<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AgeGroup;
use Auth;
use DB;

class AgeGroupController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the age froups from a franchise
    *
    * @return json
    */
    public function get_age_groups() {
        $pagination = create_pagination();
        $age_groups = AgeGroup::select(
                DB::raw('SQL_CALC_FOUND_ROWS agegroup.agegroup_id AS id'),
                'agegroup.title',
                'agegroup.max_age'
            )
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($age_groups, $count);
    }

    /**
    * Get age group with the $agegroup_id
    *
    * @param int $agegroup_id
    * @return json
    */
    public function get_age_group($agegroup_id) {
        $age_group = AgeGroup::find($agegroup_id);
        return response()->json($age_group, 200);
    }

    /**
    * Create a age group
    *
    * @return json
    */
    public function create_age_group() {
        //validate the request
       $this->validate($this->request,[
           'title'   => 'required|string|max:255',
           'status'  => 'integer|min:0|max:1'
       ]);

       $age_group = new AgeGroup;
       $age_group->title = $this->request['title'];
       $age_group->created_by = $this->user_id;
       if(isset($this->request['status'])){
           $age_group->status = $this->request['status'];
       } else {
           $age_group->status = 1; //by default we set active
       }
       $age_group->save();

       return response()->json($age_group, 200);
    }

    /**
    * Update the age group with the $agegroup_id
    *
    * @param int $agegroup_id
    * @return json
    */
    public function update_age_group($agegroup_id) {
        //validate the request
       $this->validate($this->request,[
           'title'   => 'required|string|max:255',
           'status'  => 'integer|min:0|max:1'
       ]);

       $age_group = AgeGroup::find($agegroup_id);
       $age_group->title = $this->request['title'];
       $age_group->updated_by = $this->user_id;
       if(isset($this->request['status'])){
           $age_group->status = $this->request['status'];
       } else {
           $age_group->status = 1; //by default we set active
       }
       $age_group->save();

       return response()->json($age_group, 200);
    }

    /**
    * Delete the age group with the $agegroup_id
    *
    * @param int $agegroup_id
    * @return json
    */
    public function delete_age_group($agegroup_id){
        $address = AgeGroup::find($agegroup_id)->delete();

        return response()->json('Age Group successfully deleted', 200);
    }
}
