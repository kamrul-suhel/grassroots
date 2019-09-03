<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SkillGrade extends Model
{
    protected $primaryKey = 'grade_id';
    protected $table = 'skill_grade';

    public function setUpdatedAtAttribute($value)
    {
        return null;
    }

    public function getUpdatedAtColumn() {
        return null;
    }
}
