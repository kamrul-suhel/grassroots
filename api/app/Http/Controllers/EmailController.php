<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\User;
use Auth;

class EmailController extends Controller {

  /**
  * Create a new controller instance.
  *
  * @return void
  */
  public function __construct(Request $request) {
    $this->request = $request;
    $this->middleware('auth');
    $this->user_id = Auth::id();
    $this->franchise_id = Auth::getPayload()->get('franchise_id');
    $this->club_id = Auth::getPayLoad()->get('club_id');
  }


  public function send_email() {
    $this->validate($this->request, [
      'user_id' => 'required|int|min:1|exists:user,user_id',
      'subject' => 'required|string',
      'content' => 'required|string'
    ]);

    $auth_user = Auth::user();
    $user_to_contact = User::find($this->request['user_id']);

    //super admin can only contact group admin
    if( $auth_user->hasRole('superadmin') ) {
      if( !$user_to_contact->hasRole('groupadmin') ){
        return response()->json('You cannot contact this user', 403);
      }
    //club admin can only contact parents and coaches inside their club
    } elseif( $auth_user->hasRole('admin') ){
      if( (!$user_to_contact->hasRole('coach') || !$user_to_contact->hasRole('guardian')) && $user_to_contact->club_id != $this->club_id ) {
        return response()->json('You cannot contact this user', 403);
      }
    //any other user roles are not allowed to use this
    } else {
      return response()->json('Not Found', 404);
    }
    // we pass all the validations so send the email
    Mail::send('emails.contact', ['content' => $this->request['content']], function ($message) {
        $message->subject($this->request['subject']);
        $message->to("raul01us@gmail.com"); //TODO hardcoded to be changed to $user_to_contact->email after mailgun live
    });
    AuditLogController::create('send-email', $this->request['user_id'], $this->user_id);
    return response()->json('Email sent');
  }

}
