<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Scan;


class ScanController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin');
    }

    public function delete_scan($scan_id){
        Scan::find($scan_id)->delete();
        return response()->json('Scan successfully deleted', 200);
    }

    /**
     * @param $scanId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($scanId){
        $this->validate($this->request, [
           'expire' => 'required|date'
        ]);

        $scan  = Scan::findOrFail($scanId);
        $scan->expire = $this->request->expire;

        // Check has file
        if($this->request->hasFile('file')){
            $file = $this->request->file('file');
            $file_url = gr_save_file($file, 'sc', $scan->scan_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        return response()->json('success');
    }

}
