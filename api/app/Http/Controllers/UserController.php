<?php
namespace App\Http\Controllers;
use App\Franchise;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Address;
use App\User;
use App\Scan;
use App\Consent;
use Auth;
use DB;

class UserController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['get_users']]);
        $this->middleware('role:admin|groupadmin', ['only' => ['create', 'delete_user']]);
        //get the franchise id and club id of the auth user
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayload()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
    * Get all users within the auth user franchise and club.
    *
    * @return json
    */
    public function get_users() {
        $users = User::select(
            DB::raw('SQL_CALC_FOUND_ROWS user.user_id'),
            DB::raw('(SELECT SUM(invoice.amount) FROM invoice WHERE invoice.user_id = user.user_id) AS invoiced'),
            DB::raw('(SELECT SUM(ABS(transaction.amount)) FROM transaction WHERE transaction.user_id = user.user_id) AS paid'),
            'user.user_id',
            'user.email',
            'user.user_role',
            'user.pic',
            'user.first_name',
            'user.last_name',
            'user.display_name',
            'user.mobile',
            'user.telephone',
            'user.emergency_number',
            'user.address',
            'user.town',
            'user.postcode',
            'user.auto_send_skills_reports',
            'role.title AS role'
            )
            ->leftJoin('role', 'role.role_id', '=', 'user.user_role')
            ->where('user.franchise_id', $this->franchise_id)
            ->where('user.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by user name
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('user.first_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('user.last_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('user.email', 'like', '%' . $this->request['search'] . '%');
                }
                //filter by status if is passed
                if( isset($this->request['status']) ){
                    $query->where('user.status', $this->request['status']);
                }
                if( isset($this->request['has_active_players']) ){
                    $query->where('user.has_active_players', $this->request['has_active_players']);
                }
                //allow filter by role
                if( isset($this->request['role']) && !empty($this->request['role']) ) {
                    $query->where('user.user_role', $this->request['role']);
                }
                return $query;
            })
            ->paginate($this->perPage);

        $totalUser = $users->items();
        $count = $users->total();
        $search = create_filter('search', 'Search');

        $statuses = (object)[
            '0' => (object) ['key' => 0, 'value' => 'Inactive'],
            '1' => (object) ['key' => 1, 'value' => 'Active']
        ];
        $filter_active_players = create_filter('has_active_players', 'Status', $statuses);
        $filters = [$filter_active_players, $search];
        return format_response($totalUser, $count, $filters);
    }

    /**
    * Get a specific user by id.
    *
    * @param int $user_id
    * @return json
    */
    public function get_user($user_id) {
        if($user_id == 'me'){
            $user_id = $this->user_id;
        }
        $user = User::select(
                'user.user_id',
                'user.franchise_id',
                'franchise.title AS franchise_name',
                'franchise.company_number',
                'franchise.organisation_name',
                'franchise.fa_affiliation',
                'franchise.vat_number',
                'user.club_id',
                'user.email',
                'user.user_role AS role_id',
                'role.title AS user_role',
                'user.pic',
                'user.first_name',
                'user.last_name',
                'user.display_name',
                'user.mobile',
                'user.telephone',
                'user.mobile',
                'user.emergency_number',
                'user.address',
                'user.address2',
                'user.town',
                'user.postcode',
                'user.auto_send_skills_reports',
                'user.welcome',
                'user.partner_name',
                'user.partner_tel',
                'club.slug',
                'gocardless.mandate'
            )
            ->with('players')
            ->leftJoin('role', 'role.role_id', '=', 'user.user_role')
            ->leftJoin('club', 'user.club_id', '=', 'club.club_id')
            ->leftJoin('gocardless', 'gocardless.franchise_id', '=', 'user.franchise_id')
            ->leftJoin('franchise', 'franchise.franchise_id', '=', 'user.franchise_id')
            ->where('user.franchise_id', '=', $this->franchise_id)
            ->where('user.club_id', '=', $this->club_id)
            ->where('user.user_id', $user_id)
            ->first();

        $consents = Consent::select(
            'consent.consent_id',
            'consent.title',
            'consent.content',
            'consent.created_at',
            'rel_consent_user.agreed_at'
        )
            ->leftJoin('rel_consent_user', 'rel_consent_user.consent_id', '=', 'consent.consent_id')
            ->where('rel_consent_user.user_id', $user->user_id)
            ->get();


        //if the user is coach get qualifications and crb check
        if( $user->user_role == 'coach' ) {
            //get the qualifications
            $qualifications = DB::table('qualification')
                ->select('qualification.qualification_id','qualification.title')
                ->leftJoin('rel_qualification_user', 'rel_qualification_user.qualification_id', '=', 'qualification.qualification_id')
                ->where('rel_qualification_user.user_id', $user_id)
                ->get();
            //get the documents
            $documents = DB::table('scan')
                ->select('scan.scan_id', 'scan.title', 'scan.file_url', 'scan.expire', 'scan.status', 'scan_type.type_id', 'scan_type.title AS type')
                ->leftJoin('scan_type', 'scan_type.type_id', '=', 'scan.type_id')
                ->where('scan.user_id', $user_id)
                ->orderBy('scan_type.title', 'ASC')
                ->get();
            //load the qualifications
            $user['qualifications'] = $qualifications;
            $user['documents'] = $documents;
        }

        // If the user if role is admin then get the super admin of this admin user.
        if($user->user_role == 'admin'){
            $superAdmin = User::select([
                'user.first_name',
                'user.last_name',
                'user.franchise_id',
                'club.franchise_id'
            ])->leftJoin('franchise', 'user.franchise_id', '=', 'franchise.franchise_id')
                ->leftJoin('club', 'franchise.franchise_id', '=', 'club.franchise_id')
                ->where('club.club_id', $this->club_id)
                ->where('user.user_role', 4)
                ->first();

            $user['super_admin'] = $superAdmin;
        }

        $user['consents'] = $consents;

        return response()->json($user, 200);
    }

    /**
    * Create a new user
    *
    * @return json
    */
    public function create() {
        //validate the request
        $this->validate($this->request,[
            'email'     => 'required|email|max:255|unique:user',
            'password'  => 'required|confirmed|max:50',
            'password_confirmation' => 'required',
            'first_name'    => 'required|max:50',
            'last_name'     => 'required|max:50',
            'position'      => 'string|max:255',
            'status'        => 'integer|min:0|max:1',
            'mobile'        => 'max:30',
            'telephone'     => 'max:30',
            'emergency_number' => 'max:30',
            'address'       => 'max:255',
            'town'          => 'max:255',
            'postcode'      => 'max:30'
        ]);

        // first name & last name first character uppercase
        $firstName = isset($this->request['first_name']) && !empty($this->request['first_name']) ? ucfirst($this->request['first_name']) : '';
        $lastName = isset($this->request['last_name']) && !empty($this->request['last_name']) ? ucfirst($this->request['last_name']) : '';

        //if user is registered by an admin
        if( $this->request->user()->hasRole('admin') || $this->request->user()->hasRole('groupadmin') ) {
            $this->validate($this->request, [
                'role' => 'required|integer'
            ]);
            $franchise_id = Auth::getPayload()->get('franchise_id');
            $club_id = Auth::getPayload()->get('club_id');
            $role_id = $this->request['role'];
        }

        //create the address book entry
        $latitude = 0;
        $longitude = 0;
        if(isset($this->request['postcode']) && !empty($this->request['postcode'])){
            $geodata =   json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='.urlencode($this->request['postcode'])));
            // extract latitude and longitude
            if(!empty($geodata->results)){
                $latitude  = $geodata->results[0]->geometry->location->lat;
                $longitude = $geodata->results[0]->geometry->location->lng;
            }
        }

        $address = new Address;
        $address->franchise_id = $franchise_id;
        $address->first_name = $firstName;
        $address->last_name = $lastName;
        $address->club_id = $club_id;
        $address->address = $this->request['address'];
        $address->city = $this->request['town'];
        $address->postcode = $this->request['postcode'];
        $address->lat = $latitude;
        $address->lng = $longitude;
        $address->title = $firstName . " " .  $lastName;
        $address->position = $this->request['position'];
        $address->telephone = $this->request['telephone'];
        $address->mobile = $this->request['mobile'];
        $address->email = $this->request['email'];
        $address->contact_name = $this->request['first_name'] . " " .  $this->request['last_name'];
        $address->type_id = get_address_type_id(gr_get_role_title($role_id));
        $address->created_by = 0;
        $address->updated_by = 0;
        $address->status = 1;
        $address->save();


        //create the user
        $user = new User;
        $user->franchise_id = $franchise_id;
        $user->email        = $this->request['email'];
        $user->api_key      = str_random(80).time();
        $user->password     = Hash::make($this->request['password']);
        $user->user_role    = $role_id;
        $user->first_name   = $firstName;
        $user->last_name    = $lastName;
        $user->display_name = $this->request['first_name'] . " " .  $this->request['last_name'];
        $user->mobile       = $this->request['mobile'];
        $user->telephone    = $this->request['telephone'];
        $user->emergency_number = $this->request['emergency_number'];
        $user->address      = $this->request['address'];
        $user->town         = $this->request['town'];
        $user->postcode     = $this->request['postcode'];
        $user->club_id      = $club_id;
        $user->status       = 1;
        $user->address_id   = isset($address->address_id) ? $address->address_id : NULL;
        if( $user->user_role == gr_get_role_id('guardian') ) {
            $user->has_active_players = 0;
            $user->partner_name = $this->request->has('partner_name') ? $this->request['partner_name'] : NULL;
            $user->partner_tel = $this->request->has('partner_tel') ? $this->request['partner_tel'] : NULL;
        }
        $user->save();

        //create the notification
        NotificationController::create('welcome', NULL, $user->user_id, $user->user_id, NULL);
        if($user->user_role == gr_get_role_id('guardian')){
            NotificationController::create('no-kids', NULL, $user->user_id, $user->user_id, NULL);
        }
        return response()->json($user, 200);
    }


    /**
    * Update a specific user.
    *
    * @param int $user_id
    * @return json
    */
    public function update_user($user_id) {
        if($user_id === 'me'){
            $user_id = $this->user_id;
        }
        // //make sure not admin users cant update other user accounts
        // if( !Auth::user()->hasRole('admin') && $this->user_id != $user_id ) {
        //     return response()->json(get_denied_message(), 403);
        // }

        $this->validate($this->request, [
            'email'      => 'required|email|max:255',
            'first_name' => 'required|max:50',
            'last_name'  => 'required|max:50',
            'password'   => 'string',
            'mobile'     => 'max:30',
            'telephone'  => 'max:30',
            'emergency_number' => 'max:30',
            'address'    => 'max:255',
            'town'       => 'max:255',
            'postcode'   => 'max:30',
            'file'       => 'file|image|max:1024',
            'welcome'    => 'int|min:0|max:1'
        ],
        [
          'file.max' => 'User image cannot be bigger than 1 MB'
        ]);

        // first name & last name first character uppercase
        $firstName = isset($this->request['first_name']) && !empty($this->request['first_name']) ? ucfirst($this->request['first_name']) : '';
        $lastName = isset($this->request['last_name']) && !empty($this->request['last_name']) ? ucfirst($this->request['last_name']) : '';

        $display_name = $firstName . " " .  $lastName;

        $user = User::find($user_id);
        $user->email = $this->request['email'];
        $user->first_name = $firstName;
        $user->last_name = $lastName;
        $user->display_name = $display_name;
        $user->mobile = $this->request['mobile'];
        $user->telephone = $this->request['telephone'];
        if( isset($this->request['emergency_number']) ) { $user->emergency_number = $this->request['emergency_number']; }
        $user->address = $this->request['address'];

        $this->request->has('address2') ? $user->address2 = $this->request->address2 : '';
        $user->town = $this->request['town'];
        $user->postcode = $this->request['postcode'];
        if( isset($this->request['welcome']) ) { $user->welcome = $this->request['welcome']; }
        //manage profile picture upload
        if( isset($this->request['file']) && !empty($this->request['file']) && $this->request->hasFile('file') ){
            $file = $this->request->file('file');
            $image_url = gr_save_file($file, 'user', $user_id);
            $user->pic = $image_url;
        }
        if( isset($this->request['password']) && !empty($this->request['password'])){
            $user->password = Hash::make($this->request['password']);
        }
        if($this->request->has('partner_name')) { $user->partner_name = $this->request['partner_name']; }
        if($this->request->has('partner_tel')) { $user->partner_tel = $this->request['partner_tel']; }
        $user->save();

        // Update franchise organisation_name, company_number & vat_number field, if sent
        if($this->request->has('company_number') ||
            $this->request->has('vat_number') ||
            $this->request->has('organisation_name') ||
            $this->request->has('fa_affiliation')
        ){
            $franchise = Franchise::findOrFail($user->franchise_id);

            $this->request->has('company_number') ? $franchise->company_number = $this->request->company_number : '';
            $this->request->has('vat_number') ? $franchise->vat_number = $this->request->vat_number : '';
            $this->request->has('organisation_name') ? $franchise->organisation_name = $this->request->organisation_name : '';
            $this->request->has('fa_affiliation') ? $franchise->fa_affiliation = $this->request->fa_affiliation : '';
            $franchise->save();

            // Set franchise info for response
            $user->company_number = $franchise->company_number;
            $user->vat_number = $franchise->vat_number;
            $user->organisation_name = $franchise->organisation_name;
            $user->fa_affiliation = $franchise->fa_affiliation;
        }

        $role = $user->getRole();
        $user['user_role'] = $role;

        if($role != 'admin'){
            if(!empty($user->address_id)){
                $address = Address::find($user->address_id);
            } else {
                $address = new Address;
            }
            $address->address = $user->address;
            isset($this->request['first_name']) ? $address->first_name = $firstName : '';
            isset($this->request['last_name']) ? $address->last_name = $lastName : '';
            $address->city = $user->town;
            $address->postcode = $user->postcode;
            $address->title = $user->display_name;
            $address->telephone = $user->telephone;
            $address->email = $user->email;
            $address->contact_name = $user->display_name;
            $address->created_by = $user_id;
            $address->updated_by = $user_id;
            if(isset($user->postcode) && !empty($user->postcode)){
                $geodata = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='.urlencode($user->postcode .' '.$user->town)));
                // extract latitude and longitude
                if(!empty($geodata->results)){
                    $address->lat = $geodata->results[0]->geometry->location->lat;
                    $address->lng = $geodata->results[0]->geometry->location->lng;
                }
            }
            $address->save();
        }
        return response()->json($user, 200);
    }

    public function updateUser($id){
        $user = User::findOrFail($id);

        if(isset($this->request['email']) && !empty($this->request['email'])){
            $user->email = $this->request['email'];
        }

        if(isset($this->request['first_name']) && !empty($this->request['first_name'])){
            $user->first_name = ucfirst($this->request['first_name']);
        }

        if(isset($this->request['last_name']) && !empty($this->request['last_name'])){
            $user->last_name = ucfirst($this->request['last_name']);
        }

        if(isset($this->request['telephone']) && !empty($this->request['telephone'])){
            $user->telephone = $this->request['telephone'];
        }

        // Update password
        if(isset($this->request['password']) && isset($this->request['password_confirmation']) && !empty($this->request['password']) ){
            $user->password = Hash::make($this->request['password']);
        }

        $user->save();

        return response()->json($user);
    }

    public function update_password($user_id) {
        $this->validate($this->request, [
            'password' => 'required|confirmed',
            'password_confirmation' => 'required'
        ]);

        $auth_user = Auth::user();
        $user_to_update = User::find($user_id);

        if( empty($user_to_update) ){
          return response()->json('User not found', 404);
        }

        //super admins can update only group admins
        if( $auth_user->hasRole('superadmin') ){
          if( !$user_to_update->hasRole('groupadmin') ){
            return response()->json('You cannot update this user from super admin', 403);
          }
        //rest of the users can only update themselves
        } else {
          if( $user_to_update->franchise_id != $auth_user->franchise_id ){
            return response()->json('You cannot update this user', 403);
          }
        }

        $user_to_update->password = Hash::make($this->request['password']);
        $user_to_update->save();
        
        if(isset($this->request['password_reset'])){
            return response()->json($user_to_update);
        }

        return response('Password Updated Successifully!', 200);
    }

    /**
    * Delete a specific user.
    *
    * @param int $user_id
    * @return json
    */
    public function delete_user($user_id){
        $user = User::find($user_id);
        //only allow admin users to be deleted
        if($user->hasRole('admin')){
            $user->delete();
            return response()->json('User deleted');
        }
        return response()->json('Unauthorized', 401);
    }

    /**
     * Upload files for a user .
     *
     * @return json
     */
     public function upload_scans(){
         //if auth user is admin we need to pass the user id
         if( Auth::user()->hasRole('admin') ){
             $this->validate($this->request, [
                 'user_id' => 'required|integer'
             ]);
             $user_id = $this->request['user_id'];
         } else {
             $user_id = $this->user_id;
         }
         //validate the request
         $this->validate($this->request, [
             'expiry' => 'required|date_format:Y-m-d H:i:s|after:today',
             'file' => 'required|file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
             'type' => 'string'
         ],
         [
           'file.max' => 'Uploaded scan cannot be bigger than 1 MB'
         ]);
         $type = $this->request['type'];
         $scan = new Scan;
         $scan->user_id = $user_id;
         $scan->title = $type . ' Scan';
         $scan->type_id = gr_get_scan_type_id($type);
         $scan->expire = $this->request['expiry'];
         $scan->status = 1; //hardcoded active by default
         if( $this->request->hasFile('file') ){
             $file = $this->request->file('file');
             $file_url = gr_save_file($file, $type, $user_id);
             $scan->file_url = $file_url;
         }
         $scan->save();

         return response()->json('File Uploaded successfully', 200);
     }

     public function upload_qualifications(Request $request){
         //if auth user is admin we need to pass the user id
         if( Auth::user()->hasRole('admin') ){
             $this->validate($this->request, [
                 'user_id' => 'required|integer'
             ]);
             $user_id = $this->request['user_id'];
         } else {
             $user_id = $this->user_id;
         }
         $files = $request->file('files');
         foreach ( $files as $file ){
             $destinationPath = 'storage/qualifications'.'/'.$user_id;
             $filename = $file->getClientOriginalName();
             $upload_success = $file->move($destinationPath, $filename);
             if($upload_success){
                 $file_url = url('storage')."/qualifications/" . $user_id."/" . $filename;
                 $scan = new Scan;
                 $scan->user_id = $user_id;
                 $scan->title = 'Qualification Scan';
                 $scan->type_id = gr_get_scan_type_id('qualifications');
                 $scan->status = 1; //hardcoded active by default
                 $scan->file_url = $file_url;
                 $scan->save();
             }
         }

         return response()->json("files uploaded successfully");
     }
}
