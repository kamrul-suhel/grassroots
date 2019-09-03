<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Download;
use App\Player;
use App\Match;
use Carbon\Carbon;
use Auth;
use DB;

class FixtureController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        // $this->middleware('role:admin');
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Get all fixtures.
     *
     * @return json
     */
    public function get_fixtures() {
        $pagination = create_pagination();
        $fixtures = Match::select(
                DB::raw('SQL_CALC_FOUND_ROWS match.fixture_id'),
                'match.type_id',
                'match.referee',
                'match.oposition',
                'match.match_location',
                'team.team_id',
                'team.title AS team',
                'session.venue_id',
                'session.session_id',
                'session.start_time',
                'session.coach_id',
                'session.pitch_size',
                'session.pitch_no',
                'user.display_name AS coach_name',
                'address_book.title AS venue',
                'programme.title',
                'programme.image_path',
                'programme.image_type',
                'programme.programme_id'
            )
            ->leftJoin('session', 'session.session_id', '=', 'match.session_id')
            ->leftJoin('programme', 'programme.programme_id', '=', 'session.programme_id')
            ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_programme_team.team_id')
            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
            ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
            ->where('programme.franchise_id', $this->franchise_id)
            ->where('programme.club_id', $this->club_id)
            ->where(function($query){
                //allow search by programme title
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                }
                //allow filter programme by teams
                if( isset($this->request['team']) && !empty($this->request['team']) ){
                    $query->where('rel_programme_team.team_id', $this->request['team']);
                }
                //allow filter by type
                if( isset($this->request['type']) && !empty($this->request['type']) ){
                    $query->where('match.type_id', $this->request['type']);
                }
                // allow filter by coach
                if( isset($this->request['coach']) && !empty($this->request['coach']) ){
                    $query->where('session.coach_id', $this->request['coach']);
                }
                //filter by status
                if( isset($this->request['status']) && !empty($this->request['status']) ) {
                    if($this->request['status'] == 'past'){
                      $query->whereDate('session.start_time', '<', Carbon::now());
                    } else {
                        $query->whereDate('session.start_time', '>=', Carbon::now());
                    }
                }
            })
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;

        $search = create_filter('search', 'Search');

        $teams = get_teams();
        $filter_team = create_filter('team', 'Team', $teams);

        $coaches = gr_get_coaches();
        $filter_coach = create_filter('coach', 'Coach', $coaches);

        $statuses = (object)[
            '0' => (object) ['key' => 'past', 'value' => 'Past'],
            '1' => (object) ['key' => 'current', 'value' => 'Current']
        ];
        $filter_status = create_filter('status', 'Status', $statuses);

        $types = new DropdownController($this->request);
        $match_types = $types->get_match_types('data');
        $filter_type = create_filter('type', 'Match Type', $match_types);
        $filters = [$search, $filter_team, $filter_type, $filter_status,$filter_coach ];
        return format_response($fixtures, $count, $filters);
    }

    /**
     * Get fixture with fixture id.
     *
     * @param int $fixture_id
     * @return json
     */
    public function get_fixture($fixture_id) {
        if(Auth::user()->hasRole('guardian')){
            $this->validate($this->request, [
                'player_id' => 'required|int|min:1'
            ]);

            $programe = Match::select(
                'match.session_id',
                'session.programme_id',
                'rel_programme_team.team_id'
            )
                ->leftJoin('session', 'session.session_id', '=', 'match.session_id')
                ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'session.programme_id')
                ->fist();

            $price_field = 'price';
            $count = gr_get_unique_players_in_programmes($this->user_id, $this->request['player_id'], $programe->team_id);
            if( $count == 1 ) {
                //parent has another children involved in a programme
                $price_field = 'price2';
                $discount = 1;
            } elseif( $count > 1 ) {
                //parent has more at least 2 more children involved in a programme
                $price_field = 'price2plus';
                $discount = 2;
            }

            $fixture = Match::select(
                    'match.fixture_id',
                    'match.type_id',
                    'match.kickoff_time',
                    'match.referee',
                    'match.oposition',
                    'match.match_location',
                    'match.notes',
                    'team.team_id',
                    'team.title AS team',
                    'session.venue_id',
                    'session.session_id',
                    'session.start_time',
                    'session.pitch_size',
                    'session.pitch_no',
                    'session.'.$price_field.' AS price',
                    'session.coach_id',
                    'session.surface',
                    'session.pitch_size',
                    'session.pitch_no',
                    'user.display_name AS coach_name',
                    'address_book.lat',
                    'address_book.lng',
                    'address_book.title AS venue',
                    'address_book.address',
                    'address_book.postcode',
                    'programme.programme_id',
                    'programme.title',
                    'programme.image_path',
                    'programme.image_type',
                    'programme.programme_id',
                    'rel_programme_player.status AS acceptance_status'
                )
                ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
                ->leftJoin('team', 'team.team_id', '=', 'rel_programme_team.team_id')
                ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
                ->leftJoin('rel_programme_player', 'rel_programme_player.programme_id', '=', 'programme.programme_id')
                ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
                ->where('programme.franchise_id', $this->franchise_id)
                ->where('programme.club_id', $this->club_id)
                ->where('match.fixture_id', $fixture_id)
                ->where('rel_programme_player.player_id', $this->request['player_id'])
                ->first();
        } else {
        $fixture = Match::select(
                'match.fixture_id',
                'match.type_id',
                'match.kickoff_time',
                'match.referee',
                'match.oposition',
                'match.match_location',
                'match.notes',
                'team.team_id',
                'team.title AS team',
                'session.venue_id',
                'session.session_id',
                'session.start_time',
                'session.price',
                'session.price2',
                'session.price2plus',
                'session.coach_id',
                'session.surface',
                'session.pitch_size',
                'session.pitch_no',
                'user.display_name AS coach_name',
                'address_book.lat',
                'address_book.lng',
                'address_book.title AS venue',
                'address_book.address',
                'address_book.postcode',
                'address_book.telephone AS contact_telephone',
                'address_book.contact_name',
                'programme.programme_id',
                'programme.title',
                'programme.programme_id',
                'programme.image_path',
                'programme.image_type'
            )
            ->leftJoin('session', 'session.session_id', '=', 'match.session_id')
            ->leftJoin('programme', 'programme.programme_id', '=', 'session.programme_id')
            ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_programme_team.team_id')
            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
            ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
            ->where('programme.franchise_id', $this->franchise_id)
            ->where('programme.club_id', $this->club_id)
            ->where('match.fixture_id', $fixture_id)
            ->first();
        }
        if(!Auth::user()->hasRole('guardian')){
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
                ->where('rel_programme_player.programme_id', $fixture['programme_id'])
                ->where('rel_programme_player.status', '!=', 1)
                ->groupBy('player.player_id')
                ->get()->toArray();
            //get players that accepted the session
            $accepted_players =  Player::select(
                    'player.display_name',
                    'player.player_id',
                    'player.gender',
                    'player.birthday',
                    'rel_player_session.status',
                    'player.medical_conditions',
                    'user.display_name AS guardian_name',
                    'user.telephone AS guardian_telephone'
                )
                ->leftJoin('rel_player_session', 'rel_player_session.player_id', '=', 'player.player_id')
                ->leftJoin('user', 'user.user_id', '=', 'player.living_guardian')
                ->where('rel_player_session.session_id', $fixture['session_id'])
                ->groupBy('player.player_id')
                ->get()->toArray();

            $players = array_merge($accepted_players, $invited_players);
            usort($players, function($a, $b) {
                return $a['status'] - $b['status'];
            });
            $fixture['players'] = $players;
        }
        return response()->json($fixture, 200);
    }

    public function create_fixture() {

        // Check is there any fixture available in same time. base on kickoff_time, start_time, venue, opposition
        // Check check_fixture is passed.
        if(isset($this->request->check_fixture)){
            $session = $this->request->sessions[0];
            if($session && $this->request->check_fixture === 'false'){
                $matchStartTime = Carbon::parse($session['kickoff_time'])->subMinutes(10);
                $matchEndTime = Carbon::parse($session['kickoff_time'])->addMinutes(10);

                $sessionStartTime = Carbon::parse($session['start_time'])->subMinutes(10);
                $sessionEndTime = Carbon::parse($session['start_time'])->addMinutes(10);

                $match =  Match::select([
                    'match.kickoff_time',
                    'match.fixture_id',
                    'match.session_id',
                    'match.oposition',
                    'session.session_id',
                    'session.start_time',
                    'session.venue_id',
                    'session.session_id',
                    'session.session_id',
                ])
                    ->leftJoin('session', 'match.session_id', '=', 'session.session_id')
                    ->where('oposition', $session['opposition'])
                    ->whereBetween('session.start_time', [$sessionStartTime, $sessionEndTime])
                    ->whereBetween('match.kickoff_time', [$matchStartTime, $matchEndTime])
                    ->get();

                if(!$match->isEmpty()){
                    return response()->json(['exists'=> 'true'], 409);
                }
            }
        }
        
        $this->request['type_id'] = gr_get_programme_type_id('Team Match');
        $programme = new ProgrammeController($this->request);
        return $programme->create_programme(true);
    }
}
