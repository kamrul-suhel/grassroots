<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Download;
use Auth;
use DB;

class DownloadController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['create_download', 'update_download', 'delete_download']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Get all downloads.
     *
     * @return json
     */
    public function get_downloads() {

        //validate request
        $this->validate($this->request,
            //rules
            ['status' => 'integer|max:1|min:0'],
            //overwrite the default error message
            ['status.max' => 'unaccepted status parameter', 'status.min' => 'unaccepted status parameter']
        );

        $pagination = create_pagination();
        $downloads = DB::table('download')
            ->select(
                DB::raw('SQL_CALC_FOUND_ROWS download.download_id'),
                'download.category_id',
                'download.visibility',
                'download_category.title AS category',
                'download.title',
                'download.content',
                'download.image_url',
                'download.file_url',
                'download.created_at'
            )
            ->leftJoin('download_category', 'download_category.id', '=', 'download.category_id')
            ->where('download.franchise_id', '=', $this->franchise_id)
            ->where('download.club_id', '=', $this->club_id)
            ->where(function($query){
                if( isset($this->request['status']) ) {
                    $query->where('download.status', '=', $this->request['status']);
                }
                if($this->request->user()->hasRole('coach')){
                    $query->whereIn('download.visibility', ['all', 'coach']);
                }elseif($this->request->user()->hasRole('guardian')){
                    $query->whereIn('download.visibility', ['all', 'guardian']);
                }
                return $query;
            })
            ->orderBy('download.order')
            ->orderBy('download_category.title')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($downloads, $count);
    }

    /**
    * Get download with $download_id
    *
    * @param int $download_id
    * @return json
    */
    public function get_download($download_id){
        $download = Download::find($download_id);
        return response()->json($download, 200);
    }

    /**
    * Create a new download
    *
    * @return json
    */
    public function create_download() {
        //validate the request
        $this->validate($this->request, [
            'category_id' => 'required|exists:download_category,id',
            'visibility' => 'required|in:coach,guardian,all',
            'title' => 'required|string|max:255',
            'image' => 'file|image|max:1024',
            'file' => 'required|file|max:10024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'order' => 'integer|min:0',
            'status' => 'integer|min:0|max:1'
        ],
        [
            'image.max' => 'Download Image cannot be bigger than 1 MB',
            'file.max'  => 'Download File cannot be bigger than 10 MB'
        ]);

        $download = new Download;
        $download->franchise_id = $this->franchise_id;
        $download->club_id = $this->club_id;
        $download->category_id = $this->request['category_id'];
        $download->visibility = $this->request['visibility'];
        $download->title = $this->request['title'];
        $download->content = $this->request['content'];
        //manage image upload
        if( isset($this->request['image']) && !empty($this->request['image']) && $this->request->hasFile('image') ){
            $image = $this->request->file('image');
            $image_url = gr_save_file($image, 'downloads', $this->user_id);
            $download->image_url = $image_url;
        }
        //manage file upload
        if( isset($this->request['file']) && !empty($this->request['file']) && $this->request->hasFile('file') ){
            $file = $this->request->file('file');
            $file_url = gr_save_file($file, 'downloads', $this->user_id);
            $download->file_url = $file_url;
        }
        $download->created_by = $this->user_id;
        $download->order = $this->request['order'];
        $download->status = isset($this->request['status']) ? $this->request['status'] : 1; //active by default
        
        $download->save();

        return response()->json($download, 200);
    }

    /**
    * Edit the download with $download_id
    *
    * @param int $download_id
    * @return json
    */
    public function update_download($download_id){

        //validate the request
        $this->validate($this->request, [
            'category_id' => 'required|exists:download_category,id',
            'visibility' => 'required|in:coach,guardian,all',
            'title' => 'required|string|max:255',
            'order' => 'integer|min:0',
            'status' => 'integer|min:0|max:1',
            'file' => 'file|max:10024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx'
        ]);

        $download = Download::find($download_id);
        $download->category_id = $this->request['category_id'];
        $download->visibility = $this->request['visibility'];
        $download->title = $this->request['title'];
        $download->content = $this->request['content'];
        $download->order = $this->request['order'];
        $download->updated_by = $this->user_id;

        //manage file upload
        if( isset($this->request['file']) &&
            !empty($this->request['file']) &&
            $this->request->hasFile('file')
        ){
            $file = $this->request->file('file');
            $file_url = gr_save_file($file, 'downloads', $this->user_id);
            $download->file_url = $file_url;
        }

        $download->save();

        return response()->json($download, 200);
    }

    /**
    * Delete the download with $download_id
    *
    * @param int $download_id
    * @return json
    */
    public function delete_download($download_id){
        $download = Download::find($download_id);
        //delete the files from the disk
        if( !empty($download->image_url) ){
            gr_delete_file($download->image_url);
        }
        //delete the files from the disk
        if( !empty($download->file_url) ){
            gr_delete_file($download->file_url);
        }

        $download->delete();

        return response()->json('Download Deleted Successifully', 200);
    }

}
