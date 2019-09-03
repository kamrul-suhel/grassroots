<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelKitTeam extends Model
{

    protected $table = 'rel_kit_team';
    public $timestamps = false;

    protected $fillable = [
        'team_id',
        'kit_id'
    ];
}
