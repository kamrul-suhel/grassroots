<?php

namespace App;

use DB;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    protected $table = 'programme';
    protected $primaryKey = 'programme_id';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'notes',
        'image_path',
        'image_type',
        'pitch_number',
        'pitch_info',
        'status',
        'payment_note',
        'require_equipment',
        'terms_conditions'
    ];
    protected $hidden = [
        'franchise_id',
        'club_id'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sessions(){
        return $this->hasMany(Session::class);
    }

    /**
     * @return mixed
     */
    public function existingSessions(){
        return $this->hasMany('App\Session')
            ->select([
                'session.programme_id',
                'session.session_id as id',
                DB::raw('CONCAT(DATE_FORMAT(session.start_time,\'%W, %M %e, %Y @ %h:%i %p\'), " (" , session.surface, ")") as title')
            ])
            ->where('session.start_time', '>=', date('Y-m-d'))
            ->orderBy('session.start_time');
    }

    public function teams(){
        return $this->belongsToMany(Team::class, 'rel_programme_team', 'programme_id', 'team_id');
    }

}
