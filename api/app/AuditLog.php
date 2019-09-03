<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_log';

    public function setUpdatedAtAttribute($value)
    {
        // to Disable updated_at
    }
}
