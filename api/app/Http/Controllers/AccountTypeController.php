<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AccountType;
use App\Account;
use Auth;
use DB;

class AccountTypeController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|groupadmin');
        $this->user_id      = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id      = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the account types from a franchise_id
    *
    * @return json
    */
    public function get_account_types() {
        $pagination = create_pagination();
        $account_types = AccountType::select(
                DB::raw('SQL_CALC_FOUND_ROWS id'),
                'title'
            )
            ->where('franchise_id', 0)
            ->where('club_id', 0)
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($account_types, $count);
    }

    /**
    * Get account type with the $id
    *
    * @param int $id
    * @return json
    */
    public function get_account_type($id) {
        $account_type = AccountType::find($id);
        return response()->json($account_type, 200);
    }

    /**
    * Create a new account type
    *
    * @return json
    */
    public function create_account_type() {
        //validate the request
       $this->validate($this->request,[
           'title'   => 'required|string|max:255'
       ]);

       $account_type = new AccountType;
       $account_type->franchise_id  = $this->franchise_id;
       $account_type->club_id       = $this->club_id;
       $account_type->title         = $this->request['title'];
       $account_type->created_by    = $this->user_id;
       $account_type->updated_by    = $this->user_id;
       $account_type->save();
       return response()->json($account_type, 200);
    }

    /**
    * Update the account type with the $id
    *
    * @param int $id
    * @return json
    */
    public function update_account_type($id) {
        //validate the request
       $this->validate($this->request,[
           'title'   => 'required|string|max:255'
       ]);

       $account_type = AccountType::find($id);
       $account_type->title = $this->request['title'];
       $account_type->updated_by = $this->user_id;
       $account_type->save();

       return response()->json($account_type, 200);
    }

    /**
    * Delete the account type with the $id
    *
    * @param int $id
    * @return json
    */
    public function delete_account_type($id){
        $account_type = AccountType::find($id)->delete();
        return response()->json('Account Type successfully deleted', 200);
    }
}
