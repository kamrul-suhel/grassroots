<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tile'
    ];

    protected $hidden = [
        'franchise_id',
        'year_at_school',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'pivot'
    ];

    protected $primaryKey = 'player_id';
    protected $table = 'player';

    public function teams() {
        return $this->belongsToMany(Team::class, 'rel_player_team', 'player_id', 'team_id')
            ->select(
                'team.team_id',
                'team.agegroup_id',
                'team.type',
                'team.title',
                'team.team_id AS value',
                'team.title AS label',
                'team.logo_url',
                'rel_player_team.status AS player_status',
                'rel_player_team.reason',
                'agegroup.title as agegroup_title'
            )->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id');
    }

    public function guardians() {
        return $this->belongsToMany(User::class, 'rel_player_guardian', 'player_id', 'guardian_id');
    }

    public function sessions() {
        return $this->belongsToMany(Session::class, 'rel_player_session', 'player_id', 'session_id')
            ->select(
                'rel_player_session.price as session_price',
                'rel_player_session.is_trial',
                'session.session_id',
                'session.start_time',
                'session.end_time',
                'session.venue_id',
                'address_book.title AS address',
                'session.price',
                'session.price2',
                'session.price2plus',
                'session.status',
                'programme.title AS programme_name',
                'programme_type.title AS programme_type'
            )
            ->leftJoin('programme', 'programme.programme_id', '=', 'session.programme_id')
            ->leftJoin('programme_type', 'programme_type.type_id', '=', 'programme.type_id')
            ->leftJoin('address_book', 'address_book.address_id', '=', 'session.venue_id')
            ->where('session.start_time', '>=', date('Y-m-d'))
            ->where('rel_player_session.attendance_completed', 0)
            ->groupBy('session.session_id')
            ->orderBy('session.start_time', 'ASC')
            ->withPivot('status AS attended', 'reason AS reason');
    }

    public function kits() {
        return $this->belongsToMany(KittItem::class, 'rel_kit_user', 'user_player_id', 'kit_id' )
            ->select('rel_kit_user.id', 'kit_item.kit_id AS value', 'kit_item.title AS label', 'kit_item.image_url', 'kit_item.type_id', 'kit_item.kit_id', 'kit_item.title', 'team.title As team', 'kit_type.title AS type')
            ->leftJoin('rel_kit_team', 'rel_kit_team.kit_id', '=', 'kit_item.kit_id')
            ->leftJoin('team', 'team.team_id', '=', 'rel_kit_team.team_id')
            ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
            ->withPivot('size AS size');
    }
}
