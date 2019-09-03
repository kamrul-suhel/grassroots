<?php

namespace App\Http\Controllers;

use App\KitUser;
use App\RelKitTeam;
use App\RelProgrammeTeam;
use Illuminate\Http\Request;
use App\SkillAssessmentNote;
use App\RelProgrammePlayer;
use App\RelPlayerGuardian;
use App\RelPlayerSession;
use App\RelPlayerTeam;
use App\ProgrammeType;
use App\RelKitUser;
use App\SkillGrade;
use App\Programme;
use App\KittItem;
use App\KittType;
use App\Feedback;
use App\Session;
use App\Player;
use App\User;
use App\Team;
use App\Skill;
use Auth;
use DB;


class PlayerController extends Controller
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
        $this->middleware('role:admin|guardian', ['only' => ['create_player', 'update_player']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all players
     *
     * @return json
     */
    public function get_players()
    {
        $totalPlayers = Player::select(
            DB::raw('SQL_CALC_FOUND_ROWS player.player_id'),
            DB::raw('(SELECT COUNT(*) FROM rel_player_guardian WHERE rel_player_guardian.guardian_id = player.living_guardian AND rel_player_guardian.player_id != player.player_id) AS siblings'),
            DB::raw('(SELECT COUNT(*) FROM rel_player_session LEFT JOIN session ON session.session_id = rel_player_session.session_id WHERE rel_player_session.player_id = player.player_id AND session.start_time <= CURDATE()) AS total_sessions'),
            DB::raw('(SELECT COUNT(*) FROM rel_player_session LEFT JOIN session ON session.session_id = rel_player_session.session_id WHERE rel_player_session.player_id = player.player_id AND rel_player_session.is_attended = 1 AND session.start_time <= CURDATE()) AS attended_sessions'),
            'player.first_name',
            'player.last_name',
            'player.middle_name',
            'player.display_name',
            'player.gender',
            'player.birthday',
            'player.medical_conditions',
            'rel_player_team.trial_rating',
            'player.pic',
            'player.status',
            'player.fan_no',
            'player.billing_guardian',
            'player.living_guardian',
            'rel_player_team.status AS assignment_status'
        )
            ->with('guardians', 'teams')
            ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_player_team.team_id')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('rel_player_guardian', 'rel_player_guardian.player_id', '=', 'player.player_id')
            ->where('player.franchise_id', $this->franchise_id)
            ->where('player.club_id', $this->club_id)
            ->where(function ($query) {
                //for coaches filter only players in the teams that the coach is training
                if (Auth::user()->hasRole('coach')) {
                    $query->where('rel_coach_team.coach_id', $this->user_id);
                }
                //for guardians show only players that are assigned to that guardian
                if (Auth::user()->hasRole('guardian')) {
                    $query->where('rel_player_guardian.guardian_id', '=', $this->user_id);
                }
                //allow filter by team
                if (isset($this->request['team']) && !empty($this->request['team'])) {
                    $query->where('team.team_id', $this->request['team']);
                }
                //allow filter by agegroup
                if (isset($this->request['agegroup']) && !empty($this->request['agegroup'])) {
                    $query->where('team.agegroup_id', $this->request['agegroup']);
                }
                //allow filter by skill group
                if (isset($this->request['skill_group']) && !empty($this->request['skill_group'])) {
                    $query->where('team.team_id', $this->request['skill_group']);
                }
                //allow filter by status
                if (isset($this->request['status'])) {
                    $query->where('player.status', $this->request['status']);
                }
                //allow filter by team assignment
                if (isset($this->request['assignment'])) {
                    switch ($this->request['assignment']) {
                        case 'assigned':
                            $query->whereNotNull('rel_player_team.player_id')
                                ->where('rel_player_team.status', 'assigned');
                            break;
                        case 'waiting':
                            $query->whereNotNull('rel_player_team.player_id')
                                ->where('rel_player_team.status', 'waiting');
                            break;
                        case 'trial':
                            $query->whereNotNull('rel_player_team.player_id')
                                ->where('rel_player_team.status', 'trial');
                            break;
                        case 'unassigned':
                            $query->whereNull('rel_player_team.player_id');
                            break;
                    }
                }
                //allow search by player name or email
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('player.first_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('player.last_name', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->groupBy('player.player_id')
            ->orderBy('player.display_name');

        if ($this->request->has('page')) {
            $totalPlayers = $totalPlayers->paginate($this->perPage);

            $players = $totalPlayers->items();
            $count = $totalPlayers->total();
        } else {
            $players = $totalPlayers->get();
            $count = $players->count();
        }

        //create filters for team, status, age group, skill group, and team assignment status
        $teams = get_teams();
        $filter_team = create_filter('team', 'Team', $teams);

        //form the object for the statuses filter
        $statuses = (object)[
            '0' => (object)['key' => 1, 'value' => 'Active'],
            '1' => (object)['key' => 2, 'value' => 'Injured'],
            '2' => (object)['key' => 0, 'value' => 'Inactive']
        ];
        $filter_status = create_filter('status', 'Status', $statuses);

        $agegroups = gr_get_agegroups();
        $filter_agegroup = create_filter('agegroup', 'Age Group', $agegroups);

        $skillgroups = gr_get_skillgroups();
        $filter_skillgroup = create_filter('skill_group', 'Skill Group', $skillgroups);

        $team_assignment = (object)[
            '0' => (object)['key' => 'assigned', 'value' => 'Assigned'],
            '1' => (object)['key' => 'waiting', 'value' => 'Waiting List'],
            '2' => (object)['key' => 'trial', 'value' => 'Trial'],
            '3' => (object)['key' => 'unassigned', 'value' => 'Unassigned']
        ];
        $filter_assignment = create_filter('assignment', 'Team Assignment', $team_assignment);

        $search = create_filter('search', 'Search');

        $filters = [
            $filter_team,
            $filter_skillgroup,
            $filter_agegroup,
            $filter_status,
            $filter_assignment,
            $search
        ];
        $misc = [
            'per_page' => $this->perPage
        ];

        return format_response($players, $count, $filters, $misc);
    }

    /**
     * Get a specific player by id.
     *
     * @param int $player_id
     * @return json
     */
    public function get_player($player_id)
    {
        $skills = array();
        $player = Player::find($player_id);
        if (!empty($player)) {
            $player->load('teams', 'sessions', 'guardians');
            $homeworks = Feedback::select(
                'feedback.feedback_id AS homework_id',
                'feedback.title',
                'feedback.created_by AS coach_id',
                'feedback.created_at AS homework_date',
                'user.display_name AS coach_name'
            )
                ->leftJoin('user', 'user.user_id', '=', 'feedback.created_by')
                ->leftJoin('rel_feedback_user', 'rel_feedback_user.feedback_id', '=', 'feedback.feedback_id')
                ->where('rel_feedback_user.user_id', $player->living_guardian)
                ->where('feedback.type', 'homework')
                ->groupBy('feedback.feedback_id')
                ->orderBy('feedback.created_at', 'DESC')
                ->limit(5)
                ->get();
            $player['homeworks'] = $homeworks;

            //for earch player team get the last skill assessment
            $teams = array();
            foreach ($player->teams as $team) {
                //find the last assessment date
                $teams[] = $team->team_id;
                $date = SkillGrade::select('created_at')
                    ->where('team_id', $team->team_id)
                    ->where('player_id', $player->player_id)
                    ->orderBy('created_at', 'DESC')
                    ->first();
                $created_at = !empty($date) ? $date->created_at->toDateTimeString() : NULL;
                $grades = SkillGrade::select(
                    'skill_grade.skill_id',
                    'skill.title',
                    'skill.category_id',
                    'skill_grade.grade'
                )
                    ->leftJoin('skill', 'skill.skill_id', '=', 'skill_grade.skill_id')
                    ->where('skill_grade.team_id', $team->team_id)
                    ->where('skill_grade.created_at', $created_at)
                    ->get()->keyBy('skill_id');
                $skills[$team->team_id] = $grades;

            }
            $player['skills'] = $skills;
            //get the kit items assigned to this player

            $kits = KitUser::with('kit.available_sizes', 'kit.type', 'team')
                ->where('user_player_id', $player->player_id)
                ->get();

            $notes = DB::table('skill_grade')
                ->select(
                    'skill_grade.created_at',
                    'skill_grade.note_id',
                    'skill_assessment_note.note',
                    'skill_grade.coach_id',
                    'user.display_name AS coach_name'
                )
                ->leftJoin('skill_assessment_note', 'skill_assessment_note.note_id', '=', 'skill_grade.note_id')
                ->leftJoin('user', 'user.user_id', '=', 'skill_grade.coach_id')
                ->where('skill_grade.player_id', $player_id)
                ->where('skill_grade.note_id', '>', 0)
                ->orderBy('skill_grade.created_at', 'DESC')
                ->groupBy('skill_grade.note_id')
                ->get();

            $consents = DB::table('consent')
                ->select(
                    'consent.consent_id',
                    'consent.title',
                    'rel_programme_player.consent_agreed_at',
                    'user.display_name AS agreed_by',
                    'rel_player_guardian.guardian_id'
                )
                ->leftJoin('programme', 'consent.consent_id', '=', 'programme.consent_id')
                ->leftJoin('rel_programme_player', 'programme.programme_id', '=', 'rel_programme_player.programme_id')
                ->leftJoin('rel_player_guardian', 'rel_programme_player.player_id', '=', 'rel_player_guardian.player_id')
                ->leftJoin('user', 'user.user_id', '=', 'rel_player_guardian.guardian_id')
                ->where('rel_programme_player.player_id', $player_id)
                ->where('rel_programme_player.status', 1)
                ->whereIn('rel_player_guardian.guardian_id', $player->guardians->pluck('user_id'))
                ->get();

            $player['kits'] = $kits;
            $player['notes'] = $notes;
            $player['consents'] = $consents;

        }
        return response()->json($player, 200);
    }

    /**
     * Create a player.
     *
     * @return json
     */
    public function create_player()
    {
        //Make sure there is available slots
        $slots = gr_get_available_slots($this->club_id);
        if ($slots < 1) {
            //notify admin email
            $admins = User::select('email', 'display_name')
                ->where('user_role', gr_get_role_id('admin'))
                ->where('club_id', $this->club_id)
                ->get();

            foreach ($admins as $admin) {
                Mail::send('emails.player-limit', ['name' => $admin->display_name], function ($message) use ($admin) {
                    $message->subject('Players Limit Reached');
                    $message->to("raul01us@gmail.com"); //hardcoded to be changed to $admin->email after mailgun live
                });
            }
            return response()->json('We are unable to register your children at this time. Please try again later.', 401);
        }

        //validate the request
        $this->validate($this->request, [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'middle_name' => 'string|max:50',
            'gender' => 'required|string|max:30',
            'birthday' => 'required|date_format:Y-m-d H:i:s|before:today',
            'school' => 'required|string|max:255',
            'year_at_school' => 'digits_between:1,11',
            'pic' => 'file|image|max:1024',
            'fan_no' => 'numeric'
        ],
            [
                'pic.max' => 'Player image cannot be bigger than 1 MB'
            ]);

        //If user is admin wee need to set the guardian
        if ($this->request->user()->hasRole('admin')) {
            $this->validate($this->request, [
                'guardian_id' => 'required|int'
            ]);
            //If player created by admin then guardian_id must be passed
            $guardian_id = $this->request['guardian_id'];
            $billing_guardian_id = $this->request['billing_guardian_id'];
        } else {
            $guardian_id = $this->user_id;
            $billing_guardian_id = $this->user_id;
        }

        //create the player
        $player = new Player();
        $player->franchise_id = $this->franchise_id;
        $player->club_id = $this->club_id;
        $player->first_name = ucfirst($this->request['first_name']);
        $player->last_name = $this->request['last_name'];
        $player->middle_name = $this->request['middle_name'];
        $player->display_name = ucfirst($this->request['first_name']) . ' ' . $this->request['last_name'];
        $player->gender = $this->request['gender'];
        $player->birthday = $this->request['birthday'];
        $player->school = $this->request['school'];
        $player->year_at_school = $this->request['year_at_school'];
        $player->medical_conditions = $this->request['medical_conditions'];
        $player->fan_no = $this->request['fan_no'];
        $player->created_by = $this->user_id;
        $player->status = 1; //active by default
        $player->living_guardian = $guardian_id;
        $player->billing_guardian = $billing_guardian_id;
        $player->save();

        //handle profile picture upload
        if (isset($this->request['pic']) && !empty($this->request['pic']) && $this->request->hasFile('pic')) {
            $file = $this->request->file('pic');
            $file_url = gr_save_file($file, 'players', $player->player_id);
            $player->pic = $file_url;
            $player->save();
        }

        //create the relation between player and guardian
        $rel_player_guardian = new RelPlayerGuardian();
        $rel_player_guardian->player_id = $player->player_id;
        $rel_player_guardian->guardian_id = $guardian_id;
        $rel_player_guardian->save();

        $admins = User::select('user_id')
            ->where('user_role', gr_get_role_id('admin'))
            ->get()
            ->pluck('user_id');

        foreach ($admins as $admin_id) {
            NotificationController::create('player', NULL, $player->player_id, $admin_id, $player->player_id);
        }


        // Add relation between teams & player, if selected
        if(
            $this->request->has('teams') &&
            !empty($this->request->teams)
        )
        {
            foreach ($this->request['teams'] as $team) {
                $status = $team['status'];

                RelPlayerTeam::updateOrCreate(
                    [
                        'player_id' => $player->player_id,
                        'team_id' => $team['team_id']
                    ],
                    [
                        'status' => $status,
                        'reason' => $team['reason'],
                        'trial_rating' => 0 // Create time, don't have trial
                    ]
                );
            }
        }

        // Add relation between skill group & player, if selected
        if(
            $this->request->has('skill_groups') &&
            !empty($this->request->skill_groups)
        )
        {
            foreach ($this->request['skill_groups'] as $skillGroup) {
                $status = $skillGroup['status'];

                RelPlayerTeam::updateOrCreate(
                    [
                        'player_id' => $player->player_id,
                        'team_id' => $skillGroup['team_id']
                    ],
                    [
                        'status' => $status,
                        'reason' => $skillGroup['reason'],
                        'trial_rating' => 0 // Create time, don't have trial
                    ]
                );

            }
        }

        AuditLogController::create('create-player', $player->player_id, $this->user_id);
        return response()->json($player, 200);
    }

    /**
     * Update a specific player
     *
     * @param int $user_id
     * @return json
     */
    function update_player($player_id)
    {
        $this->validate($this->request, [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'middle_name' => 'string|max:50',
            'gender' => 'required|string|max:30',
            'birthday' => 'required|date_format:Y-m-d H:i:s|before:today',
            'living_guardian' => 'int',
            'billing_guardian' => 'int',
            'school' => 'required|string|max:255',
            'year_at_school' => 'digits_between:1,11',
            'pic' => 'file|image|max:1024',
            'status' => 'int|min:0|max:2',
            'fan_no' => 'numeric'
        ],
            [
                'pic.max' => 'Player image cannot be bigger than 1 MB'
            ]);

        $auth_user = $this->request->user()->user_id;

        $player = Player::findOrFail($player_id);
        $player->first_name = ucfirst($this->request['first_name']);
        $player->last_name = $this->request['last_name'];
        $player->display_name = ucfirst($this->request['first_name']) . ' ' . $this->request['last_name'];
        $player->gender = $this->request['gender'];
        $player->birthday = $this->request['birthday'];
        $player->school = $this->request['school'];
        $player->year_at_school = $this->request['year_at_school'];
        $player->medical_conditions = $this->request['medical_conditions'];
        $this->request->has('status') ? $player->status = $this->request['status'] : null;
        $player->updated_by = $auth_user;

        if (isset($this->request['middle_name'])) {
            $player->middle_name = $this->request['middle_name'];
        }

        if (isset($this->request['fan_no'])) {
            $player->fan_no = $this->request['fan_no'];
        }

        if (Auth::user()->hasRole('admin')) {
            $player->living_guardian = $this->request['living_guardian'];
            $player->billing_guardian = $this->request['billing_guardian'];
            //remove all previous relations for this player with guardians
            $rel_player_guardian = RelPlayerGuardian::where('player_id', $player_id)->delete();

            //check if there is a relation between the living guardian and player
            $rel_player_guardian = RelPlayerGuardian::updateOrCreate(
                ['player_id' => $player_id, 'guardian_id' => $this->request['living_guardian']]
            );
            //check if there is a relation between the billing guardian and player
            $rel_player_guardian = RelPlayerGuardian::updateOrCreate(
                ['player_id' => $player_id, 'guardian_id' => $this->request['billing_guardian']]
            );
        }
        //manage profile picture upload
        if (isset($this->request['pic']) && !empty($this->request['pic']) && $this->request->hasFile('pic')) {
            $file = $this->request->file('pic');
            $image_url = gr_save_file($file, 'players', $this->request['living_guardian']);
            $player->pic = $image_url;
        }

        $player->save();

        //if player is set to inactive we need to check if the parent has all kids inactive and set parent inactive
        $guardian_players = RelPlayerGuardian::where('guardian_id', $this->request['billing_guardian'])->get();
        $inactive_players = RelPlayerGuardian::where('rel_player_guardian.guardian_id', $this->request['billing_guardian'])
            ->where('player.status', 0)
            ->leftJoin('player', 'player.player_id', '=', 'rel_player_guardian.player_id')
            ->get();
        if ($guardian_players->count() == $inactive_players->count()) {
            User::where('user_id', $this->request['billing_guardian'])->update(['has_active_players' => 0]);
        } else {
            User::where('user_id', $this->request['billing_guardian'])->update(['has_active_players' => 1]);
        }

        return response()->json($player, 200);
    }

    /**
     * Assign a player to a team or skill group.
     *
     * @param int $player_id
     * @return json
     */
    public function assign_player_teams($player_id)
    {
        $this->validate($this->request, [
            'teams' => 'required|array|min:1',
            'teams.*.team_id' => 'exists:team,team_id',
            'teams.*.status' => 'in:assigned,waiting,trialist,trial',
            'teams.*.reason' => 'string|max:255'
        ]);

        //check if this player has already attended a trial
        $already_trial = RelPlayerTeam::where('player_id', $player_id)
            ->where('trial_rating', '!=', 0)
            ->first();

        $trial_rating = !empty($already_trial->trial_rating) ? $already_trial->trial_rating : 0;

        foreach ($this->request['teams'] as $team) {
            $status = $team['status'];
            if ($status != 'assigned') {
                //if he already has a trial score make sure player will be on waiting list
                $status = empty($already_trial) ? $team['status'] : 'waiting';
            }
            RelPlayerTeam::updateOrCreate(
                ['player_id' => $player_id, 'team_id' => $team['team_id']],
                ['status' => $status, 'reason' => $team['reason'], 'trial_rating' => $trial_rating]
            );
        }
        return response()->json('Player successfully assigned');
    }

    /**
     * Assign single player to team
     * @param $playerId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function assignSinglePlayerToTeam($playerId)
    {
        $this->validate($this->request, [
            'team_id' => 'required|integer|min:1',
            'status' => 'required|in:assigned,waiting,trialist,trial'
        ]);
        $teamId = $this->request->team_id;
        $status = $this->request->status;
        $guardianId = get_guardian_id($playerId);
        $createdUpdatedUser = $this->user_id;

        RelPlayerTeam::updateOrCreate(
            ['player_id' => $playerId, 'team_id' => $teamId],
            ['status' => $status]
        );

        // If status is assigned
        if ($this->request->status === 'assigned') {
            // Create relation player with programme, team & kit
            $this->createPlayerRelationWithTeamKit($playerId, $teamId);

            NotificationController::create('player-team', $teamId, $playerId, $guardianId, $playerId);
        }

        return response()->json('success', 200);
    }

    /**
     * Remove all player form team.
     * @param $playerId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function removeAllTeamFromPlayer($playerId)
    {
        RelPlayerTeam::where('player_id', $playerId)
            ->delete();
        return response()->json("Success");
    }

    /**
     * Get the skill assessments for a player
     *
     * @param int $player_id
     * @return json
     */
    public function get_skill_assessments($player_id)
    {
        $this->validate($this->request, [
            'team_id' => 'required|int|min:1'
        ]);
        $skills = SkillGrade::select('created_at AS date', 'note_id')
            ->where('player_id', $player_id)
            ->where('team_id', $this->request['team_id'])
            ->orderBy('created_at', 'DESC')
            ->get();

        //group results by date
        $assessments = array();
        foreach ($skills as $skill) {
            $temp = explode(" ", $skill['date']);
            $date = $temp[0];
            $note_id = $skill['note_id'];
            $skill = SkillGrade::select('skill_id', 'grade')
                ->where('player_id', $player_id)
                ->where('team_id', $this->request['team_id'])
                ->whereDate('created_at', '=', date('Y-m-d', strtotime($date)))
                ->orderBy('created_at', 'DESC')
                ->groupBy('skill_id')
                ->get()
                ->keyBy('skill_id');
            $note = SkillAssessmentNote::find($note_id);
            $assessments[$date] = $skill;
            $assessments[$date]['note'] = $note;
        }
        //form the results array
        $results = array(
            'player_id' => $player_id,
            'team_id' => $this->request['team_id'],
            'assessment_dates' => $assessments
        );
        return response()->json($results, 200);
    }

    /**
     * Get all kits assigned to a specific player
     *
     * @return json
     */
    public function get_player_kits($player_id)
    {
        $player = Player::find($player_id);
        $player->load('kits.available_sizes');
        return response()->json($player);
    }

    public function update_status($player_id)
    {
        $this->validate($this->request, [
            'status' => 'required|int|min:0|max:1'
        ]);
        $player = Player::find($player_id);
        if ($this->request['status'] == 1) {
            $player->status = 1;
            $player->save();
            return response()->json('Player Activated');
        }

        //inactive players cant do anything, has to be unassigned from all programmes/teams/kits etc. Inactive players wont show in any list apart from List players
        //unassign player from all his teams
        RelPlayerTeam::where('player_id', $player_id)->delete();
        //unasign all player kits
        RelKitUser::where('user_player_id', $player_id)->delete();
        //get all the future session for this player
        $sessions = RelPlayerSession::select('rel_player_session.session_id', 'session.programme_id')
            ->leftJoin('session', 'session.session_id', '=', 'rel_player_session.session_id')
            ->where('rel_player_session.player_id', $player_id)
            ->where('session.start_time', '>=', date('Y-m-d'))
            ->get();
        foreach ($sessions as $session) {
            //unassign player from fwaitinguture sessions
            RelPlayerSession::where('session_id', $session->session_id)->where('player_id', $player_id)->delete();
            RelProgrammePlayer::where('programme_id', $session->programme_id)->where('player_id', $player_id)->delete();
        }

        return response()->json('Player Inactive');
    }

    /**
     * Update player note
     * @param $playerId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function updateNote($playerId)
    {
        $this->validate($this->request, [
            'note' => 'required|string'
        ]);

        $player = Player::findOrFail($playerId);
        $this->request->has('note') ? $player->note = $this->request->note : null;

        $player->save();

        return response()->json('Success');
    }

    /**
     * Remove relationship between kit and player
     * @param $relKitUserId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function removePlayerKitItem($relKitUserId)
    {
        $relKitUser = RelKitUser::findOrFail($relKitUserId);
        $relKitUser->delete();
        return response()->json('Success');
    }

    /**
     * return player which is not assign to this team
     * @param $clubId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getPlayersByClubId($clubId)
    {
        $teamId = $this->request->team_id;

        // If player assigned to team, we do not need to show in dropdown list
        $existing_player_ids = DB::table('rel_player_team')
            ->select('player_id')
            ->where('rel_player_team.team_id', $teamId)
            ->pluck('player_id');

        $players = Player::select([
            'player.player_id as id',
            'player.birthday',
            'player.display_name as name',
            'rel_player_team.player_id',
            'rel_player_team.team_id',
            'player.club_id'
        ])
            ->leftJoin('rel_player_team', 'player.player_id', '=', 'rel_player_team.player_id')
            ->where('player.display_name', 'like', '%' . $this->request->search . '%')
            ->where('player.club_id', $clubId)
            ->where(function ($query) use ($teamId) {
                $query->where('rel_player_team.team_id', '!=', $teamId)
                    ->orWhereNull('rel_player_team.team_id');
                return $query;
            })
            ->whereNotIn('player.player_id', $existing_player_ids)
            ->groupBy('player.player_id')
            ->get();

        return response()->json($players);
    }


    /**
     * Remove player relationship with programme, if not accepted by parent
     * @param $playerId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function checkPlayerSession($playerId)
    {
        // First get the session id from rek)player_session table
        // If session status has 1 then get all programme and team name
        $teamId = $this->request->team_id;

        $programmes = RelPlayerSession::select([
            'rel_player_session.session_id',
            'session.session_id',
            'programme.programme_id',
            'programme.title as programme_title',
            'team.title as team_title',
            'player.living_guardian as user_id'
        ])
            ->leftJoin('player', 'rel_player_session.player_id', '=', 'player.player_id')
            ->leftJoin('session', 'rel_player_session.session_id', '=', 'session.session_id')
            ->leftJoin('programme', 'session.programme_id', '=', 'programme.programme_id')
            ->leftJoin('rel_programme_team', 'programme.programme_id', '=', 'rel_programme_team.programme_id')
            ->leftJoin('team', 'rel_programme_team.team_id', '=', 'team.team_id')
            ->where('player.player_id', $playerId)
            ->where('team.team_id', $teamId)
            ->where('is_trial', 0)
            ->groupBy('team.team_id')
            ->get();

        // If programme is empty then remove all kit item from this user
        if ($programmes->isEmpty()) {
            KitUser::where('user_player_id', $playerId)
                ->where('team_id', $teamId)
                ->delete();

            // Delete all programme which is related with this player
            // First get all programme in this team
            $programmesId = RelProgrammeTeam::select('programme_id')
                ->where('team_id', $teamId)
                ->get();

            $programmesId->map(function ($programme) use ($playerId) {
                RelProgrammePlayer::where('programme_id', $programme->programme_id)
                    ->where('player_id', $playerId)
                    ->delete();
            });
        }

        return response()->json($programmes);
    }

    /**
     * @param $playerId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function removePlayerProgrammeAndSession($playerId)
    {
        $this->validate($this->request, [
            'team_id' => 'required|exists:team,team_id'
        ]);
        $teamId = $this->request->team_id;

        // Update status from rel_player_team to waiting.
        $playerTeam = RelPlayerTeam::where('player_id', $playerId)
            ->where('team_id', $teamId)
            ->first();
        $playerTeam->status = "waiting";
        $playerTeam->save();

        // Get all programme which is related with this team
        $programmeTeam = RelProgrammeTeam::where('team_id', $teamId)
            ->get();

        $programmeTeam->map(function ($programme) use ($playerId) {
            RelProgrammePlayer::where('programme_id', $programme->programme_id)
                ->where('player_id', $playerId)
                ->delete();
        });

        // Remove all accepted session from rel_player_session
        RelPlayerSession::select([
            'rel_player_session.*'
        ])
            ->leftJoin('player', 'rel_player_session.player_id', '=', 'player.player_id')
            ->leftJoin('session', 'rel_player_session.session_id', '=', 'session.session_id')
            ->leftJoin('programme', 'session.programme_id', '=', 'programme.programme_id')
            ->leftJoin('rel_programme_team', 'programme.programme_id', '=', 'rel_programme_team.programme_id')
            ->leftJoin('team', 'rel_programme_team.team_id', '=', 'team.team_id')
            ->where('player.player_id', $playerId)
            ->where('team.team_id', $teamId)
            ->delete();

        // Remove All kit item from player which is associate with this team
        KitUser::where('user_player_id', $playerId)
            ->where('team_id', $teamId)
            ->delete();

        return response()->json('You successfully remove all programme in this team and player');
    }

    /**
     * Get all session for player
     * @param $playerId
     */
    public function getPlayerSession($playerId){

    }

    private function createPlayerRelationWithTeamKit($playerId, $teamId){
        $createdUpdatedUser = $this->user_id;
        //we need to assign the player to all the programmes his team are currently having
        $programmeTeams = RelProgrammeTeam::where('team_id', $teamId)
            ->get();

        if (!empty($programmeTeams)) {
            foreach ($programmeTeams as $programme) {
                $existing_rel = RelProgrammePlayer::where('programme_id', $programme->programme_id)
                    ->where('player_id', $playerId)
                    ->first();

                if (empty($existing_rel)) {
                    $programme_player = new RelProgrammePlayer;
                    $programme_player->programme_id = $programme->programme_id;
                    $programme_player->player_id = $playerId;
                    $programme_player->status = 0; //pending
                    $programme_player->save();
                }
            }
        }
        //we need to assign the team kits to this player
        $kitTeams = RelKitTeam::where('team_id', $teamId)
            ->get();

        $kitTeams->each(function ($kitTeam) use ($playerId, $createdUpdatedUser) {
            $kitUser = new KitUser();
            $kitUser->user_player_id = $playerId;
            $kitUser->team_id = $kitTeam->team_id;
            $kitUser->kit_id = $kitTeam->kit_id;
            $kitUser->user_role = 'player';
            $kitUser->status = 0;
            $kitUser->created_by = $createdUpdatedUser;
            $kitUser->updated_by = $createdUpdatedUser;
        });
    }
}
