<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AddressType extends Model
{
    protected $hidden = [
        'franchise_id',
        'club_id'
    ];
    protected $primaryKey = 'type_id';
    protected $table = 'address_type';
}
