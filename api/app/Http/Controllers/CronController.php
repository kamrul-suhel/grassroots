<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\SubscriptionHistory;
use App\RelClubPackage;
use App\Club;
use Auth;
use DB;

class CronController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
     public function __construct(Request $request) {
         $this->request = $request;
     }

    /**
     * Renew all exipred subscriptions
     *
     * @return json
     */
    public function renew_subscription(){
        //get all expired subscriptions
        $subscriptions = RelClubPackage::where('expire_date', '<', date('Y-m-d'))->where('status', 1)->get();
        foreach($subscriptions as $subscription){
            //TODO try get payment
            $payment_success = true; // TODO hardcoded have to change it when payment is integrated
            if( $payment_success ){
              $subscription->start_date = Carbon::now()->toDateTimeString();
              $subscription->expire_date = Carbon::now()->addMonth()->toDateTimeString();
              $subscription->save();

              $history = new SubscriptionHistory;
              $history->package_id = $subscription->package_id;
              $history->club_id = $subscription->club_id;
              $history->start = $subscription->start_date;
              $history->end = $subscription->expire_date;
              $history->amount = $subscription->amount;
              $history->save();
            // payment failed so we need to deactivate the subscription
            } else {
              $subscription->status = 0;
              $subscription->save();
              //if a club is assigned to this package deactivate the club as well
              if( !empty($subscription->club_id) ){
                  $club = Club::find($subscription->club_id);
                  $club->status = 0;
                  $club->save();
              }
            }
        }
    }
}
