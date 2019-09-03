<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuestionOption extends Model
{
    protected $primaryKey = 'option_id';
    public $timestamps = false;
    protected $table = 'assessment_question_option';

    public function question(){
        return $this->belongsTo(AssessmentQuestion::class, 'question_id', 'question_id');
    }
}
