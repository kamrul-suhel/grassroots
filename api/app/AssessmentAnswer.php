<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AssessmentAnswer extends Model
{
    protected $primaryKey = 'answer_id';
    protected $table = 'assessment_answer';

    protected $hidden = ['pivot'];

    public function setUpdatedAtAttribute($value)
    {
        // to Disable updated_at
    }
}
