<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\RelPlayerSession;
use App\RelPlayerTeam;
use App\SkillGrade;
use App\Session;
use App\Player;
use App\Skill;
use App\Team;
use Auth;
use DB;

class SkillController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|groupadmin', ['only' => ['create_skill', 'update_skill', 'delete_skill']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the skills from a franchise and club
    *
    * @return json
    */
    public function get_skills(){
        $pagination = create_pagination();
        $skills = Skill::select(
                DB::raw('SQL_CALC_FOUND_ROWS skill.skill_id'),
                'skill.title',
                'skill_category.title AS category'
            )
            ->leftJoin('skill_category', 'skill.category_id','=', 'skill_category.category_id')
            ->where('skill.franchise_id', $this->franchise_id)
            ->where('skill.club_id', $this->club_id)
            ->where(function($query){
                    //allow search by assessment tile
                    if( isset($this->request['search']) && !empty($this->request['search']) ) {
                        $query->where('skill.title', 'like', '%' . $this->request['search'] . '%');
                    }
                    //allow filter by skill category
                    if( isset($this->request['category']) && !empty($this->request['category']) ){
                        $query->where('skill.category_id', $this->request['category']);
                    }
                    return $query;
                })
            ->orderBy('skill_category.category_id')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        $search = create_filter('search', 'Search');
        $category = gr_get_skill_category();
        $filter_category = create_filter('category', 'Category', $category);
        $filters = [$filter_category, $search];
        return format_response($skills, $count, $filters);
    }

    /**
    * Get all the skills from a franchise and club
    *
    * @param int $skill_id
    * @return json
    */
    public function get_skill($skill_id) {
        $skill = Skill::select(
                DB::raw('SQL_CALC_FOUND_ROWS skill.skill_id'),
                'skill.title',
                'skill.category_id',
                'skill_category.title AS category'
            )
            ->leftJoin('skill_category', 'skill.category_id','=', 'skill_category.category_id')
            ->where('skill.franchise_id', $this->franchise_id)
            ->where('skill.club_id', $this->club_id)
            ->where('skill.skill_id', $skill_id)
            ->orderBy('skill_category.category_id')
            ->first();
        return response()->json($skill, 200);
    }

    /**
    * Create a new skill
    *
    * @return json
    */
    public function create_skill() {
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'category_id' => 'required|int|exists:skill_category,category_id',
            'club_id' => 'required|int|exists:club,club_id'
        ]);

        $skill = new Skill;
        $skill->franchise_id = $this->franchise_id;
        $skill->club_id = $this->request['club_id'];
        $skill->title = $this->request['title'];
        $skill->category_id = $this->request['category_id'];
        $skill->created_by = $this->user_id;
        $skill->updated_by = $this->user_id;
        $skill->save();
        return response()->json($skill, 200);
    }

    /**
    * Update the skill with skill_id
    *
    * @param int $skill_id
    * @return json
    */
    public function update_skill($skill_id) {
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'category_id' => 'required|int|min:1'
        ]);

        $skill = Skill::find($skill_id);
        $skill->title = $this->request['title'];
        $skill->category_id = $this->request['category_id'];
        $skill->updated_by = $this->user_id;
        $skill->save();
        return response()->json('Skill updated successfully', 200);
    }

    /**
    * Delete the skill with skill_id
    *
    * @param int $skill_id
    * @return json
    */
    public function delete_skill($skill_id) {
        //make sure we dont have a skill assesment with this skill
        $skill_assessment = SkillGrade::where('skill_id', $skill_id)->first();
        if( empty($skill_assessment->grade_id) ){
            $skill = Skill::find($skill_id)->delete();
            return response()->json('Skill deleted successfully', 200);
        }
        return response()->json('You have skill assessment for this skill', 403);
    }
}
