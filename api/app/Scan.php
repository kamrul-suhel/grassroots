<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{

    protected $primaryKey = 'scan_id';
    protected $table = 'scan';

    public function setUpdatedAtAttribute($value)
    {
        return null;
    }

    public function getUpdatedAtColumn() {
        return null;
    }

}
