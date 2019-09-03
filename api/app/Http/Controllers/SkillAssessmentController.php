<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SkillAssessmentNote;
use App\SkillGrade;
use App\Player;
use Auth;
use DB;

class SkillAssessmentController extends Controller
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
        $this->middleware('role:admin|coach');
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Get all existing skill assesments created by coach_id
     *
     * @return json
     */
    public function get_skill_assesments()
    {
        //if auth user is admin we need coach id to be passed
        if (Auth::user()->hasRole('admin')) {
            $this->validate($this->request, [
                'coach_id' => 'required|integer',
            ]);
            $coach_id = $this->request['coach_id'];
        } else {
            //coach id is the auth user
            $coach_id = $this->user_id;
        }
        $pagination = create_pagination();
        $skill_assesments = SkillGrade::select(
            DB::raw('SQL_CALC_FOUND_ROWS skill_grade.grade_id'),
            'skill_grade.grade',
            'skill_grade.created_at AS assessment_date',
            'skill_grade.coach_id',
            'team.team_id',
            'team.title AS team_name',
            'player.player_id',
            'player.display_name AS player_name',
            'skill.skill_id',
            'skill.title AS skill'
        )
            ->leftJoin('team', 'team.team_id', '=', 'skill_grade.team_id')
            ->leftJoin('player', 'player.player_id', '=', 'skill_grade.player_id')
            ->leftJoin('skill', 'skill.skill_id', '=', 'skill_grade.skill_id')
            ->orderBy('skill_grade.created_at', 'DESC')
            ->where('skill_grade.coach_id', $coach_id)
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        return format_response($skill_assesments, $count);
    }

    /**
     * View the skill assessment with $grade_id
     *
     * @param int $grade_id
     * @return json
     */
    public function get_skill_assessment()
    {
        //because we dont have a franchise_id in the skill_grade table we condition by coach_id
        if (Auth::user()->hasRole('admin')) {
            $this->validate($this->request, [
                'coach_id' => 'required|integer',
            ]);
            $coach_id = $this->request['coach_id'];
        } else {
            //coach id is the auth user
            $coach_id = $this->user_id;
        }

        $skill_assesment = SkillGrade::select(
            'skill_grade.grade_id',
            'skill_grade.grade',
            'skill_grade.created_at AS assessment_date',
            'skill_grade.coach_id',
            'skill_grade.note_id',
            'skill_assessment_note.note',
            'team.team_id',
            'team.title AS team_name',
            'player.player_id',
            'player.display_name AS player_name',
            'skill.skill_id',
            'skill.title AS skill'
        )
            ->leftJoin('team', 'team.team_id', '=', 'skill_grade.team_id')
            ->leftJoin('player', 'player.player_id', '=', 'skill_grade.player_id')
            ->leftJoin('skill', 'skill.skill_id', '=', 'skill_grade.skill_id')
            ->leftJoin('skill_assessment_note', 'skill_grade.note_id', '=', 'skill_assessment_note.note_id')
            ->orderBy('skill_grade.created_at', 'DESC')
            ->where('skill_grade.coach_id', $coach_id)
            ->where('skill_grade.grade_id', $grade_id)
            ->first();
        return response()->json($skill_assesment, 200);
    }

    /**
     * Create a new skill assessment
     *
     * @return json
     */
    public function create_skill_assessment()
    {
        //if auth user is admin we need coach id to be passed
        if (Auth::user()->hasRole('admin')) {
            $this->validate($this->request, [
                'coach_id' => 'required|integer',
            ]);
            $coach_id = $this->request['coach_id'];
        } else {
            //coach id is the auth user
            $coach_id = $this->user_id;
        }
        //validate the Request
        $this->validate($this->request, [
            'player_id' => 'required|integer|min:1',
            'team_id' => 'required|integer|min:1',
            'date' => 'required|date_format:Y-m-d H:i:s|before:tomorrow',
            'note' => 'string',
            'skills' => 'required|array|min:1',
            'skills.*.skill_id' => 'required|integer|min:1',
            'skills.*.grade' => 'required|integer|min:1|max:10',
        ]);
        if (!empty($this->request['note'])) {
            $assessment_note = new SkillAssessmentNote;
            $assessment_note->note = $this->request['note'];
            $assessment_note->save();
        }

        foreach ($this->request['skills'] as $skill) {
            $skill_grade = new SkillGrade;
            $skill_grade->player_id = $this->request['player_id'];
            $skill_grade->skill_id = $skill['skill_id'];
            $skill_grade->team_id = $this->request['team_id'];
            $skill_grade->grade = $skill['grade'];
            $skill_grade->created_by = $this->user_id;
            $skill_grade->created_at = $this->request['date'];
            $skill_grade->coach_id = $coach_id;
            $skill_grade->note_id = isset($assessment_note->note_id) ? $assessment_note->note_id : 0;
            $skill_grade->save();
        }
        return response()->json($skill_grade, 200);
    }

    /**
     * Edit the skill assesment with $grade_id
     *
     * @param int $grade_id
     * @return json
     */
    public function update_skill_assesment($grade_id)
    {
        //validate the Request
        $this->validate($this->request, [
            'grade' => 'required|integer|min:1|max:10'
        ]);
        $skill_grade = SkillGrade::find($grade_id);
        //do not allow coaches to edit other coaches skill assessments
        if (Auth::user()->hasRole('coach') && $skill_grade->coach_id != $this->user_id) {
            return response()->json(get_denied_message(), 403);
        }
        $skill_grade->grade = $this->request['grade'];
        $skill_grade->save();
        return response()->json($skill_grade, 200);
    }

    /**
     * Delete the skill assessment with $grade_id
     *
     * @param int $grade_id
     * @return json
     */
    function delete_skill_assesment($grade_id)
    {
        $skill_grade = SkillGrade::find($grade_id);
        //do not allow coaches to delete other coaches skill assessments
        if (Auth::user()->hasRole('coach') && $this->user_id != $skill_grade->coach_id) {
            return response()->json(get_denied_message(), 403);
        }
        $skill_grade->delete();
        return response()->json('Skill Assessment Successfully Deleted', 200);
    }

    /**
     * Get all avaiable players
     *
     * @return json
     */
    function get_avaiable_players()
    {

        $players = Player::select(
            DB::raw('SQL_CALC_FOUND_ROWS player.player_id'),
            'player.display_name AS player_name',
            'rel_player_team.id',
            'team.title AS team_name',
            'team.team_id',
            DB::raw('(SELECT skill_grade.created_at FROM skill_grade WHERE (skill_grade.player_id = player.player_id AND skill_grade.team_id = team.team_id) ORDER BY skill_grade.created_at DESC LIMIT 1) AS last_assessed')
        )
            ->leftJoin('rel_player_team', 'rel_player_team.player_id', '=', 'player.player_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_player_team.team_id')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->where('player.franchise_id', $this->franchise_id)
            ->where('player.club_id', $this->club_id)
            ->where('rel_player_team.status', 'assigned')
            ->where(function ($query) {
                //for coaches filter only players in the teams that the coach is training
                if (Auth::user()->hasRole('coach')) {
                    $query->where('rel_coach_team.coach_id', $this->user_id);
                }
                //allow filter by team
                if (
                    isset($this->request['team']) &&
                    !empty($this->request['team'])
                ) {
                    $query->where('team.team_id', $this->request['team']);
                }
                //allow filter by skill group
                if (
                    isset($this->request['skill_group']) &&
                    !empty($this->request['skill_group'])
                ) {
                    $query->where('team.team_id', $this->request['skill_group']);
                }
                //allow search by player name
                if (
                    isset($this->request['search']) &&
                    !empty($this->request['search'])
                ) {
                    $query->where('player.first_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('player.last_name', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->orderBy('last_assessed', 'DESC')
            ->paginate($this->perPage);

        $count = $players->total();
        $players = $players->items();

        //create filters for team, status, age group, skill group, and team assignment status
        $teams = get_teams();
        $filter_team = create_filter('team', 'Team', $teams);

        $skillgroups = gr_get_skillgroups();
        $filter_skillgroup = create_filter('skill_group', 'Skill Group', $skillgroups);

        $search = create_filter('search', 'Search');

        $filters = [$filter_team, $filter_skillgroup, $search];

        return format_response($players, $count, $filters);
    }

}
