<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Address;
use App\User;
use Auth;
use DB;

class AddressBookController extends Controller {
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
    * Get all the addresses from a franchise_id
    *
    * @return json
    */
    public function get_addresses() {
        $pagination = create_pagination();
        $addresses = DB::table('address_book')
            ->select(
                DB::raw('SQL_CALC_FOUND_ROWS address_book.address_id'),
                'address_book.title',
                'address_book.address',
                'address_book.telephone',
                'address_book.mobile',
                'address_book.email',
                'address_book.city',
                'address_book.postcode',
                'address_book.first_name',
                'address_book.last_name',
                'address_book.contact_name',
                'address_book.company',
                'address_book.payment_method_id',
                'address_book.status',
                'transaction_type.title AS payment_method',
                'address_type.type_id',
                'address_type.title AS address_type'
            )
            ->leftJoin('address_type', 'address_type.type_id','=', 'address_book.type_id')
            ->leftJoin('transaction_type', 'transaction_type.id','=', 'address_book.payment_method_id')
            ->whereIn('address_book.franchise_id', [$this->franchise_id])
            ->wherein('address_book.club_id', [$this->club_id])
            ->where(function($query){
                //allow filter by address type
                if( isset($this->request['addresstype']) && !empty($this->request['addresstype']) ) {
                    $query->where('address_book.type_id', $this->request['addresstype']);
                }
                //allow filter by address status
                if( isset($this->request['status']) && !empty($this->request['status']) ) {
                    $query->where('address_book.status', $this->request['status']);
                }
                //allow search by address name, or address, or telephone, or city or post code
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('address_book.title', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.address', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.first_name', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.last_name', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.telephone', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.city', 'like', '%' . $this->request['search'] . '%')
                          ->orWhere('address_book.postcode', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->orderBy('address_book.title')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;

        //form the object for the statuses filter
        $statuses = (object)[
            '1' => (object) ['key' => 1, 'value' => 'Active'],
            '0' => (object) ['key' => 0, 'value' => 'Inactive']
        ];
        //create the status filter
        $filter_status = create_filter('status', 'Status', $statuses);
        //filter by address type
        $address_type = gr_get_address_type();
        $filter_address_type = create_filter('addresstype', 'Role', $address_type);
        $search = create_filter('search', 'Search');
        $filters = [$filter_status, $filter_address_type, $search];
        return format_response($addresses, $count, $filters);
    }

    /**
    * Get address with the $address_id
    *
    * @param int $address_id
    * @return json
    */
    public function get_address($address_id) {
        $address = Address::select(
                'address_book.address_id',
                'address_book.title',
                'address_book.position',
                'address_book.address',
                'address_book.city',
                'address_book.postcode',
                'address_book.lat',
                'address_book.lng',
                'address_book.telephone',
                'address_book.mobile',
                'address_book.email',
                'address_book.first_name',
                'address_book.last_name',
                'address_book.contact_name',
                'address_book.company',
                'address_book.payment_method_id',
                'transaction_type.title AS payment_method',
                'address_type.type_id',
                'address_type.title AS address_type'
            )
            ->leftJoin('address_type', 'address_type.type_id','=', 'address_book.type_id')
            ->leftJoin('transaction_type', 'transaction_type.id','=', 'address_book.payment_method_id')
            ->where('address_book.address_id', $address_id)
            ->where(function($query){
                $query->where('address_book.franchise_id', $this->franchise_id)
                    ->orWhere('address_book.franchise_id', 0);
                return $query;
            })
            ->first();
        return response()->json($address, 200);
    }

    /**
    * Create a new address record
    *
    * @return json
    */
    public function create_address() {
        //validate the request
       $this->validate($this->request,[
           'address'      => 'string|max:255',
           'city'         => 'string|max:255',
           'postcode'     => 'string|max:255',
           'title'        => 'string|max:255',
           'position'     => 'string|max:255',
           'telephone'    => 'string|max:30',
           'mobile'       => 'string|max:30',
           'email'        => 'string|max:255',
           'contact_first_name' => 'required|string|max:255',
           'contact_last_name' => 'string|max:255',
           'company'      => 'string|max:255',
           'payment_method_id' => 'int|min:1',
           'type_id'      => 'required|integer|min:1',
           'status'       => 'integer|min:0|max:1',
           'note'         => 'string'
       ]);

        $latitude = 0;
        $longitude = 0;
        $geodata = null;

        // Check if city & postcode is exists
        if($this->request->has('city') &&
            $this->request->has('postcode')
        ){
            $geodata = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='.urlencode($this->request['city'].' '.$this->request['postcode'])));
            if(!$geodata) {
                return reponse()->json("Invalid Postcode", 403);
            }
        }

        // extract latitude and longitude
        if( !empty($geodata->results) ){
            $latitude  = $geodata->results[0]->geometry->location->lat;
            $longitude = $geodata->results[0]->geometry->location->lng;
        }

       $address = new Address;
       $address->franchise_id       = $this->franchise_id;
       $address->club_id            = $this->club_id;
       $address->address            =     $this->request->has('address') ? $this->request->address : null;
       $address->city               = $this->request->has('city') ? $this->request['city'] : null;
       $address->postcode           = $this->request->has('postcode') ? $this->request->postcode : null;
       $address->lat                = $latitude;
       $address->lng                = $longitude;
       $address->title              = $this->request->has('title') ? $this->request['title'] :
            $this->request->contact_first_name . ($this->request->has('contact_last_name') ? $this->request->contact_last_name : null);
       $address->position           = $this->request->has('position') ? $this->request['position'] : null;
       $address->telephone          = $this->request->has('telephone') ? $this->request['telephone'] : null;
       $address->mobile             = $this->request->has('mobile') ? $this->request['mobile'] : NULL;
       $address->email              = $this->request->has('email') ? $this->request['email'] : null;
       $address->first_name         = $this->request->has('contact_first_name') ? $this->request['contact_first_name'] : null;
       $address->last_name          = $this->request->has('contact_last_name') ? $this->request['contact_last_name'] : null;
       $address->contact_name       = $this->request->has('contact_first_name') ? $this->request['contact_first_name'] . " " . $this->request['contact_last_name'] : null;
       $address->company            = $this->request->has('company') ? $this->request['company'] : NULL;
       $address->payment_method_id  = $this->request->has('payment_method_id') ? $this->request['payment_method_id'] : NULL;
       $address->type_id            = $this->request['type_id'];
       $address->note               = $this->request->has('note') ? $this->request['note'] : null;
       $address->created_by         = $this->user_id;
       $address->updated_by         = $this->user_id;

       if(isset($this->request['status'])){
           $address->status = $this->request['status'];
       } else {
           $address->status = 1; //by default we set active
       }

       $address->save();
       return response()->json($address);
    }

    /**
    * Update the address with the address_id
    *
    * @param int $address_id
    * @return json
    */
    public function update_address($address_id) {
        //validate the request
       $this->validate($this->request,[
           'address'            => 'required',
           'city'               => 'required',
           'postcode'           => 'required',
           'title'              => 'required|string|max:255',
           'position'           => 'string|max:255',
           'telephone'          => 'required|string|max:30',
           'mobile'             => 'string|max:30',
           'email'              => 'required|string|max:255',
           'contact_first_name' => 'required|string|max:255',
           'contact_last_name'  => 'required|string|max:255',
           'company'            => 'string|max:255',
           'payment_method_id'  => 'int|min:1',
           'type_id'            => 'required|integer|min:1',
           'status'             => 'integer|min:0|max:1',
           'note'               => 'string'
       ]);



       $address = Address::find($address_id);
       $address->address = $this->request['address'];
       $address->title = $this->request['title'];
       $address->city = $this->request['city'];
       $address->postcode = $this->request['postcode'];
       $address->telephone = $this->request['telephone'];
       if(isset($this->request['mobile']) && !empty($this->request['mobile'])){ $address->mobile = $this->request['mobile'];}
       if(isset($this->request['company']) && !empty($this->request['company'])){ $address->company = $this->request['company'];}
       if(isset($this->request['payment_method_id']) && !empty($this->request['payment_method_id'])){ $address->payment_method_id = $this->request['payment_method_id'];}

       $address->email = $this->request['email'];
        $address->first_name     = $this->request['contact_first_name'];
        $address->last_name      = $this->request['contact_last_name'];
        $address->contact_name = $this->request['contact_first_name'] . " " . $this->request['contact_last_name'];
       $address->position = $this->request['position'];
       $address->type_id = $this->request['type_id'];
       $address->note = $this->request['note'];
       $address->created_by = $this->user_id;
       if(isset($this->request['postcode']) && !empty($this->request['postcode'])){
           $geodata = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='.urlencode($this->request['postcode'].' '.$address->city)));
           // extract latitude and longitude
           if(!empty($geodata->results)){
               $address->lat = $geodata->results[0]->geometry->location->lat;
               $address->lng = $geodata->results[0]->geometry->location->lng;
           }
       }
       $address->status = isset($this->request['status']) ? $this->request['status'] : 1;
       $address->save();
       return response()->json($address, 200);
    }

    /**
    * Delete the address with the address_id
    *
    * @param int $address_id
    * @return json
    */
    public function delete_address($address_id){
        $address = Address::find($address_id);
        $address_type = get_address_type_title($address->type_id);
        if($address_type == 'Coach' || $address_type == 'Guardian'){
            return response()->json('You are not allowed to delete this', 403);
        }
        $address->delete();

        return response()->json('Address successfully deleted', 200);
    }
}
