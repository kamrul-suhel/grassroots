<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelPlayerTeam extends Model
{
    protected $table = 'rel_player_team';
    public $timestamps = false;
    protected $fillable = array(
        'player_id',
        'team_id',
        'status',
        'reason',
        'player_session_id',
        'trial_rating'
    );
}
