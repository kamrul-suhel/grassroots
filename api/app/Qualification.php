<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Qualification extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tile'
    ];

    protected $primaryKey = 'qualification_id';
    protected $table = 'qualification';

    public function users()
    {
      return $this->hasMany('App\User');
    }
}
