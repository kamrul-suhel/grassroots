<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Consent;
use Auth;
use DB;

class ConsentController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
     public function __construct(Request $request) {
         $this->request = $request;
         $this->middleware('auth');
         $this->middleware('role:admin|guardian', ['only' => ['get_consents', 'get_consent']]);
         $this->middleware('role:guardian', ['only' => ['accept_consent']]);
         $this->middleware('role:admin', ['only' => ['create_consent']]);
         $this->franchise_id = Auth::getPayload()->get('franchise_id');
         $this->club_id = Auth::getPayLoad()->get('club_id');
         $this->user_id = Auth::id();
     }

    /**
     * Get all the consents in a franchise.
     *
     * @return json
     */
    public function get_consents(){
        $pagination = create_pagination();
        $consents = Consent::select(
                DB::raw('SQL_CALC_FOUND_ROWS consent.consent_id'),
                'consent.title',
                'consent.content',
                'consent.created_at'
            )
            ->where('consent.franchise_id', $this->franchise_id)
            ->where('consent.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by team name
                if( isset($this->request['name']) && !empty($this->request['name']) ) {
                    $query->where('consent.title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->limit($pagination['per_page'])
            ->offset($pagination['offset']);

        //if auth user is guardian load only the consents assigned to him/her
        if( Auth::user()->hasRole('guardian') ){
            $consents->select(
                    DB::raw('SQL_CALC_FOUND_ROWS consent.consent_id'),
                    'consent.title',
                    'consent.content',
                    'consent.created_at',
                    'rel_consent_user.agreed_at'
                    )
                    ->leftJoin('rel_consent_user', 'rel_consent_user.consent_id', '=', 'consent.consent_id')
                    ->where('rel_consent_user.user_id', $this->user_id);
        }

        $consents = $consents->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;

        //for admin load the guardians that the consent was assigned to
        if( Auth::user()->hasRole('admin') ){
            $consents->load('guardians');
        }

        return format_response($consents, $count);
    }

    /**
     * Get the consent with $consent_id
     *
     * @param int $consent_id
     * @return json
     */
     public function get_consent($consent_id){
        if( Auth::user()->hasRole('admin') ){
            $consent = Consent::with('guardians')
                ->select(
                       'consent.consent_id',
                       'consent.title',
                       'consent.content',
                       'consent.created_at'
                   )
                   ->where('consent.franchise_id', $this->franchise_id)
                   ->where('consent.club_id', $this->club_id)
                   ->where('consent.consent_id', $consent_id)
                   ->first();
        } else {
            $consent = Consent::select(
                       'consent.consent_id',
                       'consent.title',
                       'consent.content',
                       'consent.created_at',
                       'rel_consent_user.agreed_at'
                   )
                   ->leftJoin('rel_consent_user', 'rel_consent_user.consent_id', '=', 'consent.consent_id')
                   ->where('rel_consent_user.user_id', $this->user_id)
                   ->where('consent.franchise_id', $this->franchise_id)
                   ->where('consent.club_id', $this->club_id)
                   ->where('consent.consent_id', $consent_id)
                   ->first();
        }
        return response()->json($consent, 200);
     }

     public function create_consent(){
         $this->validate($this->request, [
             'title' => 'required|string',
             'content' => 'required|string',
         ]);

         $consent = new Consent;
         $consent->franchise_id = $this->franchise_id;
         $consent->club_id = $this->club_id;
         $consent->title = $this->request['title'];
         $consent->content = $this->request['content'];
         $consent->created_by = $this->user_id;
         $consent->updated_by = $this->user_id;
         $consent->status = 1; //active by default
         $consent->save();

         return response()->json('Consent Created', 200);
     }

     public function accept_consent($consent_id){
         $accept = DB::table('rel_consent_user')
            ->where('consent_id', $consent_id)
            ->where('user_id', $this->user_id)
            ->update(['agreed_at' => DB::raw('NOW()')]);

        return response()->json('Consent Accepted', 200);
     }
}
