<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AgeGroup extends Model
{
    protected $hidden = ['franchise_id', 'club_id'];
    protected $primaryKey = 'agegroup_id';
    protected $table = 'agegroup';

}
