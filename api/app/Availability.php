<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $primaryKey = 'availability_id';
    protected $table = 'availability';
    public $timestamps = false;

}
