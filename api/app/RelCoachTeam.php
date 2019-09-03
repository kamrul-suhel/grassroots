<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelCoachTeam extends Model
{
    protected $table = 'rel_coach_team';
    public $timestamps = false;
    protected $fillable = array('coach_id', 'team_id');
}
