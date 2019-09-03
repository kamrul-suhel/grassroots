<?php

namespace App\Http\Controllers;
use App\KitUser;
use Illuminate\Http\Request;
use App\RelKitItemSize;
use App\RelPlayerTeam;
use App\RelCoachTeam;
use App\RelKitUser;
use App\KittItem;
use Auth;
use DB;

class KittController extends Controller {

    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|groupadmin', ['only' => ['create_kit', 'update_kit', 'delete_kit']]);
        // $this->middleware('role:coach|guardian', ['only' => ['get_kits']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all kitts assigned to a specific user role
    *
    * @return json
    */
    public function get_kits() {
        $pagination = create_pagination();
        //for guardians get the kits assigned to them and their children
        if(Auth::user()->hasRole('guardian')){
            $children = gr_guardian_get_children($this->user_id);

            if($this->request->has('parent')){
                $kits = KitUser::with(
                    'kit.available_sizes',
                    'kit.type',
                    'team',
                    'player'
                )
                    ->whereIn('user_player_id', $children)
                    ->paginate($this->perPage);

                $items = $kits->items();
                $total = $kits->total();
                return format_response($items, $total);
            }

            //get the teams
            $teams = RelPlayerTeam::select('team_id')
                ->whereIn('player_id', $children)
                ->get()->pluck('team_id');

            $kits = KittItem::with(['teams' => function($q) use ($teams){
                    //when we load the teams we only care about teams that this player is assigned to
                    $q->whereIn('team.team_id', $teams);
                }])
                ->select(
                    DB::raw('SQL_CALC_FOUND_ROWS rel_kit_user.id'),
                    'rel_kit_user.kit_id',
                    'kit_item.title',
                    'rel_kit_user.id',
                    'rel_kit_user.size',
                    'kit_type.type_id',
                    'kit_type.title AS type',
                    'player.player_id',
                    'player.display_name AS player_name'
                )
                ->leftJoin('rel_kit_user', 'rel_kit_user.kit_id', '=', 'kit_item.kit_id')
                ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
                ->leftJoin('player', 'player.player_id', '=', 'rel_kit_user.user_player_id')
                ->where('kit_item.franchise_id', $this->franchise_id)
                ->where('kit_item.club_id', $this->club_id)
                ->where(function($query) use($children){
                    $query->whereIn('rel_kit_user.user_player_id', $children)
                        ->orWhere('rel_kit_user.user_player_id', $this->user_id);
                    return $query;
                })
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();

        } elseif(Auth::user()->hasRole('coach')) {
            //for choach only return kit assigned to them
            $teams = RelCoachTeam::select('team_id')->where('coach_id', $this->user_id)->get()->pluck('team_id');
            $kits = KittItem::with(['teams' => function($q) use ($teams){
                    //when we load the teams we only care about teams that this player is assigned to
                    $q->whereIn('team.team_id', $teams);
                }])
                ->select(
                     DB::raw('SQL_CALC_FOUND_ROWS kit_item.kit_id AS id'),
                     'kit_item.kit_id',
                     'kit_item.title',
                     'rel_kit_user.size',
                     'kit_type.type_id',
                     'kit_type.title AS type'
                )
                ->leftJoin('rel_kit_user', 'rel_kit_user.kit_id', '=', 'kit_item.kit_id')
                ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
                ->where('kit_item.franchise_id', $this->franchise_id)
                ->where('kit_item.club_id', $this->club_id)
                ->where('rel_kit_user.user_player_id', $this->user_id)
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();
        } else {
            //for admins get all the kits in the franchise and club
            $kits = KittItem::with('teams')
                ->select(
                     DB::raw('SQL_CALC_FOUND_ROWS kit_item.kit_id AS id'),
                     'kit_item.kit_id',
                     'kit_item.title',
                     'kit_type.type_id',
                     'kit_type.title AS type'
                )
                ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
                ->where('kit_item.franchise_id', $this->franchise_id)
                ->where('kit_item.club_id', $this->club_id)
                ->limit($pagination['per_page'])
                ->offset($pagination['offset'])
                ->get();

        }
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        $kits->load('available_sizes');
        return format_response($kits, $count);
    }

    /**
    * View the kit with $kit_id
    *
    * @param int $grade_id
    * @return json
    */
    public function get_kit($kit_id) {
        if(Auth::user()->hasRole('admin')){
            //for admins we get the kit with all the sizes
            $kit = KittItem::with('available_sizes')
                ->select(
                    'kit_item.kit_id',
                    'kit_item.kit_id as id',
                    'kit_item.title AS kit_item',
                    'kit_item.title',
                    'kit_item.product_sku',
                    'kit_item.is_player_assignment',
                    'kit_item.image_url',
                    'kit_type.type_id',
                    'kit_type.title AS type'
                )
                ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
                ->where('kit_item.franchise_id', '=', $this->franchise_id)
                ->where('kit_item.club_id', '=', $this->club_id)
                ->where('kit_item.kit_id', '=', $kit_id)
                ->first();
        } else {
            //for coach and guardian we get the kit with the assigned size
            $kit = KittItem::with('available_sizes')
                    ->select(
                        'kit_item.kit_id',
                        'kit_item.title AS kit_item',
                        'kit_item.title',
                        'kit_item.product_sku',
                        'kit_item.is_player_assignment',
                        'kit_item.image_url',
                        'kit_type.type_id',
                        'kit_type.title AS type',
                        'rel_kit_user.size'
                    )
                    ->leftJoin('rel_kit_user', 'rel_kit_user.kit_id', '=', 'kit_item.kit_id')
                    ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
                    ->where('kit_item.franchise_id', '=', $this->franchise_id)
                    ->where('kit_item.club_id', '=', $this->club_id)
                    ->where('kit_item.kit_id', '=', $kit_id)
                    ->first();
        }
        return response()->json($kit, 200);
    }

    /**
    * Create a new kit
    *
    * @return json
    */
    public function create_kit(){
        //validate the Request
        $this->validate($this->request,[
            'title' => 'required|string|max:255',
            'type_id' => 'required|integer|min:1',
            'product_sku' => 'string|max:255',
            'image_url'=> 'file|image|max:1024',
            'is_player_assignment' => 'integer|min:0|max:1',
            'status' => 'integer|min:0|max:1',
            'sizes' => 'required|array|min:1'
        ],
        [
          'image_url.max' => 'Kit image cannot be bigger than 1 MB'
        ]);

        if(Auth::user()->hasRole('groupadmin')){
            $this->validate($this->request, [
                'club_id' => 'required|int|exists:club,club_id'
            ]);
            $club_id = $this->request['club_id'];
        } else {
            $club_id = $this->club_id;
        }

        $kit = new KittItem;
        $kit->franchise_id = $this->franchise_id;
        $kit->club_id = $club_id;
        $kit->title = $this->request['title'];
        $kit->type_id = $this->request['type_id'];
        $kit->is_player_assignment = isset($this->request['is_player_assignment']) ? $this->request['is_player_assignment'] : 0;
        $kit->product_sku = $this->request['product_sku'];
        $kit->status = isset($this->request['status']) ? $this->request['status'] : 1;
        $kit->created_by = $this->user_id;
        $kit->updated_by = $this->user_id;
        //manage image upload
        if( isset($this->request['image_url']) && !empty($this->request['image_url']) && $this->request->hasFile('image_url') ){
            $image = $this->request->file('image_url');
            $image_url = gr_save_file($image, 'kit', $this->franchise_id);
            $kit->image_url = $image_url;
        }
        $kit->save();

        //save the sizes
        foreach($this->request['sizes'] as $size){
            $kit_size = new RelKitItemSize;
            $kit_size->kit_id = $kit->kit_id;
            $kit_size->size = $size;
            $kit_size->save();
        }
        return response()->json($kit, 200);
    }

    /**
    * Edit the kit with $kit_id
    *
    * @param int $kit_id
    * @return json
    */
    public function update_kit($kit_id) {
        //validate the Request
        $this->validate($this->request,[
            'title' => 'required|string|max:255',
            'product_sku' => 'string|max:255',
            'image_url'=> 'file|image|max:1024',
            'sizes' => 'array|min:1'
        ],
        [
          'image_url.max' => 'Kit image cannot be bigger than 1 MB'
        ]);

        $kit = KittItem::find($kit_id);
        $kit->title = $this->request['title'];
        if( isset($this->request['product_sku']) && !empty($this->request['product_sku']) ) { $kit->product_sku = $this->request['product_sku']; }
        $kit->updated_by = $this->user_id;
        //manage image upload
        if( isset($this->request['image_url']) && !empty($this->request['image_url']) && $this->request->hasFile('image_url') ){
            //remove the old image
            if( !empty($kit->image_url) ){
                gr_delete_file($kit->image_url);
            }
            $image = $this->request->file('image_url');
            $image_url = gr_save_file($image, 'kit', $this->franchise_id);
            $kit->image_url = $image_url;
        }
        $kit->save();
        if(isset($this->request['sizes']) && !empty($this->request['sizes'])){
            //remove existing ones
            RelKitItemSize::where('kit_id', $kit_id)->delete();
            //save the new sizes
            foreach($this->request['sizes'] as $size){
                $kit_size = new RelKitItemSize;
                $kit_size->kit_id = $kit->kit_id;
                $kit_size->size = $size;
                $kit_size->save();
            }
        }
        return response()->json($kit, 200);
    }

    /**
    * Delete the kit with $grade_id
    *
    * @param int $grade_id
    * @return json
    */
    function delete_kit($kit_id) {
        $kit = KittItem::find($kit_id);
        //delete all assignmets of this kit
        $kit_user = DB::table('rel_kit_user')
            ->where('kit_id', '=', $kit_id)
            ->delete();
        $kit->delete();
        return response()->json('Kit Successfully Deleted', 200);
    }

    /**
    * Assign kits to users or players
    *
    * @return json
    */
    public function assign_kit() {
        $this->validate($this->request, [
            'user_id' => 'required|int|min:1',
            'user_role' => 'required|string|in:player,guardian,coach',
            'kits' => 'required|array|min:1',
            'kits.*.kit_id' => 'required|int|min:1',
            'kits.*.size' => 'string'
        ]);

        $userPlayerId = $this->request->user_id;
        $userRole = $this->request->user_role;

        foreach($this->request['kits'] as $kit){
            // Check is this player already has this kit
            $kitPlayerExists = KitUser::where('user_player_id', $userPlayerId)
                ->where('kit_id', $kit['kit_id'])
                ->where('team_id', null)
                ->first();

            if(!empty($kitPlayerExists)){
                continue;
            }

            $kitUser = new KitUser();
            $kitUser->user_player_id = $userPlayerId;
            $kitUser->kit_id = $kit['kit_id'];
            $kitUser->size = $kit['size'];
            $kitUser->status = 0;
            $kitUser->user_role = $userRole;
            $kitUser->created_by = $this->user_id;
            $kitUser->updated_by = $this->user_id;
            $kitUser->save();

            //create the notification
            if($this->request['user_role'] == 'player'){
                //for players we send the notification to the guardian
                $guardian_id = get_guardian_id($this->request['user_id']);
                NotificationController::create('kit', NULL, $kit['kit_id'], $guardian_id, $this->request['user_id']);
            } else {
                //we send the notification to the user
                NotificationController::create('kit', NULL, $kit['kit_id'], $this->request['user_id'], NULL);
            }
        }
        return response()->json('Assignment Successfully', 200);
    }


    /**
    * Select the size for an assigned kit
    *
    * @param int $id [the id of the rel_kit_user]
    * @return json
    */
    public function select_size($kitUserId){

        // If request has type = status chang only status
        if($this->request->has('type') &&
            $this->request->type === 'status'){
            $this->validate($this->request, [
                'status' => 'required|in:0,1'
            ]);

            KitUser::find($kitUserId)
                ->update(['status' => $this->request->status]);
            return response()->json('Status has been updated.');
        }

        $this->validate($this->request, [
            'size' => 'required|string|max:255'
        ]);

        $kit_user = KitUser::find($kitUserId)
            ->update(['size' => $this->request['size']]);
        return response()->json('Updated', 200);
    }
}
