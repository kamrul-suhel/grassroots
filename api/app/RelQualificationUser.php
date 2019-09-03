<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelQualificationUser extends Model
{
    protected $table = 'rel_qualification_user';
    protected $fillable = ['user_id', 'qualification_id', 'file_url', 'expiration_date'];
    public $timestamps = false;
}
