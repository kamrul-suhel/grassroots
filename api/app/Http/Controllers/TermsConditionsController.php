<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\TermCondition;
use Auth;
use DB;

class TermsConditionsController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
     public function __construct(Request $request) {
         $this->request = $request;
         $this->middleware('auth');
         $this->middleware('role:admin|guardian', ['only' => ['get_terms_conditions', 'get_term_condition']]);
         $this->middleware('role:guardian', ['only' => ['accept_term_condition']]);
         $this->franchise_id = Auth::getPayload()->get('franchise_id');
         $this->club_id = Auth::getPayLoad()->get('club_id');
         $this->user_id = Auth::id();
     }

    /**
     * Get all the terms and conditions in a franchise.
     *
     * @return json
     */
    public function get_terms_conditions(){
        $pagination = create_pagination();
        $tc = TermCondition::select(
                DB::raw('SQL_CALC_FOUND_ROWS term_condition.tc_id'),
                'term_condition.title',
                'term_condition.content'
            )
            ->where('term_condition.franchise_id', $this->franchise_id)
            ->where('term_condition.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by team name
                if( isset($this->request['name']) && !empty($this->request['name']) ) {
                    $query->where('term_condition.title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->limit($pagination['per_page'])
            ->offset($pagination['offset']);

        //if auth user is guardian load only the consents assigned to him/her
        if( Auth::user()->hasRole('guardian') ){
            $tc->select(
                    DB::raw('SQL_CALC_FOUND_ROWS term_condition.tc_id'),
                    'term_condition.title',
                    'term_condition.content',
                    'rel_tc_user.agreed_at'
                    )
                    ->leftJoin('rel_tc_user', 'rel_tc_user.tc_id', '=', 'term_condition.tc_id')
                    ->where('rel_tc_user.user_id', $this->user_id);
        }

        $tc = $tc->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;

        //for admin load the guardians that the consent was assigned to
        if( Auth::user()->hasRole('admin') ){
            $tc->load('guardians');
        }

        return format_response($tc, $count);
    }

    /**
     * Get the term and condition with $tc_id
     *
     * @param int $tc_id
     * @return json
     */
     public function get_term_condition($tc_id){
         //for admins we need to pass the user id
         if( Auth::user()->hasRole('admin') ) {
             $this->validate($this->request, [
                 'user_id' => 'required|integer|min:1'
             ]);
             $user_id = $this->request['user_id'];
         } else {
             //$user_id is the auth user id
             $user_id = $this->user_id;
         }
         $tc = TermCondition::select(
                    'term_condition.tc_id',
                    'term_condition.title',
                    'term_condition.content',
                    'rel_tc_user.agreed_at'
                )
                ->leftJoin('rel_tc_user', 'rel_tc_user.tc_id', '=', 'term_condition.tc_id')
                ->where('rel_tc_user.user_id', $user_id)
                ->where('term_condition.franchise_id', $this->franchise_id)
                ->where('term_condition.club_id', $this->club_id)
                ->where('term_condition.tc_id', $tc_id)
                ->first();
        return response()->json($tc, 200);
     }

     /**
      * Accept the tc with $tc_id
      *
      * @param int $tc_id
      * @return json
      */
     public function accept_term_condition($tc_id){
         $accept = DB::table('rel_tc_user')
            ->where('tc_id', $tc_id)
            ->where('user_id', $this->user_id)
            ->update(['agreed_at' => DB::raw('NOW()')]);

        return response()->json('Terms and Conditions Accepted', 200);
     }
}
