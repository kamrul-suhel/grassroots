<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Download;
use Validator;
use App\Scan;
use Auth;
use DB;

class UploadController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        // $this->middleware('role:admin', ['only' => ['create_download', 'update_download', 'delete_download']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Upload files for a user .
     *
     * @return json
     */
     public function upload_scans($type){
         //if auth user is admin we need to pass the user id
         if( Auth::user()->hasRole('admin') ){
             $this->validate($this->request, [
                 'user_id' => 'required|integer'
             ]);
             $user_id = $this->request['user_id'];
         } else {
             $user_id = $this->user_id;
         }
         //validate the request
         $this->validate($this->request, [
             'expiry' => 'required|date_format:Y-m-d H:i:s|after:today',
             'file' => 'required|file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx'
         ],
         [
           'file.max' => 'Uploaded scan cannot be bigger than 1 MB'
         ]);

         $scan = new Scan;
         $scan->user_id = $user_id;
         $scan->title = $type . ' Scan';
         $scan->type_id = gr_get_scan_type_id($type);
         $scan->expire = $this->request['expiry'];
         $scan->status = 1; //hardcoded active by default
         if( $this->request->hasFile('file') ){
             $file = $this->request->file('file');
             $file_url = gr_save_file($file, $type, $user_id);
             $scan->file_url = $file_url;
         }
         $scan->save();

         return response()->json('File Uploaded successfully', 200);
     }

     public function upload_qualifications(Request $request){
         //if auth user is admin we need to pass the user id
         if( Auth::user()->hasRole('admin') ){
             $this->validate($this->request, [
                 'user_id' => 'required|integer'
             ]);
             $user_id = $this->request['user_id'];
         } else {
             $user_id = $this->user_id;
         }
         $files = $request->file('files');
         foreach ( $files as $file ){
             $destinationPath = 'storage/qualifications'.'/'.$user_id;
             $filename = $file->getClientOriginalName();
             $upload_success = $file->move($destinationPath, $filename);
             if($upload_success){
                 $file_url = url('storage')."/qualifications/" . $user_id."/" . $filename;
                 $scan = new Scan;
                 $scan->user_id = $user_id;
                 $scan->title = 'Qualification Scan';
                 $scan->type_id = gr_get_scan_type_id('qualifications');
                 $scan->status = 1; //hardcoded active by default
                 $scan->file_url = $file_url;
                 $scan->save();
             }
         }

         return response()->json("files uploaded successfully");
     }
}
