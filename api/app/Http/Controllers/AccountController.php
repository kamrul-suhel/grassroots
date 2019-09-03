<?php

namespace App\Http\Controllers;

use App\AccountType;
use Illuminate\Http\Request;
use App\Account;
use App\Transaction;
use Auth;
use DB;

class AccountController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth', ['except' => 'getAccountByFranchiseAndClubId']);
        $this->middleware('role:admin|groupadmin', ['except' => 'getAccountByFranchiseAndClubId']);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Get all the accounts from a franchise_id
     *
     * @return json
     */
    public function get_accounts()
    {
        $club_id = $this->club_id;
        if (Auth::user()->hasRole('groupadmin')) {
            $this->validate($this->request, [
                'club_id' => 'required|int|exists:club,club_id'
            ]);
            $club_id = $this->request['club_id'];
        }

        $accounts = Account::select(
            DB::raw('SQL_CALC_FOUND_ROWS account.id'),
            'account.title',
            'account.type_id',
            'account_type.title AS type',
            'account.bank_name'
        )
            ->leftJoin('account_type', 'account_type.id', '=', 'account.type_id')
            ->where('account.franchise_id', $this->franchise_id)
            ->where('account.club_id', $club_id)
            ->paginate($this->perPage);

        $totalAccounts = $accounts->items();
        $count = $accounts->total();

        foreach ($totalAccounts as $account) {
            $balance = 0;
            $transactions = Transaction::select('transaction.account_id', 'transaction.amount')->where('transaction.account_id', $account->id)->get();
            $balance = $transactions->sum('amount');
            $account->balance = $balance;
        }

        return format_response($totalAccounts, $count);
    }

    /**
     * Get account with the $id
     *
     * @param int $id
     * @return json
     */
    public function get_account($id)
    {

        $club_id = $this->club_id;
        if (Auth::user()->hasRole('groupadmin')) {
            $this->validate($this->request, [
                'club_id' => 'required|int|exists:club,club_id'
            ]);
            $club_id = $this->request['club_id'];
        }

        $account = Account::select(
            'account.id',
            'account.title',
            'account.type_id',
            'account_type.title AS type',
            'account.bank_name',
            'account.account_number',
            'account.sort_code'
        )
            ->leftJoin('account_type', 'account_type.id', '=', 'account.type_id')
            ->where('account.franchise_id', $this->franchise_id)
            ->where('account.club_id', $club_id)
            ->where('account.id', $id)
            ->first();

        return response()->json($account, 200);
    }


    /**
     * @param $franchiseId
     * @param $clubId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getAccountByFranchiseAndClubId($franchiseId, $clubId)
    {

        $this->validate($this->request, [
            'franchise_id' => 'exists:franchise,franchise_id',
            'club_id' => 'exists:club,club_id'
        ]);

        $accounts = Account::select(
            'account.id',
            'account.title AS title'
        )
            ->where('account.franchise_id', $franchiseId)
            ->where('account.club_id', $clubId)
            ->get();

        return response()->json($accounts);
    }

    /**
     * Create a new account
     *
     * @return json
     */
    public function create_account()
    {
        //validate the request
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'type_id' => 'required|int|min:1',
            'bank_name' => 'string|max:255',
            'account_number' => 'string|max:255',
            'sort_code' => 'string|max:255',
            'status' => 'int|min:0|max:1',
            'club_id' => 'int|exists:club,club_id'
        ]);

        $club_id = isset($this->request['club_id']) ? $this->request['club_id'] : $this->club_id;

        //check if current user is allowed to make changes
        $is_allowed = gr_check_if_allowed($club_id, $this->franchise_id, $this->club_id);
        if (empty($is_allowed)) {
            return response()->json(get_denied_message(), 403);
        }

        $account = new Account;
        $account->franchise_id = $this->franchise_id;
        $account->club_id = $club_id;
        $account->title = $this->request['title'];
        $account->type_id = $this->request['type_id'];
        $account->bank_name = isset($this->request['bank_name']) ? $this->request['bank_name'] : NULL;
        $account->account_number = isset($this->request['account_number']) ? $this->request['account_number'] : NULL;
        $account->sort_code = isset($this->request['sort_code']) ? $this->request['sort_code'] : NULL;
        $account->created_by = $this->user_id;
        $account->updated_by = $this->user_id;
        $account->status = isset($this->request['status']) ? $this->request['status'] : 1; //active by default
        $account->save();

        return response()->json($account, 200);
    }

    /**
     * Update the account with the $id
     *
     * @param int $id
     * @return json
     */
    public function update_account($id)
    {
        //validate the request
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'type_id' => 'required|int|min:1',
            'bank_name' => 'string|max:255',
            'account_number' => 'string|max:255',
            'sort_code' => 'string|max:255',
            'status' => 'int|min:0|max:1'
        ]);

        $account = Account::find($id);

        //check if current user is allowed to make changes
        $is_allowed = gr_check_if_allowed($account->club_id, $this->franchise_id, $this->club_id);
        if (empty($is_allowed)) {
            return response()->json(get_denied_message(), 403);
        }

        $account->title = $this->request['title'];
        $account->type_id = $this->request['type_id'];
        if (isset($this->request['bank_name'])) {
            $account->bank_name = $this->request['bank_name'];
        }
        if (isset($this->request['account_number'])) {
            $account->account_number = $this->request['account_number'];
        }
        if (isset($this->request['sort_code'])) {
            $account->sort_code = $this->request['sort_code'];
        }
        if (isset($this->request['status'])) {
            $account->status = $this->request['status'];
        }
        $account->updated_by = $this->user_id;
        $account->save();

        return response()->json($account, 200);
    }

    /**
     * Delete the account with the $id
     *
     * @param int $id
     * @return json
     */
    public function delete_account($id)
    {
        $this->validate($this->request, [
            'confirmation' => 'required|string|in:DELETE',
        ]);

        $account = Account::find($id);
        if (empty($account)) {
            return response()->json('Account not found', 404);
        }

        //check if current user is allowed to make changes
        $is_allowed = gr_check_if_allowed($account->club_id, $this->franchise_id, $this->club_id);
        if (empty($is_allowed)) {
            return response()->json(get_denied_message(), 403);
        }

        //make sure there are no transactions registered for this account
        $transaction = Transaction::where('account_id', $id)->first();
        if (!empty($transaction)) {
            return response()->json('You cannot delete this account. There are registered transactions to it.', 403);
        }

        $account = Account::find($id)->delete();
        return response()->json('Account successfully deleted', 200);
    }

}
