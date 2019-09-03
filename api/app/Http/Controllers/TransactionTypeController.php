<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\TransactionType;
use App\Transaction;
use Auth;
use DB;

class TransactionTypeController extends Controller {
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
     * Get all transaction types from a club.
     *
     * @return json
     */
    public function get_transactions_types() {
        $pagination = create_pagination();
        $transactions_types = TransactionType::select(
            DB::raw('SQL_CALC_FOUND_ROWS transaction_type.id'),
                'transaction_type.title'
            )
            ->where('transaction_type.franchise_id', $this->franchise_id)
            ->where('transaction_type.club_id', $this->club_id)
            ->where(function($query){
                //allow filter by account title
                if( isset($this->request['search']) && !empty($this->request['search']) ) {
                    $query->where('transaction_type.title', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->orderBy('transaction_type.title')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount  = DB::select( DB::raw("SELECT FOUND_ROWS() AS count;") );
        $search = create_filter('search', 'Search');
        $filters = [$search];
        $count = reset($requestsCount)->count;
        return format_response($transactions_types, $count, $filters);
    }

    /**
     * Get the transaction type with $id
     *
     * @param int $todo_id
     * @return json
     */
     public function get_transaction_type($id) {
         $transaction_type = TransactionType::where('franchise_id', $this->franchise_id)
            ->where('club_id', $this->club_id)
            ->where('id', $id)
            ->first();
         return response()->json($transaction_type, 200);
     }

    /**
    * Create a new transaction type
    *
    * @return json
    */
    public function create_transaction_type() {

        $this->validate($this->request, [
            'title' => 'required|string|max:255'
        ]);
        $transaction_type = new TransactionType;
        $transaction_type->franchise_id = $this->franchise_id;
        $transaction_type->club_id = $this->club_id;
        $transaction_type->title = $this->request['title'];
        $transaction_type->created_by = $this->user_id;
        $transaction_type->updated_by = $this->user_id;
        $transaction_type->save();

        return response()->json($transaction_type, 200);
    }

    /**
    * Update the transaction type with the $id
    *
    * @return json
    */
    public function update_transaction_type($id) {

        $this->validate($this->request, [
            'title' => 'required|string|max:255'
        ]);
        $transaction_type = TransactionType::find($id);
        $transaction_type->title = $this->request['title'];
        $transaction_type->updated_by = $this->user_id;
        $transaction_type->save();
        return response()->json($transaction_type, 200);
    }

    /**
    * Delete the transaction type with the $id
    *
    * @return json
    */
    public function delete_transaction_type($id) {
        //make sure there are no transaction with this $id before deleteing it
        $transactions = Transaction::where('type_id', $id)->get();
        if( $transactions->count() > 0 ){
            return response('You have transactions with this  type, so you cannnot delete it', 403);
        }

        TransactionType::find($id)->delete();
        return response()->json('Transaction type successifully deleted', 200);
    }

    public function createOrGetTransactionType($franchiseId, $clubId, $accountTitle){
        // Check if exists or not
        $transactionType = TransactionType::select('id')
            ->where([
                'franchise_id' => $franchiseId,
                'club_id' => $clubId,
            ])
        ->where('title', 'LIKE', '%'.$accountTitle.'%')
            ->first();

        if($transactionType){
            return $transactionType->id;
        }

        $transaction_type = new TransactionType;
        $transaction_type->franchise_id = $franchiseId;
        $transaction_type->club_id = $clubId;
        $transaction_type->title = $accountTitle;
        $transaction_type->created_by = $this->user_id;
        $transaction_type->updated_by = $this->user_id;
        $transaction_type->save();

        return $transaction_type->id;
    }
}
