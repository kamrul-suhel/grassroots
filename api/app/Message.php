<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'message_id', 'franchise_id', 'club_id', 'content', 'topic_id', 'reply_to', 'created_at', 'created_by', 'status'
    ];

    protected $primaryKey = 'message_id';
    protected $table = 'message';

    public function topic(){
        return $this->belongsTo(Topic::class);
    }
}
