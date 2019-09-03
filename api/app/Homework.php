<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Auth;

class Homework extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'franchise_id', 'club_id', 'title', 'content', 'coach_id', 'created_by', 'status'
    ];

    protected $hidden = [
        'franchise_id', 'club_id', 'created_at', 'created_by', 'updated_by', 'completed_at', 'status', 'pivot'
    ];

    protected $primaryKey = 'homework_id';
    protected $table = 'homework';

    public function players(){
        return $this->belongsToMany(Player::class, 'rel_homework_player', 'homework_id', 'player_id')
                    ->select('player.player_id', 'player.display_name')
                    ->leftJoin('rel_player_guardian', 'rel_player_guardian.player_id', '=', 'player.player_id')
                    ->where('rel_player_guardian.guardian_id', 1);

    }
}
