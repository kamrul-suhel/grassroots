<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FeedbackQuestion extends Model
{
    protected $primaryKey = 'question_id';
    protected $table = 'feedback_question';

    protected $hidden = ['franchise_id', 'created_at', 'created_by', 'updated_at', 'updated_by', 'pivot'];

    public function feedbacks(){
        return $this->belongsToMany(Feedback::class, 'rel_feedback_question', 'question_id', 'feedback_id');
    }

    public function options(){
        return $this->hasMany(FeedbackQuestionOption::class, 'question_id')->select('title AS id', 'title', 'question_id');
    }

    public function answers(){
        return $this->belongsToMany(FeedbackAnswer::class, 'rel_feedback_qa', 'question_id', 'answer_id');
    }
}
