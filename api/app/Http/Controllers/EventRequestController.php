<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\EventRequest;
use App\User;
use Carbon\Carbon;
use Auth;
use DB;

class EventRequestController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');

        $this->middleware('role:admin|guardian', ['only' =>
            [
                'get_event_requests',
                'get_event_request',
                'delete_event_request',
                'accept_reject_event',
                'update_event_request'
            ]
        ]);

        $this->middleware('role:guardian',
            [
                'only' => [
                    'create_event_request'
                ]
            ]);

        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->role = Auth::getPayLoad()->get('role');
    }

    /**
    * Get all existing event requests
    *
    * @return json
    */
    public function get_event_requests(){

        $event_requests = DB::table('event_requests')
                        ->select(
                            DB::raw('SQL_CALC_FOUND_ROWS event_requests.request_id'),
                            'event_requests.status',
                            'programme_type.type_id AS event_type_id',
                            'programme_type.title AS event_type',
                            'event_requests.start_time',
                            'event_requests.end_time',
                            'event_requests.max_size',
                            'event_requests.is_coach_required',
                            'event_requests.coach_id',
                            'event_requests.venue',
                            'event_requests.notes',
                            'user.user_id',
                            'user.display_name AS created_by'
                        )
                        ->leftJoin('programme_type', 'programme_type.type_id', '=', 'event_requests.type_id')
                        ->leftJoin('user', 'user.user_id', '=', 'event_requests.created_by')
                        ->where('event_requests.club_id', $this->club_id)
                        ->where(function($query){
                            //filter by status if is passed
                            if(isset($this->request['status'])){
                                $query->where('event_requests.status', $this->request['status']);
                            }
                            //filter by status2
                            if( isset($this->request['status2']) && !empty($this->request['status2']) ) {
                                if($this->request['status2'] == 'past'){
                                  $query->whereDate('event_requests.start_time', '<', Carbon::now());
                                } else {
                                    $query->whereDate('event_requests.start_time', '>=', Carbon::now());
                                }
                            }
                            //filter by require coach
                            if(isset($this->request['coach'])){
                                $query->where('event_requests.is_coach_required', $this->request['coach']);
                            }
                            //filter by status if is passed
                            if(isset($this->request['type'])){
                                $query->where('programme_type.type_id', $this->request['type']);
                            }
                            //if logged in user is guardian show only his/hers events requests
                            if( Auth::user()->hasRole('guardian') ){
                                $query->where('event_requests.created_by', $this->user_id);
                            }
                            //if logged in user is admin only get unaproved events
//                            if( Auth::user()->hasRole('admin') ){
//                                $query->where('event_requests.status', 0);
//                            }
                            //allow search by coach name or email
                            if( isset($this->request['search']) && !empty($this->request['search']) ) {
                                $query->where('user.first_name', 'like', '%' . $this->request['search'] . '%')
                                      ->orWhere('user.last_name', 'like', '%' . $this->request['search'] . '%');
                            }
                            return $query;
                        })
                        ->orderBy('event_requests.start_time', 'DESC')
                        ->paginate($this->perPage);


        $requestedEvents = $event_requests->items();
        $total = $event_requests->total();

        //form the object for the statuses filter
        $statuses2 = (object)[
            '0' => (object) ['key' => 0, 'value' => 'Pending'],
            '1' => (object) ['key' => 1, 'value' => 'Accepted'],
            '2' => (object) ['key' => 2, 'value' => 'Rejected']
        ];
        $filter_status2 = create_filter('status', 'Status II', $statuses2);

        $statuses = (object)[
            '0' => (object) ['key' => 'past', 'value' => 'Past'],
            '1' => (object) ['key' => 'current', 'value' => 'Upcoming']
        ];
        $filter_status = create_filter('status2', 'Status', $statuses);

        $require_coach = (object)[
            '0' => (object) ['key' => 0, 'value' => 'No'],
            '1' => (object) ['key' => 1, 'value' => 'Yes']
        ];
        $filter_require_coach = create_filter('coach', 'Require Coach', $require_coach);

        $types = gr_get_programme_type();
        $filter_type = create_filter('type', 'Type', $types);

        $search = create_filter('search', 'Search');

        $filters = [$search, $filter_type, $filter_status, $filter_status2, $filter_require_coach];
        return format_response($requestedEvents, $total, $filters);
    }

    /**
    * View the event with $event_id
    *
    * @param int $request_id
    * @return json
    */
    public function get_event_request($request_id){
        $event_request = DB::table('event_requests')
                        ->select(
                            'event_requests.request_id',
                            'event_requests.created_by',
                            'event_requests.status',
                            'programme_type.type_id AS event_type_id',
                            'programme_type.title AS event_type',
                            'event_requests.start_time',
                            'event_requests.end_time',
                            'event_requests.max_size',
                            'event_requests.is_coach_required',
                            'event_requests.coach_id',
                            'event_requests.venue',
                            'event_requests.notes',
                            'user.user_id',
                            'user.display_name AS user_name',
                            'user.telephone AS user_telephone',
                            'user.email AS user_email'
                        )
                        ->leftJoin('programme_type', 'programme_type.type_id', '=', 'event_requests.type_id')
                        ->leftJoin('user', 'user.user_id', '=', 'event_requests.created_by')
                        ->where('event_requests.request_id', $request_id)
                        ->first();
        //do not allow guardians to access other guardians event requests
        if( Auth::user()->hasRole('guardian') && $this->user_id != $event_request->created_by ) {
            return response()->json(get_denied_message(), 403);
        }
        return response()->json($event_request, 200);
    }

    /**
    * Create a new event request
    *
    * @return json
    */
    public function create_event_request(){

        $this->validate($this->request, [
            'event_type_id' => 'required|integer',
            'start_time' => 'required|date_format:Y-m-d H:i:s|after:today',
            'end_time' => 'date_format:Y-m-d H:i:s|after:start_time',
            'max_size' => 'integer|min:0',
            'is_coach_required' => 'integer|min:0|max:1',
            'venue' => 'required|int|min:1',
            'notes' => 'string',
        ]);

        $event_request = new EventRequest;
        $event_request->type_id = $this->request['event_type_id'];
        $event_request->club_id = $this->club_id;
        $event_request->start_time = $this->request['start_time'];
        $event_request->end_time = $this->request['end_time'];
        $event_request->max_size = $this->request['max_size'];
        $event_request->is_coach_required = $this->request['is_coach_required'];
        $event_request->venue = $this->request['venue'];
        $event_request->notes = $this->request['notes'];
        $event_request->created_by = $this->user_id;
        $event_request->updated_by = $this->user_id;
        $event_request->save();

        //create the notification for admins
        $admins = User::select('user_id')
            ->where('user_role', gr_get_role_id('admin'))
            ->get()
            ->pluck('user_id');

        foreach($admins as $admin_id){
            NotificationController::create('event-request', NULL, $event_request->request_id, $admin_id, NULL);
        }

        return response()->json($event_request, 200);
    }

    /**
    * Edit the event with $event_id
    *
    * @param int $event_id
    * @return json
    */
    function update_event_request($event_id) {
        $this->validate($this->request, [
            'event_type_id' => 'required|integer',
            'start_time' => 'required|date_format:Y-m-d H:i:s|after:today',
            'end_time' => 'date_format:Y-m-d H:i:s|after:start_time',
            'max_size' => 'integer|min:0',
            'is_coach_required' => 'integer|min:0|max:1',
            'venue' => 'required|int|min:1',
            'notes' => 'string',
        ]);

        $event_request = EventRequest::find($event_id);
        //do not allow guardians to edit other guardians event requests
        if($event_request->created_by != $this->user_id){
            // If auth user is admin then allow admin to update user data
            if($this->role != 'admin'){
                return response()->json(get_denied_message(), 403);
            }
        }

        $event_request->type_id = $this->request['event_type_id'];
        $event_request->start_time = $this->request['start_time'];
        $event_request->end_time = $this->request['end_time'];
        $event_request->max_size = $this->request['max_size'];
        $this->request->has('is_coach_required') ? $event_request->is_coach_required = $this->request['is_coach_required'] : null;
        $this->request->has('coach_id') ? $event_request->coach_id = $this->request->coach_id : null;
        $event_request->venue = $this->request['venue'];
        $event_request->notes = $this->request['notes'];
        $event_request->updated_by = $this->user_id;
        $event_request->save();

        return response()->json($event_request, 200);
    }

    /**
    * Accept or reject an event request
    *
    * @param int $event_id
    * @return json
    */
    function accept_reject_event($event_id){
        $this->validate($this->request, [
            'status' => 'required|integer|min:1|max:2'
        ]);

        // if user is admin then update status.
        if($this->role != 'admin'){
            return response()->json("Usser must ba an admin to change status.");
        }

        $event_request = EventRequest::find($event_id);
        $event_request->status = $this->request['status'];
        $this->request->has('coach_id') ? $event_request->coach_id = $this->request->coach_id : null;
        $event_request->updated_by = $this->user_id;
        $event_request->save();

        NotificationController::create('request-rejected', NULL, $event_request->request_id, $event_request->created_by, NULL);
        return response()->json('Event updated', 200);
    }

    /**
    * Delete the event with $event_id
    *
    * @param int $event_id
    * @return json
    */
    function delete_event_request($event_id) {
        $event_request = EventRequest::find($event_id);
        //do not allow guardians to delete other guardians event requests
        if( Auth::user()->hasRole('guardian') && $this->user_id != $event_request->created_by ) {
            return response()->json(get_denied_message(), 403);
        }
        $event_request->delete();
        return response()->json('Event Request Successfully Deleted', 200);
    }
}
