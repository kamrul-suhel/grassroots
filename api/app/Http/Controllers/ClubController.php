<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\SubscriptionHistory;
use App\RelAgegroupClub;
use App\RelClubPackage;
use App\AgeGroup;
use App\KittItem;
use App\Package;
use App\Account;
use App\Skill;
use App\Address;
use App\Team;
use App\Club;
use App\User;
use Auth;
use DB;

class ClubController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin', ['only' => ['get_clubs', 'delete_club']]);
        $this->middleware('role:admin|groupadmin', ['only' => ['create_club', 'update_club']]);
        $this->middleware('role:superadmin|groupadmin', ['only' => ['activate_deactivate_package']]);

        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayload()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all the clubs within a franchise
     *
     * @return void
     */
    public function get_clubs()
    {
        $pagination = create_pagination();
        $clubs = Club::select(
            DB::raw('SQL_CALC_FOUND_ROWS club.club_id'),
            'club.title',
            'club.slug',
            'club.type',
            'club.logo_url',
            'club.email',
            'club.telephone',
            'club.emergency_telephone',
            'club.website',
            'club.address',
            'club.address2',
            'club.town',
            'club.postcode',
            'club.ss_company',
            'club.company_number',
            'club.fa_affiliation',
            'club.vat_number',
            'club.vat_rate'
        )
            ->where('club.franchise_id', $this->franchise_id)
            ->where(function ($query) {
                //allow filter by team name
                if (isset($this->request['name']) && !empty($this->request['name'])) {
                    $query->where('club.title', 'like', '%' . $this->request['name'] . '%');
                }
                return $query;
            })
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        $clubs->load('agegroups');
        return format_response($clubs, $count);
    }

    /**
     * Get the club with club_id
     *
     * @param int $club_id
     * @return void
     */
    public function get_club($club_id)
    {
        if ($club_id == 'my') {
            $club_id = $this->club_id;
        }
        $club = Club::select('club.*')
            ->where('club.franchise_id', $this->franchise_id)
            ->where('club.club_id', $club_id)
            ->first();
        $kits = KittItem::where('club_id', $club_id)
            ->where('franchise_id', $this->franchise_id)
            ->get();
        $skills = Skill::where('club_id', $club_id)
            ->where('franchise_id', $this->franchise_id)
            ->get();
        $accounts = Account::where('club_id', $club_id)
            ->where('franchise_id', $this->franchise_id)
            ->get();
        $agegroups = AgeGroup::select(
            DB::raw('(SELECT COUNT(*) FROM team WHERE team.club_id = ' . $club_id . ' AND team.agegroup_id = agegroup.agegroup_id ) AS teams_no'),
            'agegroup.*'
        )
            ->leftJoin('rel_agegroup_club', 'rel_agegroup_club.agegroup_id', '=', 'agegroup.agegroup_id')
            ->where('rel_agegroup_club.club_id', $club_id)
            ->get();
        $teams = Team::where('club_id', $club_id)
            ->with('sponsors')
            ->where('franchise_id', $this->franchise_id)
            ->get();
        if (!empty($teams)) {
            $teams->load('skillgroups');
        }

        $packages = RelClubPackage::select([
            'rel_club_package.expire_date',
            'rel_club_package.amount',
            'rel_club_package.package_id',
            'rel_club_package.club_id',
            'package.title',
            'package.description',
            'package.price',
            'package.max_slot'
        ])->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id')
        ->where('rel_club_package.club_id', $club_id)
        ->get();

        $club['kits'] = $kits;
        $club['skills'] = $skills;
        $club['accounts'] = $accounts;
        $club['agegroups'] = $agegroups;
        $club['teams'] = $teams;
        $club['packages'] = $packages;
        return response()->json($club, 200);
    }

    /**
     * Create a new club
     *
     * @return void
     */
    public function create_club()
    {
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:club',
            'rel_club_package_id' => 'required|int|min:1|exists:rel_club_package,id',
            'vat_rate' => 'int|min:0|max:99',
            'threshold' => 'int|min:0',
            'threshold_date' => 'date_format:Y-m-d',
            'fc_company' => 'string|max:255',
            'ss_company' => 'string|max:255',
            'users' => 'array|min:1',
            'users.*.first_name' => 'string|max:100',
            'users.*.last_name' => 'string|max:100',
            'users.*.email' => 'email',
            'users.*.password' => 'string'
        ],[
            'title.required' => 'Club name is required.',
            'slug.required' => 'This URL has been taken.'
        ]);

        if (in_array($this->request['slug'], gr_reserved_slugs())) {
            return response()->json('Reserved slug', 403);
        }

        $club = new Club;
        $club->franchise_id = $this->franchise_id;
        $club->title = $this->request['title'];
        $club->slug = $this->request['slug'];
        $club->vat_rate = isset($this->request['vat_rate']) ? $this->request['vat_rate'] : 20;
        $club->threshold = isset($this->request['threshold']) ? $this->request['threshold'] : 0;
        $club->threshold_date = isset($this->request['threshold_date']) ? $this->request['threshold_date'] : NULL;
        $club->fc_company = isset($this->request['fc_company']) ? $this->request['fc_company'] : NULL;
        $club->ss_company = isset($this->request['ss_company']) ? $this->request['ss_company'] : NULL;

        $this->request->has('address') ? $club->address = $this->request->address : '';
        $this->request->has('address2') ? $club->address2 = $this->request->address2 : '';
        $this->request->has('town') ? $club->town = $this->request->town : '';
        $this->request->has('city') ? $club->city = $this->request->city : '';
        $this->request->has('company_number') ? $club->company_number = $this->request->company_number : '';
        $this->request->has('email') ? $club->email = $this->request->email : '';
        $this->request->has('fa_affiliation') ? $club->fa_affiliation = $this->request->fa_affiliation : '';
        $this->request->has('postcode') ? $club->postcode = $this->request->postcode : '';
        $this->request->has('telephone') ? $club->telephone = $this->request->telephone : '';
        $this->request->has('type') ? $club->type = $this->request->type : '';
        $this->request->has('vat_number') ? $club->vat_number = $this->request->vat_number : '';
        $this->request->has('website') ? $club->website = $this->request->website : '';

        $club->save();

        //manage image upload
        if (isset($this->request['logo_url']) && !empty($this->request['logo_url']) && $this->request->hasFile('logo_url')) {
            //delete the old image
            if (!empty($club->logo_url)) {
                gr_delete_file($club->logo_url);
            }
            $image = $this->request->file('logo_url');
            $image_url = gr_save_file($image, 'clubs', $club->club_id);
            $club->logo_url = $image_url;
        }

        $club->save();

        $rel_club_package = RelClubPackage::find($this->request['rel_club_package_id']);
        $rel_club_package->club_id = $club->club_id;
        $rel_club_package->save();

        $ageGroups = AgeGroup::all();

        // Making relation with age group
        $ageGroups->each(function($ageGroup) use($club){
            $relAgeGroupCLub = new RelAgegroupClub();
            $relAgeGroupCLub->club_id = $club->club_id;
            $relAgeGroupCLub->agegroup_id = $ageGroup->agegroup_id;
            $relAgeGroupCLub->created_by = $this->user_id;
            $relAgeGroupCLub->updated_by = $this->user_id;

            $relAgeGroupCLub->save();
        });

        //save into subscription history
        $subscription = new SubscriptionHistory;
        $subscription->package_id = $rel_club_package->package_id;
        $subscription->club_id = $club->club_id;
        $subscription->start = $rel_club_package->start_date;
        $subscription->end = $rel_club_package->expire_date;
        $subscription->amount = $rel_club_package->amount;
        $subscription->save();

        if (
            isset($this->request['users']) &&
            !empty($this->request['users'])
        ) {
            foreach ($this->request['users'] as $user) {
                if (!empty($user)) {
                    $this->create_user($user, $club->club_id);
                }
            }
        }

        //make group admin a club admin
        $this->create_user(Auth::user(), $club->club_id);

        return response()->json($club, 200);
    }

    /**
     * Update the club with club_id
     *
     * @param int $club_id
     * @return void
     */
    public function update_club($club_id)
    {
        if ($club_id == 'my') {
            $club_id = $this->club_id;
        }
        $this->validate($this->request, [
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:club',
            'type' => 'string|max:20',
            'logo_url' => 'file|image|max:1024',
            'email' => 'email',
            'telephone' => 'string|max:30',
            'emergency_telephone' => 'string|max:30',
            'website' => 'string|max:255',
            'facebook_url' => 'string|max:255',
            'twitter_url' => 'string|max:255',
            'instagram_url' => 'string|max:255',
            'address' => 'string|max:255',
            'town' => 'string|max:255',
            'postcode' => 'string|max:30',
            'company_number' => 'string|max:255',
            'vat_number' => 'string|max:255',
            'vat_rate' => 'int|min:0|max:99',
            'threshold' => 'int|min:0',
            'threshold_date' => 'date_format:Y-m-d',
            'status' => 'integer|min:0|max:1',
            'agegroups' => 'array|min:1',
            'teams' => 'array|min:1',
            'fc_company' => 'string|max:255',
            'ss_company' => 'string|max:255'
        ],
            [
                'logo_url.max' => 'Club logo image cannot be bigger than 1MB',
            ]);

        if (in_array($this->request['slug'], gr_reserved_slugs())) {
            return response()->json('Reserved slug', 403);
        }

        $club = Club::find($club_id);

        if (isset($this->request['title']) && !empty($this->request['title'])) {
            $club->title = $this->request['title'];
        }
        if (isset($this->request['slug']) && !empty($this->request['slug'])) {
            $club->slug = $this->request['slug'];
        }
        if (isset($this->request['type']) && !empty($this->request['type'])) {
            $club->type = $this->request['type'];
        }
        if (isset($this->request['email']) && !empty($this->request['email'])) {
            $club->email = $this->request['email'];
        }
        if (isset($this->request['telephone']) && !empty($this->request['telephone'])) {
            $club->telephone = $this->request['telephone'];
        }
        if (isset($this->request['emergency_telephone']) && !empty($this->request['emergency_telephone'])) {
            $club->emergency_telephone = $this->request['emergency_telephone'];
        }
        if (isset($this->request['website']) && !empty($this->request['website'])) {
            $club->website = $this->request['website'];
        }
        if (isset($this->request['address']) && !empty($this->request['address'])) {
            $club->address = $this->request['address'];
        }
        if (isset($this->request['address2']) && !empty($this->request['address'])) {
            $club->address2 = $this->request['address2'];
        }
        if (isset($this->request['town']) && !empty($this->request['town'])) {
            $club->town = $this->request['town'];
        }
        if (isset($this->request['postcode']) && !empty($this->request['postcode'])) {
            $club->postcode = $this->request['postcode'];
        }
        if (isset($this->request['company_number']) && !empty($this->request['company_number'])) {
            $club->company_number = $this->request['company_number'];
        }
        if (isset($this->request['fa_affiliation'])) {
            $club->fa_affiliation = $this->request->fa_affiliation;
        }
        if (isset($this->request['vat_number'])) {
            $club->vat_number = $this->request['vat_number'];
        }
        if (isset($this->request['vat_rate'])) {
            $club->vat_rate = $this->request['vat_rate'];
        }
        if (isset($this->request['threshold']) && !empty($this->request['threshold'])) {
            $club->threshold = $this->request['threshold'];
        }
        if (isset($this->request['threshold_date']) && !empty($this->request['threshold_date'])) {
            $club->threshold_date = $this->request['threshold_date'];
        }
        if (isset($this->request['fc_company']) && !empty($this->request['fc_company'])) {
            $club->fc_company = $this->request['fc_company'];
        }
        if (isset($this->request['ss_company']) && !empty($this->request['ss_company'])) {
            $club->ss_company = $this->request['ss_company'];
        }
        if (isset($this->request['status'])) {
            $club->status = $this->request['status'];
        }
        if (isset($this->request['facebook'])) {
            $club->facebook_url = $this->request->facebook;
        }
        if (isset($this->request['twitter'])) {
            $club->twitter_url = $this->request->twitter;
        }
        if (isset($this->request['instagram'])) {
            $club->instagram_url = $this->request->instagram;
        }
        if (isset($this->request['youtube'])) {
            $club->youtube_url = $this->request->youtube;
        }

        $club->updated_by = $this->user_id;
        //manage image upload
        if (isset($this->request['logo_url']) && !empty($this->request['logo_url']) && $this->request->hasFile('logo_url')) {
            //delete the old image
            if (!empty($club->logo_url)) {
                gr_delete_file($club->logo_url);
            }
            $image = $this->request->file('logo_url');
            $image_url = gr_save_file($image, 'clubs', $club_id);
            $club->logo_url = $image_url;
        }

        $club->save();

        //update age groups for this club
        if (isset($this->request['agegroups']) && !empty($this->request['agegroups'])) {

            //remove old relations
            $existing_teams_in_agegroups = Team::select('agegroup_id')
                ->where('club_id', $club_id)
                ->groupBy('agegroup_id')
                ->get()->pluck('agegroup_id');

            $errors = array();
            foreach ($existing_teams_in_agegroups as $id) {
                if (in_array($id, $this->request['agegroups'])) {
                    continue;
                } else {
                    $errors[] = $id;
                }
            }

            if (!empty($errors)) {
                $titles = array();
                foreach ($errors as $agid) {
                    $agegr = AgeGroup::find($agid);
                    $titles[] = $agegr['title'];
                }
                return response()->json("Cannot remove the following agegroups because there are teams assigned to them: " . implode(",", $titles), 401);
            }
            // $test = array_diff($this->request['agegroups'], $existing_teams_in_agegroups);

            RelAgegroupClub::where('club_id', $club_id)->delete();

            // RelAgegroupClub::where('club_id', $club_id)->whereNotIn('agegroup_id', $existing_teams_in_agegroups)->delete();
            //create new ones
            foreach ($this->request['agegroups'] as $agegroup_id) {
                $rel_agegroup_club = new RelAgegroupClub;
                $rel_agegroup_club->agegroup_id = $agegroup_id;
                $rel_agegroup_club->club_id = $club_id;
                $rel_agegroup_club->created_by = $this->user_id;
                $rel_agegroup_club->updated_by = $this->user_id;
                $rel_agegroup_club->save();
            }
        }

        //create the teams
        if (isset($this->request['teams']) && !empty($this->request['teams'])) {
            $this->validate($this->request, [
                'teams.*.agegroup_id' => 'required|int|exists:agegroup,agegroup_id',
                'teams.*.title' => 'required|string|max:255',
                'teams.*.max_size' => 'required|int|min:1',
                'teams.*.team_id' => 'int|exists:team,team_id',
                'teams.*.rank' => 'int'
            ]);
            foreach ($this->request['teams'] as $team_data) {

                //if its a new team create it else update it
                if (!isset($team_data['team_id']) || empty($team_data['team_id'])) {
                    $team = new Team;
                    $team->franchise_id = $this->franchise_id;
                    $team->club_id = $club_id;
                    $team->agegroup_id = $team_data['agegroup_id'];
                    if (isset($team_data['rank'])) {
                        $team->rank = $team_data['rank'];
                    }
                    $team->type = $this->request['team_type'] == 'fc' ? 'team' : 'skill-group';
                    $team->title = $team_data['title'];
                    $team->max_size = $team_data['max_size'];
                    $team->created_by = $this->user_id;
                    $team->updated_by = $this->user_id;
                    $team->status = 1;
                    $team->save();
                } else {
                    $team = Team::find($team_data['team_id']);
                    $team->title = $team_data['title'];
                    $team->max_size = $team_data['max_size'];
                    if (isset($team->rank)) {
                        $team->rank = $team_data['rank'];
                    }
                    $team->updated_by = $this->user_id;
                    $team->save();
                }
            }
        }

        //create the default accounts (bank and cash)
        if (isset($this->request['type']) && !empty($this->request['type'])) {
            switch ($this->request['type']) {
                case 'academy':
                    //we need to create a cash and bank account academy
                    if (empty($club->ss_account_created)) {
                        gr_create_academy_default_accounts($this->franchise_id, $club_id);
                    }
                    break;
                case 'fc':
                    //we need to create a cash and bank account fc
                    if (empty($club->fc_account_created)) {
                        gr_create_fc_default_accounts($this->franchise_id, $club_id);
                    }
                    break;
                case 'both':
                    //we need to create a cash and bank account for both academy and fc
                    if (empty($club->fc_account_created)) {
                        gr_create_fc_default_accounts($this->franchise_id, $club_id);
                    }
                    if (empty($club->ss_account_created)) {
                        gr_create_academy_default_accounts($this->franchise_id, $club_id);
                    }
                    break;
                default:
                    break;
            }
        }

        // Age group relation if not exists then make relation club with age group
        $ageGroupsId = RelAgegroupClub::where('club_id', $club_id)
            ->get()
            ->pluck('agegroup_id');

        $ageGroups = AgeGroup::whereNotIn('agegroup_id', $ageGroupsId)
            ->get();

        $ageGroups->map(function($ageGroup) use($club_id){
            $relCluGroup = new RelAgegroupClub();
            $relCluGroup->club_id = $club_id;
            $relCluGroup->agegroup_id = $ageGroup->agegroup_id;
            $relCluGroup->updated_by = $this->user_id;

            $relCluGroup->save();
        });

        // Creating users if exists.
        if (isset($this->request['users']) && !empty($this->request['users'])) {
            foreach ($this->request['users'] as $user) {
                if (!empty($user)) {
                    $this->create_user($user, $club->club_id);
                }
            }
        }

        return response()->json($club, 200);
    }

    /**
     * Delete the club with club_id
     *
     * @param int $club_id
     * @return void
     */
    public function delete_club($club_id)
    {
        if ($this->club_id != $club_id) {
            return response()->json('You do not have sufficient permissions to delete this club', 403);
        }
        $club = Club::find($club_id);
        $club->delete();
        //delete club skill relation
        $club_skill = RelClubSkill::where('club_id', $club_id)->delete();
        //delete club age groups relation
        RelAgegroupClub::where('club_id', $club_id)->delete();
        //on club deletion we will set club_id = 0 in all the tables from DB
        $query = "
            SELECT table_name
            FROM information_schema.COLUMNS
            WHERE column_name = 'club_id' AND table_schema = 'grassroots_beta';
        ";
        $tables = DB::select($query);
        foreach ($tables as $table) {
            $query = "
                UPDATE {$table->table_name}
                SET club_id = 0
                WHERE club_id = {$club_id};
            ";
            $update = DB::update($query);
        }
        return response()->json("Club successfully deleted", 200);
    }


    /**
     * @param $user_data
     * @param $club_id
     * @return User|bool|\Symfony\Component\HttpFoundation\Response
     */
    public function create_user($user_data, $club_id)
    {
        // only save if we have user and club id
        if (!empty($user_data) && !empty($club_id)) {

            $user_exists = User::where('email', $user_data['email'])
                ->where('club_id', $club_id)
                ->first();
            if (!empty($user_exists)) {
                return response()->json('User with email ' . $user_data['email'] . ' already exists', 422);
            }

            $address = new Address;
            $address->franchise_id = $this->franchise_id;
            $address->club_id = $club_id;
            $address->first_name = $user_data['first_name'];
            $address->last_name = $user_data['last_name'];
            $address->title = $user_data['first_name'] . " " . $user_data['last_name'];
            $address->email = $user_data['email'];
            $address->contact_name = $user_data['first_name'] . " " . $user_data['last_name'];
            $address->telephone = isset($user_data['telephone']) ? $user_data['telephone'] : NULL;
            $address->type_id = get_address_type_id('admin');
            $address->created_by = $this->user_id;
            $address->updated_by = $this->user_id;
            $address->status = 1;
            $address->save();

            //dont hash auth user password twice
            $auth_user = Auth::user();

            if ($auth_user->email == $user_data['email']) {
                $password = $user_data['password'];
                $is_auth_user = true;
            } else {
                $password = Hash::make($user_data['password']);
                $is_auth_user = false;
            }

            //create the user
            $user = new User;
            $user->franchise_id = $this->franchise_id;
            $user->club_id = $club_id;
            $user->email = $user_data['email'];
            $user->api_key = str_random(80) . time();
            $user->password = $password;
            $user->user_role = gr_get_role_id('admin');
            $user->first_name = $user_data['first_name'];
            $user->last_name = $user_data['last_name'];
            $user->display_name = $user_data['first_name'] . " " . $user_data['last_name'];
            $user->telephone = isset($user_data['telephone']) ? $user_data['telephone'] : NULL;
            $user->status = 1; //active by default
            $user->save();

            //sent email to user //todo uncomment email send
            if (empty($is_auth_user)) {
                Mail::send('emails.new-user', ['name' => $user->display_name, 'email' => $user->email, 'password' => $user_data['password']], function ($message) use ($user) {
                    $message->subject('Welcomme to GrassRoots');
                    $message->to("raul@xanda.net");
                });
            }

            return $user;
        }
        return false;
    }

    /**
     * Get all teams from a club.
     * @param string $type
     * @return json
     */
    public function get_teams($club_id)
    {
        $this->validate($this->request, [
            'type' => 'required|string|in:team,skill-group'
        ]);
        $teams = DB::table('team')
            ->select('team.team_id AS id', 'team.title AS title', 'agegroup.title AS agegroup_title', 'agegroup.max_age')
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->where('team.franchise_id', $this->franchise_id)
            ->where('team.club_id', $club_id)
            ->where(function ($query) {
                //filter by team type
                if (isset($this->request['type']) && !empty($this->request['type'])) {
                    $query->where('team.type', $this->request['type']);
                }
                return $query;
            })
            ->groupBy('team.team_id')
            ->orderBy('agegroup.max_age', 'DESC')
            ->orderBy('team.title')
            ->get();
        return response()->json($teams, 200);
    }

    /**
     * Get all skills from a club.
     * @param int $club_id
     * @return json
     */
    public function get_skills($club_id)
    {
        $skills = Skill::select(
            DB::raw('SQL_CALC_FOUND_ROWS skill.skill_id'),
            'skill.title',
            'skill_category.title AS category',
            'skill.category_id'
        )
            ->leftJoin('skill_category', 'skill.category_id', '=', 'skill_category.category_id')
            ->where('skill.franchise_id', $this->franchise_id)
            ->where('skill.club_id', $club_id)
            ->orderBy('skill_category.category_id')
            ->orderBy('skill.title')
            ->get();

        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        return format_response($skills, $count, NULL);
    }

    /**
     * Get all kits from a club.
     * @param int $club_id
     * @return json
     */
    public function get_kits($club_id)
    {
        $kits = KittItem::select(
            DB::raw('SQL_CALC_FOUND_ROWS  kit_item.kit_id AS id'),
            'kit_item.kit_id',
            'kit_item.title',
            'kit_type.title AS category',
            'kit_item.type_id',
            'kit_item.product_sku'
        )
            ->leftJoin('kit_type', 'kit_type.type_id', '=', 'kit_item.type_id')
            ->where('kit_item.franchise_id', $this->franchise_id)
            ->where('kit_item.club_id', $club_id)
            ->orderBy('kit_type.type_id')
            ->orderBy('kit_item.title')
            ->get();
        $kits->load('available_sizes');
        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        return format_response($kits, $count, NULL);
    }

    /**
     * Update the package for this club.
     * @param int $id [rel_club_package id]
     * @return json
     */
    public function update_package($id)
    {
        $this->validate($this->request, [
            'package_id' => 'required|int|exists:package,id'
        ]);
        $rel_club_package = RelClubPackage::find($id);
        //if we have a club assigned to this package we need to check the avaiable slots
        if (!empty($rel_club_package->club_id)) {
            $package = Package::find($this->request['package_id']);
            $player_no = gr_get_registered_players($rel_club_package->club_id);
            if ($player_no > $package->max_slot) {
                return response()->json('You alredy have more players then max slots in this package', 401);
            }
        }
        $rel_club_package->package_id = $this->request['package_id'];
        $rel_club_package->amount = gr_get_package_price($this->request['package_id']);
        $rel_club_package->save();
        return response()->json('Subscription Updated');
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function activate_deactivate_package($id)
    {
        //function under superadmin and groupadmin middleware
        $this->validate($this->request, [
            'status' => 'required|min:0|max:1'
        ]);
        $auth_user = Auth::user();
        $rel_club_package = RelClubPackage::find($id);
        if (empty($rel_club_package)) {
            return response()->json('Not found', 404);
        }

        //group admins can only activate/deactivate their own packages
        if ($auth_user->hasRole('groupadmin') && $rel_club_package->franchise_id != $this->franchise_id) {
            return response()->json('You cannot update this club', 403);
        }

        $rel_club_package->status = $this->request['status'];

        if($this->request->has('super_admin_status')){
            $rel_club_package->super_admin_status = $this->request['super_admin_status'];
        }
        $rel_club_package->save();

        //if a club is assigned to this package update club status
        if (!empty($rel_club_package->club_id)) {
            $club = Club::find($rel_club_package->club_id);
            $club->status = $this->request['status'];
            $club->save();
        }
        return response()->json($rel_club_package);
    }

    /**
     * Get all the admins form $club_id.
     * @param int $club_id
     * @return json
     */
    public function get_admins($club_id)
    {
        $admins = User::where('user_role', gr_get_role_id('admin'))
            ->where('club_id', $club_id)
            ->get();
        return format_response($admins, $admins->count(), NULL);
    }

    /**
     * Get the package details for the $club_id.
     * @param int $club_id
     * @return json
     */
    public function get_packages($club_id)
    {
        if ($club_id == 'my') {
            $club_id = $this->club_id;
        }
        $packages = RelClubPackage::select(
            'rel_club_package.package_id', 'rel_club_package.start_date', 'rel_club_package.expire_date', 'rel_club_package.amount', 'rel_club_package.status',
            'package.title AS package_title', 'package.max_slot',
            DB::raw('(SELECT COUNT(*) FROM player WHERE player.club_id = ' . $club_id . ' AND player.status = 1 ) AS active_players')
        )
            ->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id')
            ->where('rel_club_package.club_id', $club_id)
            ->first();

        return response()->json($packages);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function add_size_chart(){
        //validate the Request
        $this->validate($this->request,[
            'image'=> 'required|file|max:1024'
        ],
        [
            'image.max' => 'Size Chart image cannot be bigger than 1 MB'
        ]);

        $club = Club::find($this->club_id);
        $image = $this->request->file('image');
        $image_url = gr_save_file($image, 'kit-size', $this->club_id);
        $club->size_chart = $image_url;
        $club->save();

        return response()->json('success');

    }
}
