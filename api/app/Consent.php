<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Consent extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'franchise_id', 'club_id', 'title', 'content', 'programme_id', 'created_by', 'updated_by', 'status'
    ];

    protected $primaryKey = 'consent_id';
    protected $table = 'consent';

    public function guardians(){
        return $this->belongsToMany(User::class, 'rel_consent_user', 'consent_id', 'user_id' )
                    ->select('user.user_id', 'user.display_name', 'rel_consent_user.agreed_at');
    }
}
