<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\User;
use Auth;
use DB;

class SelectController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');

        //get the franchise id and club id of the auth user from the token
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayload()->get('club_id');
    }

    /**
     * Get all guardians within the auth user franchise and club by names
     * Function used to populate guardians dropdown
     *
     * @return void
     */
    public function get_guardians_by_name() {
        $users = array();

        $role_id = gr_get_role_id('guardian');

        if( isset($this->request->name) && !empty($this->request->name) ) {
            $users = User::select(DB::raw('user_id AS id, CONCAT(display_name, " - ", email) AS title'))
                    ->where('franchise_id', $this->franchise_id)
                    ->where('user_role', $role_id)
                    ->where(function($q){
                        $q->where('first_name', 'like', '%' . $this->request->name . '%')
                            ->orWhere('last_name', 'like', '%' . $this->request->name . '%');
                    })
                    ->get();
        }

        return response()->json($users, 200);
    }

}
