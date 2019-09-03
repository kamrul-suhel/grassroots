<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Auth;
use DB;

class ReferController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        // $this->middleware('role:guardian', ['only' => ['get_teams']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    public function send_refer_email(){
        $this->validate($this->request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user'
        ]);

        $user = Auth::user();
        // $name = $this->request['name'];
        $email = $this->request['email'];

        Mail::send('emails.refer', ['name' => $this->request['name'], 'referer' => $user->display_name ], function ($message) use ($email) {
            $message->subject('Reffer Email');
            $message->to($this->request['email']);
        });
        return response()->json('Mail Sent');
    }
}
