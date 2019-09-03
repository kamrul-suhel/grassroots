<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $primaryKey = 'assessment_id';
    protected $table = 'assessment';

    public function questions() {
        return $this->hasMany(AssessmentQuestion::class,  'assessment_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'rel_assessment_user', 'assessment_id', 'user_id')
            ->select('user.user_id', 'user.display_name')
            ->withPivot('status', 'status');
    }

}
