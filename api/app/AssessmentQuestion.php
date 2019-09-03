<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    protected $primaryKey = 'question_id';
    protected $table = 'assessment_question';

    protected $hidden = ['franchise_id', 'created_at', 'created_by', 'updated_at', 'updated_by', 'pivot'];

    public function assessments(){
        return $this->belongsToMany(Assessment::class, 'rel_assessment_question', 'question_id', 'assessment_id');
    }

    public function options(){
        return $this->hasMany(AssessmentQuestionOption::class, 'question_id')
            ->select('title AS id', 'title', 'question_id');
    }

    public function answers(){
        return $this->belongsToMany(AssessmentAnswer::class, 'rel_assessment_qa', 'question_id', 'answer_id');
    }
}
