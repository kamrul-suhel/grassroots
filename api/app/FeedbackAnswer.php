<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FeedbackAnswer extends Model
{
    protected $primaryKey = 'answer_id';
    protected $table = 'feedback_answer';

    public function setUpdatedAtAttribute($value)
    {
        // to Disable updated_at
    }

    public function question() {
        return $this->belongsTo(RelFeedbackQa::class, 'answer_id', 'question_id');
    }
}
