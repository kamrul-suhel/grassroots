<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transaction';

    protected $fillable = [
      'gocardless_payment_id',
        'gocardless_status',
        'date',
        'amount',
        'vat_rate',
        'note',
        'register_type',
        'company',
        'updated_by'
    ];

    /**
     * gocardless_status
     * Gocardless payment status coming from gocardless api.
     * https://developer.gocardless.com/api-reference/#payments-create-a-payment
     * Go cardless status is :  pending_customer_approval, pending_submission, submitted, confirmed, paid_out, cancelled, customer_approval_denied, failed, charged_back
     *
     */


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function lines(){
        return $this->hasMany('App\TransactionLine', 'transaction_id', 'id')
            ->select([
                'transaction_line.id',
                'transaction_line.transaction_id',
                'transaction_line.package_id',
                'transaction_line.club_id',
                'transaction_line.amount',
                'transaction_line.created_at',
                'package.title as package_title',
                'club.title as club_title'
            ])
            ->leftJoin('package', 'transaction_line.package_id', '=', 'package.id')
            ->leftJoin('club', 'transaction_line.club_id', '=', 'club.club_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function charge(){
        return $this->hasOne('App\GoCardLessCharge', 'transaction_id', 'id');
    }

    /**
     *
     * @return array
     */
    public static function getCardlessStatusForCron(){
        return [
            'pending_customer_approval',
            'pending_submission',
            'submitted',
            'confirmed'
        ];
    }
}
