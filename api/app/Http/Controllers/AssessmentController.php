<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AssessmentQuestionOption;
use App\RelAssessmentQuestion;
use App\AssessmentQuestion;
use App\AssessmentAnswer;
use App\RelAssessmentUser;
use App\Assessment;
use Auth;
use DB;

class AssessmentController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['create_assessment', 'get_assessments']]);
        // $this->middleware('role:coach|admin', ['only' => ['get_assessment']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the assessments form a franchise
    *
    * @return json
    */
    public function get_assessments_templates() {
        $pagination = create_pagination();
        $assessments = Assessment::select(
                DB::raw('SQL_CALC_FOUND_ROWS assessment.assessment_id'),
                'assessment.title'
            )
            ->where('assessment.club_id', $this->club_id)
            ->where(function($query){
                    //allow search by assessment tile
                    if( isset($this->request['search']) && !empty($this->request['search']) ) {
                        $query->where('assessment.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    return $query;
                })
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        //handle the filters
        $search = create_filter('search', 'Search');
        $filters = [$search];
        return format_response($assessments, $count, $filters);
    }

    /**
    * Get the questions for a assessment template
    *
    * @return json
    */
    public function get_template_questions($assessment_id) {
        $assessment = Assessment::select(
                'assessment.assessment_id',
                'assessment.title'
            )
            ->where('assessment.club_id', $this->club_id)
            ->where('assessment.assessment_id', $assessment_id)
            ->first();
        $assessment->load('questions.options');
        return response()->json($assessment, 200);
    }

    /**
    * Add a new assessment template
    *
    * @return json
    */
    public function create_template() {
        $this->validate($this->request, [
            'title'               => 'required|string|max:255',
            'status'              => 'integer|min:0|max:1',
            'questions'           => 'required|array|min:1',
            'questions.*.title'   => 'required|string|max:255',
            'questions.*.is_multiple_answers' => 'required|integer|min:0|max:1',
            'questions.*.order'   => 'integer',
            'questions.*.status'  => 'integer|min:0|max:1',
            'questions.*.options' => 'array'
        ]);

        //create the assessment
        $assessment = new Assessment;
        $assessment->club_id = $this->club_id;
        $assessment->title = $this->request['title'];
        $assessment->created_by = $this->user_id;
        //set the status
        if(isset($this->request['status'])){
            $assessment->status = $this->request['status'];
        } else {
            $assessment->status = 1; //by default we set active
        }

        $assessment->save();
        //save the questions for this assessment
        foreach($this->request['questions'] as $question) {
            //create the question
            $assessment_question = new AssessmentQuestion;
            $assessment_question->club_id = $this->club_id;
            $assessment_question->assessment_id = $assessment->assessment_id;
            $assessment_question->title = $question['title'];
            $assessment_question->is_multiple_answers = $question['is_multiple_answers'];
            $assessment_question->created_by = $this->user_id;
            $assessment_question->order = isset($question['order']) ? $question['order'] : 1;
            $assessment_question->status = isset($question['status']) ? $question['status'] : 1; //set default status to 1
            $assessment_question->save();

            //if the question is set to have multiple answers (options) create them
            if($question['is_multiple_answers'] == 1){
                foreach($question['options'] as $option) {
                    //validate the option
                    $this->validate($this->request, [
                        'questions.*.options.*.answer' => 'required|string|max:255',
                        'questions.*.options.*.order' => 'integer'
                    ]);
                    //create the option
                    $answer_option = new AssessmentQuestionOption;
                    $answer_option->question_id = $assessment_question->question_id;
                    $answer_option->title = $option['answer'];
                    $answer_option->order = isset($option['order']) ? $option['order'] : 1;
                    $answer_option->save();
                }
            }
        }
        return response()->json($assessment, 200);
    }

    /**
    * Get all the assessments in a franchise
    *
    * @return json
    */
    public function get_assessments() {
        $pagination = create_pagination();
        $assessments = RelAssessmentUser::select(
                DB::raw('SQL_CALC_FOUND_ROWS rel_assessment_user.id'),
                'assessment.assessment_id',
                'assessment.title',
                'rel_assessment_user.created_at',
                'user.display_name AS coach_name',
                'rel_assessment_user.status'
            )
            ->leftJoin('assessment', 'rel_assessment_user.assessment_id', '=', 'assessment.assessment_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_assessment_user.user_id')
            ->where('assessment.club_id', $this->club_id)
            ->where(function($query){
                    //allow search by assessment tile
                    if( isset($this->request['search']) && !empty($this->request['search']) ) {
                        $query->where('assessment.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    // allow filter by coach
                    if( isset($this->request['coach']) && !empty($this->request['coach']) ) {
                        $query->where('rel_assessment_user.user_id', $this->request->coach);
                    }
                    return $query;
                })
            ->orderBy('rel_assessment_user.created_at', 'DESC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        //handle the filters
        $search = create_filter('search', 'Search');
        $coaches = gr_get_coaches();
        $filter_coach = create_filter('coach', 'Coach', $coaches);
        $filters = [$filter_coach, $search];
        return format_response($assessments, $count, $filters);
    }

    /**
    * Get the assessment with rel_assessment_user id
    *
    * @param int $id
    * @return json
    */
    public function get_assessment($id) {
        //for admi ns we need to load questions and users with answers
        $assessment = RelAssessmentUser::select(
                'rel_assessment_user.id',
                'rel_assessment_user.assessment_id',
                'rel_assessment_user.user_id AS coach_id',
                'rel_assessment_user.created_at',
                'user.display_name AS coach_name',
                'assessment.title'
            )
            ->leftJoin('assessment', 'assessment.assessment_id', '=', 'rel_assessment_user.assessment_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_assessment_user.user_id')
            ->where('rel_assessment_user.id', $id)
            ->where('assessment.club_id', $this->club_id)
            ->first();

        //load questions with answers
        $answers = DB::table('assessment_question')
           ->select(
               'assessment_question.question_id',
               'assessment_question.title AS question',
               'assessment_question.is_multiple_answers',
               'assessment_answer.answer_id',
               'assessment_answer.content AS answer'
           )
           ->leftJoin('rel_assessment_qa', 'rel_assessment_qa.question_id', '=', 'assessment_question.question_id')
           ->leftJoin('assessment_answer', 'assessment_answer.answer_id', '=', 'rel_assessment_qa.answer_id')
           ->where('assessment_question.assessment_id', $assessment->assessment_id)
           ->where('assessment_answer.assessment_user', $id)
           ->get();
        $assessment['answers'] = $answers;

        return response()->json($assessment, 200);
    }
}
