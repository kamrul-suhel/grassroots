<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'content', 'coach_id', 'created_by', 'status'
    ];

    protected $hidden = [
        'franchise_id', 'club_id'
    ];

    protected $primaryKey = 'topic_id';
    protected $table = 'topic';

    public function messages(){
        return $this->hasMany(Message::class);
    }
}
