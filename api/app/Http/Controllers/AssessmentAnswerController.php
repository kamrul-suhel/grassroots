<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AssessmentAnswer;
use App\RelAssessmentQa;
use App\RelAssessmentUser;
use App\Assessment;
use App\User;
use Auth;
use DB;

class AssessmentAnswerController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['delete_assessment_answer']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Create the answers for $assessment_id
    *
    * @return json
    */
    public function create_assessment_answer() {
        $this->validate($this->request, [
            'coach_id'              => 'required|int|min:1',
            'date'                  => 'date_format:Y-m-d H:i:s',
            'assessment_id'         => 'required|int|min:1',
            'answers'               => 'required|array|min:1',
        ]);

        $question_no = count($this->request['answers']);
        $answers_no = 0;

        //create the rel between coach and assessment
        $assessment_user = new RelAssessmentUser;
        $assessment_user->assessment_id = $this->request['assessment_id'];
        $assessment_user->user_id = $this->request['coach_id'];

        $assessment_user->created_by = $this->user_id;
        $assessment_user->updated_by = $this->user_id;
        $assessment_user->save();

        foreach($this->request['answers'] as $question) {
            if(!empty($question['answer'])) {
                $answers_no++;
            }
            //save the answer
            $assessment_answer = new AssessmentAnswer;
            $assessment_answer->content = $question['answer'];
            $assessment_answer->created_by = $this->user_id;
            $assessment_answer->assessment_user = $assessment_user->id;
            $assessment_answer->save();

            //set the relation between question and answer
            $answer_question = new RelAssessmentQa;
            $answer_question->answer_id = $assessment_answer->answer_id;
            $answer_question->question_id = $question['question_id'];
            $answer_question->save();
        }
        $assessment_user->status = $question_no == $answers_no ? 1 : 2;
        $assessment_user->save();
        return response()->json('Assessment Completed', 200);
    }

    /**
     * Update assessment
     * @param $id   passParam rel_assessment_user.id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update_assessment_answer($id) {
        $this->validate($this->request, [
            'coach_id'              => 'required|int|min:1',
            'date'                  => 'date_format:Y-m-d H:i:s',
            'assessment_id'         => 'required|int|min:1',
            'answers'               => 'required|array|min:1',
        ]);
        $question_no = count($this->request['answers']);
        $answers_no = 0;

        //create the rel between coach and assessment
        $assessment_user = RelAssessmentUser::find($id);
        if(empty($assessment_user)) { return response()->json("Not Found", 404); }

        $assessment_user->assessment_id = $this->request['assessment_id'];
        $assessment_user->user_id = $this->request['coach_id'];

        $assessment_user->created_by = $this->user_id;
        $assessment_user->updated_by = $this->user_id;
        $assessment_user->save();

        // get the old answers
        $old_answers = AssessmentAnswer::where('assessment_user', $id)->get();
        RelAssessmentQa::whereIn('answer_id', $old_answers->pluck('answer_id'))
            ->delete();

        //remove the old answers
        AssessmentAnswer::where('assessment_user', $id)
            ->delete();

        foreach($this->request['answers'] as $question) {
            if(!empty($question['answer'])) {
                $answers_no++;
            }
            //save the answer
            $assessment_answer = new AssessmentAnswer;
            $assessment_answer->content = $question['answer'];
            $assessment_answer->created_by = $this->user_id;
            $assessment_answer->assessment_user = $assessment_user->id;
            $assessment_answer->save();

            //set the relation between question and answer
            $answer_question = new RelAssessmentQa;
            $answer_question->answer_id = $assessment_answer->answer_id;
            $answer_question->question_id = $question['question_id'];
            $answer_question->save();
        }
        $assessment_user->status = $question_no == $answers_no ? 1 : 2;
        $assessment_user->save();
        return response()->json('Assessment Completed', 200);
    }

    public function delete_assessment_answer($id){
      $rel_assessment_user = RelAssessmentUser::find($id);
      $user = User::find($rel_assessment_user->user_id);

      if($user->franchise_id != $this->franchise_id) {
        return response()->json('You do not have permissions to delete this', 403);
      }
      $rel_assessment_user->delete();
      AssessmentAnswer::where('assessment_user', $id)->delete();

      return response()->json('Assessment successfully deleted');
    }
}
