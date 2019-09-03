<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;
use DB;

class User extends Model implements JWTSubject, AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'mobile',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'api_key', 'access_level', 'last_login', 'created_at', 'updated_at', 'status', 'password_reset'
    ];

    protected $table = "user";
    protected $primaryKey = "user_id";

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function players() {
        return $this->belongsToMany(Player::class, 'rel_player_guardian', 'guardian_id', 'player_id');
    }

    public function feedbackanswers() {
        return $this->hasMany(FeedbackAnswer::class, 'created_by');
    }

    public function assessmentanswers() {
        return $this->hasMany(AssessmentAnswer::class, 'created_by')
            ->select('assessment_answer.answer_id', 'assessment_answer.content', 'assessment_answer.created_by', 'rel_assessment_qa.question_id')
            ->leftjoin('rel_assessment_qa', 'rel_assessment_qa.answer_id', '=', 'assessment_answer.answer_id');
    }

    public function role() {
        return $this->hasOne(Role::class, 'role_id');
    }

    /**
     * Check if auth user has a certain role.
     *
     * @var string $tile [admin, coach etc.]
     * @return bool
     */
    public function hasRole($tile){

        $roles = DB::table('role')->where('title', '=', $tile)->first();

        if($this->user_role === $roles->role_id){
            return true;
        }

        return false;
    }

    /**
     * Get user role.
     *
     * @return string
     */
    public function getRole(){

        $roles = DB::table('role')->get();

        foreach($roles as $role){
            if($this->user_role == $role->role_id){
                return $role->title;
            }
        }

        return false;
    }

    public function teams(){
        return $this->belongsToMany(Team::class, 'rel_coach_team', 'coach_id');
    }
}
