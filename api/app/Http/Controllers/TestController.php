<?php
namespace App\Http\Controllers;
use App\Invoice;
use App\InvoiceLine;
use App\RelClubPackage;
use App\Transaction;
use App\TransactionLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use App\AgeGroup;
use App\Address;
use App\Session;
use Carbon\Carbon;
use App\RelKitUser;
use App\Club;
use App\Team;
use Auth;
use DB;
use Illuminate\Support\Facades\Storage;

class TestController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        //$this->middleware('auth');
    }


    public function get_players_filters() {

        //get all the clubs withing the franchise
        $franchise_id = 1;

        //get the clubs
        $clubs = Club::select('club_id', 'title')->where('franchise_id', $franchise_id)->get();
        foreach($clubs as $club){
            $clubs_array[$club->club_id] = $club->title;
        }
        $filter_clubs = array(
            'name' => array(
                'key' => 'club',
                'label' => 'Club'
            ),
            'type' => 'select',
            'options' => $clubs_array
        );

        //get the age groups
        $age_groups = AgeGroup::select('agegroup_id', 'title')->where('franchise_id', $franchise_id)->get();
        foreach($age_groups as $age_group){
            $arr[$age_group['title']][$age_group->agegroup_id] = $age_group->agegroup_id;
        }
        //set comma separated keys for ids with same title
        foreach($arr as $title=>$id){
            $keys = implode(',', $id);
            $age_groups_array[$keys] = $title;
        }

        $filter_age_groups = array(
            'name' => array(
                'key' => 'agegroup',
                'label' => 'Age Group'
            ),
            'type' => 'select',
            'options' => $age_groups_array
        );

        //get the teams
        $teams = Team::select('team_id', 'title')->where('franchise_id', $franchise_id)->get();
        foreach($teams as $team){
            $teams_array[$team->team_id] = $team->title;
        }
        $filter_teams = array(
            'name' => array(
                'key' => 'team',
                'label' => 'Teams'
            ),
            'type' => 'select',
            'options' => $teams_array
        );

        $filter_status = array(
            'name' => array(
                'key' => 'status',
                'label' => 'Status'
            ),
            'type' => 'select',
            'options' => array(
                "1" => 'Active',
                "0" => 'Inactive'
            )
        );

        $filters = array(
            $filter_clubs,
            $filter_age_groups,
            $filter_teams,
            $filter_status
        );

        return $filters;

    }

    public function send_email()
    {
        $test = Mail::send('emails.test', ['name' => 'Raul Brindus', 'link' => 'www.google.com'], function ($message) {
            $message->subject('HTML Email Sent from Grass Roots!');
            $message->from('support@xanda.net', 'Grass Roots');
            $message->to('raul01us@gmail.com');
        });
        return response()->json('email sent');
    }

    public function foo(){
        $threshold_date = '2018-10-10';
        //calculate the treshold dates
        $date = Carbon::parse($threshold_date);
        $today = Carbon::now();
        $date->year = $today->year;

        if( $today->gt($date) ) {
            $start_date = $date->toDateTimeString();
            $end_date = $today->toDateTimeString();
        } else {
            $start_date = $date->subYear()->toDateTimeString();
            $end_date = $today->toDateTimeString();
        }
        $result = array(
            'today' => $today->toDateTimeString(),
            'treshold_date' => $date->toDateTimeString(),
            'start_date' => $start_date,
            'end_date' => $end_date
        );
        return response()->json($result);
    }

    public function unique_players_in_programmes($guardian_id) {
        $children = gr_guardian_get_children($guardian_id);

        $programmes = DB::table('rel_programme_player')
            ->select('programme_id', 'player_id')
            ->whereIn('player_id', $children)
            ->where('player_id', '!=', 148)
            ->where('status', 1)
            ->groupBy('player_id')
            ->get();
        $count = count($programmes);

        return response()->json($count, 200);
    }

    public function update_lat_lng(){
        $addresses = Address::whereNull('lat')->limit(1024)->get();
        foreach($addresses as $address){
            $geodata =   json_decode(file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&key=AIzaSyAe9chRhAOJpIZlnzbN6zTjY5yNWewRmIQ&address='.urlencode($address->postcode)));
            if(!$geodata) {
              return reponse()->json("Invalid Postcode", 403);
            }
            // extract latitude and longitude
            $latitude  = $geodata->results[0]->geometry->location->lat;
            $longitude = $geodata->results[0]->geometry->location->lng;

            $add = Address::find($address->address_id);
            $add->lat = $latitude;
            $add->lng = $longitude;
            $add->save();
        }
        return response()->json("done", 200);

    }

    public function getPayment(){
        // Make payment
        $client = getCardlessClient();
        $payment = $client->payments()->get('PM000GX6KJ7YQ2');
        return response()->json($payment);
    }

    public function getPaymentTest(){
        // If anything go wrong it will rollback automatically
        DB::transaction(function () {
            // Get all franchise, who need to pay
            $customers = RelClubPackage::select(
                'rel_club_package.start_date',
                'rel_club_package.expire_date',
                'rel_club_package.id as rel_club_package_id',
                'rel_club_package.franchise_id',
                'rel_club_package.club_id',
                'franchise.franchise_id',
                'user.user_id',
                DB::raw('sum(rel_club_package.amount) as amount'),
                'franchise.title',
                'gocardless.mandate',
                'franchise.email'
            )
                ->leftJoin('franchise', 'franchise.franchise_id', '=', 'rel_club_package.franchise_id')
                ->leftJoin('user', 'franchise.franchise_id', '=', 'user.franchise_id')
                ->leftJoin('gocardless', 'franchise.franchise_id', '=', 'gocardless.franchise_id')
                ->whereNotNull('gocardless.mandate')
                ->whereBetween('rel_club_package.expire_date', [Carbon::now(), Carbon::now()->addDay(1)])
//                ->where('rel_club_package.status', 1) // uncomment if only want active package
                ->groupBy('franchise.franchise_id')
                ->where('user.user_role', 4) // Send invoice to super admin
                ->orderBy('franchise.franchise_id', 'desc')
                ->get();

            // Create a invoice in our database
            $customers->each(function ($customer) {
                // Create invoice
                $invoice = new Invoice();
                $invoice->franchise_id = $customer->franchise_id;
                $invoice->club_id = $customer->club_id;
                $invoice->user_id = $customer->user_id;
                $invoice->type = 'club'; // Every automate record for club
                $invoice->amount = $customer->amount;
                $invoice->description = $customer->title;
                $invoice->invoice_number = generateRandomString();
                $invoice->created_by = $customer->user_id;
                $invoice->updated_by = $customer->user_id;
                $invoice->save();

                // First find package in franchise
                $packages = RelClubPackage::select([
                    'rel_club_package.id',
                    'rel_club_package.club_id',
                    'rel_club_package.amount',
                    'rel_club_package.expire_date',
                    'franchise.title',
                    'package.id as package_id'
                ])
                    ->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id')
                    ->leftJoin('franchise', 'franchise.franchise_id', '=', 'rel_club_package.franchise_id')
                    ->leftJoin('gocardless', 'franchise.franchise_id', '=', 'gocardless.franchise_id')
                    ->whereNotNull('gocardless.mandate')
                    ->where([
                        'rel_club_package.franchise_id' => $customer->franchise_id,
//                        'rel_club_package.status' => 1  // Uncomment if only want active package
                    ])
                    ->whereBetween('rel_club_package.expire_date', [Carbon::now(), Carbon::now()->addDay(1)])
                    ->get();

                // Create invoice line
                $packages->each(function ($package) use ($invoice) {
                    $invoiceLine = new InvoiceLine();
                    $invoiceLine->invoice_id = $invoice->id;
                    $invoiceLine->package_id = $package->package_id;
                    $invoiceLine->club_id = $package->club_id;
                    $invoiceLine->title = $package->title;
                    $invoiceLine->amount = $package->amount;
                    $invoiceLine->save();

                    // Update expire date in rel_club_package table
                    $carbon = Carbon::parse($package->expire_date);
                    $package->expire_date = $carbon->addMonth(1);
                    $package->save();
                });

                // Make payment
                $client = getCardlessClient();
                $payment = $client->payments()->create([
                    "params" => [
                        "amount" => round(($customer->amount * 100), 2), // 10 GBP in pence
                        "currency" => "GBP",
                        "links" => [
                            "mandate" => $customer->mandate
                        ],
                        // Almost all resources in the API let you store custom metadata,
                        // which you can retrieve later
                        "metadata" => [
                            "invoice_number" => $invoice->invoice_number
                        ]
                    ],
                    "headers" => [
                        "Idempotency-Key" => $invoice->invoice_number
                    ]
                ]);

                // Create transaction
                $transaction = new Transaction();
                $transaction->franchise_id = $customer->franchise_id;
                $transaction->club_id = $customer->club_id;
                $transaction->account_id = 0; // TODO need to confirm where it is coming from
                $transaction->code_id = 0; // TODO need to change
                $transaction->user_id = $customer->user_id;
                $transaction->type = 'club'; // Automate record is for club
                $transaction->amount = $customer->amount;
                $transaction->note = "Direct debit";
                $transaction->gocardless_payment_id = $payment->id;
                $transaction->gocardless_status = $payment->status;
                $transaction->created_by = $customer->user_id;
                $transaction->updated_by = $customer->user_id;
                $transaction->save();

                // Create transaction line
                $packages->each(function ($package) use ($transaction) {
                    $transactionLine = new TransactionLine();
                    $transactionLine->transaction_id = $transaction->id;
                    $transactionLine->package_id = $package->package_id;
                    $transactionLine->club_id = $package->club_id;
                    $transactionLine->amount = $package->amount;
                    $transactionLine->save();
                });

//            Send confirmation email to customer
//            Mail::send('emails.gocardless.varification',
//                ['data' => ['url' => 'some url']],
//                function ($message) {
//                    $message->to('kamrul@xanda.net', 'Payment has been made')
//                        ->subject('New payment is made');
//
//                    $message->from(env('MAIL_FROM_ADDRESS'));
//                });
            });
        });
    }
}
