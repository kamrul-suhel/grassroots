<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AddressType;
use Auth;
use DB;

class AddressTypeController extends Controller {
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
    * Get all the addresses types from a franchise_id
    *
    * @return json
    */
    public function get_addresses_types() {
        $pagination = create_pagination();
        $addresses_types = DB::table('address_type')
            ->select(
                DB::raw('SQL_CALC_FOUND_ROWS address_type.type_id'),
                'address_type.title'
            )
            ->where('address_type.franchise_id', 0)
            ->where('address_type.club_id', 0)
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($addresses_types, $count);
    }

    /**
    * Get address type with the $type_id
    *
    * @param int $type_id
    * @return json
    */
    public function get_address_type($type_id) {
        $address = DB::table('address_type')
            ->select(
                'address_type.type_id',
                'address_type.title'
            )
            ->where('address_type.franchise_id', 0)
            ->where('address_type.type_id', $type_id)
            ->first();
        return response()->json($address, 200);
    }

    /**
    * Create a new address type record
    *
    * @return json
    */
    public function create_address_type() {
        //validate the request
       $this->validate($this->request,[
           'title'    => 'required|string|max:255',
           'status'   => 'integer|min:0|max:1'
       ]);

       $address_type = new AddressType;
       $address_type->franchise_id = $this->franchise_id;
       $address_type->club_id = $this->club_id;
       $address_type->title = $this->request['title'];
       $address_type->created_by = $this->user_id;
       if(isset($this->request['status'])){
           $address_type->status = $this->request['status'];
       } else {
           $address_type->status = 1; //by default we set active
       }
       $address_type->save();

       return response()->json($address_type, 200);
    }

    /**
    * Update the address type with the $type_id
    *
    * @param int $type_id
    * @return json
    */
    public function update_address_type($type_id) {
        //validate the request
       $this->validate($this->request,[
           'title'   => 'required|string|max:255',
           'status'  => 'integer|min:0|max:1'
       ]);

       $address_type = AddressType::find($type_id);
       $address_type->title = $this->request['title'];
       $address_type->updated_by = $this->user_id;
       if(isset($this->request['status'])){
           $address_type->status = $this->request['status'];
       } else {
           $address_type->status = 1; //by default we set active
       }
       $address_type->save();

       return response()->json($address_type, 200);
    }

    /**
    * Delete the address type with the type_id
    *
    * @param int $type_id
    * @return json
    */
    public function delete_address_type($type_id){
        $address = AddressType::find($type_id)->delete();

        return response()->json('Address type successfully deleted', 200);
    }
}
