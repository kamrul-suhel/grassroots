<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'team';
    protected $primaryKey = 'team_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'franchise_id',
        'club_id',
        'title',
        'gender',
        'created_by',
        'updated_at',
        'updated_by',
        'status',
    ];

    protected $hidden = [
        'franchise_id',
        'club_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'status',
        'pivot'
    ];

    /**
     * @return mixed
     */
    public function players() {
        return $this->belongsToMany(Player::class, 'rel_player_team', 'team_id', 'player_id')
            ->where('rel_player_team.status', 'assigned')
            ->select('player.player_id AS value', 'player.display_name AS label', 'player.player_id', 'player.display_name', 'player.medical_conditions', 'player.birthday');
    }

    public function programmes() {
        return $this->belongsToMany(Programme::class, 'rel_programme_team', 'team_id', 'programme_id');
    }

    public function skillgroups() {
        return $this->belongsToMany(Team::class, 'rel_skillgroup_team', 'team_id', 'skillgroup_id')
            ->select('team.team_id AS id', 'team.title AS title');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function skills() {
        return $this->belongsToMany('App\Skill', 'rel_skillgroup_team', 'team_id', 'skillgroup_id');
    }

    public function kits() {
        return $this->belongsToMany(KittItem::class, 'rel_kit_team', 'team_id', 'kit_id')
            ->select(
                'kit_item.kit_id AS value',
                'kit_item.title AS label',
                'kit_type.title as kit_type_title'
            )
            ->leftJoin('kit_type', 'kit_item.type_id', '=', 'kit_type.type_id');
    }

    public function sponsors() {
      return $this->belongsToMany(Sponsor::class, 'rel_sponsor_team', 'team_id', 'sponsor_id')
        ->select('sponsor.sponsor_id', 'sponsor.title', 'sponsor.logo_url', 'sponsor.url');
    }
}
