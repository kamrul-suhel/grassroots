<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelPlayerGuardian extends Model
{

    protected $fillable = [
        'player_id', 'guardian_id',
    ];

    protected $table = 'rel_player_guardian';
    public $timestamps = false;

}
