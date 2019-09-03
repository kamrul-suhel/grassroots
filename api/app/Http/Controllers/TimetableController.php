<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Session;
use App\Team;
use Auth;
use DB;

class TimetableController extends Controller {
    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:guardian');
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
    * Get all the sessions for a guardian
    *
    * @return json
    */
    public function get_timetable(){
        $pagination = create_pagination();
        $children = gr_guardian_get_children($this->user_id);
        $sessions = Session::select(
            DB::raw('SQL_CALC_FOUND_ROWS session.session_id'),
            'rel_player_session.id',
            'programme.programme_id',
            'programme.title AS programme_name',
            'programme_type.title AS programme_type',
            'session.start_time',
            'session.end_time',
            'session.venue_id',
            'address_book.title AS address',
            'session.coach_id',
            'session.price',
            'match.kickoff_time',
            'match.referee',
            'match.oposition',
            'match.notes',
            'rel_player_session.is_trial',
            'player.player_id',
            'player.display_name'
            )
            ->leftJoin('programme', 'programme.programme_id','=', 'session.programme_id')
            ->leftJoin('programme_type', 'programme_type.type_id','=', 'programme.type_id')
            ->leftJoin('rel_player_session', 'rel_player_session.session_id', '=', 'session.session_id')
            ->leftJoin('player', 'player.player_id', '=', 'rel_player_session.player_id')
            ->leftJoin('rel_player_guardian', 'rel_player_guardian.player_id', '=', 'rel_player_session.player_id')
            ->leftJoin('match', 'match.session_id', '=', 'session.session_id')
            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
            ->where('programme.franchise_id', $this->franchise_id)
            ->where('rel_player_guardian.guardian_id', $this->user_id)
            ->where('session.start_time', '>=', date('Y-m-d'))
            ->whereIn('rel_player_session.player_id', $children)
            ->where('rel_player_session.attendance_completed', 0)
            ->where('rel_player_session.status', 1)//only accepted
            ->orderBy('session.start_time', 'ASC')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        return format_response($sessions, $count);
    }
}
