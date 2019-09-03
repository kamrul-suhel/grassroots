<?php

namespace App\Http\Controllers;

use App\Account;
use App\InvoiceLine;
use App\RelClubPackage;
use App\TransactionCode;
use App\TransactionLine;
use App\TransactionType;
use Illuminate\Http\Request;
use App\Transaction;
use Carbon\Carbon;
use App\Invoice;
use App\User;
use Auth;
use DB;

class StatementController extends Controller
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
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayload()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createStatement()
    {
        $this->validate($this->request, [
            'franchise_id' => 'exists:franchise',
            'amount' => 'required',
            'register_type' => 'required',
            'date' => 'required',
            'type' => 'sometimes|in:club,coach,parent',
            'user_id' => 'sometimes|exists:user'
        ]);

        // Check what type of statement is it club or parent, Default it will club
        $type = $this->request->has('type') ? $this->request->type : 'club'; // Default it will club

        $clubId = null;
        // get CLub id
        if($this->request->has('club_id')){
             if($this->request->club_id === 'na'){
                 $clubId = 0;
             }else{
                 $clubId = $this->request->club_id;
             }
        }

        $franchiseId = $this->request->has('franchise_id') ? $this->request->franchise_id : 0;

        $registerType = $this->request->register_type;
        $amount = $this->request->amount;

        // base on user_id, get club_id & franchise_id for this user
        if ($this->request->has('user_id')) {
            $user = User::find($this->request->user_id);
            $clubId = $user->club_id;
            $franchiseId = $user->franchise_id;
        } else {
            $user = User::where([
                'franchise_id' => $this->request->franchise_id,
                'user_role' => 4
            ])
                ->first();
        }

        /*
         * Check register_type first
         * if it is credit or fee then create invoice otherwise create transaction
         */
        if ($registerType === 'receipt') {
            // Make transaction
            $transaction = new Transaction();
            $transaction->franchise_id = $franchiseId;
            $transaction->club_id = $clubId;
            $transaction->type = $type;
            $transaction->register_type = $registerType;
            $transaction->user_id = $user->user_id;
            $transaction->date = $this->request->date;
            $this->request->has('description') ? $transaction->note = $this->request->description : null;
            $transaction->amount = $amount;
                $this->request->has('status') ? $transaction->status = $this->request->status : null;
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
            $invoice->type = $type;
            $this->request->has('status') ? $invoice->status = $this->request->status : null;
            $invoice->register_type = $registerType;
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

    public function updateStatement()
    {

    }


    /**
     * Get the statement for an user.
     *
     * @return json
     */
    public function get_statement()
    {
        $this->validate($this->request, [
            'date' => 'date_format:Y-m'
        ]);

        // Statement/ Transaction type
        $type = $this->request->has('statement_type') ? $this->request->statement_type : 'club';
        $userId = $this->user_id;
        $clubId = $this->club_id;
        $franchiseId = $this->franchise_id;

        if (Auth::user()->hasRole('admin')) {
            $this->validate($this->request, [
                'user_id' => 'required|int|min:1'
            ]);
            $userId = $this->request->has('user_id') ? $this->request['user_id'] : $this->user_id;
            // Get user franchise id & club_id
            $user = User::findOrFail($userId);
            $clubId = $user->club_id;
            $franchiseId = $user->franchise_id;
        }

        //set the month for the statement
        if (isset($this->request['date']) && !empty($this->request['date'])) {
            $date = Carbon::parse($this->request['date']);
        } else {
            $date = Carbon::parse(date('Y-m'));
        }

        $date_start = $date->startOfMonth()->toDateTimeString();
        $date_end = $date->endOfMonth()->toDateTimeString();

        //make sure is an admin or auth user
        if (Auth::user()->hasRole('admin') || $userId == $this->user_id) {
            //get the invoices
            $invoices = Invoice::select(
                DB::raw('CONCAT("I_", invoice.id) AS _id'),
                'invoice.id',
                'invoice.session_id',
                'invoice.status',
                'invoice.id as invoice_id',
                'invoice.register_type',
                'invoice.date',
                'invoice.amount',
                'invoice.description'
            )->with('lines');

            if ($type === 'coach') {
                $invoices = $invoices->addSelect('rel_coach_session.status as is_attended')
                    ->leftJoin('rel_coach_session', 'invoice.session_id', '=', 'rel_coach_session.session_id');
            }

            $invoices = $invoices
                ->where('invoice.type', $type)
                ->where('invoice.franchise_id', $franchiseId)
                ->where('invoice.club_id', $clubId)
                ->where('invoice.user_id', $userId)
                ->where('invoice.date', '<=', date('Y-m-d 23:59:59'))
                ->where(function ($query) use ($date_start, $date_end) {
                    if (isset($this->request['date']) && !empty($this->request['date'])) {
                        $query->where('invoice.date', '>=', $date_start)
                            ->where('invoice.date', '<=', $date_end);
                        return $query;
                    }
                })
                ->orderBy('invoice.date', 'DESC')
                ->get();

            $totalInvoiced = $invoices->sum('amount');
            $invoices = collect($invoices);

            //get the payments
            $payments = Transaction::select(
                DB::raw('CONCAT("T_", transaction.id) AS _id'),
                'transaction.date',
                'transaction.id as transaction_id',
                'transaction.register_type',
                'transaction.note as note',
                DB::raw('ABS(transaction.amount) AS amount'),
                'transaction_type.title AS type',
                'transaction.code_id',
                'transaction.status',
                'transaction_code.code AS transaction_code',
                'transaction_code.title AS description'
            )
                ->leftJoin('transaction_type', 'transaction_type.id', '=', 'transaction.type_id')
                ->leftJoin('transaction_code', 'transaction_code.id', '=', 'transaction.code_id')
                ->where('transaction.franchise_id', $franchiseId)
                ->where('transaction.type', $type)
                ->where('transaction.club_id', $clubId)
                ->where('transaction.user_id', $userId)
                ->where('transaction.date', '<=', date('Y-m-d'))
                ->where(function ($query) use ($date_start, $date_end) {
                    if (isset($this->request['date']) && !empty($this->request['date'])) {
                        $query->where('transaction.date', '>=', $date_start)
                            ->where('transaction.date', '<=', $date_end);
                        return $query;
                    }
                })
                ->orderBy('transaction.date', 'DESC')
                ->get();
            $totalPaid = $payments->sum('amount');
            $payments = collect($payments);
            $count = $payments->count() + $invoices->count();
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $per_page = isset($_GET['perpage']) ? (int)$_GET['perpage'] : 20;
            $statement = $invoices->merge($payments)
                ->sortByDesc('date')
                ->values()
                ->forPage($page, $per_page);

            $balance = $totalInvoiced - $totalPaid;
            $misc = array(
                'balance' => $balance,
                'total_invoiced' => $totalInvoiced,
                'total_paid' => $totalPaid,
                'per_page' => $this->perPage
            );
            return format_response($statement, $count, false, $misc);
        }

        return response()->json(get_denied_message(), 403);
    }


    /**
     * Get the statement for an user.
     *
     * @return json
     */
    public function getStatementByFranchiseId($franchiseId)
    {

        $userRole = Auth::getPayload()->get('role');

        // Statement type
        $type = $this->request->has('stmt_type') ? $this->request->stmt_type : 'club';

        // Get total fee for franchise
        $packageFee = RelClubPackage::select(
            'amount'
        )->where('rel_club_package.franchise_id', $franchiseId)
            ->get()
            ->sum('amount');

        //make sure is an admin or auth user
        //get the invoices
        $invoices = Invoice::select(
            DB::raw('CONCAT("I_", invoice.id) AS _id'),
            'invoice.id as invoice_id',
            'invoice.id',
            'invoice.date',
            'invoice.amount',
            'invoice.description',
            'invoice.register_type',
            'club.title as club_title',
            'franchise.title as franchise_title',
            'rel_club_package.package_id',
            'package.title as package_title'
        )
            ->with('lines')
            ->leftJoin('club', 'club.club_id', '=', 'invoice.club_id')
            ->leftJoin('rel_club_package', 'rel_club_package.franchise_id', '=', 'invoice.franchise_id')
            ->leftJoin('franchise', 'franchise.franchise_id', '=', 'invoice.franchise_id')
            ->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id');

        // Check auth user role, if admin the add only this club
        if($userRole === 'admin'){
            $invoices = $invoices->where('invoice.club_id', $this->club_id);
        }

        $invoices = $invoices->where('invoice.type', $type)
            ->where('invoice.franchise_id', $franchiseId)
            ->groupBy('invoice.id')
            ->orderBy('invoice.date', 'DESC')
            ->get();

        $totalCredit = Invoice::select('amount')
            ->where('franchise_id', $franchiseId)
            ->where('type', $type)
            ->get()
            ->sum('amount');

        $otherFee = Invoice::select('amount')
            ->where('franchise_id', $franchiseId)
            ->where('type', $type)
            ->get()
            ->sum();

        $totalInvoiced = $invoices->sum('amount');
        $invoices = collect($invoices);

        //get the payments
        $payments = Transaction::select(
            'transaction.id as _id',
            'transaction.id',
            'transaction.id as transaction_id',
            'transaction.amount',
            'transaction.note as description',
            'transaction.date',
            'transaction.gocardless_payment_id as payment_id',
            'transaction.register_type',
            'club.title as club_title',
            'franchise.title as franchise_title',
            'rel_club_package.package_id'
        )
            ->with(['lines', 'charge'])
            ->leftJoin('club', 'club.club_id', '=', 'transaction.club_id')
            ->leftJoin('franchise', 'franchise.franchise_id', '=', 'transaction.franchise_id')
            ->leftJoin('rel_club_package', 'rel_club_package.franchise_id', '=', 'transaction.franchise_id');

        // If auth user is admin then show only this club.
        if($userRole === 'admin'){
            $payments = $payments->where('transaction.club_id', $this->club_id);
        }

        $payments = $payments->where('transaction.franchise_id', $franchiseId)
            ->where('transaction.type', $type)
            ->where('transaction.gocardless_status', 'paid_out')// Only paid need to show
            ->groupBy('transaction.id')
            ->orderBy('transaction.date', 'DESC')
            ->get();

        $totalPaid = $payments->sum('amount');
        // Calculate total charge
        $cardlessCharge = $payments->pluck('charge')
            ->sum('amount');

        $payments = collect($payments);
        $count = $payments->count() + $invoices->count();
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $per_page = isset($_GET['perpage']) ? (int)$_GET['perpage'] : 20;
        $statement = $invoices->merge($payments)
            ->sortByDesc('date')
            ->values()
            ->forPage($page, $per_page);

        $balance = $totalInvoiced - $totalPaid;
        $misc = array(
            'balance' => $balance,
            'total_invoiced' => $totalInvoiced,
            'total_paid' => $totalPaid,
            'charge' => $cardlessCharge,
            'package_fee' => $packageFee,
            'total_credit' => $totalCredit,
            'other_fee' => $otherFee
        );
        return format_response($statement, $count, false, $misc);
    }


    /**
     * Only club statement will return.
     *
     */
    public function getStatementForClub(){
        $userId = $this->user_id;
        $clubId = $this->club_id;

        // Get all invoice line for login user
       $invoices = InvoiceLine::select(
           'invoice_line.id',
           'invoice_line.title',
           'invoice_line.amount',
           'invoice_line.club_id',
           'invoice.type',
           'invoice.date'
       )
           ->leftJoin('invoice', 'invoice_line.invoice_id', '=', 'invoice.id')
           ->where('invoice_line.club_id', $clubId)
           ->where('invoice.type', 'club')
           ->get();

       $totalInvoice = $invoices->sum('amount');

       // get all transaction from login user.
       $transactions = TransactionLine::select(
           'transaction_line.id',
           'transaction_line.club_id',
           'transaction_line.amount',
           'transaction_line.transaction_id',
           'transaction.type',
           'transaction.date',
           'transaction.note as title'
       )->leftJoin('transaction', 'transaction_line.transaction_id', '=', 'transaction.id')
           ->where('transaction_line.club_id', $clubId)
           ->where('transaction.type', 'club')
           ->get();

       $totalTransaction = $transactions->sum('amount');
       $collections = $transactions->merge($invoices);

       $total = $collections->count();
        $misc = array(
            'balance' => $totalTransaction + $totalInvoice,
            'total' => $totalTransaction
        );
        return format_response($collections, $total, false, $misc);
    }

    /**
     * Get all users with balance.
     *
     * @return void
     */
    public function get_statements()
    {
        $this->validate($this->request, [
            'role' => 'required|string|in:coach,guardian',
            'statement_type' => 'string|in:parent,club'
        ]);

        $pagination = create_pagination();
        $users = User::select(
            DB::raw('SQL_CALC_FOUND_ROWS user.user_id'),
            DB::raw('(SELECT SUM(invoice.amount) FROM invoice WHERE invoice.user_id = user.user_id) AS invoiced'),
            DB::raw('(SELECT SUM(ABS(transaction.amount)) FROM transaction WHERE transaction.user_id = user.user_id) AS paid'),
            'user.display_name',
            'user.email'
        )
            ->where('user.user_role', gr_get_role_id($this->request['role']))
            ->orderBy('user.display_name')
            ->groupBy('user.user_id')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        $search = create_filter('search', 'Search');
        $filters = [$search];

        return format_response($users, $count, $filters);
    }
}
