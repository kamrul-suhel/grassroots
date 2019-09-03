<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Transaction;
use App\User;
use Auth;
use DB;

class TransactionController extends Controller {
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
     * Get all transaction from a club.
     *
     * @return json
     */
    public function get_transactions() {
        $this->validate($this->request, [
            'account_id' => 'required|int|exists:account,id'
        ]);
        $pagination = create_pagination();
        $transactions = Transaction::select(
                DB::raw('SQL_CALC_FOUND_ROWS transaction.id'),
                'transaction.account_id',
                'account.title AS account',
                'transaction.type_id',
                'transaction.user_id',
                'user.display_name AS party',
                'transaction.code_id',
                'transaction_code.title as code',
                'transaction.date',
                'transaction.amount',
                'transaction.vat_rate',
                'transaction.note'
            )
            ->leftJoin('account', 'account.id', '=', 'transaction.account_id')
            ->leftJoin('transaction_type', 'transaction_type.id', '=', 'transaction.type_id')
            ->leftJoin('user', 'user.user_id', '=', 'transaction.user_id')
            ->leftJoin('transaction_code', 'transaction_code.id', '=', 'transaction.code_id')
            ->where('transaction.franchise_id', $this->franchise_id)
            ->where('transaction.club_id', $this->club_id)
            ->where('transaction.account_id', $this->request['account_id'])
            ->where(function($query) {
                if( isset($this->request['start_date']) && !empty($this->request['start_date']) ) {
                    $query->where('transaction.date', '>=', $this->request['start_date']);
                }
                if( isset($this->request['end_date']) && !empty($this->request['end_date']) ) {
                    $query->where('transaction.date', '<=', $this->request['end_date']);
                }
                if( isset($this->request['code_id']) && !empty($this->request['code_id']) ) {
                    $query->where('transaction.code_id', '=', $this->request['code_id']);
                }
                return $query;
            })
            ->orderBy('transaction.date')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $count = reset($requestsCount)->count;
        $balance = $transactions->sum('amount');
        $misc = array('balance' => $balance,);
        return format_response($transactions, $count, NULL, $misc);
    }

    /**
     * Get the transaction with $id
     *
     * @param int $todo_id
     * @return json
     */
     public function get_transaction($id) {

         if($this->request->has('type') && $this->request->type === 'single'){
            $transaction = Transaction::findOrFail($id);
            return response()->json($transaction);
         }

         $transaction = Transaction::where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->where('id', $id)
            ->first();
         return response()->json($transaction, 200);
     }

    /**
    * Create a new transaction
    *
    * @return json
    */
    public function create_transaction(){
        $this->validate($this->request, [
         'account_id' => 'required|int|min:1',
         'type_id'    => 'required|int|min:1',
         'user_id'    => 'required|int|min:1',
         'code_id'    => 'int|min:1',
         'date'       => 'required|date_format:Y-m-d H:i:s',
         'amount'     => 'required|int',
         'vat_rate'   => 'required|int|min:0|max:99',
         'note'       => 'string|max:255'
        ]);
        //if payment is registered for a coach then save the amount with -
        $user = User::find($this->request['user_id']);
        $amount = $this->request['amount'];
        if( $user->hasRole('coach') ){
            $amount = -1 * $this->request['amount'];
        }
        $transaction = new Transaction;
        $transaction->franchise_id = $this->franchise_id;
        $transaction->club_id = $this->club_id;
        $transaction->account_id = $this->request['account_id'];
        $transaction->type_id = $this->request['type_id'];
        $transaction->user_id = $this->request['user_id'];
        $transaction->code_id = isset($this->request['code_id']) ? $this->request['code_id'] : 0;
        $transaction->date = $this->request['date'];
        $transaction->amount = $amount;
        $transaction->vat_rate = $this->request['vat_rate'];
        if( isset($this->request['note']) ) { $transaction->note = $this->request['note']; }
        $transaction->created_by = $this->user_id;
        $transaction->updated_by = $this->user_id;
        $transaction->save();

        return response()->json($transaction, 200);
    }

    /**
    * Create a new transaction
    *
    * @return json
    */
    public function create_tansfer_between_accounts(){
        $this->validate($this->request, [
         'account_from' => 'required|int|min:1',
         'account_to'   => 'required|int|min:1',
         'date'         => 'required|date_format:Y-m-d H:i:s',
         'amount'       => 'required|int',
         'vat_rate'     => 'required|int|min:0|max:99',
         'note'         => 'string|max:255'
        ]);

        //we will need to create the negative transaction (out transaction)
        $transaction = new Transaction;
        $transaction->franchise_id = $this->franchise_id;
        $transaction->club_id = $this->club_id;
        $transaction->account_id = $this->request['account_from'];
        $transaction->type_id = 4;
        $transaction->user_id = 0;
        $transaction->code_id = 7;
        $transaction->date = $this->request['date'];
        $transaction->amount = -1 * $this->request['amount']; //money go out of this account
        $transaction->vat_rate = $this->request['vat_rate'];
        if( isset($this->request['note']) ) { $transaction->note = $this->request['note']; }
        $transaction->created_by = $this->user_id;
        $transaction->updated_by = $this->user_id;
        $transaction->save();

        //we will need to create the negative transaction (in transaction)
        $transaction = new Transaction;
        $transaction->franchise_id = $this->franchise_id;
        $transaction->club_id = $this->club_id;
        $transaction->account_id = $this->request['account_to'];
        $transaction->type_id = 4;
        $transaction->user_id = 0;
        $transaction->code_id = 7;
        $transaction->date = $this->request['date'];
        $transaction->amount = $this->request['amount']; //money go in this account
        $transaction->vat_rate = $this->request['vat_rate'];
        if( isset($this->request['note']) ) { $transaction->note = $this->request['note']; }
        $transaction->created_by = $this->user_id;
        $transaction->updated_by = $this->user_id;
        $transaction->save();

        return response()->json($transaction, 200);
    }


    /**
    * Update the transaction with the $id
    *
    * @return json
    */
    public function update_transaction($id){

        // Check if we are updating only amount.
        if($this->request->has('type') && $this->request->type === 'single'){
            $transaction = Transaction::findOrFail($id);
            $transaction->amount = $this->request->amount;
            $this->request->has('register_type') ? $transaction->register_type = $this->request->register_type : null;
            $this->request->has('date') ? $transaction->date = $this->request->date : null;
            $this->request->has('player_id') ? $transaction->player_id = $this->request->player_id : null;
            $this->request->has('entity_type') ? $transaction->company = $this->request->entity_type : null;
            $this->request->has('club_id') ? $transaction->club_id = $this->request->club_id : null;
            $this->request->has('description') ? $transaction->note = $this->request->description : null;
            $transaction->updated_by = $this->user_id;
            $transaction->save();

            return response()->json($transaction);
        }

        $this->validate($this->request, [
         'account_id' => 'required|int|min:1',
         'type_id'    => 'required|int|min:1',
         'user_id'    => 'required|int|min:1',
         'code_id'    => 'int|min:1',
         'date'       => 'required|date_format:Y-m-d H:i:s',
         'amount'     => 'required|int|between:0,99.99',
         'vat_rate'   => 'required|int|min:0|max:99',
         'note'       => 'string|max:255'
        ]);

        $transaction = Transaction::where('franchise_id', $this->franchise_id)->where('club_id', $this->club_id)->where('id', $id)->first();
        $transaction->account_id = $this->request['account_id'];
        $transaction->type_id = $this->request['type_id'];
        $transaction->user_id = $this->request['user_id'];
        if(isset($this->request['code_id'])) { $transaction->code_id = $this->request['code_id']; }
        $transaction->date = $this->request['date'];
        $transaction->amount = $this->request['amount'];
        $transaction->vat_rate = $this->request['vat_rate'];
        if(isset($this->request['note'])) { $transaction->note = $this->request['note']; }
        $transaction->updated_by = $this->user_id;
        $transaction->save();

        return response()->json($transaction, 200);
    }

    /**
    * Delete the transaction with the $id
    *
    * @return json
    */
    public function delete_transaction($id){
        Transaction::findOrFail($id)
            ->delete();
        return response()->json('Transaction deleted', 200);
    }
}
