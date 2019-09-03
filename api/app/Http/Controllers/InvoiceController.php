<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Invoice;
use App\InvoiceLine;
use App\User;
use Carbon\Carbon;
use Auth;
use DB;

class InvoiceController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|superadmin');
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
    * Create a invoice line
    *
    * @return json
    */
    public function create_invoice(){
        $this->validate($this->request, [
         'company' => 'required|string|in:fc,academy',
         'user_id' => 'required|int|exists:user',
         'programme_id' => 'int|min:1|exists:programme',
         'session_id' => 'int|min:1|exists:session',
         'player_id' => 'int|min:1|exists:player',
         'team_id' => 'int|min:1|exists:team',
         'date' => 'required|date_format:Y-m-d H:i:s',
         'description' => 'string|max:255',
         'vat_rate' => 'required|int|min:0|max:99',
         'lines' => 'required|array|min:1',
         'lines.*.title' => 'required|string|max:255',
         'lines.*.amount' => 'required|numeric'
        ]);


        $invoice = new Invoice;
        $invoice->franchise_id = $this->franchise_id;
        $invoice->club_id = $this->club_id;
        $invoice->company = $this->request['company'];
        $invoice->user_id = $this->request['user_id'];
        $invoice->programme_id = isset($this->request['programme_id']) ? $this->request['programme_id'] : NULL;
        $invoice->session_id = isset($this->request['session_id']) ? $this->request['session_id'] : NULL;
        $invoice->player_id = isset($this->request['player_id']) ? $this->request['player_id'] : NULL;
        $invoice->team_id = isset($this->request['team_id']) ? $this->request['team_id'] : NULL;
        $invoice->vat_rate = $this->request['vat_rate'];
        $invoice->date = $this->request['date'];
        $invoice->description = $this->request['description'];
        $invoice->created_by = $this->user_id;
        $invoice->updated_by = $this->user_id;
        $invoice->save();

        $invoice_total = 0;
        foreach($this->request['lines'] as $line){
            $inv_line = new InvoiceLine;
            $inv_line->invoice_id = $invoice->id;
            $inv_line->title = $line['title'];
            $inv_line->amount = $line['amount'];
            $inv_line->save();
            $invoice_total += $line['amount'];
        }
        $invoice->amount = $invoice_total;
        $invoice->save();

        //check if club reach threshold and send email
        $threshold = gr_get_club_threshold($this->club_id);
        if( !empty($threshold) && !empty($threshold->date) ){
            //calculate the treshold dates
            $date = Carbon::parse($threshold->date);
            $today = Carbon::now();
            $date->year = $today->year;

            if( $today->gt($date) ) {
                $start_date = $date->toDateTimeString();
                $end_date = $today->toDateTimeString();
            } else {
                $start_date = $date->subYear()->toDateTimeString();
                $end_date = $today->toDateTimeString();
            }

            $total_invoiced = gr_get_club_total_invoiced($this->club_id, $start_date, $end_date);
            if( $total_invoiced >= $threshold->total ){
                $admins = User::select('email', 'display_name')
                    ->where('user_role', gr_get_role_id('admin'))
                    ->where('club_id', $this->club_id)
                    ->get();

                foreach($admins as $admin){
                    Mail::send('emails.threshold-reached', ['name' => $admin->display_name], function ($message) use ($admin) {
                        $message->subject('Threshold Reached');
                        $message->to("raul01us@gmail.com"); //hardcoded to be changed to $admin->email after mailgun live
                    });
                }
            }
        }
        return response()->json($invoice, 200);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id){

        $invoice = Invoice::findOrFail($id);
        $this->request->has('amount') ? $invoice->amount = $this->request->amount : null;
        $this->request->has('register_type') ? $invoice->register_type = $this->request->register_type : null;
        $this->request->has('date') ? $invoice->date = $this->request->date : null;
        $this->request->has('entity_type') ? $invoice->company = $this->request->entity_type : null;
        $this->request->has('club_id') ? $invoice->club_id = $this->request->club_id : null;
        $this->request->has('description') ? $invoice->description = $this->request->description : null;
        $invoice->save();
        return response()->json($invoice);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function list() {
        $invoices = Invoice::select(
                DB::raw('SQL_CALC_FOUND_ROWS invoice.id'),
                'invoice.*',
                'user.display_name AS party_name'
            )
            ->leftJoin('user', 'user.user_id', '=', 'invoice.user_id')
            ->where('invoice.franchise_id', $this->franchise_id)
            ->where('invoice.club_id', $this->club_id)
            ->where(function($query){
                if( isset($this->request['start_date']) && !empty($this->request['start_date']) ){
                    $query->where('invoice.date', '>=', $this->request['start_date']);
                }

                if( isset($this->request['end_date']) && !empty($this->request['end_date']) ){
                    $query->where('invoice.date', '<=', $this->request['end_date']);
                }

                if( isset($this->request['search']) && !empty($this->request['search']) ){
                    $query->where('user.first_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('user.last_name', 'like', '%' . $this->request['search'] . '%');
                }

                return $query;

            })
            ->orderBy('invoice.date', 'DESC')
            ->get();

        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        $invoices->load('lines');
        return format_response($invoices, $count);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function single($id) {
        $invoice = Invoice::find($id);
        $invoice->load('lines');
        return response()->json($invoice);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function delete($id) {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json('success');
    }
}
