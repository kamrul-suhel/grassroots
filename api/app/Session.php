<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title'
    ];

    protected $hidden = [
        'index', 'created_at', 'created_by', 'updated_at', 'updated_by', 'pivot'
    ];

    protected $primaryKey = 'session_id';
    protected $table = 'session';

    public function programme(){
        return $this->belongsTo(Programme::class);
    }

    public function address(){
        return $this->hasOne(Address::class, 'address_id', 'venue_id');
    }

    public function coach(){
        return $this->hasOne(User::class, 'user_id', 'coach_id' );
    }
}
