<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'invoice';

    protected $fillable = [
        'company',
        'amount',
        'vat_rate',
        'description',
        'created_by',
        'description'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function lines()
    {
        return $this->hasMany(InvoiceLine::class, 'invoice_id', 'id')
            ->select([
                'invoice_line.id',
                'invoice_line.title as line_title',
                'invoice_line.package_id',
                'invoice_line.invoice_id',
                'invoice_line.club_id',
                'invoice_line.amount',
                'invoice_line.created_at as date',
                'package.title',
                'club.title as club_title'
            ])
            ->leftJoin('package', 'invoice_line.package_id', '=', 'package.id')
            ->leftJoin('club', 'invoice_line.club_id', '=', 'club.club_id');
    }
}
