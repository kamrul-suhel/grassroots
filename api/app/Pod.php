<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pod extends Model
{
    protected $table = 'pod';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
