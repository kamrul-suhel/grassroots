<?php

namespace App\Http\Controllers;

use App\Invoice;
use App\Session;
use App\Transaction;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\RelQualificationUser;
use App\RelCoachTeam;
use App\CoachInfo;
use App\Address;
use App\User;
use App\Scan;
use Auth;
use DB;

class CoachController extends Controller
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
        $this->middleware('role:admin', ['only' => ['get_coaches']]);
        $this->middleware('role:coach', ['only' => ['get_coach_players']]);
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
        $this->user_id = Auth::id();
    }

    /**
     * Get all coaches registered under logged in user franchise and club
     *
     * @return json
     */
    public function get_coaches()
    {
        $role_id = gr_get_role_id('coach');
        $pagination = create_pagination();
        $coaches = User::select(
            DB::raw('SQL_CALC_FOUND_ROWS user.user_id'),
            DB::raw('(SELECT COUNT(*) FROM scan WHERE scan.user_id = user.user_id AND scan.expire BETWEEN curdate() AND DATE_ADD(curdate(), INTERVAL 3 MONTH) ) AS due_to_expire'),
            DB::raw('(SELECT COUNT(*) FROM scan WHERE scan.user_id = user.user_id AND scan.expire < curdate()) AS expired'),
            'user.email',
            'user.user_role',
            'user.pic',
            'user.first_name',
            'user.last_name',
            'user.dob',
            'user.display_name',
            'user.mobile',
            'user.telephone',
            'user.address',
            'user.town',
            'user.postcode',
            'user.auto_send_skills_reports'
        )
            ->leftJoin('rel_coach_team', 'rel_coach_team.coach_id', '=', 'user.user_id')
            ->where('user.franchise_id', '=', $this->franchise_id)
            ->where('user.club_id', '=', $this->club_id)
            ->where('user.user_role', $role_id)
            ->where(function ($query) {
                //allow filter by coach assigned team
                if (isset($this->request['team']) && !empty($this->request['team'])) {
                    $query->where('rel_coach_team.team_id', $this->request['team']);
                }
                //allow filter by skill group assigned team
                if (isset($this->request['skill_group']) && !empty($this->request['skill_group'])) {
                    $query->where('rel_coach_team.team_id', $this->request['skill_group']);
                }
                //allow filter by status
                if (isset($this->request['status'])) {
                    $query->where('user.status', $this->request['status']);
                }
                //allow search by coach name or email
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('user.first_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('user.last_name', 'like', '%' . $this->request['search'] . '%')
                        ->orWhere('user.email', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->groupBy('user.user_id')
            ->orderBy('user.display_name')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        //count the results so we can use them in pagination
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;

        $search = create_filter('search', 'Search');
        $filters = [$search];
        $coaches->load('teams');
        return format_response($coaches, $count, $filters);
    }

    /**
     * Get the coach with $coach_id
     *
     * @param int $coach_id
     * @return json
     */
    public function get_coach($coach_id)
    {
        //make sure user has role coach
        $user = User::find($coach_id);
        if (!$user->hasRole('coach')) {
            return response()->json('User is not coach', 403);
        }
        $coach = User::select(
            'user.user_id',
            'user.email',
            'user.user_role',
            'user.pic',
            'user.first_name',
            'user.last_name',
            'user.display_name',
            'user.dob',
            'user.mobile',
            'user.telephone',
            'user.address',
            'user.town',
            'user.postcode',
            'coach_info.fan_number',
            'coach_info.rate',
            'coach_info.show_money_owned',
            'coach_info.utr_number',
            'user.auto_send_skills_reports'
        )
            ->leftJoin('coach_info', 'coach_info.user_id', '=', 'user.user_id')
            ->where('user.franchise_id', '=', $this->franchise_id)
            ->where('user.club_id', '=', $this->club_id)
            ->where('user.user_id', $coach_id)
            ->first();
        //get the qualifications
        $qualifications = DB::table('qualification')
            ->select('qualification.qualification_id', 'qualification.title', 'qualification.qualification_id AS id', 'qualification.title AS title', 'rel_qualification_user.file_url')
            ->leftJoin('rel_qualification_user', 'rel_qualification_user.qualification_id', '=', 'qualification.qualification_id')
            ->where('rel_qualification_user.user_id', $coach_id)
            ->get();
        //get the documents
        $documents = DB::table('scan')
            ->select('scan.scan_id', 'scan.title', 'scan.file_url', 'scan.expire', 'scan.status', 'scan_type.type_id', 'scan_type.title AS type')
            ->leftJoin('scan_type', 'scan_type.type_id', '=', 'scan.type_id')
            ->where('scan.user_id', $coach_id)
            ->get();
        //get the teams this coach is assigned to
        $teams = DB::table('team')
            ->select('team.team_id', 'team.title', 'team.team_id AS id', 'team.title AS title', 'team.logo_url', 'agegroup.title AS agegroup_title')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
            ->where('rel_coach_team.coach_id', $coach_id)
            ->get();
        //load the teams, qualifications and documents
        $coach['teams'] = $teams;
        $coach['qualifications'] = $qualifications;
        $coach['documents'] = $documents;
        return response()->json($coach, 200);
    }

    /**
     * Create a new coach
     *
     * @return json
     */
    public function create_coach()
    {
        //validate the request
        $this->validate($this->request, [
            'email' => 'required|email|unique:user',
            'password' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'string|date_format:Y-m-d|before:today',
            'telephone' => 'required|string|max:30',
            'mobile' => 'string|max:30',
            'address' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'postcode' => 'required|string|max:30',
            'rate' => 'required|between:0,99.99',
            'pic' => 'file|image|max:1024',
            'qualifications' => 'array',
            'qualifications.*.qualification_id' => 'integer|min:1',
            'qualifications.*.file_url' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'qualifications.*.expiration_date' => 'date_format:Y-m-d H:i:s|after:today',
            'crb_expiry' => 'required|date_format:Y-m-d H:i:s|after:today',
            'crb_scan' => 'required|file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'sc_expiry' => 'required|date_format:Y-m-d H:i:s|after:today',
            'sc_scan' => 'required|file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'fa_level_1_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'fa_level_2_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'ea_expiry' => 'required|date_format:Y-m-d H:i:s|after:today',
            'ea_scan' => 'required|file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'fan_number' => 'string|max:255',
            'fa_coaching_licence_expiry' => 'date_format:Y-m-d H:i:s|after:today',
            'fa_coaching_licence_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'teams' => 'array'
        ],
            [
                'ea_expiry' => 'Emergency Aid certificate expiration date required',
                'ea_scan.required' => 'Emergency Aid certificate required',
                'pic.max' => 'Profile image cannot be bigger than 1 MB',
                'qualifications.*.file_url.max' => 'Qualifications image cannot be bigger than 1 MB',
                'crb_scan.max' => 'CRB scan cannot be bigger than 1 MB',
                'sc_scan.max' => 'SC scan cannot be bigger than 1 MB',
                'fa_level_1_scan.max' => 'The FA LEVEL 1 file uploaded may not be greater than 1 MB',
                'ea_scan.max' => 'Emergency Aid scan cannot be bigger than 1 MB',
                'fa_coaching_licence_scan.max' => 'FA licence scan cannot be bigger than 1 MB'
            ]);

        //create the address book entry for this coach
        $address = new Address;
        $address->franchise_id = $this->franchise_id;
        $address->club_id = $this->club_id;
        $address->address = $this->request['address'];
        $address->city = $this->request['town'];
        $address->postcode = $this->request['postcode'];
        $address->title = $this->request['first_name'] . ' ' . $this->request['last_name'];
        $address->telephone = $this->request['telephone'];
        $address->mobile = isset($this->request['mobile']) ? $this->request['mobile'] : NULL;
        $address->email = $this->request['email'];
        $address->contact_name = $this->request['first_name'] . ' ' . $this->request['last_name'];
        $address->type_id = get_address_type_id('coach');
        $address->created_by = $this->user_id;
        $address->updated_by = $this->user_id;
        $address->status = 1;
        $coordinates = gr_get_coordinates($this->request['postcode'], $this->request['town']);
        $address->lat = $coordinates['lat'];
        $address->lng = $coordinates['lng'];
        $address->save();

        //create the user
        $coach = new User;
        $coach->franchise_id = $this->franchise_id;
        $coach->club_id = $this->club_id;
        $coach->email = $this->request['email'];
        $coach->api_key = str_random(80) . time();
        $coach->access_level = 0; //hardcoded -- this field is not used yet
        $coach->password = Hash::make($this->request['password']);
        $coach->user_role = gr_get_role_id('coach');
        $coach->first_name = $this->request['first_name'];
        $coach->last_name = $this->request['last_name'];
        $coach->dob = isset($this->request['dob']) ? $this->request['dob'] : NULL;
        $coach->display_name = $this->request['first_name'] . ' ' . $this->request['last_name'];
        $coach->mobile = isset($this->request['mobile']) ? $this->request['mobile'] : NULL;
        $coach->telephone = $this->request['telephone'];
        $coach->address_id = $address->address_id;
        $coach->address = $this->request['address'];
        $coach->town = $this->request['town'];
        $coach->postcode = $this->request['postcode'];
        $coach->auto_send_skills_reports = 1; //hardcoded -- this field is not used yet
        $coach->status = 1; //active by default

        //handle profile picture upload
        if (isset($this->request['pic']) && !empty($this->request['pic']) && $this->request->hasFile('pic')) {
            $file = $this->request->file('pic');
            $file_url = gr_save_file($file, 'coaches', $this->franchise_id);
            $coach->pic = $file_url;
        }
        $coach->save();

        //save additional coach info
        $coach_info = new CoachInfo;
        $coach_info->user_id = $coach->user_id;
        $coach_info->fan_number = isset($this->request['fan_number']) ? $this->request['fan_number'] : NULL;
        $coach_info->show_money_owned = isset($this->request['show_money_owned']) ? $this->request['show_money_owned'] : NULL;
        $coach_info->rate = $this->request['rate'];
        $this->request->has('utr_number') ? $coach_info->utr_number = $this->request->utr_number : null;
        $coach_info->save();

        //save qualifications
        if (isset($this->request['qualifications']) && !empty($this->request['qualifications'])) {
            foreach ($this->request['qualifications'] as $qualification) {
                $rel_qualification_user = new RelQualificationUser;
                $rel_qualification_user->user_id = $coach->user_id;
                $rel_qualification_user->qualification_id = $qualification['qualification_id'];
                $rel_qualification_user->expiration_date = isset($qualification['expiration_date']) ? $qualification['expiration_date'] : null;
                if (!empty($qualification['file_url'])) {
                    $file = $qualification['file_url'];
                    $file_url = gr_save_file($file, 'qualifications', $coach->user_id);
                    $rel_qualification_user->file_url = $file_url;
                }
                $rel_qualification_user->save();
            }
        }

        //save teams
        if (isset($this->request['teams']) && !empty($this->request['teams'])) {
            foreach ($this->request['teams'] as $team_id) {
                $rel_coach_team = new RelCoachTeam;
                $rel_coach_team->coach_id = $coach->user_id;
                $rel_coach_team->team_id = $team_id;
                $rel_coach_team->save();
            }
        }

        //manage the CRB
        $scan = new Scan;
        $scan->user_id = $coach->user_id;
        $scan->title = 'CRB Scan';
        $scan->type_id = 1; //hardcoded CRB
        $scan->expire = $this->request['crb_expiry'];
        $scan->status = 1; //hardcoded active by default
        if (isset($this->request['crb_scan']) && !empty($this->request['crb_scan']) && $this->request->hasFile('crb_scan')) {
            $file = $this->request->file('crb_scan');
            $file_url = gr_save_file($file, 'crb', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        //manage the SC
        $scan = new Scan;
        $scan->user_id = $coach->user_id;
        $scan->title = 'Safeguarding Children Scan';
        $scan->type_id = 2; //hardcoded SC
        $scan->expire = $this->request['sc_expiry'];
        $scan->status = 1; //hardcoded active by default
        if (isset($this->request['sc_scan']) && !empty($this->request['sc_scan']) && $this->request->hasFile('sc_scan')) {
            $file = $this->request->file('sc_scan');
            $file_url = gr_save_file($file, 'sc', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        //manage the FA Level 1
        $scan = new Scan;
        $scan->user_id = $coach->user_id;
        $scan->title = 'FA Level 1 Scan';
        $scan->type_id = 3; //hardcoded FA Level 1
        $scan->status = 1; //hardcoded active by default
        if ($this->request->hasFile('fa_level_1_scan')) {
            $file = $this->request->file('fa_level_1_scan');
            $file_url = gr_save_file($file, 'fa-level-1', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        //manage the FA Level 2
        $scan = new Scan();
        $scan->user_id = $coach->user_id;
        $scan->title = 'FA Level 2 Scan';
        $scan->type_id = 3; //hardcoded FA Level 1
        $scan->status = 1; //hardcoded active by default
        if ($this->request->hasFile('fa_level_2_scan')) {
            $file = $this->request->file('fa_level_2_scan');
            $file_url = gr_save_file($file, 'fa-level-2', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        //manage EA
        $scan = new Scan;
        $scan->user_id = $coach->user_id;
        $scan->title = 'Emergency Aid Scan';
        $scan->type_id = 4; //hardcoded EA
        $scan->expire = $this->request['ea_expiry'];
        $scan->status = 1; //hardcoded active by default
        if (isset($this->request['ea_scan']) && !empty($this->request['ea_scan']) && $this->request->hasFile('ea_scan')) {
            $file = $this->request->file('ea_scan');
            $file_url = gr_save_file($file, 'ea', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        //manage FA coaching licence
        $scan = new Scan;
        $scan->user_id = $coach->user_id;
        $scan->title = 'FA Coaching Licence';
        $scan->type_id = 5; //hardcoded FA Coaching Licence
        $scan->expire = $this->request['fa_coaching_licence_expiry'];
        $scan->status = 1; //hardcoded active by default
        if (isset($this->request['fa_coaching_licence_scan']) && !empty($this->request['fa_coaching_licence_scan']) && $this->request->hasFile('fa_coaching_licence_scan')) {
            $file = $this->request->file('fa_coaching_licence_scan');
            $file_url = gr_save_file($file, 'fa-coaching-licence', $coach->user_id);
            $scan->file_url = $file_url;
        }
        $scan->save();

        NotificationController::create('welcome', NULL, $coach->user_id, $coach->user_id, NULL);
        return response()->json('Coach created successfully', 200);
    }

    /**
     * Update the coach with $coach_id
     *
     * @return json
     */
    public function update_coach($coach_id)
    {
        //validate the request
        $this->validate($this->request, [
            'email' => 'required|email',
            'password' => 'string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'string|date_format:Y-m-d|before:today',
            'telephone' => 'required|string|max:30',
            'mobile' => 'string|max:30',
            'address' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'postcode' => 'required|string|max:30',
            'pic' => 'file|image|max:1024',
            'rate' => 'required|between:0,99.99',
            'qualifications' => 'array',
            'qualifications.*.qualification_id' => 'integer|min:1',
            'qualifications.*.file_url' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'qualifications.*.expiration_date' => 'date_format:Y-m-d H:i:s|after:today',
            'crb_expiry' => 'date_format:Y-m-d H:i:s|after:today',
            'crb_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'sc_expiry' => 'date_format:Y-m-d H:i:s|after:today',
            'sc_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'fa_level_1_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'ea_expiry' => 'date_format:Y-m-d H:i:s|after:today',
            'ea_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'fan_number' => 'string|max:255',
            'fa_coaching_licence_expiry' => 'date_format:Y-m-d H:i:s|after:today',
            'fa_coaching_licence_scan' => 'file|max:1024|mimes:jpeg,jpg,bmp,png,doc,docx,pdf,xls,xlsx,ppt,pptx',
            'teams' => 'array'
        ],
            [
                'ea_expiry' => 'Emergency Aid certificate expiration date required',
                'ea_scan.required' => 'Emergency Aid certificate required',
                'pic.max' => 'Profile image cannot be bigger than 1 MB',
                'qualifications.*.file_url.max' => 'Qualifications image cannot be bigger than 1 MB',
                'crb_scan.max' => 'CRB scan cannot be bigger than 1 MB',
                'sc_scan.max' => 'SC scan cannot be bigger than 1 MB',
                'fa_level_1_scan.max' => 'The FA LEVEL 1 file uploaded may not be greater than 1 MB',
                'ea_scan.max' => 'Emergency Aid scan cannot be bigger than 1 MB',
                'fa_coaching_licence_scan.max' => 'FA licence scan cannot be bigger than 1 MB'
            ]);

        $coach = User::find($coach_id);
        $coach->email = $this->request['email'];
        if (isset($this->request['password']) && !empty($this->request['password'])) {
            $coach->password = Hash::make($this->request['password']);
        }
        $coach->first_name = $this->request['first_name'];
        $coach->last_name = $this->request['last_name'];
        $coach->display_name = $this->request['first_name'] . ' ' . $this->request['last_name'];
        if (isset($this->request['dob']) && !empty($this->request['dob'])) {
            $coach->dob = $this->request['dob'];
        }
        $coach->telephone = $this->request['telephone'];
        $coach->mobile = $this->request['mobile'];
        $coach->address = $this->request['address'];
        $coach->town = $this->request['town'];
        $coach->postcode = $this->request['postcode'];
        //handle profile picture upload
        if (isset($this->request['pic']) && !empty($this->request['pic']) && $this->request->hasFile('pic')) {
            //remove the old profile image
            gr_delete_file($coach->pic);
            //save the new profile image
            $file = $this->request->file('pic');
            $file_url = gr_save_file($file, 'coaches', $this->franchise_id);
            $coach->pic = $file_url;
        }
        $coach->save();

        //save additional coach info
        $coach_info = CoachInfo::where('user_id', $coach_id)->first();
        $coach_info->rate = $this->request['rate'];
        if ($this->request->has('fan_number')) {
            $coach_info->fan_number = $this->request['fan_number'];
        }
        if ($this->request->has('show_money_owned')) {
            $coach_info->show_money_owned = $this->request['show_money_owned'];
        }
        $this->request->has('utr_number') ? $coach_info->utr_number = $this->request->utr_number : null;
        $coach_info->save();

        //update the address record
        if (!empty($coach->address_id)) {
            $address = Address::find($coach->address_id);
            $address->address = $coach->address;
            $address->city = $coach->town;
            $address->postcode = $coach->postcode;
            $address->title = $coach->display_name;
            $address->telephone = $coach->telephone;
            $address->email = $coach->email;
            $address->contact_name = $coach->display_name;
            $address->updated_by = $this->user_id;
            $coordinates = gr_get_coordinates($this->request['postcode'], $this->request['town']);
            $address->lat = $coordinates['lat'];
            $address->lng = $coordinates['lng'];
            $address->save();
        }

        //handle qualifications
        $existing_qualifications = RelQualificationUser::where('user_id', $coach_id)->get();
        $new_qualification_ids = array();
        //save qualifications
        if (isset($this->request['qualifications']) && !empty($this->request['qualifications'])) {
            foreach ($this->request['qualifications'] as $qualification) {
                if (isset($qualification['file_url']) && !empty($qualification['file_url'])) {
                    $old_file = RelQualificationUser::where('user_id', $coach_id)
                        ->where('qualification_id', $qualification['qualification_id'])
                        ->first();
                    if (!empty($old_file)) {
                        gr_delete_file($old_file->file_url);
                    }
                    $file = $qualification['file_url'];
                    $file_url = gr_save_file($file, 'qualifications', $coach_id);
                    $rel_qualification_user = RelQualificationUser::updateOrCreate(
                        ['user_id' => $coach_id, 'qualification_id' => $qualification['qualification_id']],
                        ['user_id' => $coach_id, 'qualification_id' => $qualification['qualification_id'], 'file_url' => $file_url, 'expiration_date' => $qualification['expiration_date']]
                    );
                }
                $new_qualification_ids[] = $qualification['qualification_id'];
            }
        }
        foreach ($existing_qualifications as $existing_qualification) {
            if (!in_array($existing_qualification->qualification_id, $new_qualification_ids)) {
                RelQualificationUser::where('user_id', $coach_id)
                    ->where('qualification_id', $existing_qualification['qualification_id'])
                    ->delete();
            }
        }

        //save teams
        if (isset($this->request['teams']) && !empty($this->request['teams'])) {
            //remove existing relationship
            RelCoachTeam::where('coach_id', $coach_id)->delete();
            foreach ($this->request['teams'] as $team_id) {
                $rel_coach_team = RelCoachTeam::updateOrCreate(
                    ['coach_id' => $coach_id, 'team_id' => $team_id],
                    ['coach_id' => $coach_id, 'team_id' => $team_id]
                );
            }
        }

        //manage the CRB
        if (isset($this->request['crb_scan']) && !empty($this->request['crb_scan']) && $this->request->hasFile('crb_scan')) {
            $scan = new Scan;
            $scan->user_id = $coach->user_id;
            $scan->title = 'CRB Scan';
            $scan->type_id = 1; //hardcoded CRB
            $scan->expire = $this->request['crb_expiry'];
            $scan->status = 1; //hardcoded active by default
            $file = $this->request->file('crb_scan');
            $file_url = gr_save_file($file, 'crb', $coach->user_id);
            $scan->file_url = $file_url;
            $scan->save();
        }

        //manage the SC
        if (isset($this->request['sc_scan']) && !empty($this->request['sc_scan']) && $this->request->hasFile('sc_scan')) {
            $scan = new Scan;
            $scan->user_id = $coach->user_id;
            $scan->title = 'Safeguarding Children Scan';
            $scan->type_id = 2; //hardcoded SC
            $scan->expire = $this->request['sc_expiry'];
            $scan->status = 1; //hardcoded active by default
            $file = $this->request->file('sc_scan');
            $file_url = gr_save_file($file, 'sc', $coach->user_id);
            $scan->file_url = $file_url;
            $scan->save();
        }

        //manage the FA Level 1
        if (isset($this->request['fa_level_1_scan']) && !empty($this->request['fa_level_1_scan']) && $this->request->hasFile('fa_level_1_scan')) {
            $scan = new Scan;
            $scan->user_id = $coach->user_id;
            $scan->title = 'FA Level 1 Scan';
            $scan->type_id = 3; //hardcoded FA Level 1
            $scan->status = 1; //hardcoded active by default
            $file = $this->request->file('fa_level_1_scan');
            $file_url = gr_save_file($file, 'fa-level-1', $coach->user_id);
            $scan->file_url = $file_url;
            $scan->save();
        }

        //manage EA
        if (isset($this->request['ea_scan']) && !empty($this->request['ea_scan']) && $this->request->hasFile('ea_scan')) {
            $scan = new Scan;
            $scan->user_id = $coach->user_id;
            $scan->title = 'Emergency Aid Scan';
            $scan->type_id = 4; //hardcoded EA
            $scan->expire = $this->request['ea_expiry'];
            $scan->status = 1; //hardcoded active by default
            $file = $this->request->file('ea_scan');
            $file_url = gr_save_file($file, 'ea', $coach->user_id);
            $scan->file_url = $file_url;
            $scan->save();
        }

        //manage FA coaching licence
        if (isset($this->request['fa_coaching_licence_scan']) && !empty($this->request['fa_coaching_licence_scan']) && $this->request->hasFile('fa_coaching_licence_scan')) {
            $scan = new Scan;
            $scan->user_id = $coach->user_id;
            $scan->title = 'FA Coaching Licence';
            $scan->type_id = 5; //hardcoded FA Coaching Licence
            $scan->expire = $this->request['fa_coaching_licence_expiry'];
            $scan->status = 1; //hardcoded active by default
            $file = $this->request->file('fa_coaching_licence_scan');
            $file_url = gr_save_file($file, 'fa-coaching-licence', $coach->user_id);
            $scan->file_url = $file_url;
            $scan->save();
        }

        return response()->json('Coach updated successfully', 200);
    }

    /**
     * Get all teams that a coach is assigned to.
     *
     * @param int $coach_id
     * @return json
     */
    public function get_coach_teams($coach_id)
    {
        $query = "
            SELECT T.team_id, T.title AS team_name, T.max_size
            FROM team AS T
            LEFT JOIN rel_coach_team AS CT ON CT.team_id = T.team_id
            LEFT JOIN `user` AS U ON U.user_id = CT.coach_id
            WHERE U.user_id = {$coach_id} AND T.club_id = 1 AND T.franchise_id = 1
        ";

        $teams = Team::select('team.team_id', 'team.title AS team_name', 'team.max_size')
            ->leftJoin('rel_coach_team', 'rel_coach_team.team_id', '=', 'team.team_id')
            ->leftJoin('user', 'user.user_id', '=', 'rel_coach_team.coach_id')
            ->where('team.franchise_id', $this->franchise_id)
            ->where('team.club_id', $this->club_id)
            ->where('user.user_id', $coach_id)
            ->get();
        return response()->json($teams, 200);
    }


    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function makePayment($coachId)
    {

        $this->validate($this->request, [
            'coach_id' => 'exists:user,user_id',
            'session_id' => 'exists:session,session_id',
            'invoice_id' => 'exists:invoice,id',
            'date' => 'required|date_format:Y-m-d H:i:s',
            'amount' => 'required|numeric',
            'description' => 'string|max:255'
        ]);

        // Check is coach has been paid or not if paid then do not make transition
        $invoice = Invoice::find($this->request->invoice_id);
        if($invoice->status === 1){
            return response()->json('Coach has been paid');
        }

        // Make a transition for coach
        $user = User::find($coachId);
        $session = Session::find($this->request->session_id);
        $amount = $this->request->amount;

        $transaction                = new Transaction();
        $transaction->franchise_id  = $user->franchise_id;
        $transaction->club_id       = $user->club_id;
        $transaction->account_id    = 0; // TODO need to implement
        $transaction->programme_id  = $session->programme_id;
        $transaction->session_id    = $session->session_id;
        $transaction->type_id       = 0; // TODO nee to implement
        $transaction->user_id       = $user->user_id;
        $transaction->type          = 'coach';
        $transaction->date          = $this->request->date;
        $transaction->code_id       = 0; // TODO need to implement
        $transaction->amount        = $amount;
        $transaction->note          = $this->request->description;
        $transaction->vat_rate      = 0;
        $transaction->created_by = $this->user_id;
        $transaction->updated_by = $this->user_id;
        $transaction->save();

        // Update invoice status
        $invoice->status = 1;
        $invoice->save();

        return response()->json($this->request);
    }
}
