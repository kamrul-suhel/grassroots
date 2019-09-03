<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Feedback extends Model
{
    protected $primaryKey = 'feedback_id';
    protected $table = 'feedback';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions() {
        return $this->hasMany(FeedbackQuestion::class, 'feedback_id');
    }

    public function guardians() {
        return $this->belongsToMany(User::class, 'rel_feedback_user', 'feedback_id', 'user_id')
            ->select(
                'user.user_id',
                'user.display_name'
            )
            ->withPivot('status', 'status');;
    }


}
