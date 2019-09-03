<?php

namespace App\Http\Controllers;
use App\KitUser;
use Illuminate\Http\Request;
use App\RelKitItemSize;
use App\RelPlayerTeam;
use App\RelCoachTeam;
use App\RelKitUser;
use App\KittItem;
use Auth;
use DB;

class KittUserController extends Controller {

    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin|groupadmin', ['only' => ['create_kit', 'update_kit', 'delete_kit']]);
        // $this->middleware('role:coach|guardian', ['only' => ['get_kits']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    /**
     * Update kit_user size and status
     * @param $kitUserId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($kitUserId){

        // If request has type && type = status then chang only status
        if($this->request->has('type') &&
            $this->request->type === 'status'){
            $this->validate($this->request, [
                'status' => 'required|in:0,1'
            ]);

            KitUser::find($kitUserId)
                ->update(['status' => $this->request->status]);
            return response()->json('Status has been updated.');
        }

        $this->validate($this->request, [
            'size' => 'required|string|max:255'
        ]);
        KitUser::find($kitUserId)
            ->update(['size' => $this->request['size']]);

        return response()->json('Updated', 200);
    }


    /**
     * Delete kit user by id
     * @param $kitUserId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function delete($kitUserId){
        KitUser::where('id', $kitUserId)
            ->delete();

        return response()->json("success", 200);
    }
}
