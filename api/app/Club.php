<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{

    protected $primaryKey = 'club_id';
    protected $table = 'club';

    protected $fillable = [
        'title',
        'slug',
        'type',
        'fa_affiliation',
        'address',
        'address2',
        'city',
        'town',
        'company_number',
        'email',
        'fa_affiliation',
        'postcode',
        'telephone',
        'emergency_telephone',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'youtube_url',
        'type',
        'vat_number',
        'vat_rate',
        'website',
        'threshold',
        'threshold_date',
        'fc_company',
        'ss_company',
        'status',
        'postcode',
        'logo_url',
    ];

    public function agegroups()
    {
        return $this->belongsToMany(AgeGroup::class, 'rel_agegroup_club', 'club_id', 'agegroup_id');
    }

}
