<?php

use Illuminate\Database\Eloquent\Model;
use App\Notification;
use App\AgeGroup;
use App\Team;
use App\Player;
use App\Account;
use App\Club;
use Auth;

function gr_create_academy_default_accounts($franchise_id, $club_id)
{
    $types = array('bank', 'cash', 'directors');
    $club = Club::find($club_id);
    $i = 1;
    foreach ($types as $type) {
        $account = new Account;
        $account->franchise_id = $franchise_id;
        $account->club_id = $club_id;
        $account->title = 'Soccer School ' . $type . ' account';
        $account->type_id = ($type == 'bank') ? 1 : 2; //bank is id 1 and cash is id2
        $account->is_fc = 0;
        $account->is_academy = 1;
        $account->status = 1;
        $account->save();
    }
    $club->ss_account_created = 1;
    $club->save();
}

function get_club_vat($club_id)
{
    $club = Club::find($club_id);
    return $club->vat_rate;
}

function gr_create_fc_default_accounts($franchise_id, $club_id)
{
    $club = Club::find($club_id);
    $types = array('bank', 'cash');
    $i = 1;
    foreach ($types as $type) {
        $account = new Account;
        $account->franchise_id = $franchise_id;
        $account->club_id = $club_id;
        $account->title = 'Football Club ' . $type . ' account';
        $account->type_id = ($type == 'bank') ? 1 : 2; //bank is id 1 and cash is id2
        $account->is_fc = 1;
        $account->is_academy = 0;
        $account->status = 1;
        $account->save();
        $i++;
    }
    $club->fc_account_created = 1;
    $club->save();
}

function gr_get_club_threshold($club_id)
{
    $club = DB::table('club')
        ->select('threshold AS total', 'threshold_date AS date')
        ->where('club_id', $club_id)
        ->first();
    return $club;
}

function gr_get_club_total_invoiced($club_id, $start_date = null, $end_date = null)
{
    $invoiced = DB::table('invoice')
        ->select(
            DB::raw('SUM(invoice.amount) AS total')
        )
        ->where('invoice.club_id', $club_id)
        ->where(function ($query) {
            if (!empty($start_date)) {
                $query->where('invoice.date', '>=', $start_date);
            }
            if (!empty($end_date)) {
                $query->where('invoice.date', '<=', $end_date);
            }
            return $query;
        })
        ->first();
    return $invoiced->total;
}

function gr_get_package_price($package_id)
{
    $package = DB::table('package')
        ->select('package.price')
        ->where('package.id', $package_id)
        ->first();
    return $package->price;
}

function gr_get_available_slots($club_id)
{
    $slots = DB::table('package')
        ->select('max_slot')
        ->leftJoin('rel_club_package', 'rel_club_package.package_id', '=', 'package.id')
        ->where('rel_club_package.club_id', '=', $club_id)
        ->first();
    $players = Player::where('club_id', $club_id)
        ->where('status', 1)
        ->get();

    $player_no = $players->count();

    return $slots->max_slot - $player_no;
}

function gr_get_registered_players($club_id)
{
    $players = Player::where('club_id', $club_id)
        ->where('status', 1)
        ->get();
    return $players->count();
}

function gr_get_query_fields($available_fields)
{
    $query_fields = isset($_GET['fields']) ? array_intersect(explode(',', $_GET['fields']), $available_fields) : '';
    $query_fields = !empty($query_fields) ? ',' . implode($query_fields, ',') : '';

    return $query_fields;
}

function gr_get_field_price($guardian_id, $player_id, $team_id)
{
    $price_field = 'price';
    $discount = 0;
    $count = gr_get_unique_players_in_programmes($guardian_id, $player_id, $team_id);
    if ($count == 1) {
        //parent has another children involved in a programme
        $price_field = 'price2';
        $discount = 1;
    } elseif ($count > 1) {
        //parent has more at least 2 more children involved in a programme
        $price_field = 'price2plus';
        $discount = 2;
    }
    $result = array(
        'price_field' => $price_field,
        'discount' => $discount
    );
    return $result;
}

/**
 * Get a given parameter from the route.
 *
 * @param $name
 * @return mixed
 */
function gr_get_route_param($name)
{
    $routeInfo = app('request')->route();

    return array_get($routeInfo[2], $name);
}

/**
 * Save uploaded file
 *
 * @param object $file
 * @param string $type [team, users, club etc]
 * @param int $user_id
 * @return string [url to file]
 */
function gr_save_file($file, $type, $id)
{

    $destination_path = 'storage' . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR . $id;
    $file_name = time() . '_' . str_replace(' ', '', $file->getClientOriginalName());
    $uploaded = $file->move($destination_path, $file_name);

    if ($uploaded) {
        return $location = url('storage') . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR . $id . DIRECTORY_SEPARATOR . $file_name;
    }

    return false;
}

/**
 * Get coach rate per hour
 *
 * @param int $coach_id
 * @param string $coach_rate [rate, rate1, rate2]
 * @return int
 */
function gr_get_coach_rate($coach_id, $coach_rate)
{
    $rate = !empty($coach_rate) ? $coach_rate : 'rate';
    $coach_info = DB::table('coach_info')->select("coach_info.$rate AS rate")
        ->where('user_id', $coach_id)
        ->first();
    if (empty($coach_info->rate)) {
        return 0;
    }
    return $coach_info->rate;
}

/**
 * Delete a file
 *
 * @param object $file
 * @param string $type [team, users, club etc]
 * @param int $user_id
 * @return string [url to file]
 */
function gr_delete_file($file_url)
{
    $root = url('/') . '/';
    $old_image_path = str_replace($root, '', $file_url);
    if (file_exists($old_image_path)) {
        return unlink($old_image_path);
    }
    // print_r($old_image_path);
    // die;
    //TODO ignore external images
    // return unlink($old_image_path);
    return 1;
}

/**
 * Get Role Id by title
 *
 * @param string $role
 * @return int
 */
function gr_get_role_id($role)
{

    $role = \App\Role::where('title', $role)->first();

    return $role->role_id;
}

/**
 * Get Role title by id
 *
 * @param int $id
 * @return string
 */
function gr_get_role_title($id)
{
    $role = \App\Role::where('role_id', $id)->first();
    return $role->title;
}

/**
 * Get Programme Type Id by title
 *
 * @param string $title
 * @return int $type_id
 */
function gr_get_programme_type_id($title)
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $programme_type = \App\ProgrammeType::where('title', $title)
        ->where(function ($query) use ($franchise_id) {
            $query->where('franchise_id', $franchise_id)
                ->orWhere('franchise_id', 0);
            return $query;
        })
        ->first();
    return $programme_type['type_id'];
}

/**
 * Get Programme Type title by id
 *
 * @param string $title
 * @return int $type_id
 */
function gr_get_programme_type_title($type_id)
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $programme_type = \App\ProgrammeType::where('type_id', $type_id)
        ->where(function ($query) use ($franchise_id) {
            $query->where('franchise_id', $franchise_id)
                ->orWhere('franchise_id', 0);
            return $query;
        })
        ->first();
    return $programme_type['type'];
}

function format_response($result = null, $count = 0, $filters = null, $misc = null)
{

    $response = array(
        'entities' => $result,
        'count' => $count,
        'filters' => $filters,
        'misc' => $misc
    );
    return response()->json($response, 200);
}

function create_filter($key, $label, $results = null, $default = null)
{
    $options = null;
    if (!empty($results)) {
        foreach ($results as $result) {
            $options[] = array(
                'id' => $result->key,
                'title' => $result->value
            );
        }
    }

    $filter = array(
        'key' => $key,
        'type' => $key,
        'label' => $label,
        'options' => $options,
        'default' => $default
    );
    return $filter;
}

function create_pagination()
{
    // Get current page from query string
    $currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    // Items per page
    $perPage = isset($_GET['perpage']) ? (int)$_GET['perpage'] : 20;
    //set the offset
    $offset = $perPage * ($currentPage - 1);

    $pagination = array(
        'offset' => $offset,
        'per_page' => $perPage
    );

    return $pagination;
}

/** ============== Filters Helper Functions ================== */

/**
 * Get all the addresses from the auth user franchise and club
 *
 * @return collection address
 */
function gr_get_address()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $address = DB::table('address_book')
        ->select('address_id AS key', 'title AS value')
        ->where('franchise_id', $franchise_id)
        ->where('club_id', $club_id)
        ->get();
    return $address;
}

/**
 * Get all the address types from the auth user franchise and club
 *
 * @return collection $address_type
 */
function gr_get_address_type()
{
    // $franchise_id = Auth::getPayload()->get('franchise_id');
    // $club_id = Auth::getPayload()->get('club_id');
    $address_type = DB::table('address_type')
        ->select('type_id AS key', 'title AS value')
        ->where('franchise_id', 0)
        ->where('club_id', 0)
        ->orderBy('address_type.title')
        ->get();
    return $address_type;
}

/**
 * Get all the age groups from the auth user franchise
 *
 * @return collection $agegroups
 */
function gr_get_agegroups()
{
    $agegroups = AgeGroup::select('agegroup_id AS key', 'title AS value')->get();
    return $agegroups;
}

/**
 * Get all the availability types
 *
 * @return collection $availability_types
 */
function gr_get_availability_types()
{
    $availability_types = DB::table('availability_type')
        ->select('type_id AS key', 'title AS value')
        ->get();
    return $availability_types;
}

/**
 * Get all the coaches from the auth user franchise
 *
 * @return collection $coaches
 */
function gr_get_coaches()
{
    $role_id = gr_get_role_id('coach');
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $coaches = DB::table('user')
        ->select('user_id AS key', 'display_name AS value')
        ->where('franchise_id', '=', $franchise_id)
        ->where('club_id', '=', $club_id)
        ->where('user_role', $role_id)
        ->get();
    return $coaches;
}

/**
 * Get all the teams from the auth user franchise and club
 *
 * @return collection $teams
 */
function get_teams()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $teams = Team::where('franchise_id', $franchise_id)
        ->where('club_id', $club_id)
        ->where('type', 'team')
        ->select('team_id AS key', 'title AS value')
        ->get();
    return $teams;
}

/**
 * Get all the skill groups from the auth user franchise
 *
 * @return collection $teams
 */
function gr_get_skillgroups()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $skillgroups = Team::where('franchise_id', $franchise_id)
        ->where('club_id', $club_id)
        ->where('type', 'skill-group')
        ->select('team_id AS key', 'title AS value')
        ->get();
    return $skillgroups;
}

/**
 * Get all the skill category from the auth user franchise
 *
 * @return collection $teams
 */
function gr_get_skill_category()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');

    $skill_category = DB::table('skill_category')
        ->select('category_id AS key', 'title As value')
        ->where(function ($query) use ($franchise_id) {
            $query->where('franchise_id', $franchise_id)
                ->orWhere('franchise_id', 0);
            return $query;
        })
        ->get();
    return $skill_category;
}

function gr_get_programme_type()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $programme_type = DB::table('programme_type')
        ->select('type_id AS key', 'title AS value')
        ->where(function ($query) use ($franchise_id) {
            $query->where('franchise_id', $franchise_id)
                ->orWhere('franchise_id', 0);
            return $query;
        })
        ->get();
    return $programme_type;
}

function get_denied_message()
{
    return 'You Shall Not Pass!';
}

function gr_get_scan_type_id($type)
{
    $scan_type = \App\ScanType::where('title', $type)->first();
    if (empty($scan_type)) {
        return 0;
    }
    return $scan_type->type_id;
}

function gr_guardian_get_children($guardian_id)
{
    $children = \App\RelPlayerGuardian::select('player_id')
        ->where('guardian_id', $guardian_id)
        ->get();

    return $children;
}

/**
 * Get the Id of a address type based on the address type title
 *
 * @param string $title
 * @return int
 */
function get_address_type_id($title)
{
    $type = DB::table('address_type')
        ->select('type_id')
        ->where('title', $title)
        ->first();
    return $type->type_id;
}

/**
 * Get the title of a address type based on the address type id
 *
 * @param int $id
 * @return string
 */
function get_address_type_title($id)
{
    $type = DB::table('address_type')
        ->select('title')
        ->where('type_id', $id)
        ->first();
    return $type->title;
}

/**
 * Get the geographic coordinates
 *
 * @param string $postcode , $city
 * @return array
 */
function gr_get_coordinates($postcode, $city)
{
    $coordinates = array('lat' => 0, 'lng' => 0);
    $geodata = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' . urlencode($postcode . ' ' . $city)));
    // extract latitude and longitude
    if (!empty($geodata->results)) {
        $coordinates['lat'] = $geodata->results[0]->geometry->location->lat;
        $coordinates['lng'] = $geodata->results[0]->geometry->location->lng;
    }
    return $coordinates;
}

/**
 * Generate the csv file contents
 *
 * @param array $data The data
 * @param string $delimiter The delimiter
 * @param string $enclosure The enclosure
 *
 * @return     string  The contents of the csv file
 */
function gr_generate_csv($data = array(), $header = null)
{
    $newline = "\n";
    $delimiter = ",";
    $enclosure = '';
    $escape = "\\";
    // prepare the output string
    $output = $header . $newline;

    // loop through the data and add each row to the output
    foreach ($data as $row) {
        $output .= $enclosure . implode($enclosure . $delimiter . $enclosure, $row) . $enclosure . $newline;
    }
    // remove the extra newline which was added from the fputcsv function
    $output = rtrim($output, $newline);

    return $output;
}

/**
 * Get all the guardian ids from a club
 *
 * @return     array  Guardians ids
 */
function gr_get_guardian_ids()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $guardians = DB::table('user')
        ->select('user_id')
        ->where('user_role', gr_get_role_id('guardian'))
        ->where('franchise_id', $franchise_id)
        ->where('club_id', $club_id)
        ->pluck('user_id');
    return $guardians;
}

/**
 * Get all the coaches ids from a club
 *
 * @return     array  Coaches ids
 */
function gr_get_coach_ids()
{
    $franchise_id = Auth::getPayload()->get('franchise_id');
    $club_id = Auth::getPayload()->get('club_id');

    $coaches = DB::table('user')
        ->select('user_id')
        ->where('user_role', gr_get_role_id('coach'))
        ->where('franchise_id', $franchise_id)
        ->where('club_id', $club_id)
        ->pluck('user_id');
    return $coaches;
}

/**
 * Get all the players for a guardian
 *
 * @param $guardian_id
 * @return    array
 */
function get_guardian_players($guardian_id)
{
    $players = DB::table('rel_player_guardian')
        ->select('player.player_id AS key', 'player.display_name AS value')
        ->leftJoin('player', 'player.player_id', '=', 'rel_player_guardian.player_id')
        ->where('rel_player_guardian.guardian_id', $guardian_id)
        ->get();
    return $players;
}

/**
 * Get all the guardian_id for player
 *
 * @param int $player_id
 * @return array
 */
function get_guardian_id($player_id)
{
    $guardian = DB::table('rel_player_guardian')
        ->select('guardian_id')
        ->where('player_id', $player_id)
        ->first();
    return $guardian->guardian_id;
}

/**
 * Get all the players ids from $tem_id
 *
 * @param int $team_id
 * @return     array
 */
function get_team_players($team_id)
{
    $player_ids = DB::table('rel_player_team')
        ->select('player_id')
        ->where('team_id', $team_id)
        ->where('status', 'assigned')
        ->get();
    return $player_ids;
}

/**
 * Get the number of unique children involved in other programmes except current player
 *
 * @param int $guardian_id , $player_id
 * @return     int $count
 */
function gr_get_unique_players_in_programmes($guardian_id, $player_id, $team_id)
{
    //get all the guardian children
    $children = gr_guardian_get_children($guardian_id);
    //get the unique players involved in other programmes except $player_id
    $players = DB::table('rel_programme_player')
        ->select(
            'rel_programme_player.programme_id',
            'rel_programme_player.player_id',
            DB::raw('(SELECT session.start_time FROM session WHERE session.programme_id = rel_programme_player.programme_id ORDER BY session.start_time DESC LIMIT 1) AS programme_end'))
        ->leftJoin('rel_programme_team', 'rel_programme_player.programme_id', '=', 'rel_programme_player.programme_id')
        ->whereIn('rel_programme_player.player_id', $children)
        ->where('rel_programme_player.player_id', '!=', $player_id)
        ->where('rel_programme_team.team_id', $team_id)
        ->where('rel_programme_player.status', 1)
        ->groupBy('rel_programme_player.player_id')
        ->having('programme_end', '>=', date('Y-m-d'))
        ->get();
    $count = count($players);
    return $count;
}

/**
 * Get the lowest rank team inside a agegroup
 *
 * @param int club_id, $agegroup_id
 * @return     int $rank
 */
function gr_get_lowest_rank($club_id, $agegroup)
{
    $team = DB::table('team')
        ->select('team.rank', 'team.agegroup_id')
        ->leftJoin('agegroup', 'agegroup.agegroup_id', '=', 'team.agegroup_id')
        ->where('club_id', $club_id)
        ->where('agegroup.max_age', '=', $agegroup)
        ->orderBy('rank', 'DESC')
        ->first();
    if (!empty($team)) {
        return $team->rank;
    }
    return false;
}

/**
 * Get the franchise id for a club
 *
 * @param int club_id
 * @return     int $franchise_id
 */
function gr_get_franchise_by_club($club_id)
{
    $franchise = DB::table('club')->select('franchise_id')->where('club_id', $club_id)->first();
    return $franchise->franchise_id;
}

function gr_reserved_slugs()
{
    $slugs = array('packages');
    return $slugs;
}

function gr_get_clubs_by_franchise($franchise_id)
{
    $clubs = DB::table('club')->select('club_id')->where('franchise_id', $franchise_id)->pluck('club_id');
    return $clubs;
}

function gr_check_if_allowed($club_id, $current_franchise, $current_club)
{
    //groupadmins are only alowed to make changes for clubs in their franchise
    if (Auth::user()->hasRole('groupadmin')) {
        $allowed_clubs = gr_get_clubs_by_franchise($current_franchise);
        if (in_array($club_id, $allowed_clubs)) {
            return true;
        }
        //admins are only allowed to make changes for their clubs
    } elseif (Auth::user()->hasRole('admin') && $club_id == $current_club) {
        return true;
    }

    return false;
}

/**
 * Generate a unique page slug
 *
 * @param string $title
 * @return string $slug
 */
function generate_slug($title)
{
    $slug = str_slug($title, '-');
    $existing_slug = DB::table('page')->select('id')->where('slug', $slug)->first();
    if (!empty($existing_slug)) {
        //slug already exists so we add the page id to make it unique
        $slug = $slug . '-' . $existing_slug['id'];
    }
    return $slug;
}

/**
 * @param int $length
 * @return string
 */
function generateRandomString($length = 30)
{
    return substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, $length);
}
