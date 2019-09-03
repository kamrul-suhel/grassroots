<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\TransactionCode;
use App\Transaction;
use Auth;
use DB;

class TransactionCodeController extends Controller {
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin');
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all transaction codes from a club.
     *
     * @return json
     */
    public function get_transactions_codes() {
        $pagination = create_pagination();
        $transactions_codes = TransactionCode::select(
            DB::raw('SQL_CALC_FOUND_ROWS transaction_code.id'),
                'transaction_code.code',
                'transaction_code.title'
            )
            ->where('transaction_code.franchise_id', $this->franchise_id)
            ->where('transaction_code.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by account title
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('transaction_code.title', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('transaction_code.code', 'like', '%' . $this->request['search']. '%');
                }
                return $query;
            })
            ->orderBy('transaction_code.code')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $search = create_filter('search', 'Search');
        $filters = [$search];
        $count = reset($requestsCount)->count;
        return format_response($transactions_codes, $count, $filters);
    }

    /**
     * Get the transaction code with $id
     *
     * @param int $todo_id
     * @return json
     */
     public function get_transaction_code($id) {
         $transaction = TransactionCode::where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->where('id', $id)
            ->first();
         return response()->json($transaction, 200);
     }

    /**
    * Create a new transaction code
    *
    * @return json
    */
    public function create_transaction_code() {

        $this->validate($this->request, [
            'code' => 'required|string|max:255',
            'title' => 'required|string|max:255'
        ]);
        $transaction_code = new TransactionCode;
        $transaction_code->franchise_id = $this->franchise_id;
        $transaction_code->club_id = $this->club_id;
        $transaction_code->code = $this->request['code'];
        $transaction_code->title = $this->request['title'];
        $transaction_code->created_by = $this->user_id;
        $transaction_code->updated_by = $this->user_id;
        $transaction_code->save();

        return response()->json($transaction_code, 200);
    }

    /**
     * @param $franchiseId
     * @param $clubId
     * @return mixed
     */
    public function createOrGetTransactionCodeId($franchiseId, $clubId){

        $transactionCode = new TransactionCode;
        $transactionCode->franchise_id = $this->franchise_id;
        $transactionCode->club_id = $this->club_id;

        // Need to change
        $transactionCode->code = mt_rand();
        $transactionCode->title = 'Guardian Payment';

        $transactionCode->created_by = $this->user_id;
        $transactionCode->updated_by = $this->user_id;
        $transactionCode->save();

        return $transactionCode->id;
    }

    /**
    * Update the transaction code with the $id
    *
    * @return json
    */
    public function update_transaction_code($id) {

        $this->validate($this->request, [
            'code' => 'required|string|max:255',
            'title' => 'required|string|max:255'
        ]);
        $transaction_code = TransactionCode::find($id);
        $transaction_code->code = $this->request['code'];
        $transaction_code->title = $this->request['title'];
        $transaction_code->updated_by = $this->user_id;
        $transaction_code->save();

        return response()->json($transaction_code, 200);
    }

    /**
    * Delete the transaction code with the $id
    *
    * @return json
    */
    public function delete_transaction_code($id) {
        //make sure there are no transaction with this $id before deleteing it
        $transactions = Transaction::where('code_id', $id)->get();
        if( $transactions->count() > 0 ){
            return response('You have transactions with this code, so you cannnot delete it', 403);
        }

        TransactionCode::find($id)->delete();
        return response()->json('Transaction code successifully deleted', 200);
    }

}
