<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class
Todo extends Model
{
    protected $primaryKey = 'todo_id';
    protected $table = 'todo';
    protected $hidden = ['franchise_id', 'club_id'];
    protected $fillable = [
        'start_time',
        'end_time'
    ];

}
