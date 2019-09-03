<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\RelSponsorTeam;
use App\Sponsor;
use Auth;
use DB;

class SponsorController extends Controller {
  /**
  * Create a new controller instance.
  *
  * @return void
  */
  public function __construct(Request $request) {
    $this->request = $request;
    $this->middleware('auth');
    // $this->middleware('role:admin', ['only' => ['create', 'update', 'delete']]);
    $this->user_id = Auth::id();
    $this->franchise_id = Auth::getPayload()->get('franchise_id');
    $this->club_id = Auth::getPayLoad()->get('club_id');
  }

  /**
  * Create a new sponsor
  *
  * @return json
  */
  public function create(){
    //validate the request
    $this->validate($this->request,[
      'title'    => 'required|string|max:255',
      'content'  => 'string',
      'url'      => 'string|max:255',
      'logo_url' => 'file|image|max:1024',
      'order'    => 'int',
      'status'   => 'int|min:0|max:1'
    ],
    [
      'logo_url.max' => 'Sponsor image cannot be bigger than 1 MB'
    ]);

    $sponsor = new Sponsor();
    $sponsor->franchise_id  = $this->franchise_id;
    $sponsor->club_id  = $this->club_id;
    $sponsor->title         = $this->request['title'];
    $sponsor->content       = isset($this->request['content']) ? $this->request['content'] : NULL;
    $sponsor->url           = isset($this->request['url']) ? $this->request['url'] : NULL;
    //handle sponsor logo_url
    if( isset($this->request['logo_url']) && !empty($this->request['logo_url']) && $this->request->hasFile('logo_url') ){
      $image              = $this->request->file('logo_url');
      $image_url          = gr_save_file($image, 'sponsors', $this->franchise_id);
      $sponsor->logo_url  = $image_url;
    }
    $sponsor->created_by = $this->user_id;
    $sponsor->updated_by = $this->user_id;
    $sponsor->order      = isset($this->request['order']) ? $this->request['order'] : 1;
    $sponsor->status     = isset($this->request['status']) ? $this->request['status'] : 1;
    $sponsor->save();

    return response()->json($sponsor, 200);
  }

  /**
  * Update the sponsor with $id
  *
  * @param int $id
  * @return json
  */
  public function update($id){
    //validate the request
    $this->validate($this->request,[
      'title'    => 'required|string|max:255',
      'content'  => 'string',
      'url'      => 'string|max:255',
      'logo_url' => 'file|image|max:1024',
      'order'    => 'int',
      'status'   => 'int|min:0|max:1'
    ],
    [
      'logo_url.max' => 'Sponsor image cannot be bigger than 1 MB'
    ]);

    $sponsor = Sponsor::find($id);
    $sponsor->franchise_id  = $this->franchise_id;
    $sponsor->title         = $this->request['title'];
    if( isset($this->request['content']) && !empty($this->request['content']) ) {$sponsor->content = $this->request['content']; }
    if( isset($this->request['url']) && !empty($this->request['url']) ) {$sponsor->url = $this->request['url']; }

    //manage image upload
    if( isset($this->request['logo_url']) && !empty($this->request['logo_url']) && $this->request->hasFile('logo_url') ){
        //delete the old image
        if( !empty($sponsor->logo_url) ){
            gr_delete_file($sponsor->logo_url);
        }
        $image              = $this->request->file('logo_url');
        $image_url          = gr_save_file($image, 'sponsors', $this->franchise_id);
        $sponsor->logo_url  = $image_url;
    }

    $sponsor->updated_by = $this->user_id;
    if( isset($this->request['order']) && !empty($this->request['order']) ) {$sponsor->order = $this->request['order']; }
    if( isset($this->request['status']) && !empty($this->request['status']) ) {$sponsor->status = $this->request['status']; }
    $sponsor->save();

    return response()->json($sponsor, 200);
  }

  /**
  * Get sponsors within a franchise_id
  *
  * @return json
  */
  public function list() {
    $pagination = create_pagination();
    $sponsors = Sponsor::select(
        DB::raw('SQL_CALC_FOUND_ROWS sponsor.sponsor_id'),
        'sponsor.title',
        'sponsor.content',
        'sponsor.url',
        'sponsor.logo_url',
        'sponsor.status'
      )
      ->where([
          'sponsor.franchise_id' =>  $this->franchise_id,
          'sponsor.club_id' => $this->club_id
      ])
      ->where(function($query){
        //allow search by sponsor name
        if( isset($this->request['search']) && !empty($this->request['search']) ) {
          $query->where('sponsor.title', 'like', '%' . $this->request['search'] . '%');
        }
        return $query;
      })
      ->limit($pagination['per_page'])
      ->offset($pagination['offset'])
      ->get();

      //count the results so we can use them in pagination
      $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
      $count = reset($requestsCount)->count;

      $search = create_filter('search', 'Search');
      //create filters array
      $filters = [$search];

      return format_response($sponsors, $count, $filters);
  }

  /**
  * Get the sponsor with $id
  *
  * @param int $id
  * @return void
  */
  public function single($id) {
    $sponsor = Sponsor::select(
        'sponsor.sponsor_id',
        'sponsor.title',
        'sponsor.content',
        'sponsor.url',
        'sponsor.logo_url',
        'sponsor.status'
      )
      ->where('sponsor.franchise_id', $this->franchise_id)
      ->where('sponsor.sponsor_id', $id)
      ->first();
    return response()->json($sponsor, 200);
  }

  /**
  * Delete the sponsor with the id
  *
  * @param int $id
  * @return void
  */
  public function delete($id) {
    //make sure there are no teams assigned to this sponsor
    $teams = RelSponsorTeam::where('sponsor_id', $id)->first();
    if( !empty($teams) ){
      return response()->json('You cannot delete this sponsor. There are teams assigned to it.', 403);
    }
    //proceed and delete the sponsor
    $sponsor = Sponsor::find($id);
    if( empty($sponsor) ) { return response()->json('Sponsor not found', 404);}
    //delete the image from the disk
    if( !empty($sponsor->logo_url) ){ gr_delete_file($sponsor->logo_url); }
    $sponsor->delete();

    return response()->json('Sponsor successfully deleted', 200);
  }
}
