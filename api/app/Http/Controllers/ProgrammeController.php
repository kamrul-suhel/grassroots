<?php

namespace App\Http\Controllers;

use App\InvoiceLine;
use App\RelConsentUser;
use App\RelSkillgroupTeam;
use DateTime;
use Illuminate\Http\Request;
use App\RelProgrammePlayer;
use App\RelProgrammeTeam;
use App\RelPlayerSession;
use App\RelCoachSession;
use App\Programme;
use Carbon\Carbon;
use App\Invoice;
use App\Session;
use App\Player;
use App\Match;
use App\Team;
use Auth;
use DB;
use Illuminate\Support\Facades\Storage;

class ProgrammeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth');
        // $this->middleware('role:admin|guardian', ['only' => ['get_programms']]);
        $this->middleware('role:guardian', ['only' => ['accept_reject_programme']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all programms inside a franchise.
     *
     * @return json
     */
    public function get_programms()
    {
        $pagination = create_pagination();
        //for guardians only display programme that their children are invited
        if (Auth::user()->hasRole('guardian')) {
            $children = gr_guardian_get_children($this->user_id);
            $children = $children->pluck('player_id');

            //get players that are in trial
            $trials = Player::select(
                DB::raw('SQL_CALC_FOUND_ROWS player.player_id'),
                DB::raw('CONCAT(programme.programme_id, "1", player.player_id, team.team_id) AS id'),
                'player.display_name AS player_name',
                'player.player_id',
                'session.session_id',
                'rel_player_session.status AS acceptance_status',
                'rel_player_session.is_trial',
                'programme.programme_id',
                'programme.title',
                'programme_type.title AS type',
                'team.title as team_title'
            )
                ->leftJoin('rel_player_session', 'player.player_id', '=', 'rel_player_session.player_id')
                ->leftJoin('session', 'session.session_id', '=', 'rel_player_session.session_id')
                ->leftJoin('programme', 'session.programme_id', '=', 'programme.programme_id')
                ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                ->leftJoin('rel_programme_team', 'programme.programme_id', '=', 'rel_programme_team.programme_id')
                ->leftJoin('team', 'rel_programme_team.team_id', '=', 'team.team_id')
                ->where('rel_player_session.attendance_completed', 0)
                ->where('rel_player_session.is_trial', 1)
                ->whereIn('player.player_id', $children)
                ->where(function ($query) {
                    //allow search by programme title
                    if (isset($this->request['search']) && !empty($this->request['search'])) {
                        $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    //allow filter by player
                    if (isset($this->request['player']) && !empty($this->request['player'])) {
                        $query->where('player.player_id', $this->request['player']);
                    }
                    //allow filter by status
                    if (isset($this->request['status'])) {
                        $query->where('rel_player_session.status', $this->request['status']);
                    }
                    return $query;
                })
                ->orderBy('id')
                ->get()
                ->toArray();

            $programmes = Player::select(
                DB::raw('SQL_CALC_FOUND_ROWS player.player_id'),
                'rel_programme_player.id',
                'player.player_id',
                'player.display_name AS player_name',
                'rel_programme_player.status AS acceptance_status',
                'programme.programme_id',
                'programme.title',
                'programme_type.title AS type',
                'match.fixture_id',
                'team.title as team_title'
            )
                ->leftJoin('rel_programme_player', 'rel_programme_player.player_id', '=', 'player.player_id')
                ->leftJoin('programme', 'programme.programme_id', '=', 'rel_programme_player.programme_id')
                ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                ->leftJoin('session', 'session.programme_id', '=', 'programme.programme_id')
                ->leftJoin('rel_programme_team', 'session.programme_id', '=', 'rel_programme_team.programme_id')
                ->leftJoin('team', 'rel_programme_team.team_id', '=', 'team.team_id')
                ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                ->whereNotNull('programme.programme_id')
                ->whereIn('player.player_id', $children)
                ->where(function ($query) {
                    //allow search by programme title
                    if (isset($this->request['search']) && !empty($this->request['search'])) {
                        $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    //allow filter by player
                    if (isset($this->request['player']) && !empty($this->request['player'])) {
                        $query->where('rel_programme_player.player_id', $this->request['player']);
                    }
                    //allow filter by status
                    if (isset($this->request['status'])) {
                        $query->where('rel_programme_player.status', $this->request['status']);
                    }
                    return $query;
                })
                ->groupBy('rel_programme_player.id')
                ->get();

            //get session price for guardian
            foreach ($programmes as $prog) {
                //get the team_id
                $rel_programme_team = RelProgrammeTeam::where('programme_id', $prog->programme_id)->first();
                $price_field = gr_get_field_price($this->user_id, $prog['player_id'], $rel_programme_team->team_id);
                $total = DB::table('session')
                    ->select(
                        DB::raw('SUM(session.' . $price_field['price_field'] . ') AS total')
                    )
                    ->where('session.programme_id', $prog['programme_id'])
                    ->where('session.start_time', '>=', date('Y-m-d'))
                    ->first();
                // return response()->json($total,403);
                $prog->total = $total->total;
            }
            $programmes = $programmes->toArray();
            //merge trials with programmes
            $programme = array_merge($programmes, $trials);
            $count = count($programme);

        } else {
            //for admins get all programmes
            if (isset($this->request['status'])) {
                if (empty($this->request['status'])) {
                    //all finished programmes
                    $programme = Programme::where('programme.franchise_id', $this->franchise_id)
                        ->where('club_id', $this->club_id)
                        ->select(
                            DB::raw('SQL_CALC_FOUND_ROWS programme.programme_id AS id'),
                            'programme.programme_id',
                            'programme.title',
                            'programme_type.title AS type',
                            'match.fixture_id',
                            DB::raw('(SELECT session.start_time FROM session WHERE session.programme_id = programme.programme_id ORDER BY session.start_time DESC LIMIT 1) AS programme_end')
                        )
                        ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                        ->leftJoin('session', 'session.programme_id', '=', 'programme.programme_id')
                        ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
                        ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                        ->where(function ($query) {
                            //allow search by programme title
                            if (isset($this->request['search']) && !empty($this->request['search'])) {
                                $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                            }
                            //allow filter programme by teams
                            if (isset($this->request['team']) && !empty($this->request['team'])) {
                                $query->where('rel_programme_team.team_id', $this->request['team']);
                            }
                            //allow filter programme by skill groups
                            if (isset($this->request['skill_group']) && !empty($this->request['skill_group'])) {
                                $query->where('rel_programme_team.team_id', $this->request['skill_group']);
                            }

                            //allow filter by type
                            if (isset($this->request['type']) && !empty($this->request['type'])) {
                                $query->where('programme.type_id', $this->request['type']);
                            }
                            //for coaches only their sessions
                            if (Auth::user()->hasRole('coach')) {
                                $query->where('session.coach_id', $this->user_id);
                            }
                            return $query;
                        })
                        ->groupBy('programme.programme_id')
                        ->having('programme_end', '<', date('Y-m-d'))
                        ->limit($pagination['per_page'])
                        ->offset($pagination['offset'])
                        ->get();
                } else {
                    //all current programmes
                    $programme = Programme::where('programme.franchise_id', $this->franchise_id)
                        ->where('club_id', $this->club_id)
                        ->select(
                            DB::raw('SQL_CALC_FOUND_ROWS programme.programme_id AS id'),
                            'programme.programme_id',
                            'programme.title',
                            'programme_type.title AS type',
                            'match.fixture_id',
                            DB::raw('(SELECT session.start_time FROM session WHERE session.programme_id = programme.programme_id ORDER BY session.start_time DESC LIMIT 1) AS programme_end')
                        )
                        ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                        ->leftJoin('session', 'session.programme_id', '=', 'programme.programme_id')
                        ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
                        ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                        ->where(function ($query) {
                            //allow search by programme title
                            if (isset($this->request['search']) && !empty($this->request['search'])) {
                                $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                            }
                            //allow filter programme by teams
                            if (isset($this->request['team']) && !empty($this->request['team'])) {
                                $query->where('rel_programme_team.team_id', $this->request['team']);
                            }
                            //allow filter programme by skill groups
                            if (isset($this->request['skill_group']) && !empty($this->request['skill_group'])) {
                                $query->where('rel_programme_team.team_id', $this->request['skill_group']);
                            }
                            //allow filter by type
                            if (isset($this->request['type']) && !empty($this->request['type'])) {
                                $query->where('programme.type_id', $this->request['type']);
                            }
                            //for coaches only their sessions
                            if (Auth::user()->hasRole('coach')) {
                                $query->where('session.coach_id', $this->user_id);
                            }
                            return $query;
                        })
                        ->groupBy('programme.programme_id')
                        ->having('programme_end', '>=', date('Y-m-d'))
                        ->limit($pagination['per_page'])
                        ->offset($pagination['offset'])
                        ->get();
                }
            } else {
                $programme = Programme::where('programme.franchise_id', $this->franchise_id)
                    ->where('club_id', $this->club_id)
                    ->select(
                        DB::raw('SQL_CALC_FOUND_ROWS programme.programme_id AS id'),
                        'programme.programme_id',
                        'programme.title',
                        'programme_type.title AS type',
                        'match.fixture_id',
                        DB::raw('(SELECT session.start_time FROM session WHERE session.programme_id = programme.programme_id ORDER BY session.start_time DESC LIMIT 1) AS programme_end')
                    )
                    ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                    ->leftJoin('session', 'session.programme_id', '=', 'programme.programme_id')
                    ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                    ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
                    ->where(function ($query) {
                        //allow search by programme title
                        if (isset($this->request['search']) && !empty($this->request['search'])) {
                            $query->where('programme.title', 'like', '%' . $this->request['search'] . '%');
                        }
                        //allow filter programme by teams
                        if (isset($this->request['team']) && !empty($this->request['team'])) {
                            $query->where('rel_programme_team.team_id', $this->request['team']);
                        }
                        //allow filter programme by skill groups
                        if (isset($this->request['skill_group']) && !empty($this->request['skill_group'])) {
                            $query->where('rel_programme_team.team_id', $this->request['skill_group']);
                        }
                        //allow filter by type
                        if (isset($this->request['type']) && !empty($this->request['type'])) {
                            $query->where('programme.type_id', $this->request['type']);
                        }
                        //for coaches only their sessions
                        if (Auth::user()->hasRole('coach')) {
                            $query->where('session.coach_id', $this->user_id);
                        }
                        return $query;
                    })
                    ->groupBy('programme.programme_id')
                    ->limit($pagination['per_page'])
                    ->offset($pagination['offset'])
                    ->get();
            }

            //count the results so we can use them in pagination
            $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
            $count = reset($requestsCount)->count;
        }
        $search = create_filter('search', 'Search');
        if (isset($children)) {
            $players = Player::select('player_id AS key', 'display_name AS value')->whereIn('player_id', $children)->get();
            $filter_players = create_filter('player', 'Player', $players);
        }

        //load the teams into the programme
        if (Auth::user()->hasRole('guardian')) {
            $statuses = (object)[
                '0' => (object)['key' => 0, 'value' => 'Pending'],
                '1' => (object)['key' => 1, 'value' => 'Accepted'],
                '2' => (object)['key' => 2, 'value' => 'Rejected']
            ];
            $filter_status = create_filter('status', 'Status', $statuses);
            $filters = [$search, $filter_players, $filter_status];
        } else {
            if (!empty($programme)) {
                $programme->load('teams');
            }
            $teams = get_teams();
            $filter_team = create_filter('team', 'Team', $teams);
            $skillgroups = gr_get_skillgroups();
            $filter_skillgroup = create_filter('skill_group', 'Skill Group', $skillgroups);
            $statuses = (object)[
                '0' => (object)['key' => 0, 'value' => 'Past'],
                '1' => (object)['key' => 1, 'value' => 'Current']
            ];
            $filter_status = create_filter('status', 'Status', $statuses, 1);
            $programme_type = gr_get_programme_type();
            $filter_type = create_filter('type', 'Type', $programme_type);
            $filters = [$filter_team, $filter_skillgroup, $filter_type, $filter_status, $search];
        }

        return format_response($programme, $count, $filters);

    }

    /**
     * Get a specific programme.
     *
     * @param int $homework_id
     * @return json
     */
    public function get_programme($programme_id)
    {
        $programme = Programme::with('teams')
            ->select(
                'programme.programme_id',
                'programme.programme_id AS id',
                'programme.title',
                'programme.status',
                'programme.pitch_number',
                'programme.pitch_info',
                'programme.payment_note',
                'programme.require_equipment',
                'programme_type.title AS type'
            )
            ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
            ->where('programme.programme_id', $programme_id)
            ->first();

        if (Auth::user()->hasRole('guardian')) {
            $this->validate($this->request, [
                'player_id' => 'required|integer|min:1'
            ]);
            $programme = Programme::select(
                'programme.programme_id AS id',
                'programme.title',
                'programme.status',
                'programme.pitch_number',
                'programme.pitch_info',
                'programme.payment_note',
                'programme.require_equipment',

                'programme_type.title AS type',

                'rel_programme_player.status AS acceptance_status',

                'player.display_name AS player_name',

                'consent.title as consent_title',
                'consent.content as consent_content'
            )
                ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
                ->leftJoin('consent', 'programme.consent_id', '=', 'consent.consent_id')
                ->leftJoin('rel_programme_player', 'rel_programme_player.programme_id', '=', 'programme.programme_id')
                ->leftJoin('player', 'player.player_id', '=', 'rel_programme_player.player_id')
                ->where('programme.programme_id', $programme_id)
                ->where('rel_programme_player.player_id', $this->request['player_id'])
                ->first();
        }
        return response()->json($programme, 200);
    }

    /**
     * Get all the future sessions within a programme
     *
     * @param int $programme_id
     * @return json
     */
    public function get_programme_sessions($programme_id)
    {
        $pagination = create_pagination();
        $price_field = 'price';
        $status = 0;
        $discount = 0;
        $total = 0;

        if (Auth::user()->hasRole('guardian')) {
            //for guardians we need to pass the player id so we can display the correct session prices
            $this->validate($this->request, [
                'player_id' => 'required|int|min:1'
            ]);

            //get the team_id
            $rel_programme_team = RelProgrammeTeam::where('programme_id', $programme_id)->first();
            $count = gr_get_unique_players_in_programmes($this->user_id, $this->request['player_id'], $rel_programme_team->team_id);
            if ($count == 1) {
                //parent has another children involved in a programme
                $price_field = 'price2';
                $discount = 1;
            } elseif ($count > 1) {
                //parent has more at least 2 more children involved in a programme
                $price_field = 'price2plus';
                $discount = 2;
            }
            //we need the status to know what sessions to load
            $prog_player = DB::table('rel_programme_player')
                ->select('status')
                ->where('programme_id', $programme_id)
                ->where('player_id', $this->request['player_id'])
                ->first();
            $status = $prog_player->status;
            //
            // $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
            // $count = reset($requestsCount)->count;
            $total = DB::table('session')
                ->select(
                    DB::raw('COUNT(session.session_id) AS count'),
                    DB::raw('SUM(session.' . $price_field . ') AS total')
                )
                ->where('session.programme_id', $programme_id)
                ->where('session.start_time', '>=', date('Y-m-d'))
                ->first();
            $count = $total->count;
            $total = $total->total;
        }

        // $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        // $count = reset($requestsCount)->count;
        if ($status == 1) {
            //programme is accepted so we load the sessions from the rel player sessions table
            $sessions = DB::table('rel_player_session')
                ->select(
                    DB::raw('SQL_CALC_FOUND_ROWS session.session_id'),
                    'session.start_time',
                    'session.end_time',
                    'session.surface',
                    'rel_player_session.price',
                    'address_book.lat',
                    'address_book.lng',
                    'address_book.title AS venue_title',
                    'address_book.address',
                    'address_book.contact_name',
                    'address_book.telephone AS contact_phone',
                    'user.user_id AS coach_id',
                    'user.display_name AS coach_name',
                    'match.type_id',
                    'match_type.title AS type',
                    'match.kickoff_time',
                    'match.referee',
                    'match.oposition',
                    'match.notes'
                )
                ->leftJoin('session', 'session.session_id', '=', 'rel_player_session.session_id')
                ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
                ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
                ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                ->leftJoin('match_type', 'match_type.id', '=', 'match.type_id')
                ->where('session.programme_id', $programme_id)
                ->where('rel_player_session.player_id', $this->request['player_id'])
                ->where('rel_player_session.is_trial', 0)
                ->where(function ($query) {
                    if (Auth::user()->hasRole('coach')) {
                        $query->where('session.coach_id', $this->user_id);
                    }
                    return $query;
                })
                ->orderBy('session.start_time')
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();
            $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
            $count = reset($requestsCount)->count;
        } else {
            //load the programme sessions
            $sessions = DB::table('session')
                ->select(
                    DB::raw('SQL_CALC_FOUND_ROWS session.session_id'),
                    'session.start_time',
                    'session.end_time',
                    'session.surface',
                    'session.' . $price_field . ' AS price',
                    'address_book.lat',
                    'address_book.lng',
                    'address_book.title AS venue_title',
                    'address_book.address',
                    'address_book.contact_name',
                    'address_book.telephone AS contact_phone',
                    'user.user_id AS coach_id',
                    'user.display_name AS coach_name',
                    'match.type_id',
                    'match_type.title AS type',
                    'match.kickoff_time',
                    'match.referee',
                    'match.oposition',
                    'match.notes'
                )
                ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
                ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
                ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                ->leftJoin('match_type', 'match_type.id', '=', 'match.type_id')
                ->where('session.programme_id', $programme_id)
                ->where(function ($query) {
                    if (Auth::user()->hasRole('guardian')) {
                        $query->where('session.start_time', '>=', date('Y-m-d'));
                    }
                    if (Auth::user()->hasRole('coach')) {
                        $query->where('session.coach_id', $this->user_id);
                    }
                    return $query;
                })
                ->orderBy('session.start_time')
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();
            $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
            $count = reset($requestsCount)->count;
        }

        //for admins we need to select all the sessions prices
        if (Auth::user()->hasRole('admin')) {
            $sessions = DB::table('session')
                ->select(
                    DB::raw('SQL_CALC_FOUND_ROWS session.session_id'),
                    'session.start_time',
                    'session.end_time',
                    'session.price',
                    'session.price2',
                    'session.price2plus',
                    'session.surface',
                    'address_book.lat',
                    'address_book.lng',
                    'address_book.title AS venue_title',
                    'address_book.address',
                    'address_book.contact_name',
                    'address_book.telephone AS contact_phone',
                    'user.user_id AS coach_id',
                    'user.display_name AS coach_name',
                    'match.type_id',
                    'match_type.title AS type',
                    'match.kickoff_time',
                    'match.referee',
                    'match.oposition',
                    'match.notes'
                )
                ->leftJoin('user', 'user.user_id', '=', 'session.coach_id')
                ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
                ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
                ->leftJoin('match_type', 'match_type.id', '=', 'match.type_id')
                ->where('session.programme_id', $programme_id)
                ->orderBy('session.start_time')
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();
            $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
            $count = reset($requestsCount)->count;
        }

        $misc = array('total' => $total, 'discount' => $discount);
        return format_response($sessions, $count, false, $misc);
    }

    /**
     * Create a new programme.
     *
     * @return json
     */
    public function create_programme($fixture = false)
    {
        // if it is programme then check consent_id
        if(!$fixture){
            $this->validate($this->request,[
                'consent_id' => 'required|exists:consent,consent_id'
            ]);
        }

        //validate the request
        $this->validate($this->request, [
            'title' => 'required|max:255',
            'type_id' => 'required|integer|min:1',
            'teams' => 'required|array|min:1',
            'notes' => 'string',
            'sessions' => 'required|array|min:1',
            'sessions.*.start_time' => 'required|date_format:Y-m-d H:i:s|after:today',
            'sessions.*.end_time' => 'date_format:Y-m-d H:i:s',
            'sessions.*.venue_id' => 'required|integer|min:0',
            'sessions.*.status' => 'integer|min:0|max:1',
            'sessions.*.price' => 'required|numeric',
            'sessions.*.price2' => 'numeric',
            'sessions.*.price2plus' => 'numeric',
            'sessions.*.surface' => 'array'
        ]);

        //if the programme type is Team Match we need to validate aditional fields
        $is_match = false;
        if ($this->request['type_id'] === gr_get_programme_type_id('Team Match')) {
            $is_match = true;
            $this->validate($this->request, [
                'sessions.*.match_type' => 'required|exists:match_type,id',
                'sessions.*.kickoff_time' => 'required|date_format:Y-m-d H:i:s|after:today',
                'sessions.*.opposition' => 'required|string|max:255',
                'sessions.*.referee' => 'string|max:255',
                'sessions.*match_location' => 'string|in:home,away,neutral'
            ]);
        }
        $coach = 0;

        // Upload file if exists for programme
        $programmeFilePath = '';
        $programmeFileType = '';
        if (!empty($this->request['programme_file'])) {
            $file = $this->request->file('programme_file');

            $filePath = gr_save_file($file, 'program', $this->request['type_id']);
            $programmeFilePath = $filePath;
            $programmeFileType = $file->getClientOriginalExtension();
        }

        // Upload file if exists for fixture
        if (!empty($this->request['fixture_file'])) {
            $file = $this->request->file('fixture_file');
            $filePath = gr_save_file($file, 'fixture', $this->request['type_id']);
            $programmeFilePath = $filePath;
            $programmeFileType = $file->getClientOriginalExtension();
        }

        // If programme does not require teams I.E. birthday (//TODO this is a reduntant function)
        if (!isset($this->request['teams']) || empty($this->request['teams'])) {
            //we need the player_id
            $this->validate($this->request, [
                'player_id' => 'required|int|min:1',
                'guest_no' => 'required|int|min:1'
            ]);

            $programme = new Programme;
            $programme->franchise_id = $this->franchise_id;
            $programme->club_id = $this->club_id;
            $programme->title = $this->request['title'];
            $programme->type_id = $this->request['type_id'];
            $programme->notes = $this->request['notes'];
            $programme->image_path = $programmeFilePath;
            $programme->image_type = $programmeFileType;

            // Additional info
            $this->request->has('pitch_number') ? $programme->pitch_number = $this->request->pitch_number : null;
            $this->request->has('pitch_info') ? $programme->pitch_info = $this->request->pitch_info : null;
            $this->request->has('status') ? $programme->status = $this->request->status : null;
            $this->request->has('payment_note') ? $programme->payment_note = $this->request->payment_note : null;
            $this->request->has('require_equipment') ? $programme->require_equipment = $this->request->require_equipment : null;
            $this->request->has('terms') ? $programme->terms_conditions = $this->request->terms : null;

            // If programme then we need consent_id
            if(!$fixture){
                $programme->consent_id = $this->request->consent;
            }
            $programme->save();

            //create the sessions
            foreach ($this->request['sessions'] as $sess) {
                //create the session
                $session = new Session();
                $session->programme_id = $programme->programme_id;
                $session->start_time = $sess['start_time'];
                $session->end_time = isset($sess['end_time']) ? $sess['end_time'] : NULL;
                $session->venue_id = $sess['venue_id'];
                $session->price = $sess['price'];
                $session->price2 = isset($sess['price2']) ? $sess['price2'] : $sess['price'];
                $session->price2plus = isset($sess['price2plus']) ? $sess['price2plus'] : $sess['price'];
                $session->surface = isset($sess['surface']) ? implode(',', $sess['surface']) : NULL;
                $session->guest_no = $this->request['guest_no'];
                $session->created_by = $this->user_id;
                $session->updated_by = $this->user_id;
                //set status active by default
                $session->status = isset($sess['status']) ? $sess['status'] : 1;
                $session->save();
            }

            $existing_rel = RelProgrammePlayer::where('programme_id', $programme->programme_id)
                ->where('player_id', $this->reques['player_id'])
                ->first();

            if (empty($existing_rel)) {
                $rel_programme_player = new RelProgrammePlayer;
                $rel_programme_player->programme_id = $programme->programme_id;
                $rel_programme_player->player_id = $this->reques['player_id'];
                $rel_programme_player->status = 0; //default we set to pending
                $rel_programme_player->save();
            }
            return response()->json($programme);
        }

        //create the programme to each of the teams
        foreach ($this->request['teams'] as $team) {
            $programme = new Programme();
            $programme->franchise_id = $this->franchise_id;
            $programme->club_id = $this->club_id;
            $programme->title = $this->request['title'];
            $programme->type_id = $this->request['type_id'];
            $programme->notes = $this->request['notes'];
            $programme->image_path = $programmeFilePath;
            $programme->image_type = $programmeFileType;
            // If create programme then we need consent id
            $this->request->has('consent_id') ? $programme->consent_id = $this->request->consent_id : NULL;

            // Additional info
            $this->request->has('pitch_number') ? $programme->pitch_number = $this->request->pitch_number : null;
            $this->request->has('pitch_info') ? $programme->pitch_info = $this->request->pitch_info : null;
            $this->request->has('status') ? $programme->status = $this->request->status : null;
            $this->request->has('payment_note') ? $programme->payment_note = $this->request->payment_note : null;
            $this->request->has('require_equipment') ? $programme->require_equipment = $this->request->require_equipment : null;
            $this->request->has('terms') ? $programme->terms_conditions = $this->request->terms : null;
            $programme->save();

            $programme_team = new RelProgrammeTeam();
            $programme_team->programme_id = $programme->programme_id;
            $programme_team->team_id = $team['id'];
            $programme_team->save();

            //create the sessions
            foreach ($this->request['sessions'] as $sess) {
                //create the session
                $session = new Session();
                $session->programme_id = $programme->programme_id;
                $session->start_time = $sess['start_time'];
                $session->end_time = isset($sess['end_time']) ? $sess['end_time'] : NULL;
                $session->venue_id = $sess['venue_id'];
                $session->price = $sess['price'];
                $session->price2 = isset($sess['price2']) ? $sess['price2'] : $sess['price'];
                $session->price2plus = isset($sess['price2plus']) ? $sess['price2plus'] : $sess['price'];
                $session->surface = isset($sess['surface']) ? implode(',', $sess['surface']) : NULL;
                $session->coach_id = isset($team['coach_id']) ? $team['coach_id'] : NULL;
                $session->created_by = $this->user_id;
                $session->updated_by = $this->user_id;
                //set status active by default
                $session->status = isset($sess['status']) ? $sess['status'] : 1;
                $session->save();

                //create the relation between coach and session
                if (isset($team['coach_id']) && !empty($team['coach_id'])) {
                    $rel_coach_session = new RelCoachSession();
                    $rel_coach_session->coach_id = $session->coach_id;
                    $rel_coach_session->session_id = $session->session_id;
                    $rate = isset($team['coach_rate']) ? $team['coach_rate'] : 'rate';
                    $coach_rate = gr_get_coach_rate($team['coach_id'], $rate);
                    $rel_coach_session->price = $coach_rate;
                    $rel_coach_session->created_by = $this->user_id;
                    $rel_coach_session->updated_by = $this->user_id;
                    $rel_coach_session->save();

                    //create the invoice line for the coach
                    $team_details = Team::find($team['id']);
                    $invoice = new Invoice;
                    $invoice->franchise_id = $this->franchise_id;
                    $invoice->club_id = $this->club_id;
                    $invoice->user_id = $team['coach_id'];
                    $invoice->programme_id = $programme->programme_id;
                    $invoice->session_id = $session->session_id;
                    $invoice->type = 'coach';
                    $invoice->register_type = 'fee';
                    $invoice->status = 0;
                    $invoice->team_id = $team['id'];
                    $invoice->date = $sess['start_time'];
                    $invoice->amount = $coach_rate;
                    $invoice->vat_rate = get_club_vat($this->club_id);
                    $invoice->description = $programme->title . " with " . $team_details->title;
                    $invoice->created_by = $this->user_id;
                    $invoice->updated_by = $this->user_id;
                    $invoice->save();
                }

                //if the programme is of type Team Match then we need to store the extra info
                if (!empty($is_match)) {
                    $match_details = new Match;
                    $match_details->session_id = $session->session_id;
                    $match_details->type_id = $sess['match_type'];
                    $match_details->kickoff_time = $sess['kickoff_time'];
                    $match_details->oposition = $sess['opposition'];
                    $this->request->has('opposition_contact_number') ? $match_details->opposition_contact_number = $this->request->opposition_contact_number : null;
                    $match_details->referee = $sess['referee'];
                    $this->request->has('referee_contact_number') ? $match_details->referee_contact_number = $this->request->referee_contact_number : null;
                    $match_details->notes = isset($sess['notes']) ? $sess['notes'] : NULL;
                    $match_details->match_location = isset($sess['match_location']) ? $sess['match_location'] : NULL;
                    $match_details->save();
                    $coach = $session->coach_id;
                }
            }

            $type = gr_get_programme_type_title($programme->type_id);
            $coach_id = isset($team['coach_id']) ? $team['coach_id'] : $coach;
            //create notifications for coach
            if (!empty($coach_id)) {
                switch ($type) {
                    case 'academy':
                        NotificationController::create('programme', $team['id'], $programme->programme_id, $coach_id, NULL);
                        break;
                    case 'event':
                        NotificationController::create('event', $team['id'], $session->session_id, $coach_id, NULL);
                        break;
                    case 'fc':
                        if (!empty($is_match)) {
                            NotificationController::create('fixture', $team['id'], $match_details->fixture_id, $coach_id, NULL);
                        } else {
                            NotificationController::create('programme', $team['id'], $programme->programme_id, $coach_id, NULL);
                        }
                        break;
                    default:
                        break;
                }
            }

            //get all players and assigned to $team_id
            $players = DB::table('rel_player_team')
                ->select('player_id')
                ->where('team_id', $team['id'])
                ->where('status', 'assigned')
                ->get();

            //assign programme to each player assigned to team_id
            foreach ($players as $player) {
                $existing_rel = RelProgrammePlayer::where('programme_id', $programme->programme_id)
                    ->where('player_id', $player->player_id)
                    ->first();

                if (empty($existing_rel)) {
                    $rel_programme_player = new RelProgrammePlayer();
                    $rel_programme_player->programme_id = $programme->programme_id;
                    $rel_programme_player->player_id = $player->player_id;
                    $rel_programme_player->status = 0; //default we set to pending
                    $rel_programme_player->save();
                }

                //create the notifications for guardians
                $guardian_id = get_guardian_id($player->player_id);
                switch ($type) {
                    case 'academy':
                        NotificationController::create('programme', $team['id'], $programme->programme_id, $guardian_id, $player->player_id);
                        break;
                    case 'event':
                        NotificationController::create('event', $team['id'], $session->session_id, $guardian_id, $player->player_id);
                        break;
                    case 'fc':
                        if (!empty($is_match)) {
                            NotificationController::create('fixture', $team['id'], $match_details->fixture_id, $guardian_id, $player->player_id);
                        } else {
                            NotificationController::create('programme', $team['id'], $programme->programme_id, $guardian_id, $player->player_id);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        AuditLogController::create('create-programme', $programme->programme_id, $this->user_id);
        return response()->json($programme, 200);
    }

    /**
     * Guardian accepts or reject a session for a player
     *
     * @param int $user_id , $session_id
     * @return json
     */
    public function accept_reject_programme($programme_id)
    {
        //validate the request
        $this->validate($this->request, [
            'player_id' => 'required|integer|min:1',
            'status' => 'required|in:accept,reject'
        ]);

        $programme = Programme::find($programme_id);

        //$status => 0 (pending) ; 1 (accepted); 2 (rejected)
        $status = $this->request['status'] === 'accept' ? 1 : 2;

        //get the team_id
        $rel_programme_team = RelProgrammeTeam::where('programme_id', $programme_id)
            ->first();

        $count = gr_get_unique_players_in_programmes($this->user_id, $this->request['player_id'], $rel_programme_team->team_id);
        $team = Team::findOrFail($rel_programme_team->team_id);

        $price = '';
        if ($count == 1) {
            //parent has another children involved in a programme
            $price = 'price2';
        } elseif ($count > 1) {
            //parent has more at least 2 more children involved in a programme
            $price = 'price2plus';
        } else {
            //parent has no other child involved in a programme
            $price = 'price';
        }

        //get the sessions in the programme
        $sessions = Session::where('programme_id', $programme_id)
            ->where('start_time', '>=', date('Y-m-d'))
            ->get();

        $totalPrice = $sessions->sum($price);

        //update the status
        $relProgrammePlayer = RelProgrammePlayer::where('player_id', $this->request['player_id'])
            ->where('programme_id', $programme_id)
            ->first();

        $relProgrammePlayer->status = $status;

        // If status = accept, then set the consent_agreed_at time
        if($status === 1){
            $relProgrammePlayer->consent_agreed_at = Carbon::now();
        }
        $relProgrammePlayer->save();

        //create rel between the session and player only if parent accepts the programme
        if ($this->request['status'] === 'accept') {
            // Make a invoice
            $player = Player::find($this->request['player_id']);
            $invoice = new Invoice;
            $invoice->franchise_id = $this->franchise_id;
            $invoice->club_id = $this->club_id;
            $invoice->user_id = $this->user_id;
            $invoice->programme_id = $programme_id;
            $invoice->type = 'parent';
            $invoice->status = 0; // Not paid only create a invoice
            $invoice->player_id = $this->request['player_id'];
            $invoice->team_id = $rel_programme_team->team_id;
            $invoice->date = date('Y-m-d H:i:s');
            $invoice->amount = $totalPrice;
            $invoice->vat_rate = get_club_vat($this->club_id);
            $invoice->description = $programme->title . " for " . $player->display_name . " " . $team->title;
            $invoice->created_by = $this->user_id;
            $invoice->updated_by = $this->user_id;
            $invoice->save();

            // create invoice line
            foreach ($sessions as $session) {
                //set the session price based on the number of children
                // Create Invoice line
                $startTime = new DateTime($session->start_time);
                $endTime = new DateTime($session->start_time);
                $title = date_format($startTime, 'D, jS M Y') . ' ' . date_format($startTime, 'H:i') . ' - ' . date_format($endTime, 'H:i');
                $sessionPrice = $session->{$price};

                $invoiceLine = new InvoiceLine();
                $invoiceLine->invoice_id = $invoice->id;
                $invoiceLine->amount = $sessionPrice;
                $invoiceLine->title = $title;
                $invoiceLine->save();

                $rel_player_session = new RelPlayerSession;
                $rel_player_session->player_id = $this->request['player_id'];
                $rel_player_session->session_id = $session->session_id;
                $rel_player_session->status = 1; //accepted
                $rel_player_session->created_by = $this->user_id;
                $rel_player_session->updated_by = $this->user_id;
                $rel_player_session->attendance_completed = 0;
                $rel_player_session->is_trial = 0;
                $rel_player_session->is_attended = 0;
                $rel_player_session->price = $sessionPrice;
                $rel_player_session->save();
            }
        }

        return response()->json('Programme ' . $this->request['status'] . 'ed', 200);
    }

    /**
     * @param $id
     * @return mixed
     */
    public function downloadImage($id)
    {
        $programme = Programme::findOrFail($id);

        $filePath = str_replace(env('APP_URL') . '/', '', $programme->image_path);

        if (file_exists($filePath)) {
            return response()->download($filePath);
        } else {
            return response()->json('file not exists');
        }
    }
}
