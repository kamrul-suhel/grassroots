<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FeedbackQuestionOption extends Model
{
    protected $primaryKey = 'option_id';
    public $timestamps = false;
    protected $table = 'feedback_question_option';
    protected $hidden = ['question_id'];

    public function question(){
        return $this->belongsTo(FeedbackQuestion::class, 'question_id', 'question_id');
    }
}
