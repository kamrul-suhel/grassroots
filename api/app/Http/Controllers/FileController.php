<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Player;
use Auth;
use DB;


class FileController extends Controller
{
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    public function update_image(){
        $this->validate($this->request, [
            'user_id' => 'required|int|min:1',
            'type' => 'required|string|in:player,guardian,coach',
            'file' => 'required|file|image|max:1024',
        ],
        [
          'file.max' => 'Uploaded file cannot be bigger than 1 MB'
        ]);
        //handle update images for different  types
        switch ($this->request['type']) {
            case 'player':
                //update the player profile image
                $player = Player::find($this->request['id']);
                $file = $this->request->file('file');
                $file_url = gr_save_file($file, 'players', $this->request['id']);
                $player->pic = $file_url;
                $player->save();
                break;
            default:
                # code...
                break;
        }
    }
}
