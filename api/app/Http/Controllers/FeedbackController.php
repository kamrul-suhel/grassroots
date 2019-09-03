<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\FeedbackQuestionOption;
use App\RelFeedbackQuestion;
use App\FeedbackQuestion;
use App\RelFeedbackUser;
use App\FeedbackAnswer;
use App\Feedback;
use Auth;
use DB;

class FeedbackController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        // $this->middleware('role:admin', ['only' => ['get_feedback']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all feedbacks in a franchise.
     *
     * @return json
     */
    public function get_feedbacks() {
        $pagination = create_pagination();
        $feedbacks = Feedback::select(
                DB::raw('SQL_CALC_FOUND_ROWS feedback.feedback_id'),
                'feedback.title',
                DB::raw('(SELECT COUNT(*) FROM rel_feedback_user WHERE rel_feedback_user.feedback_id = feedback.feedback_id) AS sent_count'),
                DB::raw('(SELECT COUNT(*) FROM rel_feedback_user WHERE rel_feedback_user.feedback_id = feedback.feedback_id AND rel_feedback_user.status = 1) AS completed_count')
            )
            ->where('feedback.franchise_id', $this->franchise_id)
            ->where('feedback.type', 'feedback')
            ->where(function($query){
                //allow search by feedbacks tile
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('feedback.title', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            });

        //if user is guardian join rel_feedback_user so we can only display only the auth user feedbacks
        if( Auth::user()->hasRole('guardian') || Auth::user()->hasRole('coach') ){
            $feedbacks = $feedbacks->leftJoin('rel_feedback_user', 'rel_feedback_user.feedback_id', '=', 'feedback.feedback_id')
                ->where('rel_feedback_user.user_id', $this->user_id)
                ->where('rel_feedback_user.status', 0)
                ->where('feedback.type', 'feedback')
                ->select(
                    DB::raw('SQL_CALC_FOUND_ROWS feedback.feedback_id'),
                    'feedback.title',
                    'rel_feedback_user.status AS completed'
                );

        }
        $feedbacks = $feedbacks->paginate($this->perPage);

        $items = $feedbacks->items();
        $count = $feedbacks->total();

        //handle the filters
        $search = create_filter('search', 'Search');
        $filters = [$search];
        return format_response($items, $count, $filters, $pagination);
    }

    /**
     * View the feedback with $feedback_id
     *
     * @param int $feedback_id
     * @return json
     */
     public function get_feedback($feedback_id){
        if(Auth::user()->hasRole('admin')){
            //get the feedback
            $feedback = Feedback::select(
                    'feedback.feedback_id',
                    'feedback.title'
                )
                ->where('feedback.franchise_id', $this->franchise_id)
                ->where('feedback.feedback_id', $feedback_id)
                ->where('feedback.type', 'feedback')
                ->first();
            //get feedback questions
            $questions = FeedbackQuestion::select(
                    'feedback_question.question_id',
                    'feedback_question.title',
                    'feedback_question.is_multiple_answers'
                )
                ->where('feedback_question.feedback_id', $feedback_id)
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
            $feedback['questions'] = $questions;

            return response()->json($feedback, 200);
        } else {
            $feedback = Feedback::select(
                    'feedback.feedback_id',
                    'feedback.title',
                    'rel_feedback_user.status AS completed'
                )
                ->leftJoin('rel_feedback_user', 'rel_feedback_user.feedback_id', '=', 'feedback.feedback_id')
                ->where('feedback.franchise_id', $this->franchise_id)
                ->where('feedback.feedback_id', $feedback_id)
                ->where('rel_feedback_user.user_id', $this->user_id)
                ->where('feedback.type', 'feedback')
                ->first();
            //if feedback is completed then load questions with answers else load questions with options
            if($feedback['completed'] === 1){
                $answers = DB::table('feedback_question')
                   ->select(
                       'feedback_question.question_id',
                       'feedback_question.title AS question',
                       'feedback_answer.answer_id',
                       'feedback_answer.content AS answer'
                   )
                   ->leftJoin('rel_feedback_question', 'rel_feedback_question.question_id', '=', 'feedback_question.question_id')
                   ->leftJoin('rel_feedback_qa', 'rel_feedback_qa.question_id', '=', 'feedback_question.question_id')
                   ->leftJoin('feedback_answer', 'feedback_answer.answer_id', '=', 'rel_feedback_qa.answer_id')
                   ->where('rel_feedback_question.feedback_id', $feedback_id)
                   ->where('feedback_answer.created_by', $this->user_id)
                   ->get();
                $feedback['answers'] = $answers;
            } else {
                $feedback->load('questions.options');
            }

            return response()->json($feedback, 200);
        }
     }

     /**
     * Create a new feedback
     *
     * @return json
     */
     public function create_feedback() {
         $this->validate($this->request, [
             'title' => 'required|string|max:255',
             'status' => 'integer|min:0|max:1',
             'questions' => 'required|array|min:1',
             'questions.*.title'  => 'required|string|max:255',
             'questions.*.is_multiple_answers' => 'required|integer|min:0|max:1',
             'questions.*.order' => 'integer',
             'questions.*.status' => 'integer|min:0|max:1',
             'questions.*.options' => 'array',
             'user_roles' => 'required|array|min:1'
         ]);

         //create the feedback
         $feedback = new Feedback;
         $feedback->franchise_id = $this->franchise_id;
         $feedback->title = $this->request['title'];
         $feedback->created_by = $this->user_id;
         $feedback->type = 'feedback';
         $feedback->status = isset($this->request['status']) ?$this->request['status'] : 1; //by default we set active
         $feedback->save();
         //save the questions for this feedback
         foreach($this->request['questions'] as $question) {
             //create the question
             $feedback_question = new FeedbackQuestion;
             $feedback_question->franchise_id = $this->franchise_id;
             $feedback_question->feedback_id = $feedback->feedback_id;
             $feedback_question->title = $question['title'];
             $feedback_question->is_multiple_answers = $question['is_multiple_answers'];
             $feedback_question->created_by = $this->user_id;
             $feedback_question->order = isset($question['order']) ? $question['order'] : 1; //set default order to 1
             $feedback_question->status = isset($question['status']) ? $question['status'] : 1; //set default status to 1
             $feedback_question->save();

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
         //check which user roles we need to assign this feedback
         $guardians = array();
         $coaches = array();
         foreach($this->request['user_roles'] as $role) {
             //get all the user_id for the given role
             if($role === 'coach'){ $coaches = gr_get_coach_ids(); }
             if($role === 'guardian'){ $guardians = gr_get_guardian_ids(); }
             $users = array_merge($guardians, $coaches);
         }

         foreach($users as $user_id){
             $feedback_user = new RelFeedbackUser;
             $feedback_user->feedback_id = $feedback->feedback_id;
             $feedback_user->user_id = $user_id;
             $feedback_user->status = 0; //"not completed"
             $feedback_user->save();
             NotificationController::create('feedback', NULL, $feedback->feedback_id, $user_id, NULL);
         }
         return response()->json($feedback, 200);
     }
}
