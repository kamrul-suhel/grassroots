<?php
namespace App\Http\Controllers;
use App\User;
use Illuminate\Http\Request;
use App\RelProgrammeTeam;
use App\RelCoachSession;
use App\RelPlayerSession;
use App\RelPlayerTeam;
use App\Programme;
use Carbon\Carbon;
use App\Invoice;
use App\Session;
use App\Player;
use App\Team;
use App\Pod;
use Auth;
use DB;

class SessionController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['update_session']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the sessions for a coach
    *
    * @return json
    */
    public function get_sessions(){
        $pagination = create_pagination();
        $sessions = Session::select(
                DB::raw('SQL_CALC_FOUND_ROWS session.session_id'),
                'programme.programme_id',
                'programme.title AS programme_name',
                'programme_type.title AS programme_type',
                'session.start_time',
                'session.end_time',
                'session.venue_id',
                'session.coach_id',
                'session.price',
                'session.price2',
                'session.price2plus',
                'session.surface',
                'rel_player_session.attendance_completed'
            )
            ->leftJoin('programme', 'programme.programme_id','=', 'session.programme_id')
            ->leftJoin('programme_type', 'programme_type.type_id','=', 'programme.type_id')
            ->leftJoin('rel_player_session', 'rel_player_session.session_id', '=', 'session.session_id')
            ->leftJoin('user', 'user.user_id','=', 'session.coach_id')
            ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
            ->where('programme.franchise_id', $this->franchise_id)
            ->where(function($query){
                //allow filter by teams
                if( isset($this->request['team']) && !empty($this->request['team']) ){
                    $query->where('rel_programme_team.team_id', $this->request['team']);
                }

                //allow filter by skill group
                if( isset($this->request['skill']) && !empty($this->request['skill']) ){
                    $query->where('rel_programme_team.team_id', $this->request['skill']);
                }

                //allow filter by address
                if( isset($this->request['address']) && !empty($this->request['address']) ){
                    $query->where('session.venue_id', $this->request['address']);
                }

                //allow filter by status
                if( isset($this->request['status']) ){
                    $query->where('rel_player_session.attendance_completed', $this->request['status']);
                }

                //check if we should return past session or future
                if( empty($this->request['past']) ){
                    $query->where('session.start_time', '>=',  date('Y-m-d 00:00:00'));
                } else {
                    $query->where('session.start_time', '<=',  date('Y-m-d 23:59:59'));
                }

                //if auth user is coach only show his sessions
                if(Auth::user()->hasRole('coach')){
                    $query->where('user.user_id', $this->user_id);
                }

                return $query;
            });

        // If datepicker is set then search by custome date
        if($this->request->has('datepicker') && !empty($this->request->datepicker)){
            $date = Carbon::parse($this->request->datepicker);
            $startDay = $date->copy()->startOfDay();
            $endDay = $date->copy()->endOfDay();
            $sessions = $sessions->whereBetween('session.start_time', [$startDay, $endDay]);
        }

        $sessions = $sessions->groupBy('session.session_id')
            ->orderBy('session.start_time', 'ASC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        //load coach detail and address
        $sessions->load('coach', 'address', 'programme.teams');

        //handle filters
        $teams = get_teams();
        $teams_filter = create_filter('team', 'Teams', $teams);

        $skill_groups = gr_get_skillgroups();
        $skill_filter = create_filter('skill', 'Skill Group', $skill_groups);

        $dateFilter = create_filter('datepicker','Date', '');

        $address = gr_get_address();
        $address_filter = create_filter('address', 'Venue', $address);

        $statuses = (object)[
            '0' => (object) ['key' => 0, 'value' => 'Not Completed'],
            '1' => (object) ['key' => 1, 'value' => 'Completed']
        ];
        $filter_status = create_filter('status', 'Status', $statuses);

        //create the status filter only for attendance page where we load the sessions that happen in the past
        if( isset($this->request['past']) ){
            $filters = [$teams_filter, $skill_filter, $address_filter, $filter_status, $dateFilter];
        }else{
            $filters = [$teams_filter, $skill_filter, $address_filter, $dateFilter];
        }

        //create filters array

        return format_response($sessions, $count, $filters);
    }

    /**
    * Get a specific session
    *
    * @param $session_id
    * @return void
    */
    public function get_session($session_id) {
        if( Auth::user()->hasRole('guardian') ){
            $this->validate($this->request, [
                'player_id' => 'required|integer|min:1'
            ]);
            $session = Session::select(
                    'session.session_id',
                    'session.surface',
                    'programme.programme_id',
                    'programme.title AS programme_name',
                    'programme_type.title AS programme_type',
                    'session.start_time',
                    'session.end_time',
                    'session.venue_id',
                    'session.coach_id',
                    'session.price',
                    'rel_player_session.player_id',
                    'rel_player_session.is_trial',
                    'rel_player_session.status AS acceptance_status',
                    'player.display_name AS player_name',
                    'player.medical_conditions'
                )
                ->leftJoin('rel_player_session', 'rel_player_session.session_id', '=', 'session.session_id')
                ->leftJoin('player', 'player.player_id', '=', 'rel_player_session.player_id')
                ->leftJoin('programme', 'programme.programme_id','=', 'session.programme_id')
                ->leftJoin('programme_type', 'programme_type.type_id','=', 'programme.type_id')
                ->where('rel_player_session.session_id', $session_id)
                ->where('rel_player_session.player_id', $this->request['player_id'])
                ->first();
        } else {
            $session = Session::select(
                    'programme.programme_id',
                    'session.session_id',
                    'programme.title AS programme_name',
                    'programme_type.title AS programme_type',
                    'session.start_time',
                    'session.end_time',
                    'session.venue_id',
                    'session.coach_id',
                    'session.price',
                    'session.surface',
                    'rel_player_session.attendance_completed'
                )
                ->leftJoin('programme', 'programme.programme_id','=', 'session.programme_id')
                ->leftJoin('programme_type', 'programme_type.type_id','=', 'programme.type_id')
                ->leftJoin('rel_player_session', 'rel_player_session.session_id', '=', 'session.session_id')
                ->where('session.session_id', $session_id)
                ->first();

            //get invited players that didnt accept the programme
            $invited_players = Player::select(
                    'player.display_name',
                    'player.player_id',
                    'player.gender',
                    'player.birthday',
                    'player.medical_conditions',
                    'rel_programme_player.status',
                    'user.display_name AS guardian_name',
                    'user.telephone AS guardian_telephone'
                )
                ->leftJoin('rel_programme_player', 'rel_programme_player.player_id', '=', 'player.player_id')
                ->leftJoin('user', 'user.user_id', '=', 'player.living_guardian')
                ->where('rel_programme_player.programme_id', $session->programme_id)
                ->where('rel_programme_player.status', '!=', 1)
                ->groupBy('player.player_id')
                ->get()->toArray();

            //get players that accepted the session
            $accepted_players =  Player::select(
                    'player.display_name',
                    'player.player_id',
                    'player.gender',
                    'player.birthday',
                    'player.medical_conditions',
                    'rel_player_session.status',
                    'user.display_name AS guardian_name',
                    'user.telephone AS guardian_telephone'
                )
                ->leftJoin('rel_player_session', 'rel_player_session.player_id', '=', 'player.player_id')
                ->leftJoin('user', 'user.user_id', '=', 'player.living_guardian')
                ->where('rel_player_session.session_id', $session->session_id)
                ->groupBy('player.player_id')
                ->get()->toArray();

            $players = array_merge($accepted_players, $invited_players);
            usort($players, function($a, $b) {
                // return strcasecmp($a['display_name'], $b['display_name']);
                return $a['status'] - $b['status'];
            });
            $session->players = $players;
        }
        if(empty($session)){
            return response()->json($session_id, 403);
            $session = Session::find($session_id);
            $session->load('coach', 'address');
        } else {
            $session->load('coach', 'address');
        }
        return response()->json($session, 200);
    }

    /**
    * Create a new seesion inside a programme
    *
    * @return void
    */
    public function create_session() {
        //if auth user is admin we need coach id to be passed
        if(Auth::user()->hasRole('admin')){
            $this->validate($this->request,[
                'coach_id' => 'required|integer',
            ]);
            $coach_id = $this->request['coach_id'];
        } else {
            //coach id is the auth user
            $coach_id = $this->user_id;
        }
        //validate the request
       $this->validate($this->request,[
           'start_time' => 'required|date_format:Y-m-d H:i:s|after:today',
           'end_time'   => 'required|date_format:Y-m-d H:i:s|after:start_time',
           'status' => 'integer|min:0|max:1',
           'venue_id'   => 'required|integer|min:0',
           'programme_id' => 'required|integer|min:0',
           'price'      => 'numeric',
           'price2'      => 'numeric',
           'price2plus'      => 'numeric',
           'surface' => 'required|string|max:255'
       ]);
       //create the session
       $session = new Session();
       $session->programme_id = $this->request['programme_id'];
       $session->start_time = $this->request['start_time'];
       $session->end_time = $this->request['end_time'];
       $session->venue_id = $this->request['venue_id'];
       $session->price = $this->request['price'];
       $session->price2 = $this->request['price2'];
       $session->price2plus = $this->request['price2plus'];
       $session->surface = $this->request['surface'];
       $session->coach_id = $coach_id;
       $session->created_by = $this->user_id;
       //set status active by default
       if( isset($this->request['status']) ){
           $session->status = $this->request['status'];
       } else {
           $session->status = 1;
       }

       $session->save();

       return response()->json($session, 200);
    }

    /**
    * Update the session with $session_id
    *
    * @param $session_id
    * @return void
    */
    public function update_session($session_id) {
        //validate the request
       $this->validate($this->request,[
           'venue_id'   => 'required|integer|min:0',
           'coach_id' => 'integer|min:0',
           'coach_rate' => 'string|in:rate,rate1,rate2',
           'update_remaining' => 'int|min:0|max:1',
           'surface' => 'string|max:255'
       ]);

       //get the session
       $session = Session::find($session_id);
       //check if we need to update all future sessions within the programme
       if(isset($this->request['update_remaining']) && !empty($this->request['update_remaining'])){
           //for multiple session we can only change the hours
           $this->validate($this->request, [
               'start_time' => 'date_format:H:i:s',
               'end_time'   => 'date_format:H:i:s'
           ]);
           //get all remaining session in the programme
           $sessions = Session::select('programme_id', 'session_id', 'start_time', 'end_time')
                ->where('programme_id', $session->programme_id)
                ->where('start_time', '>=', $session->end_time)
                ->orWhere('session_id', $session_id)
                ->get();
            //update the remaining sessions
            foreach($sessions as $sess){
                $session = Session::find($sess->session_id);
                $session->start_time = date('Y-m-d', strtotime($session->start_time)). " " .$this->request['start_time'];
                $session->end_time = date('Y-m-d', strtotime($session->end_time)). " " .$this->request['end_time'];
                $session->venue_id = $this->request['venue_id'];
                $this->request->has('surface') ? $session->surface = $this->request['surface'] : null;

                if( isset($this->request['coach_id']) ){
                    $session->coach_id = $this->request['coach_id'];
                    //update coach price in rel coach session
                    $rel_coach_session = RelCoachSession::where('coach_id', $this->request['coach_id'])->where('session_id', $sess->session_id)->first();
                    //check if the record exist and update it
                    $rate = isset($this->request['coach_rate']) ? $this->request['coach_rate'] : 'rate';
                    $coach_rate = gr_get_coach_rate($this->request['coach_id'], $rate);
                    if(!empty($rel_coach_session)){
                        $rel_coach_session->price = $coach_rate;
                        $rel_coach_session->updated_by = $this->user_id;
                        $rel_coach_session->save();
                        //update the invoice line with the new price
                        $invoice = Invoice::where('user_id', $this->request['coach_id'])->where('session_id', $sess->session_id)->first();
                        $invoice->amount = $coach_rate;
                        $invoice->vat_rate = get_club_vat($this->club_id);
                        $invoice->updated_by = $this->user_id;
                        $invoice->save();
                    } else {
                        //we need to create a new record and remove the old one because we changed the coach
                        RelCoachSession::where('session_id', $sess->session_id)->delete();
                        $rel_coach_session = new RelCoachSession;
                        $rel_coach_session->coach_id = $this->request['coach_id'];
                        $rel_coach_session->session_id = $sess->session_id;
                        $rel_coach_session->price = $coach_rate;
                        $rel_coach_session->created_by = $this->user_id;
                        $rel_coach_session->updated_by = $this->user_id;
                        $rel_coach_session->save();

                        //remove the only invoice line and create a new one
                        Invoice::where('session_id', $sess->session_id)->delete();
                        $rel_programme_team = RelProgrammeTeam::where('programme_id', $sess->programme_id)->first();
                        $programme = Programme::find($sess->programme_id);
                        $team_details = Team::find($rel_programme_team->team_id);

                        $invoice = new Invoice;
                        $invoice->franchise_id = $this->franchise_id;
                        $invoice->club_id = $this->club_id;
                        $invoice->user_id = $this->request['coach_id'];
                        $invoice->programme_id = $sess->programme_id;
                        $invoice->session_id = $sess->session_id;
                        $invoice->team_id = $rel_programme_team->team_id;
                        $invoice->date = date('Y-m-d', strtotime($session->start_time)). " " .$this->request['start_time'];
                        $invoice->amount = $coach_rate;
                        $invoice->vat_rate = get_club_vat($this->club_id);
                        $invoice->description = $programme->title ." with ".$team_details->title;
                        $invoice->updated_by = $this->user_id;
                        $invoice->save();
                    }
                }
                $session->updated_by = $this->user_id;
                $session->save();
            }
       } else {
           //update only this session
           $this->validate($this->request, [
               'start_date_time' => 'required|date_format:Y-m-d H:i:s|after:today',
               'end_date_time' => 'required|date_format:Y-m-d H:i:s|after:start_date_time'
           ]);
           $session->start_time = $this->request['start_date_time'];
           $session->end_time = $this->request['end_date_time'];
           $session->venue_id = $this->request['venue_id'];
           $this->request->has('surface') ? $session->surface = $this->request['surface'] : null;

           if( isset($this->request['coach_id']) && !empty($this->request['coach_id']) ){
               $rel_coach_session = RelCoachSession::where('coach_id', $this->request['coach_id'])
                   ->where('session_id', $session->session_id)
                   ->first();

               //check if the record exist and update it
               $rate = isset($this->request['coach_rate']) ? $this->request['coach_rate'] : 'rate';
               $coach_rate = gr_get_coach_rate($this->request['coach_id'], $rate);
               if(!empty($rel_coach_session)){
                   $rel_coach_session->price = $coach_rate;
                   $rel_coach_session->updated_by = $this->user_id;
                   $rel_coach_session->save();

                   //update the invoice line with the new price
                   $invoice = Invoice::where('user_id', $this->request['coach_id'])
                       ->where('session_id', $session->session_id)
                       ->first();

                   $invoice->amount = $coach_rate;
                   $invoice->vat_rate = get_club_vat($this->club_id);
                   $invoice->updated_by = $this->user_id;
                   $invoice->save();
               } else {
                   //we need to create a new record and remove the old one because we changed the coach
                   RelCoachSession::where('session_id', $session->session_id)->delete();
                   $rel_coach_session = new RelCoachSession;
                   $rel_coach_session->coach_id = $this->request['coach_id'];
                   $rel_coach_session->session_id = $session->session_id;
                   $rel_coach_session->price = $coach_rate;
                   $rel_coach_session->created_by = $this->user_id;
                   $rel_coach_session->updated_by = $this->user_id;
                   $rel_coach_session->save();

                   //remove the old invoice line and create a new one
                   Invoice::where('session_id', $session->session_id)->delete();
                   $rel_programme_team = RelProgrammeTeam::where('programme_id', $session->programme_id)->first();
                   $programme = Programme::find($session->programme_id);
                   $team_details = Team::find($rel_programme_team->team_id);

                   $invoice = new Invoice;
                   $invoice->franchise_id = $this->franchise_id;
                   $invoice->club_id = $this->club_id;
                   $invoice->user_id = $this->request['coach_id'];
                   $invoice->programme_id = $session->programme_id;
                   $invoice->session_id = $session->session_id;
                   $invoice->team_id = $rel_programme_team->team_id;
                   $invoice->date = date('Y-m-d', strtotime($session->start_time)). " " .$this->request['start_time'];
                   $invoice->amount = $coach_rate;
                   $invoice->vat_rate = get_club_vat($this->club_id);
                   $invoice->description = $programme->title ." with ".$team_details->title;
                   $invoice->updated_by = $this->user_id;
                   $invoice->save();
               }
               $session->coach_id = $this->request['coach_id'];
           }
           $session->updated_by = $this->user_id;
           $session->save();
       }
       return response()->json('Session updated successfully', 200);
    }

    /**
    * Get all the players that accepted the programme for the $session_id
    *
    * @param int $session_id
    * @return json
    */
    public function get_session_players($session_id){
        //get the session details
        $session = Session::with('coach', 'address')
            ->select(
                'session.session_id',
                'programme.programme_id',
                'programme.title AS programme_name',
                'programme_type.title AS programme_type',
                'session.start_time',
                'session.end_time',
                'session.venue_id',
                'session.coach_id',
                'session.price',
                'session.price2',
                'session.price2plus',
                'session.surface',
                'rel_player_session.attendance_completed',
                'address_book.lat',
                'address_book.lng',
                'pod.player_id AS pod_player_id'
            )
            ->leftJoin('programme', 'programme.programme_id','=', 'session.programme_id')
            ->leftJoin('programme_type', 'programme_type.type_id','=', 'programme.type_id')
            ->leftJoin('rel_player_session', 'rel_player_session.session_id', '=', 'session.session_id')
            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
            ->leftJoin('pod', 'pod.session_id', '=', 'session.session_id')
            ->where('session.session_id', $session_id)
            ->groupBy('session.session_id')
            ->first();

        $team = RelProgrammeTeam::where('programme_id', $session->programme_id)->first();
        //get the players that accepted the programme for this $session_id
        $players = Player::select(
                DB::raw('SQL_CALC_FOUND_ROWS player.player_id'),
                'player.display_name',
                'rel_player_session.is_attended',
                'rel_player_session.is_trial',
                'rel_player_session.rating',
                'rel_player_session.reason',
                'rel_player_team.trial_rating',
                'player.medical_conditions',
                DB::raw('(SELECT COUNT(*) FROM pod WHERE pod.player_id = player.player_id AND pod.team_id = '.$team->team_id.') AS pod_count'),
                DB::raw('
                    (SELECT rel_kit_user.kit_id FROM rel_kit_user
                    LEFT JOIN kit_item ON kit_item.kit_id = rel_kit_user.kit_id
                    LEFT JOIN rel_kit_team ON rel_kit_team.kit_id = kit_item.kit_id
                    WHERE rel_kit_user.user_player_id = player.player_id AND (rel_kit_user.size = "" OR rel_kit_user.size IS NULL) AND rel_kit_team.team_id = '.$team->team_id.'
                    LIMIT 1) AS missing_size')
            )
            ->leftJoin('rel_player_session', 'rel_player_session.player_id', '=', 'player.player_id')
            ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
            ->where('rel_player_session.session_id', $session_id)
            ->where('rel_player_session.status', 1) //only accepted sessions
            ->groupBy('player.player_id')
            ->orderBy('player.display_name')
            ->get();

        //add the players to the session object
        $session['players'] = $players;

        return response()->json($session);
    }

    /**
    * Take the attendance for $session_id
    *
    * @param int $session_id
    * @return json
    */
    public function take_attendance($session_id){
        $session = Session::findOrFail($session_id);
        $coachSession = RelCoachSession::where('coach_id', $session->coach_id)
            ->where('session_id', $session->session_id)
            ->first();

        // Update coach attendant
        $coachSession->status = 1;
        $coachSession->save();

        // Get team
        $team = RelProgrammeTeam::select([
            'rel_programme_team.team_id',
            'rel_programme_team.programme_id',
            'programme.programme_id',
            'programme.title'
        ])
            ->leftJoin('programme', 'programme.programme_id', '=', 'rel_programme_team.programme_id')
            ->where('programme.programme_id', $session->programme_id)
            ->first();

        if(date('Y-m-d H:i:s') < $session->start_time){
            return response()->json('You cannot take attandance for future sessions', 403);
        }

        $this->validate($this->request, [
            'players' => 'required|array|min:1',
            'players.*.player_id'  => 'required|int|min:1',
            'players.*.status'  => 'required|int|min:0|max:1',
            'players.*.pod' => 'int|min:0|max:1',
            'players.*.reason' => 'string',
            'players.*.rating' => 'int|min:1|max:10',
        ]);

        foreach($this->request['players'] as $player){
            $rel_player_session = RelPlayerSession::where('session_id', $session_id)
                ->where('player_id', $player['player_id'])
                ->first();

            //do not update if attendance is already completed
            if($rel_player_session->attendance_completed == 1){ continue; }

            $rel_player_session->is_attended = $player['status'];
            $rel_player_session->updated_by = $this->user_id;
            $rel_player_session->attendance_completed = 1;
            $rel_player_session->reason = isset($player['reason']) ? $player['reason'] : NULL;
            $rel_player_session->rating = isset($player['rating']) ? $player['rating'] : NULL;
            //for trial session coach will have to mark the trial rating score and change player status to waiting list

            if( $rel_player_session->is_trial === 1 ){
                if(empty($player['trial_rating'])) {
                    return response()->json('Trial Rating is required', 403);
                }
                //update the rel player team with the tiral rating
                RelPlayerTeam::where('player_id',  $player['player_id'])
                    ->where('status', 'trialist')
                    ->update([
                        'status' => 'waiting',
                        'trial_rating' => $player['trial_rating']
                    ]);
            }

            //mark player as player of the day
            if(isset($player['pod']) && !empty($player['pod'])){
                $pod = new Pod;
                $pod->player_id = $player['player_id'];
                $pod->team_id = $team->team_id;
                $pod->session_id = $session_id;
                $pod->date = date('Y-m-d H:i:s');
                $pod->save();
            }

            $rel_player_session->save();
        }
        return response()->json('Attendance Updated Successfully', 200);
    }

    /**
    * Accept or reject a individual session (this will be used for accepting trial session)
    *
    * @param int $session_id
    * @return json
    */
    public function accept_reject_session($session_id){
        $this->validate($this->request, [
            'player_id' => 'required|integer|min:1',
            'status'      => 'required|in:accept,accept_team,reject'
        ]);

        //parent rejected the trial so we need to update the rel between the player and session and put the player back as waitng trial
        if($this->request['status'] === 'reject'){
            RelPlayerSession::where('player_id', $this->request['player_id'])
                ->where('session_id', $session_id)
                ->update(['status' => 2]);

            RelPlayerTeam::where('player_id', $this->request['player_id'])
                ->where('status', 'trialist')
                ->update(['status' => 'trial']);
        }

        // Parent accept for team, we need to update rel_player_session status
        else if($this->request->status === 'accept_team'){
            //parent accepted the trial so we update the status
            // TODO need to send invoice base on how many children has active in this parent
            RelPlayerSession::where('player_id', $this->request['player_id'])
                ->where('session_id', $session_id)
                ->update(['status' => 1]);
        }

        // Parent reject for team, we need to update rel_player_session status
        else if($this->request->status === 'reject_team'){
            //parent accepted the trial so we update the status
            // TODO need to implement when reject from team
        }

        else {
            //parent accepted the trial so we update the status
            RelPlayerSession::where('player_id', $this->request['player_id'])
                ->where('session_id', $session_id)
                ->update(['status' => 1]);
        }

        return response()->json('Session '.$this->request['status'].'ed', 200);
    }
}
