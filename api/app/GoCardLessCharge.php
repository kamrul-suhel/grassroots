<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class GoCardLessCharge extends Model{

    /**
     * @var string
     */
    protected $table='gocardless_charge';

    /**
     * @var array
     */
    protected $fillable = [
        'amount'
    ];
}