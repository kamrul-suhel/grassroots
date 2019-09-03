<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\FeedbackQuestionOption;
use App\RelFeedbackQuestion;
use App\FeedbackQuestion;
use App\RelFeedbackUser;
use App\FeedbackAnswer;
use App\RelFeedbackQa;
use App\Feedback;
use Auth;
use DB;

class HomeworkController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:coach', ['only' => ['create_homework']]);
        $this->middleware('role:guardian|coach', ['only' => ['get_homeworks', 'get_homework']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all homeworks in $club_id.
     *
     * @return json
     */
    public function get_homeworks() {
        $pagination = create_pagination();
        if( Auth::user()->hasRole('coach') ){
            $homeworks = Feedback::select(
                    DB::raw('SQL_CALC_FOUND_ROWS feedback.feedback_id AS homework_id'),
                    'feedback.feedback_id AS id',
                    'feedback.title',
                    'feedback.created_at',
                    DB::raw('(SELECT COUNT(*) FROM rel_feedback_user WHERE rel_feedback_user.feedback_id = feedback.feedback_id) AS count'),
                    'feedback.team_id',
                    'team.title AS team_name'
                )
                ->leftJoin('team', 'team.team_id', '=', 'feedback.team_id')
                ->where('feedback.franchise_id', $this->franchise_id)
                ->where('feedback.type', 'homework')
                ->where('feedback.created_by', $this->user_id)
                ->where(function($query){
                    //allow search by feedbacks tile
                    if( isset($this->request['search']) && !empty($this->request['search']) ) {
                        $query->where('feedback.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    //allow filter by teams
                    if( isset($this->request['team']) && !empty($this->request['team']) ){
                        $query->where('team.team_id', $this->request['team']);
                    }
                    //allow filter by skill group
                    if( isset($this->request['skill_group']) && !empty($this->request['skill_group']) ){
                        $query->where('team.team_id', $this->request['skill_group']);
                    }
                    return $query;
                })
                ->limit($pagination['per_page'])
                ->offset($pagination['offset']);
            //add filters to the response, this is used on the react side
            $teams = get_teams();
            $filter_team = create_filter('team', 'Team', $teams);

            $skillgroups = gr_get_skillgroups();
            $filter_skillgroup = create_filter('skill_group', 'Skill Group', $skillgroups);
        } else {
        //if user is guardian join rel_feedback_user so we can only display only the auth user feedbacks
            $homeworks = Feedback::select(
                    DB::raw('SQL_CALC_FOUND_ROWS feedback.feedback_id AS homework_id'),
                    'rel_feedback_user.id',
                    'feedback.title',
                    'feedback.created_at',
                    'rel_feedback_user.status AS completed',
                    'rel_feedback_user.player_id',
                    'player.display_name AS player_name'
                )
                ->leftJoin('rel_feedback_user', 'rel_feedback_user.feedback_id', '=', 'feedback.feedback_id')
                ->leftJoin('player', 'player.player_id', '=', 'rel_feedback_user.player_id')
                ->where(function($query){
                    //allow search by feedbacks tile
                    if( isset($this->request['search']) && !empty($this->request['search']) ) {
                        $query->where('feedback.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    //allow filter by skill group
                    if( isset($this->request['player']) && !empty($this->request['player']) ){
                        $query->where('rel_feedback_user.player_id', $this->request['player']);
                    }
                    //allow filter by status
                    if( isset($this->request['status']) ){
                        $query->where('rel_feedback_user.status', $this->request['status']);
                    }
                    return $query;
                })
                ->where('rel_feedback_user.user_id', $this->user_id)
                // ->where('rel_feedback_user.status', 0)
                ->where('feedback.type', 'homework')
                ->limit($pagination['per_page'])
                ->offset($pagination['offset']);
            $players = get_guardian_players($this->user_id);
            $filter_players = create_filter('player', 'Player', $players);
        }
        $homeworks = $homeworks->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        //handle the filters
        $search = create_filter('search', 'Search');
        if(Auth::user()->hasRole('coach')){
            $filters = [$search, $filter_team, $filter_skillgroup];
        } else {
            //form the object for the statuses filter
            $statuses = (object)[
                '0' => (object) ['key' => 0, 'value' => 'Pending'],
                '1' => (object) ['key' => 1, 'value' => 'Completed']
            ];
            $filter_status = create_filter('status', 'Status', $statuses, 0);

            $filters = [$filter_players, $filter_status, $search];
        }

        return format_response($homeworks, $count, $filters);
    }

    /**
     * View the homework with $homework_id
     *
     * @param int $homework_id
     * @return json
     */
     public function get_homework($homework_id){
         if(Auth::user()->hasRole('coach')){
             //get the feedback
             $homework = Feedback::select(
                     'feedback.feedback_id AS homework_id',
                     'feedback.feedback_id AS id',
                     'feedback.title',
                     'feedback.created_at'
                 )
                 ->where('feedback.franchise_id', $this->franchise_id)
                 ->where('feedback.feedback_id', $homework_id)
                 ->where('feedback.type', 'homework')
                 ->first();
             //get feedback questions
             $questions = FeedbackQuestion::select(
                     'feedback_question.question_id',
                     'feedback_question.title',
                     'feedback_question.image_url',
                     'feedback_question.is_multiple_answers'
                 )
                 ->leftJoin('rel_feedback_question', 'rel_feedback_question.question_id', '=', 'feedback_question.question_id')
                 ->where('rel_feedback_question.feedback_id', $homework_id)
                 ->get();
             foreach($questions as $question){
                 $answers = FeedbackAnswer::select(
                             'feedback_answer.answer_id',
                             'feedback_answer.created_by AS user_id',
                             'user.display_name',
                             'feedback_answer.content AS title'
                     )
                     ->leftJoin('user', 'user.user_id', '=', 'feedback_answer.created_by')
                     ->leftJoin('rel_feedback_qa', 'rel_feedback_qa.answer_id', '=', 'feedback_answer.answer_id')
                     ->where('rel_feedback_qa.question_id',  $question->question_id)
                     ->get();
                 $question->answers = $answers;
             }
             $homework['questions'] = $questions;

             return response()->json($homework, 200);
         } else {
             $this->validate($this->request,[
                 'player_id' => 'required|int|min:1'
             ]);
             $homework = Feedback::select(
                     'feedback.feedback_id',
                     'rel_feedback_user.id',
                     'feedback.feedback_id AS homework_id',
                     'feedback.created_at',
                     'feedback.title',
                     'rel_feedback_user.status AS completed'
                 )
                 ->leftJoin('rel_feedback_user', 'rel_feedback_user.feedback_id', '=', 'feedback.feedback_id')
                 ->where('feedback.franchise_id', $this->franchise_id)
                 ->where('feedback.feedback_id', $homework_id)
                 ->where('rel_feedback_user.user_id', $this->user_id)
                 ->where('rel_feedback_user.player_id', $this->request['player_id'])
                 ->where('feedback.type', 'homework')
                 ->first();
             //if feedback is completed then load questions with answers else load questions with options
             if( empty($homework) ) {
                 return response()->json('Homework not found', 404);
             }
             if($homework->completed === 1){
                 $answers = DB::table('feedback_question')
                    ->select(
                        'feedback_question.question_id',
                        'feedback_question.title AS question',
                        'feedback_question.image_url',
                        'feedback_answer.answer_id',
                        'feedback_answer.content AS answer'
                    )
                    ->leftJoin('rel_feedback_question', 'rel_feedback_question.question_id', '=', 'feedback_question.question_id')
                    ->leftJoin('rel_feedback_qa', 'rel_feedback_qa.question_id', '=', 'feedback_question.question_id')
                    ->leftJoin('feedback_answer', 'feedback_answer.answer_id', '=', 'rel_feedback_qa.answer_id')
                    ->where('rel_feedback_question.feedback_id', $homework_id)
                    ->where('feedback_answer.created_by', $this->user_id)
                    ->get();
                 $homework['answers'] = $answers;
             } else {
                 $homework->load('questions.options');
             }
             return response()->json($homework, 200);
         }
     }

     /**
      * Create a new homework and assign it to all the players in the team
      *
      * @return json
      */
     public function create_homework(){
         $this->validate($this->request, [
             'title' => 'required|string|max:255',
             'team_id' => 'required|int|min:1',
             'status' => 'integer|min:0|max:1',
             'questions' => 'required|array|min:1',
             'questions.*.title'  => 'required|string|max:255',
             'questions.*.image_url' => 'file|image|max:1024',
             'questions.*.is_multiple_answers' => 'required|integer|min:0|max:1',
             'questions.*.order' => 'integer',
             'questions.*.status' => 'integer|min:0|max:1',
             'questions.*.options' => 'array'
         ],
         [
             'questions.*.image_url.max' => 'Question image cannot be bigger than 1 MB'
         ]);

         //create the feedback
         $feedback = new Feedback;
         $feedback->franchise_id = $this->franchise_id;
         $feedback->title = $this->request['title'];
         $feedback->created_by = $this->user_id;
         $feedback->type = 'homework';
         $feedback->team_id = $this->request['team_id'];
         $feedback->status = isset($this->request['status']) ? $this->request['status'] : 1; //by default we set active
         $feedback->save();

         //save the questions for this feedback
         foreach($this->request['questions'] as $question) {
             //create the question
             $feedback_question = new FeedbackQuestion;
             $feedback_question->franchise_id = $this->franchise_id;
             $feedback_question->title = $question['title'];

             //handle profile picture upload
             if( isset($question['image_url']) && !empty($question['image_url']) ){
                 $destinationPath = 'storage/feedbacks'.'/'.$feedback->feedback_id;
                 $file = $question['image_url'];
                 $filename = $file->getClientOriginalName();
                 $upload_success = $file->move($destinationPath, $filename);
                 if($upload_success){
                     $file_url = url('storage')."/feedbacks/" . $feedback->feedback_id."/" . $filename;
                     $feedback_question->image_url = $file_url;
                 }
             }
             $feedback_question->is_multiple_answers = $question['is_multiple_answers'];
             $feedback_question->created_by = $this->user_id;
             $feedback_question->order = isset($question['order']) ? $question['order'] : 1; //set default order to 1
             $feedback_question->status = isset($question['status']) ? $question['status'] : 1; //set default status to 1
             $feedback_question->save();

             //create the relation between feedback and question
             $rel_feedback_question = new RelFeedbackQuestion;
             $rel_feedback_question->feedback_id = $feedback->feedback_id;
             $rel_feedback_question->question_id = $feedback_question->question_id;
             $rel_feedback_question->save();

             //if the question is set to have multiple answers (options) create them
             if($question['is_multiple_answers'] == 1){
                 foreach($question['options'] as $option) {
                     //validate the option
                     $this->validate($this->request, [
                         'questions.*.options.*.title' => 'required|string|max:255',
                         'questions.*.options.*.order' => 'integer'
                     ]);
                     //create the option
                     $answer_option = new FeedbackQuestionOption;
                     $answer_option->question_id = $feedback_question->question_id;
                     $answer_option->title = $option['title'];
                     $answer_option->order = isset($option['order']) ? $option['order'] : 1;
                     $answer_option->save();
                 }
             }
         }
         $players = get_team_players($this->request['team_id']);

         foreach($players as $player){
             $feedback_user = new RelFeedbackUser;
             $feedback_user->feedback_id = $feedback->feedback_id;
             $feedback_user->player_id = $player->player_id;
             $feedback_user->user_id = get_guardian_id($player->player_id);
             $feedback_user->status = 0; //"not completed"
             $feedback_user->save();
             //create the notification
             NotificationController::create('homework', NULL, $feedback->feedback_id, $feedback_user->user_id, $feedback_user->player_id);
         }
         return response()->json('Homework created', 200);
     }

     /**
      * Delete the homework with $homework_id
      *
      * @param int $homework_id
      * @return json
      */
      public function delete_homework($homework_id) {
          $rel_feedback_question = RelFeedbackQuestion::where('feedback_id', $homework_id)->get();
          $questions = $rel_feedback_question->pluck('question_id');

          $rel_question_answers = RelFeedbackQa::whereIn('question_id', $questions)->get();
          $answers = $rel_question_answers->pluck('answer_id');

          $feedback = Feedback::find($homework_id)->delete();
          $feedback_user = RelFeedbackUser::where('feedback_id', $homework_id)->delete();
          $feedback_question = FeedbackQuestion::whereIn('question_id', $questions)->delete();
          $answer_option = FeedbackQuestionOption::whereIn('question_id', $questions)->delete();
          $rel_feedback_qa = RelFeedbackQa::whereIn('question_id', $questions)->delete();
          $feedback_answers = FeedbackAnswer::whereIn('answer_id', $answers)->delete();
          $rel_feedback_question = RelFeedbackQuestion::where('feedback_id', $homework_id)->delete();

          return response()->json('Homework Deleted', 200);
      }
}
