<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventRequest extends Model
{

    protected $primaryKey = 'request_id';
    protected $table = 'event_requests';

}
