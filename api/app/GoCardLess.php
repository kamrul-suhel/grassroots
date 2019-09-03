<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GoCardLess extends Model
{
    protected $table = 'gocardless';

    protected $fillable = [
        'cardless_id',
        'session_token',
        'customer_status',
        'mandate',
        'customer'
    ];
}
