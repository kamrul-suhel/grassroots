<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Invoice;
use App\InvoiceLine;
use App\User;
use App\Page;
use Carbon\Carbon;
use Auth;
use DB;

class PageController extends Controller {
  /**
  * Create a new controller instance.
  *
  * @return void
  */
  public function __construct(Request $request) {
    $this->request = $request;
    $this->middleware('auth', ['except' => ['single']]);
    $this->middleware('role:superadmin', ['except' => ['single']]);
    $this->user_id = Auth::id();
  }

  /**
  * Create a new page
  *
  * @return json
  */
  public function create(){

    $this->validate($this->request, [
      'title'   => 'required|string|max:255',
      'content' => 'required|string',
      'status'  => 'int|min:0|max:1'
    ]);

    $page = new Page;
    $page->title        = $this->request['title'];
    $page->content      = $this->request['content'];
    $page->slug         = generate_slug($this->request['title']);
    $page->status       = isset($this->request['status']) ? $this->request['status'] : 1;
    $page->created_by   = $this->user_id;
    $page->updated_by   = $this->user_id;
    $page->save();

    return response()->json($page, 200);
  }

  /**
  * List all pages
  *
  * @return json
  */
  public function list(){
    $pagination = create_pagination();
    $pages = Page::select(
        DB::raw('SQL_CALC_FOUND_ROWS page.id'),
        'page.title',
        'page.slug',
        'page.content'
      )
      ->where(function($query){
        //allow filter by title
        if( isset($this->request['search']) && !empty($this->request['search']) ) {
          $query->where('page.title', 'like', '%' . $this->request['search'] . '%');
        }
        return $query;
      })
      ->limit($pagination['per_page'])
      ->offset($pagination['offset'])
      ->get();
    $requestsCount = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
    $count = reset($requestsCount)->count;

    return format_response($pages, $count);
  }

  /**
  * List the page with $slug_or_id
  *
  * @return json
  */
  public function single($slug_or_id){
    $page = Page::where('slug', $slug_or_id)
        ->orWhere('id', $slug_or_id)
        ->first();
    if( empty($page) ) { return response()->json('Page not found', 404); }

    return response()->json($page);
  }

  /**
  * Update the page with $id
  *
  * @return json
  */
  public function update($id) {

    $this->validate($this->request, [
      'title'   => 'string|max:255',
      'content' => 'string',
      'status'  => 'int|min:0|max:1'
    ]);

    $page = Page::find($id);
    if( empty($page) ){ return response()->json('Page not found', 404); }

    if( isset($this->request['title']) ) { $page->title = $this->request['title']; }
    if( isset($this->request['content']) ) { $page->content = $this->request['content']; }
    if( isset($this->request['status']) ) { $page->status = $this->request['status']; }
    $page->updated_by = $this->user_id;
    $page->save();

    return response()->json($page);
  }

  /**
  * Delete the page with $id
  *
  * @return json
  */
  public function delete($id) {
    $page = Page::find($id);
    if( empty($page) ){ return response()->json('Page not found', 404); }
    $page->delete();

    return response()->json('Page successifully deleted');
  }

}
