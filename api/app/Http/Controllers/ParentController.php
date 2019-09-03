<?php

namespace App\Http\Controllers;
use App\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Invoice;
use App\InvoiceLine;
use App\User;
use App\Page;
use Carbon\Carbon;
use Auth;
use DB;

class ParentController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth', ['except' => ['single']]);
        $this->middleware('role:superadmin|admin', ['except' => ['single']]);
        $this->user_id = Auth::id();
    }

    /**
     * Create a new page
     *
     * @return json
     */
    public function create()
    {

        return response()->json($this->request);
    }

    public function createStatement(){
        $this->validate($this->request, [
            'player_id' => 'exists:player',
            'user_id' => 'exists:user',
            'programme_id' => 'exists:programme',
            'amount' => 'required|numeric',
            'register_type' => 'required|in:fee,credit,receipt'
        ]);

        // Check what type of statement, is it club or parent, Default it will club
        $type = $this->request->has('type') ? $this->request->type : 'club'; // Default it will club

        $registerType = $this->request->register_type;
        $amount = $this->request->amount;

        // Get user
        $user = User::find($this->request->user_id);
        $clubId = $user->club_id;
        $franchiseId = $user->franchise_id;
        $programmeId = $this->request->has('programme_id') ? $this->request->programme_id : null;
        $playerId = $this->request->player_id;

        /*
         * Check register_type
         * if it is credit or fee then make invoice otherwise make transaction
         */
        if ($registerType === 'receipt') {
            // Make transaction
            $transaction = new Transaction();
            $transaction->franchise_id = $franchiseId;
            $transaction->programme_id = $programmeId;
            $transaction->player_id = $playerId;
            $transaction->club_id = $clubId;
            $transaction->type = $type;
            $transaction->register_type = $registerType;
            $transaction->user_id = $user->user_id;
            $transaction->date = $this->request->date;
            $this->request->has('description') ? $transaction->note = $this->request->description : null;
            $transaction->amount = $amount;
            $this->request->has('vat_rate') ? $transaction->vat_rate = $this->request->vat_rate : 0;
            $transaction->created_by = $this->user_id;
            $transaction->updated_by = $this->user_id;

            // Set gocardless_status value paid_out because it is manuel transaction
            $transaction->gocardless_status = 'paid_out';

            $transaction->save();

            return response()->json('Success');
        } else {

            // Convert amount - or + base on register_type
            $amount = $registerType === 'credit' ? -$amount : $amount;

            // Make invoice
            $invoice = new Invoice();
            $invoice->franchise_id = $franchiseId;
            $invoice->club_id = $clubId;
            $invoice->programme_id = $programmeId;
            $invoice->player_id = $playerId;
            $invoice->type = $type;
            $invoice->register_type = $this->request->register_type;
            $invoice->user_id = $user->user_id;
            $invoice->date = $this->request->date;
            $this->request->has('description') ? $invoice->description = $this->request->description : null;
            $invoice->amount = $amount;
            $this->request->has('vat_rate') ? $invoice->vat_rate = $this->request->vat_rate : 0;
            $invoice->created_by = $this->user_id;
            $invoice->updated_by = $this->user_id;
            $invoice->save();

            return response()->json('Success');
        }
    }


    public function updateStatement(){

    }
}
