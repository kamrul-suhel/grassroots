<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TermCondition extends Model
{

    protected $primaryKey = 'tc_id';
    protected $table = 'term_condition';

    public function guardians(){
        return $this->belongsToMany(User::class, 'rel_tc_user', 'tc_id', 'user_id' )
                    ->select('user.user_id', 'user.display_name', 'rel_tc_user.agreed_at');
    }
}
