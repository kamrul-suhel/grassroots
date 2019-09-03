<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Availability;
use Auth;
use DB;

class AvailabilityController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|coach');
        $this->user_id = Auth::id();
    }

    /**
     * Get all availabilities
     *
     * @return json
     */
    public function get_availabilities()
    {

        //if auth user is admin we need coach id to be passed
        if (Auth::user()->hasRole('admin')) {

            // Check coach_id is set or not. if not then get all coach in this club
            if ($this->request->has('coach_id')) {
                $coachIds = [$this->request->coach_id];
            } else {
                // get club user first
                $clubUser = User::findOrFail($this->user_id);
                $coachIds = User::select('user_id')
                    ->where('club_id', $clubUser->club_id)
                    ->where('user_role', 2)// Only coaches
                    ->pluck('user_id');
            }
        } else if (Auth::user()->hasRole('coach')) {
            $coachIds = [$this->user_id];
        }

        $pagination = create_pagination();
        $availabilities = DB::table('availability')
            ->select(
                DB::raw('SQL_CALC_FOUND_ROWS availability.availability_id'),
                'availability.start_date',
                'availability.end_date',
                'availability.type AS type_id',
                'availability_type.title AS type'
            )
            ->leftJoin('availability_type', 'availability_type.type_id', '=', 'availability.type')
            ->whereIn('availability.user_id', $coachIds)
            ->where(function ($query) {
                if (isset($this->request['type']) && !empty($this->request['type'])) {
                    $query->where('availability.type', $this->request['type']);
                }
                return $query;
            })
            ->orderBy('availability.start_date', 'DESC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;

        $types = gr_get_availability_types();
        $filter_types = create_filter('type', 'Type', $types);

        $filters = [$filter_types];
        return format_response($availabilities, $count, $filters);
    }

    /**
     * Get availability with $availability_id
     *
     * @return json
     */
    public function get_availability($availability_id)
    {
        $availability = Availability::select(
            'availability_id',
            'start_date',
            'end_date',
            'type AS type_id'
        )
            ->where('availability_id', $availability_id)
            ->first();
        return response()->json($availability, 200);
    }

    /**
     * Create a new availability
     *
     * @return json
     */
    public function create_availability()
    {
        //if auth user is admin we need coach id to be passed
        if (Auth::user()->hasRole('admin')) {
            $this->validate($this->request, [
                'coach_id' => 'required|integer',
            ]);
            $coach_id = $this->request['coach_id'];
        } else {
            //coach id is the auth user
            $coach_id = $this->user_id;
        }
        $this->validate($this->request, [
            'start_date' => 'required|date_format:Y-m-d H:i:s|after:today',
            'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
            'type' => 'required|integer|min:1'
        ]);

        $availability = new Availability;
        $availability->start_date = $this->request['start_date'];
        $availability->end_date = $this->request['end_date'];
        $availability->type = $this->request['type'];
        $availability->user_id = $coach_id;
        $availability->save();

        return response()->json($availability, 200);
    }

    /**
     * Edit the availability with $availability_id
     *
     * @param int $availability_id
     * @return json
     */
    public function update_availability($availability_id)
    {
        $this->validate($this->request, [
            'start_date' => 'required|date_format:Y-m-d H:i:s',
            'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
            'type' => 'required|integer|min:1'
        ]);
        $availability = Availability::find($availability_id);
        $availability->start_date = $this->request['start_date'];
        $availability->end_date = $this->request['end_date'];
        $availability->type = $this->request['type'];

        //do not allow coaches to edit other coaches avaiabilities
        if (Auth::user()->hasRole('coach') && $this->user_id != $availability->user_id) {
            return response()->json(get_denied_message(), 403);
        }
        $availability->save();
        return response()->json($availability, 200);
    }

    /**
     * Delete the skill assessment with $grade_id
     *
     * @param int $availability_id
     * @return json
     */
    function delete_availability($availability_id)
    {
        $availability = Availability::find($availability_id);
        //do not allow coaches to delete other coaches avaiabilities
        if (Auth::user()->hasRole('coach') && $this->user_id != $availability->user_id) {
            return response()->json(get_denied_message(), 403);
        }
        $availability->delete();
        return response()->json('Availability Successfully Deleted', 200);
    }
}
