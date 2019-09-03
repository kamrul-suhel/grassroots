<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelKitUser extends Model
{
    protected $fillable = array('kit_id', 'user_player_id', 'user_role', 'size', 'created_by', 'updated_by', 'status');
    protected $table = 'rel_kit_user';

    public function available_sizes(){
        return $this->hasMany(RelKitItemSize::class, 'kit_id', 'kit_id')
            ->select('size AS label', 'size AS value', 'kit_id');
    }
}
