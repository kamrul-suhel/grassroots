<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelCoachSession extends Model
{
    protected $table = 'rel_coach_session';
    protected $fillable = array('coach_id', 'session_id');
}
