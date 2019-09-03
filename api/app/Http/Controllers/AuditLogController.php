<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\AuditLog;
use Auth;
use DB;

class AuditLogController extends Controller
{
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

    /**
     * Create a new statistic
     *
     * @param int $target_id
     * @param string  $type ('article-download', 'profile-view', 'email')
     * @return json
     */
    public static function create($type, $target_id, $user_id = null) {

        $statistic = new AuditLog;
        $statistic->user_id     = !empty($user_id) ? $user_id : $this->user_id;
        $statistic->target_id   = $target_id;
        $statistic->type        = $type;
        $statistic->save();

        return response()->json($statistic);
    }
}
