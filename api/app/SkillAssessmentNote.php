<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SkillAssessmentNote extends Model
{
    protected $primaryKey = 'note_id';
    protected $table = 'skill_assessment_note';

    public $timestamps = false;
}
