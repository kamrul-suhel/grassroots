<?php

namespace App\Http\Controllers;

use App\GoCardLessCharge;
use App\Invoice;
use App\InvoiceLine;
use App\RelClubPackage;
use App\Transaction;
use App\TransactionLine;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Mail;
use Ollywarren\LaravelGoCardless\Services\GoCardlessService;

class CronJobController extends Controller
{

    public function __construct()
    {
    }

    /**
     * Cron job for make payment
     */
    public function makePayment()
    {
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

    /**
     * Run as a cron job to change gocardless payment status
     */
    public function updateGoCardLessPaymentStatus()
    {

        $transactions = Transaction::select([
            'id',
            'gocardless_payment_id'
        ])->whereIn('gocardless_status', Transaction::getCardlessStatusForCron())
            ->get();

        $transactions->each(function ($transaction) {
            $client = getCardlessClient();
            $payment = $client->payments()->get($transaction->gocardless_payment_id);
            $transaction->gocardless_status = $payment->status;
            $transaction->save();

            // If status is paid_out, create gocardless_charge record
            if ($payment->status === 'paid_out') {
                $payOut = $client->payouts()->get($payment->links->payout);
                $totalCharge = $payOut->deducted_fees / 100;

                $charge = new GoCardLessCharge();
                $charge->transaction_id = $transaction->id;
                $charge->amount = $totalCharge;
                $charge->save();
            }

//        Send send thank you email to customer if status is paid_out
//        Mail::send('emails.gocardless.varification',
//            ['data' => ['url' => 'some url']],
//            function ($message) {
//                $message->to('kamrul@xanda.net', 'Status is changing')
//                    ->subject('New payment is made');
//
//                $message->from(env('MAIL_FROM_ADDRESS'));
//            });
        });
    }
}