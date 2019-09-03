<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TransactionLine extends Model
{
    protected $table = 'transaction_line';

    protected $fillable = [
        'transaction_id',
        'package_id',
        'amount'
    ];
}
