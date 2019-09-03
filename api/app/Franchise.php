<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Franchise extends Model
{

    protected $primaryKey = 'franchise_id';
    protected $table = 'franchise';

    protected $fillable = [
        'company_number',
        'vat_number',
        'title',
        'image_url',
        'content',
        'email',
        'telephone',
        'mobile',
        'emergency_telephone',
        'website',
        'address',
        'address2',
        'city',
        'town',
        'postcode',
        'organisation_name',
        'fa_affiliation',
        'created_by',
        'updated_by',
        'status',
        'contact_with_email',
        'manager_name',
        'cardless_id',
        'cardless_session_token',
        'cardless_customer_status',
        'cardless_mandate',
        'cardless_customer'
    ];
}
