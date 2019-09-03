<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ScanType extends Model
{

    protected $hidden = [

    ];
    protected $primaryKey = 'type_id';
    protected $table = 'scan_type';

    public function setUpdatedAtAttribute($value)
    {
        return null;
    }

    public function getUpdatedAtColumn() {
        return null;
    }
}
