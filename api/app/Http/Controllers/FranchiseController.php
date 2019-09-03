<?php

namespace App\Http\Controllers;

use App\Account;
use App\User;
use Illuminate\Http\Request;
use App\RelClubPackage;
use App\Franchise;
use App\Club;
use Carbon\Carbon;
use Auth;
use DB;


class FranchiseController extends Controller
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
        $this->middleware('role:superadmin', ['only' => ['get_franchises']]);
        $this->middleware('role:groupadmin|superadmin', ['only' => ['buy_package', 'update_franchise']]);
        $this->middleware('role:groupadmin|superadmin|admin', ['only' => ['single', 'get_franchise_clubs', 'get_packages']]);
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');

        // Set default pagination item
        $this->perPage = 15;
    }

    public function create_franchise()
    {
        $this->validate($this->request, [
            'title' => 'required|string|max:255|unique:franchise',
            'email' => 'required|email',
            'telephone' => 'required|string|max:30',
            'emergency_telephone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'postcode' => 'required|string|max:30',
            'company_number' => 'string|max:255',
            'vat_number' => 'string|max:255',
            'content' => 'string',
            'website' => 'string|max:255',
            'pic' => 'file|image|max:1024'
        ],
            [
                'pic.max' => 'Franchise image cannot be bigger than 1 MB'
            ]);
        $franchise = new Franchise;
        $franchise->title = $this->request['title'];
        $franchise->content = isset($this->request['content']) ? $this->request['content'] : NULL;
        $franchise->email = $this->request['email'];
        $franchise->telephone = $this->request['telephone'];
        $franchise->emergency_telephone = $this->request['emergency_telephone'];
        $franchise->website = isset($this->request['website']) ? $this->request['website'] : NULL;
        $franchise->address = $this->request['address'];
        $franchise->town = $this->request['town'];
        $franchise->postcode = $this->request['postcode'];
        $franchise->company_number = isset($this->request['company_number']) ? $this->request['company_number'] : NULL;
        $franchise->vat_number = isset($this->request['vat_number']) ? $this->request['vat_number'] : NULL;
        $franchise->created_by = $this->user_id;
        $franchise->updated_by = $this->user_id;
        $franchise->status = 1; //active by dfefault
        //handle profile picture upload
        if (isset($this->request['pic']) && !empty($this->request['pic']) && $this->request->hasFile('pic')) {
            $file = $this->request->file('pic');
            $file_url = gr_save_file($file, 'franchise', $this->user_id);
            $franchise->image_url = $file_url;
        }

        // Contact with email
        if (isset($this->request['email_contact']) && !empty($this->request['email_contact'])) {
            $franchise->contact_with_email = 1;
        }
        $franchise->save();
        return response()->json($franchise, 200);
    }

    public function update_franchise($franchiseId)
    {
        // Updating manger name
        if($this->request->has('type') && $this->request->type === 'manager'){
            $franchise = Franchise::findOrFail($franchiseId);
            $franchise->manager_name = $this->request->manager;
            $franchise->save();
            return response()->json($franchise);
        }

        if ($this->franchise_id != $franchiseId) {
            return response()->json('You do not have permissions to update this franchise', 403);
        }
        $this->validate($this->request, [
            'email' => 'required|email',
            'telephone' => 'required|string|max:30',
            'emergency_telephone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'town' => 'required|string|max:255',
            'postcode' => 'required|string|max:30',
            'company_number' => 'string|max:255',
            'vat_number' => 'string|max:255',
            'content' => 'string',
            'website' => 'string|max:255',
            'image_url' => 'file|image|max:1024',
            'status' => 'int|min:0|max:1'
        ],
            [
                'image_url.max' => 'Franchise image cannot be bigger than 1 MB'
            ]);

        $franchise = Franchise::find($franchiseId);
        $franchise->email = $this->request['email'];
        $franchise->telephone = $this->request['telephone'];
        $franchise->emergency_telephone = $this->request['emergency_telephone'];
        $franchise->address = $this->request['address'];
        $franchise->town = $this->request['town'];
        $franchise->postcode = $this->request['postcode'];
        if (isset($this->request['company_number'])) {
            $franchise->company_number = $this->request['company_number'];
        }
        if (isset($this->request['vat_number'])) {
            $franchise->vat_number = $this->request['vat_number'];
        }
        if (isset($this->request['content'])) {
            $franchise->content = $this->request['content'];
        }
        if (isset($this->request['website'])) {
            $franchise->website = $this->request['website'];
        }
        //handle image upload
        if (isset($this->request['image_url']) && !empty($this->request['image_url']) && $this->request->hasFile('image_url')) {
            //delete the old image
            if (!empty($franchise->image_url)) {
                gr_delete_file($franchise->image_url);
            }
            $file = $this->request->file('image_url');
            $file_url = gr_save_file($file, 'franchise', $this->user_id);
            $franchise->image_url = $file_url;
        }
        if (isset($this->request['status'])) {
            $franchise->status = $this->request['status'];
        }

        if (isset($this->request['email_contact'])) {
            $franchise->contact_with_email = $this->request['email_contact'];
        }
        $franchise->updated_by = $this->user_id;
        $franchise->save();
        return response()->json($franchise, 200);
    }

    /**
     * Get all franchises.
     *
     * @return json
     */
    public function getFranchises()
    {
        $pagination = create_pagination();
        $franchises = Franchise::select(
            DB::raw('SQL_CALC_FOUND_ROWS franchise.franchise_id'),
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = franchise.franchise_id AND club_id <> 0) AS clubs_no'),
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = franchise.franchise_id) AS packages_no'),
            DB::raw("(SELECT sum(amount) FROM invoice WHERE franchise.franchise_id = invoice.franchise_id AND invoice.type='club') AS invoice"), // Only for master admin
            DB::raw('(SELECT sum(amount) FROM transaction WHERE franchise.franchise_id = transaction.franchise_id) AS transaction'),
            DB::raw('(SELECT SUM(rel_club_package.amount) FROM rel_club_package WHERE rel_club_package.franchise_id = franchise.franchise_id) AS subscription_fee'),
            'franchise.*'
        )
            ->where(function ($query) {
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('franchise.title', 'like', '%' . $this->request['search'] . '%');
                }
            })
            ->orderBy('franchise.title')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();

        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;
        $search = create_filter('search', 'Search');
        $filters = [$search];

        //need to get all the franchise ids without pagination so we can show total monthly income
        $franchises_ids = Franchise::select('franchise_id')
            ->where(function ($query) {
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('franchise.title', 'like', '%' . $this->request['search'] . '%');
                }
            })
            ->get();

        $total_subsctiprions = DB::table('rel_club_package')
            ->whereIn('rel_club_package.franchise_id', $franchises_ids->pluck('franchise_id')->toArray())
            ->sum('rel_club_package.amount');

        $activePackage = Franchise::select(
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = franchise.franchise_id AND club_id > 0) AS active_package')
        )->get()->sum('active_package');

        $purchasePackage = Franchise::select(
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = franchise.franchise_id) AS purchase_packages')
        )->get()->sum('purchase_packages');

        $misc = array(
            'total_monthly_income' => $total_subsctiprions,
            'active_package' => $activePackage,
            'total_purchase_packages' => $purchasePackage
        );
        return format_response($franchises, $count, $filters, $misc);
    }

    /**
     * Get franchise with the $id
     *
     * @param int $id
     * @return json
     */
    public function single($id)
    {
        $id = ($id == 'my') ? $this->franchise_id : $id;
        //group admins can only see their franchises (this route is only accessible by groupadmin and superadmin)
        if (Auth::user()->hasRole('groupadmin') && $this->franchise_id != $id) {
            return response()->json('You do not have permissions to view this franchise', 403);
        }

        $franchise = Franchise::select(
            DB::raw('SQL_CALC_FOUND_ROWS franchise.franchise_id'),
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = ' . $id . ' AND club_id <> 0) AS clubs_no'),
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.franchise_id = ' . $id . ') AS packages_no'),
            DB::raw('(SELECT COUNT(*) FROM rel_club_package WHERE rel_club_package.status = 1 AND rel_club_package.franchise_id = ' . $id . ') AS active_packages'),
            DB::raw('(SELECT SUM(rel_club_package.amount) FROM rel_club_package WHERE rel_club_package.status = 1 AND rel_club_package.franchise_id = ' . $id . ' ) AS subscription_fee'),
            'franchise.*'
        )
            ->where('franchise.franchise_id', $id)
            ->first();

        if (empty($franchise)) {
            return response()->json('Franchise not found', 404);
        }

        // Get the user for this franchise
        $groupAdminUser = User::where(['franchise_id' => $id, 'user_role' => 4])
            ->first();

        $packages = RelClubPackage::select(
            DB::raw('SQL_CALC_FOUND_ROWS rel_club_package.id'),
            DB::raw('(SELECT COUNT(*) FROM player WHERE player.status = 1 AND player.club_id = club.club_id) AS player_no'),
            'rel_club_package.*',
            'club.title AS club_name',
            'club.slug',
            'package.title AS package',
            'package.max_slot'
        )
            ->leftJoin('club', 'club.club_id', '=', 'rel_club_package.club_id')
            ->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id')
            ->where('rel_club_package.franchise_id', $id)
            ->orderBy('club.club_id')
            ->orderBy('package.max_slot')
            ->get();
        $franchise['packages'] = $packages;
        $franchise['group_admin'] = $groupAdminUser;
        return response()->json($franchise);
    }

    /**
     * @param $franchiseId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function get_franchise_clubs($franchiseId)
    {
        //group admins can only access their franchise (this route is restricted to superadmins and groupadmins)
        if (Auth::user()->hasRole('groupadmin') && $franchiseId != $this->franchise_id) {
            return response()->json('You do not have permissions to view this franchise', 403);
        }

        $franchise = Franchise::find($franchiseId);
        if (empty($franchise)) {
            return response()->json('Franchise not found', 404);
        }

        $clubs = new Club();

        //Drop down menu
        if(isset($this->request->type) && $this->request->type === 'dropdown'){
            $clubs = $clubs->select([
                'club.club_id as id',
                'club.title',
                'rel_club_package.amount as amount'
            ]);
            $clubs = $clubs->leftJoin('rel_club_package', 'rel_club_package.club_id', '=', 'club.club_id');
            $clubs = $clubs->where('rel_club_package.franchise_id', $franchiseId);
        }

        $clubs = $clubs->where('club.franchise_id', $franchiseId)
            ->get();

        $franchise->clubs = $clubs;

        return response()->json($franchise);
    }

    /**
     * Get all available packages for this franchise.
     *
     * @return json
     */
    public function get_packages()
    {
        $this->validate($this->request, [
            'franchise_id' => 'int|min:1|exists:franchise,franchise_id'
        ]);
        $franchiseId = isset($this->request['franchise_id']) ? $this->request['franchise_id'] : $this->franchise_id;

        if (Auth::user()->hasRole('groupadmin')) {
            $franchiseId = $this->franchise_id;
        }

        $packages = RelClubPackage::select(
            DB::raw('SQL_CALC_FOUND_ROWS rel_club_package.id'),
            DB::raw('(SELECT COUNT(*) FROM player WHERE player.status = 1 AND player.club_id = club.club_id) AS player_no'),
            'rel_club_package.*',
            'club.title AS club_name',
            'club.slug',
            'package.title AS package',
            'package.max_slot',
            'package.description'
        )
            ->leftJoin('club', 'club.club_id', '=', 'rel_club_package.club_id')
            ->leftJoin('package', 'package.id', '=', 'rel_club_package.package_id')
            ->where('rel_club_package.franchise_id', $franchiseId);

        // check state is set
        if (isset($this->request['status'])) {
            $packages = $packages->where('rel_club_package.status', $this->request['status']);
        }

        $packages = $packages->where(function ($query) {
            if (isset($this->request['rel_club_package_id']) && !empty($this->request['rel_club_package_id'])) {
                $query->where('rel_club_package.id', $this->request['rel_club_package_id']);
            }
            return $query;
        })
            ->orderBy('package.title')
            ->orderBy('package.max_slot');

        $totalAmount = $packages;
        $totalAmount = number_format($totalAmount->get()->sum('amount'), 2);

        $packages = $packages->paginate($this->perPage);

        $packages = $packages->items();
        $requestsCount = DB::select(DB::raw("SELECT FOUND_ROWS() AS count;"));
        $count = reset($requestsCount)->count;

        $data = [
            'entities' => $packages,
            'count' => $count,
            'filters' => null,
            'total' => $totalAmount
        ];
        return response()->json($data);
    }

    /**
     * Purchase a new package
     *
     * @return json
     */
    public function buy_package()
    {
        $this->validate($this->request, [
            'package_id' => 'required|int|min:1|exists:package,id',
            'quantity' => 'required|int|min:1'
        ]);
        for ($i = 0; $i < $this->request['quantity']; $i++) {
            $rel_club_package = new RelClubPackage;
            $rel_club_package->package_id = $this->request['package_id'];
            $rel_club_package->club_id = 0;
            $rel_club_package->franchise_id = $this->franchise_id;
            $rel_club_package->start_date = Carbon::now()->toDateTimeString();
            $rel_club_package->expire_date = Carbon::now()->addMonth()->toDateTimeString();
            $rel_club_package->amount = gr_get_package_price($this->request['package_id']);
            $rel_club_package->created_by = $this->user_id;
            $rel_club_package->updated_by = $this->user_id;
            $rel_club_package->status = 1; //active
            $rel_club_package->save();
        }

        return response()->json($rel_club_package);
    }
}
