<?php

namespace App\Http\Controllers;

use App\GoCardLess;
use App\Invoice;
use App\InvoiceLine;
use App\RelClubPackage;
use App\Transaction;
use App\TransactionLine;
use Carbon\Carbon;
use Carbon\Laravel\ServiceProvider;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class GoCardlessController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @return array
     * @throws \GoCardlessPro\Core\Exception\InvalidStateException
     */
    public function createGoCardLessCustomer()
    {

        $client = getCardlessClient();
        $sessionToken = getRandomSessionId();
        $firstName = $this->request->has('first_name') ? $this->request->first_name : '';
        $lastName = $this->request->has('last_name') ? $this->request->last_name : '';
        $organisation = $this->request->has('organisation_name') ? $this->request->organisation_name : '';
        $email = $this->request->has('email') ? $this->request->email : '';
        $address = $this->request->has('address') ? $this->request->address : '';
        $city = $this->request->has('town') ? $this->request->town : '';
        $postcode = $this->request->has('postcode') ? $this->request->postcode : '';

        // Create customer
        $redirectFlow = $client->redirectFlows()->create([
            "params" => [
                // This will be shown on the payment pages
                "description" => $organisation,
                // Not the access token
                "session_token" => $sessionToken,
                "success_redirect_url" => "http://api2.grassroots.hostings.co.uk/v1/gocardless/customer/verify",
                // Optionally, prefill customer details on the payment page
                "prefilled_customer" => [
                    "given_name" => $firstName,
                    "family_name" => $lastName,
                    "email" => $email,
                    "address_line1" => $address,
                    "city" => $city,
                    "postal_code" => $postcode
                ]
            ]
        ]);

        // Send email to customer to complete there verification.
        Mail::send('emails.gocardless.varification',
            ['data' => ['url' => $redirectFlow->redirect_url]],
            function ($message) use ($email) {
                $message->to($email, 'New customer setup')
                    ->subject('New customer setup');

                $message->from(env('MAIL_FROM_ADDRESS'));
            });

        $goCardlessInfo = [
            'id' => $redirectFlow->id,
            'session_token' => $sessionToken,
            'redirect_url' => $redirectFlow->redirect_url
        ];

        return $goCardlessInfo;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Laravel\Lumen\Http\Redirector
     * @throws \GoCardlessPro\Core\Exception\InvalidStateException
     */
    public function verifyCustomer(Request $request)
    {
        $client = getCardlessClient();

        $customerId = $request->redirect_flow_id;
        $goCardLess = GoCardLess::where('cardless_id', $customerId)
            ->first();
        $goCardLess->customer_status = 1;
        $redirectFlow = $client->redirectFlows()->complete(
            $customerId, //The redirect flow ID from above.
            ["params" => ["session_token" => $goCardLess->session_token]]
        );

        $goCardLess->mandate = $redirectFlow->links->mandate;
        $goCardLess->customer = $redirectFlow->links->customer;
        $goCardLess->save();
        return redirect('http://grassroots.hostings.co.uk');
    }
}
