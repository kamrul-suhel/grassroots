<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\RelFeedbackUser;
use App\FeedbackAnswer;
use App\RelFeedbackQa;
use App\Feedback;
use Auth;
use DB;

class FeedbackAnswerController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:guardian|coach');
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Create the answers for $feedback_id
    *
    * @param $feedback_id
    * @return json
    */
    public function create_feedback_answer($feedback_id) {
        $this->validate($this->request, [
            'answers' => 'required|array|min:1',
            'answers.*.question_id'  => 'required|int|min:1',
            'answers.*.answer'  => 'required|string'
        ]);

        $feedback = Feedback::find($feedback_id);
        if($feedback->type === 'homework'){
            $this->validate($this->request, [
                'player_id' => 'required|int|min:1'
            ]);
        }

        foreach($this->request['answers'] as $question) {
            //save the answer
            $assessment_answer = new FeedbackAnswer;
            $assessment_answer->content = $question['answer'];
            $assessment_answer->created_by = $this->user_id;
            $assessment_answer->save();

            //set the relation between question and answer
            $answer_question = new RelFeedbackQa;
            $answer_question->answer_id = $assessment_answer->answer_id;
            $answer_question->question_id = $question['question_id'];
            $answer_question->save();
        }
        if($feedback->type === 'homework'){
            RelFeedbackUser::where('feedback_id', $feedback_id)
                ->where('user_id', $this->user_id)
                ->where('player_id', $this->request['player_id'])
                ->where('status', 0)
                ->update(['status' => 1]);
        } else {
            //mark feedback as completed
            RelFeedbackUser::where('feedback_id', $feedback_id)
                ->where('user_id', $this->user_id)
                ->where('status', 0)
                ->update(['status' => 1]);
        }

        return response()->json('Feedback Completed', 200);
    }
}
