<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Tymon\JWTAuth\JWTAuth;
use App\Address;
use Validator;
use App\Club;
use App\User;
use URL;
use Auth;
use DB;

class AuthController extends Controller
{
    /**
     * @var \Tymon\JWTAuth\JWTAuth
     */
    protected $jwt;

    public function __construct(JWTAuth $jwt)
    {
        $this->jwt = $jwt;
    }

    public function login(Request $request)
    {
        //get the club id form the POST request
        $post_data = $request->all();
        $club_id = isset($post_data['club_id']) ? $post_data['club_id'] : NULL;

        //check if the club is inactive and block access
        if(!empty($club_id)){
            $club = Club::find($club_id);
            if($club->status == 0){
                return response()->json('Club is inactive', 401);
            }
        }

        //get the basic auth credentials from the request
        $credentials = array(
            'email'    => $request->server('PHP_AUTH_USER'),
            'password' => $request->server('PHP_AUTH_PW'),
            'club_id'  => $club_id
        );

        //set the rules for validation
        $rules = [
            'email'    => 'required|email|max:255',
            'password' => 'required',
            'club_id'  => 'required'
        ];

        $messages = [
            'email.required' => 'Invalid email entered'
        ];

        //validate the credentials
        $validator = Validator::make( $credentials, $rules, $messages);
        if ($validator->fails()) {
            $errors = json_decode($validator->errors());
            foreach($errors as $key => $value){
                if($key === 'email'){
                    return response()->json(['error' => 'Invalid email entered'], 401);
                }
            }
            return response()->json($validator->errors(), 401);
        }

        try {

            if (!$token = $this->jwt->attempt($credentials)) {
                return response()->json(['Incorrect log in entered'], 401);
            }

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['Token Expired'], 401);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['Incorrect log in entered'], 401);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['Incorrect log in entered' => $e->getMessage()], 401);

        }

        //decode the token so we can add custom data into payload
        $payloadArray = $this->jwt->manager()->getJWTProvider()->decode($token);

        $user = Auth::user();
        $role = DB::table('role')->where('role_id', '=', $user->user_role)->first();

        $payloadArray['franchise_id'] = $user->franchise_id;
        $payloadArray['club_id'] = $user->club_id;
        $payloadArray['user_id'] = $user->user_id;
        $payloadArray['name'] = $user->display_name;
        $payloadArray['role'] = $role->title;
        $tokenNew = $this->jwt->manager()->getJWTProvider()->encode($payloadArray);

        AuditLogController::create('log-in', 0, $user->user_id);
        return response()->json($tokenNew);
    }

    /**
    * Create a new guardian after a valid registration.
    *
    * @return json
    */
    public function register(Request $request) {
        //validate the request
        $this->validate($request,[
            'email'      => 'required|email|max:255',
            'club_id'    => 'required|int|min:1|exists:club,club_id',
            'password'   => 'required|confirmed|max:50',
            'password_confirmation' => 'required',
            'first_name' => 'required|max:50',
            'last_name'  => 'required|max:50',
            'position'   => 'string|max:255',
            'status'     => 'integer|min:0|max:1',
            'mobile'     => 'max:30',
            'telephone'  => 'max:30',
            'address'    => 'max:255',
            'town'       => 'max:255',
            'postcode'   => 'max:30'
        ]);

        $user_exists = User::where('email', $request['email'])
            ->where('club_id', $request['club_id'])
            ->first();
        if( !empty($user_exists) ) { return response()->json('User with email '.$request['email'].' already exists', 422); }

        //if user is registered by an admin
        if( !empty($request->user()) && $request->user()->hasRole('admin') || $request->user()->hasRole('groupadmin') ) {
            $this->validate($request, [
                'role' => 'required|integer'
            ]);
            $franchise_id = Auth::getPayload()->get('franchise_id');
            $club_id = $request['club_id'];
            $role_id = $request['role'];
        } else {
            return response()->json('Don\'t know the club_id', 422);
        }

        //create the address book entry
        $latitude = 0;
        $longitude = 0;
        if(isset($request['postcode']) && !empty($request['postcode'])){
            $geodata =   json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='.urlencode($request['postcode'])));
            // extract latitude and longitude
            $latitude  = $geodata->results[0]->geometry->location->lat;
            $longitude = $geodata->results[0]->geometry->location->lng;
        }

        if( !isset($request['no_address']) ){
            $address = new Address;
            $address->franchise_id = $franchise_id;
            $address->club_id = $club_id;
            $address->address = $request['address'];
            $address->city = $request['town'];
            $address->postcode = $request['postcode'];
            $address->lat = $latitude;
            $address->lng = $longitude;
            $address->title = $request['first_name'] . " " .  $request['last_name'];
            $address->position = $request['position'];
            $address->telephone = $request['telephone'];
            $address->mobile = $request['mobile'];
            $address->email = $request['email'];
            $address->contact_name = $request['first_name'] . " " .  $request['last_name'];
            $address->type_id = get_address_type_id(gr_get_role_title($role_id));
            $address->created_by = 0;
            $address->updated_by = 0;
            $address->status = 1;
            $address->save();
        }

        //create the user
        $user = new User;
        $user->franchise_id = $franchise_id;
        $user->email        = $request['email'];
        $user->api_key      = str_random(80).time();
        $user->password     = Hash::make($request['password']);
        $user->user_role    = $role_id;
        $user->first_name   = $request['first_name'];
        $user->last_name    = $request['last_name'];
        $user->display_name = $request['first_name'] . " " .  $request['last_name'];
        $user->mobile       = $request['mobile'];
        $user->telephone    = $request['telephone'];
        $user->address      = $request['address'];
        $user->town         = $request['town'];
        $user->postcode     = $request['postcode'];
        $user->club_id      = $club_id;
        $user->address_id   = isset($address->address_id) ? $address->address_id : NULL;
        if( $user->user_role == gr_get_role_id('guardian') ) {
            $user->has_active_players = 0;
        }
        $user->save();

        //create the notification
        NotificationController::create('welcome', NULL, $user->user_id, $user->user_id, NULL);
        if($user->user_role == gr_get_role_id('guardian')){
            NotificationController::create('no-kids', NULL, $user->user_id, $user->user_id, NULL);
        }
        return response()->json($user, 200);
    }

    public function handle_reset_password(Request $request){
        //validate the request
        $this->validate($request,[
            'email'      => 'required|email',
            'club_id'    => 'required|int|min:0',
            'redirect_url' => 'required|string'
        ]);
        //get the user
        $user = User::where('email', $request['email'])
          ->where('club_id', $request['club_id'])
          ->first();

        if( !empty($user) ){
            //set a password reset token and store it into the database
            $user->password_reset = str_random(80).time();
            $user->save();
            //create the url for the reset password form
            //$link = URL::to('v1/auth/password-reset/'.$user->password_reset);
            $link = $request['redirect_url'].'/'.$user->password_reset;
            //sent email to user
            Mail::send('emails.test', ['name' => $user->display_name, 'link' => $link], function ($message) use ($user) {
                $message->subject('Password Reset');
                $message->to("raul01us@gmail.com"); //TODO hardcoded change to $user->email when mailgun live
            });

            return response()->json('Check your email to reset the password');
        }
        return response()->json('We couldn’t find any user with this email please re-enter your email address', 402);
    }

    public function reset_password(Request $request, $token){
        //validate the request
        $this->validate($request, [
            'password' => 'required|confirmed',
            'password_confirmation' => 'required'
        ]);
        //get the user with the token
        $user = User::where('password_reset', $token)->first();
        if( !empty($user) ){
            //set new password
            $user->password = Hash::make($request['password']);
            //clear the token
            $user->password_reset = '';
            $user->save();
            return response('Password Changed Successifully!', 200);
        }

        return response()->json('Could not find the user', 402);
    }

    public function get_club_by_slug($slug){
        $club = Club::select(
                'club.club_id',
                'club.title',
                'club.type',
                'club.logo_url',
                'club.email',
                'club.telephone',
                'club.emergency_telephone',
                'club.website',
                'club.address',
                'club.town',
                'club.postcode',
                'club.company_number',
                'club.vat_number'
            )
            ->where('club.slug', $slug)
            ->first();
        return response()->json($club, 200);
    }

    public function foo(Request $request){
        return response()->json(Hash::make($request['password']));
    }

}
