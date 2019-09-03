<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{

    protected $hidden = [
        'franchise_id', 'club_id', 'created_at', 'created_by', 'updated_at', 'updated_by', 'order', 'status', 'pivot'
    ];

    protected $primaryKey = 'skill_id';
    protected $table = 'skill';

}
