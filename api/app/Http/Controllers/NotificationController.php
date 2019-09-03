<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Notification;
use Auth;
use DB;

class NotificationController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->user_id = Auth::id();
    }

    /**
     * Create a new notification
     *
     * @return void
     */
    public static function create($type, $team_id, $source_id, $user_id, $player_id){
        $notification = new Notification;
    	$notification->type = $type;
    	$notification->team_id = $team_id;
    	$notification->source_id = $source_id;
    	$notification->user_id = $user_id;
    	$notification->player_id = $player_id;
    	$notification->time = date('Y-m-d H:i:s');
    	$notification->seen = 0; //not seen by default
    	$notification->save();
    	return $notification;
    }

    /**
    * Get all notifications for the auth user
    *
    * @return json
    */
    public function get_notifications() {
        $pagination = create_pagination();
        $notifications = Notification::select(
                DB::raw('SQL_CALC_FOUND_ROWS notification.id'),
                'notification.id',
                'notification.user_id',
                'notification.player_id',
                'notification.type',
                'notification.source_id',
                'notification.team_id',
                'notification.time',
                'notification.seen',
                'player.display_name AS player_name',
                'team.title AS team_name'
            )
            ->leftJoin('player', 'player.player_id', '=', 'notification.player_id')
            ->leftJoin('team', 'team.team_id', '=', 'notification.team_id')
            ->where('notification.user_id', $this->user_id)
            ->orderBy('notification.time', 'DESC')
            ->orderBy('notification.type')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        $requestsCount = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;

        //check how many new/not seen notifications this user has
        $new = Notification::select(
                DB::raw('(SELECT COUNT(*) FROM notification WHERE notification.seen = 0 AND notification.user_id = '.$this->user_id.') AS notification_count')
            )
            ->where('user_id', $this->user_id)
            ->where('seen', 0)
            ->first();
        $misc = $new;
        return format_response($notifications, $count, false, $misc);
    }

    /**
    * Mark a notification as seen
    *
    * @param int $id
    * @return json
    */
    public function update_notification($id){
        $notification = Notification::find($id);
        $notification->seen = 1;
        $notification->save();

        return response()->json($notification, 200);
    }

    /**
    * Mark all notifications as seen for the auth user id
    *
    * @param int $user_id
    * @return json
    */
    public function mark_all_notification() {
        $notifications = Notification::where('seen', 0)
            ->where('user_id', $this->user_id)
            ->update(['seen' => 1]);
        return response()->json('All good bro', 200);
    }

    /**
    * Delete the notification with $id
    *
    * @param int $id
    * @return json
    */
    public function delete_notification($id){
        Notification::where('id', $id)
            ->where('user_id', $this->user_id)
            ->delete();
        return response()->json('Notification deleted', 200);
    }

}
