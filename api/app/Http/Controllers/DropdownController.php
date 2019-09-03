<?php

namespace App\Http\Controllers;

use App\Assessment;
use App\Consent;
use App\Player;
use App\RelPlayerTeam;
use App\User;
use Illuminate\Http\Request;
use App\RelProgrammeTeam;
use App\Programme;
use App\KittItem;
use App\Session;
use App\Team;
use App\Club;
use Auth;
use DB;

class DropdownController extends Controller
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
        $this->middleware('role:admin|coach|groupadmin', ['only' => ['get_teams']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Get companies names for a club
     * @return json
     */
    public function get_club_companies()
    {
        $club = Club::find($this->club_id);

        switch ($club->type) {
            case 'both':
                $response = array(
                    array(
                        'id' => 'fc',
                        'title' => $club->fc_company
                    ),
                    array(
                        'id' => 'academy',
                        'title' => $club->ss_company
                    )
                );
                break;
            case 'academy':
                $response = array(
                    array(
                        'id' => 'academy',
                        'title' => $club->ss_company
                    )
                );
                break;
            case 'fc':
                $response = array(
                    array(
                        'id' => 'academy',
                        'title' => $club->ss_company
                    )
                );
                break;
            default:
                break;
        }

        return response()->json($response);
    }

    /**
     * Get all agegroups from club.
     * @param string $type
     * @return json
     */
    public function get_age_groups()
    {
        $age_groups = DB::table('agegroup')
            ->select('agegroup.agegroup_id AS id', 'agegroup.title AS title')
            ->leftJoin('rel_agegroup_club', 'rel_agegroup_club.agegroup_id', '=', 'agegroup.agegroup_id')
            ->where('rel_agegroup_club.club_id', $this->club_id)
            ->orderBy('agegroup.max_age')
            ->get();
        return response()->json($age_groups, 200);
    }

    /**
     * Get all teams from a franchise.
     * @param string $type
     * @return json
     */
    public function get_teams($type)
    {
        $request = $this->request;

        $teams = DB::table('team')
            ->select(
                DB::raw("(select COUNT('rel_player_team.id') from rel_player_team where rel_player_team.team_id = team.team_id) as total"),
                'team.team_id AS id',
                'team.title AS title',
                'team.max_size',
                'team.gender',
                'team.agegroup_id',
                'rel_coach_team.coach_id', 'team.type AS team_type',
                'user.display_name AS coach_name',
                'agegroup.title AS agegroup_title',
                'agegroup.max_age AS max_age'
            )
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_coach_team.coach_id')
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->where('team.franchise_id', $this->franchise_id)
            ->where('team.club_id', $this->club_id)
            ->where(function ($query) use ($type, $request) {
                //allow to search by team name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('team.title', 'like', '%' . $this->request['name'] . '%');
                }
                //for coaches return only this coach teams
                if (Auth::user()->hasRole('coach')) {
                    $query->where('user.user_id', $this->user_id);
                }
                //filter by team type
                if ($type != 'all') {
                    $query->where('team.type', $type);
                }

                return $query;
            });

        // Check if filter by max_age of skill group component in player folder
        if (
            $this->request->has('max_age') &&
            $this->request->max_age !== 'all'
        ) {
            $teams = $teams->where('agegroup.max_age', $this->request->max_age);
        }

        if($this->request->has('age_group')){
            $teams = $teams->where('agegroup.max_age','<', $this->request->age_group);
        }

        $teams = $teams->groupBy('team.team_id')
            ->orderBy('agegroup.max_age')
            ->get();
        return response()->json($teams, 200);
    }

    /**
     * Get all programme types from a franchise.
     *
     * @return json
     */
    public function get_programme_type($type)
    {
        //    dd($type);
        $programme_type = DB::table('programme_type')
            ->select('type_id AS id', 'title AS title')
            ->where(function ($query) use ($type) {
                //allow to search by programme type name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('title', 'like', '%' . $this->request['name'] . '%');
                }
                switch ($type) {
                    case 'academy':
                        $query->where('type', 'academy');
                        break;
                    case 'fc':
                        $query->where('type', 'fc');
                        break;
                    case 'event':
                        $query->where('type', 'event');
                        break;
                    default:
                        break;
                }
                return $query;
            })
            ->where(function ($query) {
                $query->where('franchise_id', $this->franchise_id)
                    ->orWhere('franchise_id', 0);
                return $query;
            })
            ->get();
        return response()->json($programme_type, 200);
    }

    /**
     * Get all address types from a franchise.
     *
     * @return json
     */
    public function get_address_type()
    {
        $address_type = DB::table('address_type')
            ->select('type_id AS id', 'title AS title')
            ->where(function ($query) {
                //allow to search by programme type name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->where(function ($query) {
                $query->where('franchise_id', $this->franchise_id)
                    ->orWhere('franchise_id', 0);
                return $query;
            })
            ->orderBy('title')
            ->get();
        return response()->json($address_type, 200);
    }

    /**
     * Get all qualifications from a franchise.
     *
     * @return json
     */
    public function get_qualifications()
    {
        $qualifications = DB::table('qualification')
            ->select('qualification_id AS id', 'title AS title')
            ->where('franchise_id', 0)
            ->where('club_id', 0)
            ->where(function ($query) {
                //allow to search by qualification name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->get();
        return response()->json($qualifications, 200);
    }

    /**
     * Get all kitt items from a franchise
     *
     * @return json
     */
    public function get_kit_items()
    {
        $kit_items = KittItem::select
        ([
            'kit_item.kit_id AS id',
            'kit_item.type_id',
            'kit_item.image_url',
            DB::raw("concat(kit_item.title, ' - ', kit_type.title) as title")
        ])
            ->leftJoin('kit_type', 'kit_item.type_id', '=', 'kit_type.type_id')
            ->where('kit_item.franchise_id', $this->franchise_id)
            ->where('kit_item.club_id', $this->club_id)
            ->get();

        foreach ($kit_items as $item) {
            $size = DB::table('rel_kititem_size')
                ->select('size AS id', 'size AS title')
                ->where('kit_id', $item['id'])
                ->get();

            $item['sizes'] = $size;
        }
        return response()->json($kit_items, 200);
    }


    /**
     * Get all kitt types from a franchise.
     *
     * @return json
     */
    public function get_kit_type()
    {
        $kit_type = DB::table('kit_type')
            ->select('type_id AS id', 'title AS title')
            ->where(function ($query) {
                //allow to search by programme type name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('title', 'like', '%' . $this->request['name'] . '%');
                }
                $query->where('franchise_id', $this->franchise_id)
                    ->orWhere('franchise_id', 0);
                return $query;
            })
            ->get();
        return response()->json($kit_type, 200);
    }

    /**
     * Get all programme from a franchise.
     *
     * @return json
     */
    public function get_programme()
    {
        $programme = DB::table('programme')
            ->select('programme_id AS id', 'title AS title')
            ->where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->where(function ($query) {
                //allow to seach by programme name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->get();
        return response()->json($programme, 200);
    }

    /**
     * Get all venues from a franchise.
     *
     * @return json
     */
    public function get_venues()
    {
        $type_id = get_address_type_id('Venue');
        $venues = DB::table('address_book')
            ->select(
                'address_book.address_id AS id',
                'address_book.title AS title',
                'address_book.note'
            )
            ->where('address_book.type_id', $type_id)
            ->where('address_book.status', 1)
            ->where(function ($query) {
                $query->where('address_book.franchise_id', $this->franchise_id)
                    ->orWhere('address_book.franchise_id', 0);
                return $query;
            })
            ->orderBy('address_book.title')
            ->get();
        return response()->json($venues, 200);
    }


    /**
     * Get all coaches from a franchise.
     *
     * @return json
     */
    public function get_coaches()
    {
        $venues = DB::table('user')
            ->select('user_id AS id', 'display_name AS title')
            ->where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->where('user_role', gr_get_role_id('coach'))
            ->where(function ($query) {
                //allow to search by venue name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('display_name', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->get();
        return response()->json($venues, 200);
    }

    /**
     * Get all schools from a franchise.
     *
     * @return json
     */
    public function get_schools()
    {
        $type_id = get_address_type_id('School');
        $schools = DB::table('address_book')
            ->select('address_book.address_id AS id', 'address_book.title AS title')
            ->where('address_book.type_id', $type_id)
            ->where('address_book.status', 1)
            ->where(function ($query) {
                $query->where('address_book.franchise_id', $this->franchise_id)
                    ->orWhere('address_book.franchise_id', 0);
                return $query;
            })
            ->orderBy('address_book.title')
            ->get();
        return response()->json($schools, 200);
    }

    /**
     * Get all the players from a franchise.
     *
     * @return json
     */
    public function get_players()
    {
        $players = DB::table('player')
            ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_player_team.team_id')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('rel_player_guardian', 'rel_player_guardian.player_id', '=', 'player.player_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_player_guardian.guardian_id')
            ->select('player.player_id AS id', 'player.display_name AS title')
            ->where(function ($query) {
                //allow to search by team name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('player.first_name', 'like', '%' . $this->request['name'] . '%')
                        ->orWhere('player.last_name', 'like', '%' . $this->request['name'] . '%');
                }

                //for coaches only return players assigned to his teams
                if (Auth::user()->hasRole('coach')) {
                    $query->where('rel_coach_team.coach_id', $this->user_id);
                }
                return $query;
            })
            ->groupBy('player.player_id')
            ->orderBy('player.display_name')
            ->get();
        return response()->json($players, 200);
    }

    /**
     * Get player statuses
     *
     * @return json
     */
    public function get_players_status()
    {
        $player_status = array(
            array(
                'id' => 1,
                'title' => 'Active'
            ),
            array(
                'id' => 0,
                'title' => 'Inactive'
            ),
            array(
                'id' => 2,
                'title' => 'Injured'
            )
        );
        return response()->json($player_status, 200);
    }

    /**
     * Get team ranks
     *
     * @return json
     */
    public function get_team_rank()
    {
        $team_ranks = array(
            array(
                'id' => 1,
                'title' => 'Mixed'
            ),
            array(
                'id' => 2,
                'title' => 'Beginners'
            ),
            array(
                'id' => 3,
                'title' => 'Intermediate'
            ),
            array(
                'id' => 4,
                'title' => 'Advanced'
            ),
            array(
                'id' => 5,
                'title' => 'Elite'
            )

        );
        return response()->json($team_ranks, 200);
    }

    /**
     * Get all guardians from a franchise
     *
     * @return json
     */
    public function get_guardians()
    {
        $guardians = DB::table('user')
            ->select('user.user_id AS id', 'user.display_name AS title')
            ->where('user.franchise_id', $this->franchise_id)
            ->where('user.club_id', $this->club_id)
            ->where('user.user_role', gr_get_role_id('guardian'))
            ->orderBy('user.display_name')
            ->get();
        return response()->json($guardians, 200);
    }

    public function get_users()
    {
        $this->validate($this->request, [
            'roles' => 'required|string'
        ]);
        $roles = explode(',', $this->request['roles']);
        foreach ($roles as $role) {
            $roles_ids[] = gr_get_role_id($role);
        }
        $users = DB::table('user')
            ->select('user.user_id AS id', 'user.display_name AS title', 'role.title AS role')
            ->leftJoin('role', 'role.role_id', '=', 'user.user_role')
            ->where('user.franchise_id', $this->franchise_id)
            ->where('user.club_id', $this->club_id)
            ->whereIn('user.user_role', $roles_ids)
            ->orderBy('user.display_name')
            ->get();
        return response()->json($users, 200);
    }

    /**
     * Get all skills from a franchise
     *
     * @return json
     */
    public function get_skills()
    {
        $skills = DB::table('skill')
            ->select('skill.skill_id AS id', 'skill.title AS title')
            ->where('skill.franchise_id', $this->franchise_id)
            ->where('skill.club_id', $this->club_id)
            ->orderBy('skill.title')
            ->get();
        return response()->json($skills, 200);
    }

    /**
     * Get all skills categories from a franchise
     *
     * @return json
     */
    public function get_skills_category()
    {
        $skills_category = DB::table('skill_category')
            ->select('skill_category.category_id AS id', 'skill_category.title AS title')
            ->where(function ($query) {
                $query->where('skill_category.franchise_id', $this->franchise_id)
                    ->orWhere('skill_category.franchise_id', 0);
                return $query;
            })
            ->orderBy('skill_category.title')
            ->get();
        return response()->json($skills_category, 200);
    }

    /**
     * Get all players from a team with status
     *
     * @return json
     */
    public function get_team_players()
    {
        $this->validate($this->request, [
            'team_id' => 'required|integer|min:1'
        ]);
        $team = Team::find($this->request['team_id']);
        if ($team->type === 'team') {
            //get the skill groups assigned to this team
//            $skill_groups = DB::table('rel_skillgroup_team')
//                ->select('skillgroup_id')
//                ->where('team_id', $this->request['team_id'])
//                ->pluck('skillgroup_id');

            $players = DB::table('rel_player_team')
                ->select(
                    'rel_player_team.player_id AS id',
                    'player.display_name AS title',
                    'team.title AS team_name'
                )
                ->leftJoin('player', 'player.player_id', '=', 'rel_player_team.player_id')
                ->leftJoin('team', 'team.team_id', '=', 'rel_player_team.team_id')
//                ->where('rel_player_team.team_id', $this->request->team_id)
                ->where('rel_player_team.status', 'assigned')
                ->where('team.club_id', $this->club_id)
                ->groupBy('player.player_id')
                ->get();
            return response()->json($players, 200);
        }
        $statuses = array('assigned', 'waiting', 'trialist', 'trial');
        foreach ($statuses as $status) {
            //for triallist we need to add the trial session date
            if ($status === 'trialist') {
                $filterStatus = ['trialist', 'pending_parent_approval'];
            } else {
                $filterStatus = [$status];
            }

            if ($status === 'trialist') {
                $players[$status] = DB::table('player')
                    ->select(
                        'player.player_id AS id',
                        'player.display_name AS title',
                        'rel_player_team.trial_rating',
                        'rel_player_team.status',
                        'rel_player_team.date',
                        'rel_player_team.id as rel_player_team_id',
                        'session.start_time AS trial_date',
                        'session.session_id',
                        'rel_player_session.status as session_status',
                        'rel_player_session.id as rel_session_id'
                    )
                    ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
                    ->leftJoin('rel_player_session', 'rel_player_session.id', '=', 'rel_player_team.player_session_id')
                    ->leftJoin('session', 'session.session_id', '=', 'rel_player_session.session_id')
                    ->whereIn('rel_player_team.status', $filterStatus)
                    ->where('rel_player_team.team_id', $this->request['team_id'])
                    ->whereIn('rel_player_session.status', [0, 1])// Only pending and accept will show
                    ->get();

            } else {
                $players[$status] = DB::table('player')
                    ->select(
                        'player.player_id AS id',
                        'player.display_name AS title',
                        'rel_player_team.trial_rating',
                        'rel_player_team.status',
                        'rel_player_team.date',
                        'rel_player_team.id as rel_player_team_id',
                        'rel_player_session.status as session_status',
                        'rel_player_session.id as rel_session_id'
                    )
                    ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
                    ->leftJoin('rel_player_session', 'rel_player_session.player_id', '=', 'player.player_id')
                    ->whereIn('rel_player_team.status', $filterStatus)
                    ->where('rel_player_team.team_id', $this->request['team_id'])
                    ->groupBy('player.player_id')
                    ->get();
            }
        }
        return $players;
    }

    /**
     * Get all availability types
     *
     * @return json
     */
    public function get_availability_types()
    {
        $availability_types = DB::table('availability_type')
            ->select('type_id AS id', 'title AS title')
            ->get();
        return response()->json($availability_types, 200);
    }

    /**
     * Get all future trial session for a team or skill group
     *
     * @return json
     */
    public function get_trial_sessions_old()
    {
        $this->validate($this->request, [
            'team_id' => 'required|integer|min:1'
        ]);
        $team = Team::find($this->request['team_id']);
        $sessions = DB::table('session')
            ->select(
                'session.session_id AS id',
                'session.start_time AS title'
            )
            ->leftJoin('programme', 'programme.programme_id', '=', 'session.programme_id')
            ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
            ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
            ->where('rel_programme_team.team_id', $this->request['team_id'])
            ->where('session.start_time', '>=', date('Y-m-d'))
            ->where(function ($query) use ($team) {
                if ($team->type === 'skill-group') {
                    $query->where('programme_type.type', 'academy');
                    $query->where('programme_type.title', 'Soccer School');
                } else {
                    $query->where('programme_type.type', 'fc');
                    $query->where('programme_type.title', 'Team Training');
                }
            })
            ->groupBy('session.session_id')
            ->get();
        return response()->json($sessions, 200);
    }

    /**
     * Get all future trial session for a team or skill group
     *
     * @return json
     */
    public function get_trial_sessions()
    {
        $this->validate($this->request, [
            'team_id' => 'required|integer|min:1'
        ]);

        $team = Team::find($this->request['team_id']);

        $programmes = Programme::select([
            'programme.programme_id',
            'programme.programme_id as id',
            'programme.title',
            'programme_type.title as type_title'
        ])
            ->with('existingSessions')
            ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
            ->leftJoin('rel_programme_team', 'rel_programme_team.programme_id', '=', 'programme.programme_id')
            ->where('rel_programme_team.team_id', $this->request['team_id'])
            ->where(function ($query) use ($team) {
                if ($team->type === 'skill-group') {
                    $query->where('programme_type.type', 'academy');
                    $query->where('programme_type.title', 'Soccer School');
                } else {
                    $query->where('programme_type.type', 'fc');
                    $query->where('programme_type.title', 'Team Training');
                }
            })->get();

        return response()->json($programmes, 200);
    }

    /**
     * Get all the players from the assigned skill group of a team
     *
     * @return json
     */
    public function get_skill_group_players($team_id)
    {
        //get the skill groups assigned to this team
        $skill_groups = DB::table('rel_skillgroup_team')
            ->select('skillgroup_id')
            ->where('team_id', $team_id)
            ->pluck('skillgroup_id');
        // dd($skill_groups);
        $players = DB::table('rel_player_team')
            ->select(
                'rel_player_team.player_id AS id',
                'player.display_name AS title',
                'team.title AS team_name'
            )
            ->leftJoin('player', 'player.player_id', '=', 'rel_player_team.player_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_player_team.team_id')
            ->whereIn('rel_player_team.team_id', $skill_groups)
            ->where('rel_player_team.status', 'assigned')
            ->get();
        return response()->json($players, 200);
    }

    /**
     * Get the coach assessments templates
     *
     * @return json
     */
    public function get_assessment_templates()
    {
        $assessments = Assessment::select('assessment_id AS id', 'title AS title')
            ->where('club_id', $this->club_id)
            ->orderBy('title')
            ->get();
        return response()->json($assessments, 200);
    }

    /**
     * Get the existing user roles
     *
     * @return json
     */
    public function get_roles()
    {
        $user = Auth::user();
        if ($user->hasRole('groupadmin')) {
            $roles = DB::table('role')
                ->select('role_id AS id', 'title')
                ->whereIn('title', ['admin', 'coach', 'guardian'])
                ->get();
            return response()->json($roles);
        }
        return false;
    }

    /**
     * Get the existing match types
     *
     * @return json
     */
    public function get_match_types($data = NULL)
    {
        $types = DB::table('match_type')
            ->select('id', 'title', 'id as key', 'title as value')
            ->where('status', 1)
            ->orderBy('title', 'ASC')
            ->get();
        if (isset($data) && !empty($data)) {
            return $types;
        }
        return response()->json($types);
    }

    public function getProgrammeAndPlayerByParentId($parentId)
    {

        $user = User::findOrFail($parentId);

        // Get all Players for this parent
        $players = Player::select([
            'player.player_id as id',
            'player.display_name as title'
        ])->where('billing_guardian', $user->user_id)
            ->get();

        // Get all programme which related with programme
        $playersIds = $players->pluck('id');
        $programmes = Programme::select([
            'programme.programme_id as id',
            'programme.title as title'
        ])
            ->leftJoin('rel_programme_player', 'programme.programme_id', '=', 'rel_programme_player.programme_id')
            ->whereIn('rel_programme_player.player_id', $playersIds)
            ->get();

        $result = [
            'players' => $players,
            'programmes' => $programmes
        ];

        return response()->json($result);
    }


    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getConsent()
    {
        $consents = Consent::select('consent_id as id', 'title')
            ->where('club_id', $this->club_id)
            ->get();

        return response()->json($consents);
    }
}
