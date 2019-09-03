<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class KittItem extends Model
{

    protected $primaryKey = 'kit_id';
    protected $table = 'kit_item';

    public function available_sizes(){
        return $this->hasMany(RelKitItemSize::class, 'kit_id')->select('size AS value', 'size AS title', 'kit_id');
    }

    public function teams(){
        return $this->belongsToMany(Team::class, 'rel_kit_team', 'kit_id', 'team_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type(){
        return $this->belongsTo(KittType::class, 'type_id');
    }

}
