<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Tymon\JWTAuth\JWTAuth;
use App\Player;
use App\Team;
use App\User;
use Auth;

class ExportController extends Controller {
    protected $jwt;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request, JWTAuth $jwt) {
        $this->request = $request;
        // $this->jwt = $jwt;
        $payloadArray = $jwt->manager()->getJWTProvider()->decode($request['token']);
        // $this->middleware('auth');
        // $this->middleware('role:admin', ['only' => ['create_download', 'update_download', 'delete_download']]);
        // $this->user_id = Auth::id();
        $this->franchise_id = $payloadArray['franchise_id'];
        $this->club_id = $payloadArray['club_id'];
    }

    /**
    * Export all players in a club to CSV.
    *
    * @return csv
    */
    public function export_players() {
     $players = Player::select(
                     'player.display_name',
                     'player.gender',
                     'player.birthday',
                     'player.medical_conditions',
                     'user.display_name AS billing',
                     'U.display_name AS living'
                     )
                     ->leftJoin('rel_player_guardian','rel_player_guardian.player_id', '=', 'player.player_id')
                     ->leftJoin('user', 'user.user_id', '=', 'player.billing_guardian')
                     ->leftJoin('user AS U', 'U.user_id', '=', 'player.living_guardian')
                     ->where('player.franchise_id', $this->franchise_id)
                     ->where('player.club_id', $this->club_id)
                     ->orderBy('player.display_name')
                     ->get()->toArray();
     $header = 'Player Name, Gender, Date of birth, Medical Conditions, Billing Guardian, Living Guardian';
     $csv = gr_generate_csv($players, $header);
     $filename = 'PlayersExport_'. date('U');
     header("Content-type: text/csv");
     header('Content-Disposition: attachment; filename="'.$filename.'.csv"');
     return response()->make($csv, 200);
    }

    /**
    * Export all teams in a club to CSV.
    *
    * @return csv
    */
    public function export_teams() {
    $teams = Team::select(
             'team.title',
             'team.type',
             'agegroup.title AS agegroup'
         )
         ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
         ->where('team.franchise_id', $this->franchise_id)
         ->where('team.club_id', $this->club_id)
         ->get()->toArray();
    $header = 'Team Name, Team Type, Age Group';
    $csv = gr_generate_csv($teams, $header);
    $filename = 'TeamsExport_'. date('U');
    header("Content-type: text/csv");
    header('Content-Disposition: attachment; filename="'.$filename.'.csv"');
    return response()->make($csv, 200);
    }

    /**
    * Export all guardians in a club to CSV.
    *
    * @return csv
    */
    public function export_guardians(){
        $guardians = User::select(
                'display_name',
                'mobile',
                'telephone',
                'address',
                'town',
                'postcode'
            )
            ->where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->get()->toArray();
        $header = 'Name, Mobile, Telephone, Address, Town, Post Code';
        $csv = gr_generate_csv($guardians, $header);
        $filename = 'GuardiansExport_'. date('U');
        header("Content-type: text/csv");
        header('Content-Disposition: attachment; filename="'.$filename.'.csv"');
        return response()->make($csv, 200);
    }
}
