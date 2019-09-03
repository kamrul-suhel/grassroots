<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
    protected $table = 'match';
    protected $primaryKey = 'fixture_id';
    public $timestamps = false;
}
