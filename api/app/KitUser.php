<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class KitUser extends Model
{
    /**
     * Table
     * @var string
     */
    protected $table = 'kit_user';

    /**
     * Fillable Attributes
     * @var array
     */
    protected $fillable = [
        'kit_id',
        'user_player_id',
        'user_role',
        'team_id',
        'size',
        'created_by',
        'updated_by',
        'status'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kit(){
        return $this->belongsTo(KittItem::class,'kit_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function team(){
        return $this->belongsTo(Team::class, 'team_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function player(){
        return $this->belongsTo(Player::class, 'user_player_id', 'player_id');
    }

}
