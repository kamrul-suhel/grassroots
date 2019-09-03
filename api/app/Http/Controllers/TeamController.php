<?php

namespace App\Http\Controllers;

use App\KitUser;
use Illuminate\Http\Request;
use App\RelProgrammePlayer;
use App\RelSkillgroupTeam;
use App\RelProgrammeTeam;
use App\RelPlayerSession;
use App\RelSponsorTeam;
use App\RelPlayerTeam;
use App\RelCoachTeam;
use App\RelKitTeam;
use App\RelKitUser;
use App\AgeGroup;
use App\Sponsor;
use App\Session;
use App\KittItem;
use App\Team;
use Auth;
use DB;

class TeamController extends Controller
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
        $this->middleware('role:admin|coach', ['only' => ['get_teams_list']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get teams within a franchise_id and club_id
     *
     * @return json
     */
    public function get_teams_list()
    {
        $perPage = $this->request->has('perpage') ? $this->request->perpage : 12;
        $teams = Team::select(
            DB::raw('SQL_CALC_FOUND_ROWS team.team_id'),
            DB::raw('(SELECT COUNT(*) FROM rel_player_team WHERE team_id = team.team_id AND status = "assigned") AS player_count'),
            DB::raw('(SELECT COUNT(*) FROM rel_kit_team WHERE rel_kit_team.team_id = team.team_id) AS total_kit'),
            'team.title',
            'team.team_id',
            'team.logo_url',
            'team.type',
            'team.gender',
            'team.max_size',
            'agegroup.title AS agegroup'
        )
            ->with('skills')
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->where('team.franchise_id', $this->franchise_id)
            ->where('team.club_id', $this->club_id)
            ->where(function ($query) {
                //allow search by team name
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('team.title', 'like', '%' . $this->request['search'] . '%');
                }
                //filter by team type
                if (isset($this->request['type']) && !empty($this->request['type'])) {
                    $query->where('team.type', $this->request['type']);
                }
                //filter by age group
                if (isset($this->request['agegroup']) && !empty($this->request['agegroup'])) {
                    $query->where('team.agegroup_id', $this->request['agegroup']);
                }
                //for coaches only show teams that are assigned to them
                if (Auth::user()->hasRole('coach')) {
                    $query->where('rel_coach_team.coach_id', $this->user_id);
                }
                return $query;
            })
            ->groupBy('team.team_id')
            ->paginate($perPage);

        $totalTeam  = $teams->items();
        $count = $teams->total();

        //get the age groups to load the filters
        $agegroup = gr_get_agegroups();
        //create the status filter
        $filter_agegroup = create_filter('agegroup', 'Age Group', $agegroup);

        //form the object for the team type  filter
        $type = (object)[
            '0' => (object)['key' => 'team', 'value' => 'FC'],
            '1' => (object)['key' => 'skill-group', 'value' => 'Academy']
        ];
        $filter_type = create_filter('type', 'Type', $type);
        $search = create_filter('search', 'Search');
        //create filters array
        $filters = [$filter_type, $filter_agegroup, $search];
        $misc = [
            'per_page' => $this->perPage
        ];

        return format_response($totalTeam, $count, $filters, $misc);
    }

    /**
     * Get team with team_id
     *
     * @param int $team_id
     * @return json
     */
    public function get_team($team_id)
    {
        $team = Team::select(
            'team.team_id',
            'team.agegroup_id',
            'agegroup.title AS agegroup',
            'team.title',
            'team.rank',
            'team.logo_url',
            'team.max_size',
            'team.type',
            'team.gender',
            'rel_coach_team.coach_id',
            'user.display_name AS coach_name'
        )
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_coach_team.coach_id')
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->where('team.franchise_id', $this->franchise_id)
            ->where('team.club_id', $this->club_id)
            ->where('team.team_id', $team_id)
            ->first();

        //load the programms iside the team object
        if (!empty($team)) {
            $team->load('programmes', 'players', 'kits', 'sponsors');
            if ($team->type === 'team') {
                //load the skill groups assigned to this team
                $team->load('skillgroups');
            }
        }
        return response()->json($team, 200);
    }

    /**
     * Create a new team
     *
     * @return json
     */
    public function create_team()
    {
        $this->validate($this->request, [
            'agegroup_id' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:team,skill-group',
            'coach_id' => 'int|min:1|exists:user,user_id',
            'club_id' => 'int|min:1|exists:club,club_id',
            'team_logo' => 'file|image|max:1024',
            'max_size' => 'required|integer|min:0',
            'rank' => 'required|integer|min:1',
            'status' => 'integer|min:0|max:1',
            'skill_groups' => 'array|min:1',
            'sponsors' => 'array|min:1'
        ],
            [
                'logo_url.max' => 'Team image cannot be bigger than 1 MB'
            ]);

        $club_id = $this->club_id;
        if (isset($this->request['club_id']) && !empty($this->request['club_id'])) {
            $club_id = $this->request['club_id'];
        }

        $team = new Team;
        $team->franchise_id = $this->franchise_id;
        $team->club_id = $club_id;
        $team->agegroup_id = $this->request['agegroup_id'];
        $team->title = $this->request['title'];
        $team->type = $this->request['type'];
        $team->max_size = $this->request['max_size'];
        $team->rank = isset($this->request['rank']) ? $this->request['rank'] : 0;
        $team->gender = isset($this->request['gender']) ? $this->request['gender'] : '';
        $team->created_by = $this->user_id;
        $team->status = isset($this->request['status']) ? $this->request['status'] : 1;

        //manage image upload
        if (
            isset($this->request['team_logo']) &&
            !empty($this->request['team_logo']) &&
            $this->request->hasFile('team_logo')
        ) {
            $image = $this->request->file('team_logo');
            $image_url = gr_save_file($image, 'teams', $this->franchise_id);
            $team->logo_url = $image_url;
        }

        $team->save();

        //assign the coach to the team
        if (
            isset($this->request['coach_id']) &&
            !empty($this->request['coach_id'])
        ) {
            $coach_team = new RelCoachTeam;
            $coach_team->coach_id = $this->request['coach_id'];
            $coach_team->team_id = $team->team_id;
            $coach_team->save();
        }

        //manage assigned skill groups
        if (
            isset($this->request['skill_groups']) &&
            !empty($this->request['skill_groups'])
        ) {
            foreach ($this->request['skill_groups'] as $id) {
                $rel_skillgroup_team = new RelSkillgroupTeam;
                $rel_skillgroup_team->team_id = $team->team_id;
                $rel_skillgroup_team->skillgroup_id = $id;
                $rel_skillgroup_team->save();
            }
        }

        //handle sponsor or sponsors
        if ($this->request->has('sponsor')) {
            $rel_sponsor_team = new RelSponsorTeam;
            $rel_sponsor_team->sponsor_id = $this->request->sponsor;
            $rel_sponsor_team->team_id = $team->team_id;
            $rel_sponsor_team->save();
        }

        if (isset($this->request['sponsors']) && !empty($this->request['sponsors'])) {
            foreach ($this->request['sponsors'] as $sponsor_id) {
                $rel_sponsor_team = new RelSponsorTeam;
                $rel_sponsor_team->sponsor_id = $sponsor_id;
                $rel_sponsor_team->team_id = $team->team_id;
                $rel_sponsor_team->save();
            }
        }

        return response()->json($team, 200);
    }

    /**
     * Edit the team with team_id
     *
     * @param int $team_id
     * @return json
     */
    public function update_team($team_id)
    {
        $this->validate($this->request, [
            'agegroup_id' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'coach_id' => 'int|min:1',
            'team_logo' => 'file|image|max:1024',
            'max_size' => 'integer|min:1',
            'rank' => 'required|integer|min:1',
            'status' => 'integer|min:0|max:1',
            'skill_groups' => 'array|min:1',
            'sponsors' => 'array|min:1'
        ],
            [
                'logo_url.max' => 'Team image cannot be bigger than 1 MB'
            ]);

        $team = Team::find($team_id);
        $team->agegroup_id = $this->request['agegroup_id'];
        $team->title = $this->request['title'];

        $this->request->has('gender') ? $team->gender = $this->request->gender : '';

        if (isset($this->request['max_size'])) {
            $team->max_size = $this->request['max_size'];
        }
        if (isset($this->request['status'])) {
            $team->status = $this->request['status'];
        }
        if (isset($this->request['rank'])) {
            $team->rank = $this->request['rank'];
        }
        $team->updated_by = $this->user_id;

        //manage image upload
        if (isset($this->request['team_logo']) &&
            !empty($this->request['team_logo']) &&
            $this->request->hasFile('team_logo')) {
            $image = $this->request->file('team_logo');
            $image_url = gr_save_file($image, 'teams', $this->franchise_id);
            $team->logo_url = $image_url;
        }
        $team->save();

        //manage coach assingnment
        if (isset($this->request['coach_id']) && !empty($this->request['coach_id'])) {
            RelCoachTeam::updateOrCreate(
                ['team_id' => $team_id, 'coach_id' => $this->request['coach_id']],
                ['coach_id' => $this->request['coach_id']]
            );
        }

        //manage assigned skill groups
        if (isset($this->request['skill_groups']) && !empty($this->request['skill_groups'])) {
            //remove the existing ones
            RelSkillgroupTeam::where('team_id', $team->team_id)->delete();
            foreach ($this->request['skill_groups'] as $id) {
                $rel_skillgroup_team = new RelSkillgroupTeam;
                $rel_skillgroup_team->team_id = $team->team_id;
                $rel_skillgroup_team->skillgroup_id = $id;
                $rel_skillgroup_team->save();
            }
        }

        //handle sponsors
        if (isset($this->request['sponsors']) && !empty($this->request['sponsors'])) {
            //delete existing sponsors
            RelSponsorTeam::where('team_id', $team->team_id)->delete();
            foreach ($this->request['sponsors'] as $sponsor_id) {
                $rel_sponsor_team = new RelSponsorTeam;
                $rel_sponsor_team->sponsor_id = $sponsor_id;
                $rel_sponsor_team->team_id = $team->team_id;
                $rel_sponsor_team->save();
            }
        }

        // Handle single sponsors
        if ($this->request->has('sponsor')) {
            // Remove all existing relation with sponsor
            RelSponsorTeam::where('team_id', $team->team_id)->delete();

            // Create new relation with sponsor
            $rel_sponsor_team = new RelSponsorTeam;
            $rel_sponsor_team->sponsor_id = $this->request->sponsor;
            $rel_sponsor_team->team_id = $team->team_id;
            $rel_sponsor_team->save();
        }

        return response()->json($team, 200);
    }

    /**
     * Delete the team with team_id
     *
     * @param int $team_id
     * @return json
     */
    public function delete_team($team_id)
    {
        //make sure there are no players assigned to this team
        $players = RelPlayerTeam::where('team_id', $team_id)->first();
        if (!empty($players)) {
            return response()->json('You cannot delete this team. There are players assigned to it.', 403);
        }
        //proceed and delete the team
        $team = Team::find($team_id);
        if (empty($team)) {
            return response()->json('Team not found', 404);
        }
        //delete the image from the disk
        if (!empty($team->logo_url)) {
            gr_delete_file($team->logo_url);
        }

        $team->delete();
        //delete relation in rel_sponsor_team
        $sponsor_team = RelSponsorTeam::where('team_id', $team_id)->delete();
        //delete relation in rel_programme_team
        $programme_team = RelProgrammeTeam::where('team_id', $team_id)->delete();
        //delete relation in rel_coach_team
        $coach_team = RelCoachTeam::where('team_id', $team_id)->delete();

        return response()->json('Team successfully deleted', 200);
    }

    /**
     * Change the status of a player inside a skill group or team
     *
     * @param int $team_id
     * @return json
     */
    public function change_player_team_status($team_id)
    {
        $this->validate($this->request, [
            'players' => 'required|array',
            'players.*.player_id' => 'required|int|min:1',
            'players.*.status' => 'required|in:assigned,waiting,trialist,trial'
        ]);

        foreach ($this->request['players'] as $player) {

            $guardian_id = get_guardian_id($player['player_id']);
            if ($player['status'] === 'trialist') {

                //if we move the player to a trial list we need to make sure that a trial session is selected
                if (empty($player['session_id'])) {
                    return response()->json('session id is required', 422);
                }
                //get the session details
                Session::where('session_id', $player['session_id'])
                    ->first();

                // Delete all relation between player & session
                RelPlayerSession::where([
                    'player_id' => $player['player_id'],
                    'session_id' => $player['session_id']
                ])->delete();

                //create rel between session and player
                $rel_player_session = new RelPlayerSession;
                $rel_player_session->player_id = $player['player_id'];
                $rel_player_session->session_id = $player['session_id'];
                $rel_player_session->status = 0; //pending
                $rel_player_session->created_by = $this->user_id;
                $rel_player_session->updated_by = $this->user_id;
                $rel_player_session->attendance_completed = 0;
                $rel_player_session->is_trial = 1;
                $rel_player_session->is_attended = 0;
                $rel_player_session->save();

                // Assign session id to rel_player_team
                $playerTeam = RelPlayerTeam::where('player_id', $player['player_id'])
                    ->where('team_id', $team_id)
                    ->first();

                $playerTeam->player_session_id = $rel_player_session->id;
                $playerTeam->save();

                NotificationController::create('trial-session', $team_id, $player['session_id'], $guardian_id, $player['player_id']);
            }

            if ($player['status'] === 'assigned') {
                //we need to assign the player to all the programmes his team are curently having
                $programme_team = RelProgrammeTeam::where('team_id', $team_id)
                    ->get();

                if (!empty($programme_team)) {
                    foreach ($programme_team as $programme) {
                        $existing_rel = RelProgrammePlayer::where('programme_id', $programme->programme_id)
                            ->where('player_id', $player['player_id'])
                            ->first();

                        if (empty($existing_rel)) {
                            $programme_player = new RelProgrammePlayer;
                            $programme_player->programme_id = $programme->programme_id;
                            $programme_player->player_id = $player['player_id'];
                            $programme_player->status = 0; //pending
                            $programme_player->save();
                        }
                    }
                }
                //we need to assign the team kits to this player
                $team_kits = KittItem::select(
                    'kit_item.kit_id'
                )
                    ->leftJoin('rel_kit_team', 'rel_kit_team.kit_id', '=', 'kit_item.kit_id')
                    ->where('rel_kit_team.team_id', $team_id)
                    ->where('kit_item.is_player_assignment', 1)
                    ->groupBy('kit_item.kit_id')
                    ->get();

                if (!empty($team_kits)) {
                    foreach ($team_kits as $kitTeam) {
                        $kitUser = new KitUser();
                        $kitUser->user_player_id = $player->player_id;
                        $kitUser->team_id = $kitTeam->team_id;
                        $kitUser->kit_id = $kitTeam->kit_id;
                        $kitUser->user_role = 'player';
                        $kitUser->status = 0;
                        $kitUser->created_by = $this->user_id;
                        $kitUser->updated_by = $this->user_id;
                    }
                }
                NotificationController::create('player-team', $team_id, $player['player_id'], $guardian_id, $player['player_id']);
            }

            RelPlayerTeam::updateOrCreate(
                ['player_id' => $player['player_id'], 'team_id' => $team_id],
                ['status' => $player['status'], 'date' => date('Y-m-d H:i:s')]
            );
        }
        return response()->json('Success', 200);
    }

    /**
     * Assign kits to all players inside a team
     *
     * @return json
     */
    public function assign_kits($team_id)
    {
        $this->validate($this->request, [
            'kits' => 'array|min:1'
        ]);

        //get all players assigned to $team_id
        $players = DB::table('rel_player_team')
            ->select('player_id')
            ->where('team_id', $team_id)
            ->where('status', 'assigned')
            ->get();

        $createdUpdatedUser = $this->user_id;

        if ($this->request->has('kits')) {

            // Delete all kit item in in this team
            RelKitTeam::where('team_id', $team_id)
                ->delete();

            //create the relation between team and kit item
            foreach ($this->request['kits'] as $kit_id) {
                RelKitTeam::updateOrCreate([
                    'kit_id' => $kit_id,
                    'team_id' => $team_id
                ]);
            }
        }

        //assign every kit item to every player in the $team_id
        foreach ($players as $player) {
            // Crate relationship with team, player, kit
            $relKitTeams = RelKitTeam::where('team_id', $team_id)
                ->get();

            $relKitTeams->each(function($kitTeam) use ($player, $createdUpdatedUser){

                // Check If user already assign to this kit
                $existingKitUser = KitUser::where('kit_id', $kitTeam->kit_id)
                    ->where('user_player_id', $player->player_id)
                    ->where('team_id', $kitTeam->team_id)
                    ->first();

                if(!empty($existingKitUser)){
                    return true;
                }

                $kitUser = new KitUser();
                $kitUser->user_player_id = $player->player_id;
                $kitUser->team_id = $kitTeam->team_id;
                $kitUser->kit_id = $kitTeam->kit_id;
                $kitUser->user_role = 'player';
                $kitUser->status = 0;
                $kitUser->created_by = $createdUpdatedUser;
                $kitUser->updated_by = $createdUpdatedUser;
                $kitUser->save();

                $guardian_id = get_guardian_id($player->player_id);
                NotificationController::create('kit', $kitTeam->team_id, $kitTeam->kit_id, $guardian_id, $player->player_id);
            });
        }

        return response()->json('Kit successfully assigned', 200);
    }

    /**
     * Update rel_player_team status
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function updateRelPlayerTeamStatus()
    {
        $this->validate($this->request, [
            'rel_player_team_id' => 'exists:rel_player_team,id',
            'status' => 'required|in:assigned,waiting,trialist,trial,pending_parent_approval'
        ]);

        // Update status in rel_player_team table
        $relPlayerTeam = RelPlayerTeam::findOrFail($this->request->rel_player_team_id);

        $playerId = $relPlayerTeam->player_id;
        $teamId = $relPlayerTeam->team_id;

        $createUpdatedUser = $this->user_id;
        $sessionId = $this->request->has('session_id') ? $this->request->session_id : null;
        $guardianId = get_guardian_id($playerId);
        $relPlayerTeam->status = $this->request->status;
        $relPlayerTeam->save();

        // If status is trial then remove session form rel_player_session
        if ($this->request->status === 'trial') {
            RelPlayerSession::where([
                'player_id' => $playerId,
                'session_id' => $sessionId
            ])->delete();
        }

        // If status is trialist then update status form parent approval
        if ($this->request->status === 'trialist') {
            $relPlayerSession = RelPlayerSession::where([
                'id' => $sessionId,
            ])->first();

            $relPlayerSession->status = 0; // need to approve by parent
            $relPlayerSession->save();
        }

        // If status is assigned
        if ($this->request->status === 'assigned') {
            //we need to assign the player to all the programmes his team are curently having
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

            // Get all kit item for this team

            // need to assign all kit item into this player

            //we need to assign the team kits to this player
            $kitTeams = RelKitTeam::where('team_id', $teamId)
                        ->get();

            $kitTeams->each(function($kitTeam) use ($playerId, $createUpdatedUser){
                $kitUser = new KitUser();
                $kitUser->user_player_id = $playerId;
                $kitUser->team_id = $kitTeam->team_id;
                $kitUser->kit_id = $kitTeam->kit_id;
                $kitUser->user_role = 'player';
                $kitUser->status = 0;
                $kitUser->created_by = $createUpdatedUser;
                $kitUser->updated_by = $createUpdatedUser;
                $kitUser->save();

                $guardian_id = get_guardian_id($playerId);
                NotificationController::create('kit', $kitTeam->team_id, $kitTeam->kit_id, $guardian_id, $playerId);
            });

            NotificationController::create('player-team', $teamId, $playerId, $guardianId, $playerId);
        }

        return response()->json('Success');
    }
}
