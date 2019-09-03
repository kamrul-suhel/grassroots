<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $hidden = [
        'franchise_id',
        'club_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];

    protected $primaryKey = 'address_id';
    protected $table = 'address_book';

}
