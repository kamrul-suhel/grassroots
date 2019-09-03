<?php

namespace App\Http\Controllers;
use App\GoCardLess;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\RelProgrammePlayer;
use App\RelPlayerGuardian;
use App\RelPlayerSession;
use App\RelProgrammeTeam;
use App\RelClubPackage;
use App\RelPlayerTeam;
use App\RelKitUser;
use App\Franchise;
use App\Programme;
use App\KittItem;
use App\Address;
use App\Invoice;
use App\Session;
use App\Player;
use App\Team;
use App\User;
use App\Club;
use DB;


class PublicController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    public function get_compatible_programmes(){
        $this->validate($this->request, [
            'dob' => 'required|date_format:Y-m-d|before:today',
            'club_id' => 'required|int|min:1'
        ]);
        $dob = Carbon::parse($this->request['dob']);
        $now = Carbon::now();
        $age_years = $dob->diffInYears($now);
        $programmes = NULL;

        $club = Club::find($this->request['club_id']);

        $age_group = $age_years + 1;
        $rank = gr_get_lowest_rank($this->request['club_id'], $age_group);

        //get all teams that are in the age group
        $teams = Team::select(
                'team.team_id',
                'team.title',
                'team.agegroup_id'
            )
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->where('team.club_id', $this->request['club_id'])
            ->where('agegroup.max_age', '=', $age_group)
            ->where(function($query) use ($rank, $club){
                if(!empty($rank)){
                    $query->where('team.rank', $rank);
                }
                if($club->type == 'fc'){
                    $query->where('team.type', 'team');
                } else {
                    $query->where('team.type', 'skill-group');
                }
                return $query;
            })
            ->get();

        if($teams->count() > 0){
            foreach($teams as $team){
                //get all team programmes
                $programmes = Programme::select(
                        DB::raw('SQL_CALC_FOUND_ROWS programme.programme_id'),
                        DB::raw('(SELECT SUM(session.price)) AS price'),
                        DB::raw('(SELECT SUM(session.price2)) AS price2'),
                        DB::raw('(SELECT SUM(session.price2plus)) AS price2plus'),
                        DB::raw('(SELECT COUNT(session.session_id)) AS session_count'),
                        'programme.title',
                        'programme.notes',
                        'programme.type_id',
                        'programme_type.title AS type',
                        'programme.title',
                        'rel_programme_team.team_id',
                        'team.title AS team'
                    )
                    ->leftJoin('session', 'session.programme_id', '=', 'programme.programme_id')
                    ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
                    ->leftJoin('team', 'team.team_id', '=', 'rel_programme_team.team_id')
                    ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                    ->where('rel_programme_team.team_id', $team->team_id)
                    ->where('session.start_time', '>=', date('Y-m-d'))
                    ->groupBy('programme.programme_id')
                    ->get();
                // return response()->json($programmes);
                //get the future session inside the programme
                if($programmes->count() > 0){
                    foreach($programmes as $prog){
                        $sessions = Session::select(
                                'session.session_id',
                                'session.start_time',
                                'session.end_time',
                                'session.venue_id',
                                'address_book.title AS venue_title',
                                'session.price',
                                'session.price2',
                                'session.price2plus',
                                'session.surface',
                                'session.coach_id',
                                'user.display_name AS coach_name'
                            )
                            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
                            ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
                            ->where('session.start_time', '>=', date('Y-m-d'))
                            ->where('session.programme_id', $prog->programme_id)
                            ->orderBy('session.start_time')
                            ->get();
                        $prog->sessions = $sessions;
                    }
                }
            }
        }
        return response()->json($programmes, 200);
    }

    public function register_accounts(){
        //validate the request
        $this->validate($this->request, [
            'club_id' => 'required|exists:club,club_id',
            'email' => 'required|email|max:255|unique:user',
            'password' => 'required|confirmed|max:50',
            'password_confirmation' => 'required',
            'first_name' => 'required|string|max:50',
            'last_name'  => 'required|string|max:50',
            'telephone'  => 'required|string|max:30',
            'address'    => 'required|string|max:255',
            'town'       => 'required|string|max:255',
            'postcode'   => 'required|string|max:30',
            'players' => 'required|array|min:1',
            'players.*.first_name' => 'required|string|max:50',
            'players.*.last_name' => 'required|string|max:50',
            'players.*.birthday' => 'required|date_format:Y-m-d|before:today',
            'players.*.programmes' => 'required|array|min:1',
            'players.*.programmes.*.programme_id' => 'required|exists:programme,programme_id',
            'players.*.programmes.*.team_id' => 'required|exists:team,team_id',
            'players.*.programmes.*.is_trial' => 'required|int|min:0|max:1',
            'players.*.programmes.*.price_band' => 'required|string|in:price,price2,price2plus'
        ]);
        //create the guardian account
        $guardian = $this->create_guardian();
        //create the players accounts
        foreach($this->request['players'] as $child){
            $player = $this->create_player($child, $guardian);
            foreach($child['programmes'] as $progr){
                if( !empty($progr['is_trial']) ){
                    //session is trial so we need to assign the player to the session as trial and set player in team with status triallist
                    $this->create_rel_player_session($player->player_id, $progr['session_id'], 1, 1, 0, $guardian);//we consider it accepted because the guardian choose it
                    //assign player to team
                    $rel_player_team = RelPlayerTeam::updateOrCreate(
                        ['player_id' => $player->player_id, 'team_id' => $progr['team_id']],
                        ['status' => 'trialist', 'date' => date('Y-m-d H:i:s')]
                    );
                } else {
                    //guardian paid for a full programme we need to assign the player to programme
                    $this->create_rel_programme_player($progr['programme_id'], $player->player_id, 1); //we consider programme status accepted because the guardian choose it

                    //get the sessions in the programme
                    $sessions = Session::select(
                            'session.session_id',
                            'session.'.$progr['price_band'].' AS price'
                        )
                        ->where('programme_id', $progr['programme_id'])
                        ->where('start_time', '>=', date('Y-m-d'))
                        ->get();
                   //assign player to sessions
                   $total_price = 0;
                   foreach($sessions as $session){
                       $this->create_rel_player_session($player->player_id, $session->session_id, 1, 0, $session->price, $guardian);
                       $total_price += $session->price;
                   }
                   $programe_details = Programme::find($progr['programme_id']);
                   $inv_description = $programe_details->title . " for " . $player->display_name;
                   $this->create_invoice($guardian->user_id, $progr['programme_id'], $player->player_id, $progr['team_id'], $total_price, $inv_description);
                   //invite player to all other programmes inside the team
                   $team_programmes = RelProgrammeTeam::where('team_id', $progr['team_id'])->where('programme_id', '!=', $progr['programme_id'])->get();
                   foreach($team_programmes as $program){
                       $this->create_rel_programme_player($program['programme_id'], $player->player_id, 0);
                   }
                   //assign player to team
                   $rel_player_team = RelPlayerTeam::updateOrCreate(
                       ['player_id' => $player->player_id, 'team_id' => $progr['team_id']],
                       ['status' => 'assigned', 'date' => date('Y-m-d H:i:s')]
                   );
                   //we need to assign the team kits to this player
                   $team_kits = KittItem::select(
                            'kit_item.kit_id'
                       )
                       ->leftJoin('rel_kit_team', 'rel_kit_team.kit_id', '=', 'kit_item.kit_id')
                       ->where('rel_kit_team.team_id', $progr['team_id'])
                       ->where('kit_item.is_player_assignment', 1)
                       ->groupBy('kit_item.kit_id')
                       ->get();
                   if(!empty($team_kits)){
                       foreach($team_kits as $kit){
                           $kit_user = RelKitUser::updateOrCreate(
                               ['kit_id' => $kit->kit_id, 'user_player_id' => $player->player_id],
                               ['user_role' => 'player', 'created_by' => $guardian->user_id, 'updated_by' => $guardian->user_id]
                           );
                       }
                   }
                }
            }
        }
        return response()->json('Success', 200);
    }

    public function register_franchsie(){
        //validate the request
        $this->validate($this->request, [
            'franchise_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:user',
            'password' => 'required|confirmed|max:50',
            'password_confirmation' => 'required',
            'telephone'  => 'required|string|max:30',
            'address'    => 'required|string|max:255',
            'address2' => 'string|max:255',
            'town'       => 'required|string|max:255',
            'postcode'   => 'required|string|max:30',
            'packages' => 'array|min:1',
            'packages.*.id' => 'required|min:1|exists:package,id',
            'packages.*.price' => 'required|numeric|min:1',
        ]);

        // Create gocardless customer account
        $cardLessController = new GoCardlessController($this->request);
        $goCardLessInfo = $cardLessController->createGoCardLessCustomer();

        if(empty($goCardLessInfo)){
            return response()->json($goCardLessInfo, 402);
        }

        //create the franchise
        $franchise = $this->create_franchise();
        
        //create the group admin user
        $user = $this->create_group_admin($franchise->franchise_id);
        $franchise->created_by = $user->user_id;
        $franchise->updated_by = $user->user_id;
        $franchise->save();

        // Create goCardLess record into our database
        $goCardLess = new GoCardLess();
        $goCardLess->franchise_id = $franchise->franchise_id;
        isset($goCardLessInfo['id']) ? $goCardLess->cardless_id = $goCardLessInfo['id'] : null;
        isset($goCardLessInfo['session_token']) ? $goCardLess->session_token = $goCardLessInfo['session_token'] : null;
        $goCardLess->customer_status = 0; // by default it not confirm
        $goCardLess->save();

        //create the rel between this franchise and packages
        foreach($this->request['packages'] as $package){
            $rel_club_package = new RelClubPackage;
            $rel_club_package->package_id = $package['id'];
            $rel_club_package->club_id = 0; //there is no club created at this point
            $rel_club_package->franchise_id = $franchise->franchise_id;
            $rel_club_package->start_date = Carbon::now()->toDateTimeString();
            $rel_club_package->expire_date = Carbon::now()->addMonth()->toDateTimeString();
            $rel_club_package->amount = $package['price'];
            $rel_club_package->created_by = $user->user_id;
            $rel_club_package->updated_by = $user->user_id;
            $rel_club_package->status = 1; //active
            $rel_club_package->save();
        }

        return response()->json($goCardLessInfo);
    }

    private function create_guardian(){
        $franchise_id = gr_get_franchise_by_club($this->request['club_id']);
        $role_id = gr_get_role_id('guardian');
        //create the address book entry
        $coordinates = gr_get_coordinates($this->request['postcode'], $this->request['town']);
        $address = new Address;
        $address->franchise_id = $franchise_id;
        $address->club_id = $this->request['club_id'];
        $address->address = $this->request['address'];
        $address->city = $this->request['town'];
        $address->postcode = $this->request['postcode'];
        $address->lat = $coordinates['lat'];
        $address->lng = $coordinates['lng'];
        $address->title = $this->request['first_name'] . " " .  $this->request['last_name'];
        $address->telephone = $this->request['telephone'];
        $address->mobile = $this->request['mobile'];
        $address->email = $this->request['email'];
        $address->contact_name = $this->request['first_name'] . " " .  $this->request['last_name'];
        $address->type_id = get_address_type_id('Guardian');
        $address->created_by = 0;
        $address->updated_by = 0;
        $address->status = 1;
        $address->save();

        //create the guardian
        $user = new User();
        $user->franchise_id = $franchise_id;
        $user->email        = $this->request['email'];
        $user->api_key      = str_random(80).time();
        $user->password     = Hash::make($this->request['password']);
        $user->user_role    = $role_id;
        $user->first_name   = $this->request['first_name'];
        $user->last_name    = $this->request['last_name'];
        $user->display_name = $this->request['first_name'] . " " .  $this->request['last_name'];
        $user->telephone    = $this->request['telephone'];
        $user->address      = $this->request['address'];
        $user->town         = $this->request['town'];
        $user->postcode     = $this->request['postcode'];
        $user->club_id      = $this->request['club_id'];
        $user->address_id   = $address->address_id;
        $user->save();

        NotificationController::create('welcome', NULL, $user->user_id, $user->user_id, NULL);
        NotificationController::create('update-kids', NULL, $user->user_id, $user->user_id, NULL);

        return $user;
    }

    private function create_player($child, $guardian){
        //make sure there are available slots
        $slots = gr_get_available_slots($this->request['club_id']);
        if ($slots < 1) {
            //notify admin email
            $admins = User::select('email', 'display_name')
                ->where('user_role', gr_get_role_id('admin'))
                ->where('club_id', $this->club_id)
                ->get();

            foreach($admins as $admin){
                Mail::send('emails.player-limit', ['name' => $admin->display_name], function ($message) use ($admin) {
                    $message->subject('Players Limit Reached');
                    $message->to("raul01us@gmail.com"); //hardcoded to be changed to $admin->email after mailgun live
                });
            }
            return response()->json('We are unable to register your children at this time. Please try again later.', 401);
        }
        $franchise_id = gr_get_franchise_by_club($this->request['club_id']);
        $player = new Player;
        $player->franchise_id = $franchise_id;
        $player->club_id = $this->request['club_id'];
        $player->first_name = $child['first_name'];
        $player->last_name = $child['last_name'];
        $player->display_name = $child['first_name'] . ' ' . $child['last_name'];
        $player->birthday = $child['birthday'];
        $player->created_by = $guardian->user_id;
        $player->status = 1; //active by default
        $player->living_guardian =  $guardian->user_id;
        $player->billing_guardian =  $guardian->user_id;
        $player->save();

        //create the relation between player and guardian
        $rel_player_guardian = new RelPlayerGuardian;
        $rel_player_guardian->player_id = $player->player_id;
        $rel_player_guardian->guardian_id = $guardian->user_id;
        $rel_player_guardian->save();

        return $player;
    }

    private function create_rel_player_session($player_id, $session_id, $status, $is_trial, $price, $guardian){
        $rel_player_session = new RelPlayerSession;
        $rel_player_session->player_id = $player_id;
        $rel_player_session->session_id = $session_id;
        $rel_player_session->status = $status;
        $rel_player_session->created_by = $guardian->user_id;
        $rel_player_session->updated_by = $guardian->user_id;
        $rel_player_session->attendance_completed = 0;
        $rel_player_session->is_trial = $is_trial;
        $rel_player_session->is_attended = 0;
        $rel_player_session->price = $price;
        $rel_player_session->save();
    }

    private function create_rel_programme_player($programme_id, $player_id, $status){
        $existing_rel = RelProgrammePlayer::where('programme_id', $programme_id)->where('player_id', $player_id)->first();
        if(empty($existing_rel)){
          $programme_player = new RelProgrammePlayer;
          $programme_player->programme_id = $programme_id;
          $programme_player->player_id = $player_id;
          $programme_player->status = $status;
          $programme_player->save();
        }

    }

    private function create_invoice($quardian_id, $programme_id, $player_id, $team_id, $total_price, $description){
        $franchise_id = gr_get_franchise_by_club($this->request['club_id']);
        //create the invoice line
        $invoice = new Invoice;
        $invoice->franchise_id = $franchise_id;
        $invoice->club_id = $this->request['club_id'];
        $invoice->user_id = $quardian_id;
        $invoice->programme_id = $programme_id;
        $invoice->player_id = $player_id;
        $invoice->team_id = $team_id;
        $invoice->date = date('Y-m-d H:i:s');
        $invoice->amount = $total_price;
        $invoice->vat_rate = get_club_vat($this->request['club_id']);
        $invoice->description = $description;
        $invoice->created_by = $quardian_id;
        $invoice->updated_by = $quardian_id;
        $invoice->save();
    }

    private function create_group_admin($franchise_id){
        $role_id = gr_get_role_id('groupadmin');
        $user = new User();
        $user->franchise_id = $franchise_id;
        $user->email        = $this->request['email'];
        $user->api_key      = str_random(80).time();
        $user->password     = Hash::make($this->request['password']);
        $user->user_role    = $role_id;
        $user->first_name   = ucfirst($this->request['first_name']);
        $user->last_name    = ucfirst($this->request['last_name']);
        $user->display_name = ucfirst($this->request['first_name']) . " " .  ucfirst($this->request['last_name']);
        $user->telephone    = $this->request['telephone'];
        $user->mobile    = $this->request['mobile'];
        $user->address      = $this->request['address'];
        $user->address2      = $this->request['address2'];
        $user->town         = $this->request['town'];
        $user->postcode     = $this->request['postcode'];
        $user->club_id      = 0;
        $user->save();
        return $user;
    }

    private function create_franchise($gocardlessInfo = []){
        $franchise = new Franchise;
        $franchise->title = $this->request['franchise_name'];
        $franchise->email = $this->request['email'];
        $franchise->telephone = $this->request['telephone'];
        $franchise->emergency_telephone = $this->request['telephone'];

        if(isset($this->request['mobile'])){
            $franchise->mobile = $this->request['mobile'];
        }
        if(isset($this->request['email_contact']) && !empty($this->request['email_contact'])){
            $franchise->contact_with_email = 1;
        }

        $franchise->company_number = $this->request['company_number'];
        $franchise->organisation_name = $this->request['organisation_name'];
        $franchise->address = $this->request['address'];
        $franchise->address2 = $this->request['address2'];
        $franchise->vat_number = $this->request['vat_number'];
        $franchise->postcode = $this->request['postcode'];
        $franchise->fa_affiliation = $this->request['fa_affiliation'];
        $franchise->created_by = 0;
        $franchise->updated_by = 0;
        $franchise->status = 1; //active by dfefault
        $franchise->save();

        return $franchise;
    }
}
