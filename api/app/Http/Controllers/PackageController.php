<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\RelClubPackage;
use App\Package;
use Auth;
use DB;

class PackageController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->middleware('auth', ['except' => ['get_packages']]);
        $this->middleware('role:superadmin', ['except' => ['get_packages']]);
        $this->user_id = Auth::id();
    }

    /**
     * Get all packages packages
     *
     * @return void
     */
    public function get_packages()
    {
        $pagination = create_pagination();
        $packages = Package::select('id', 'title', 'image_url', 'description', 'price', 'max_slot', 'status')
            ->where(function ($query) {
                //allow search by package tile
                if (isset($this->request['search']) && !empty($this->request['search'])) {
                    $query->where('title', 'like', '%' . $this->request['search'] . '%');
                }
                return $query;
            })
            ->orderBy('max_slot')
            ->orderBy('price')
            ->limit($pagination['per_page'])
            ->offset($pagination['offset'])
            ->get();
        $count = $packages->count();
        //handle the filters
        $search = create_filter('search', 'Search');
        $filters = [$search];
        return format_response($packages, $count, $filters);
    }

    /**
     * Get the package with package id
     *
     * @param int $id [id of the package to be updated]
     * @return void
     */
    public function get_package($id)
    {
        $package = Package::select('id', 'title', 'image_url', 'description', 'price', 'max_slot', 'status')
            ->where('id', $id)
            ->first();
        return response()->json($package, 200);
    }

    /**
     * Create a new package
     *
     * @return void
     */
    public function create_package()
    {
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'image_url' => 'file|image|max:1024',
            'description' => 'string',
            'price' => 'required|numeric|min:0',
            'max_slot' => 'required|integer|min:1'
        ],
            [
                'image_url.max' => 'Package image cannot be bigger than 1 MB',
                'max_slot.integer' => 'Maximum number of players must be a number.'
            ]);

        // Check package title is exists
        $existingPackage = Package::where('title', $this->request['title'])
            ->first();

        if (!empty($existingPackage)) {
            return response()->json('This package title has been taken.', 422);
        }

        $package = new Package;
        $package->title = $this->request['title'];
        $package->price = $this->request['price'];
        $package->max_slot = $this->request['max_slot'];
        $package->description = isset($this->request['description']) ? $this->request['description'] : '';
        if (isset($this->request['image_url']) && !empty($this->request['image_url']) && $this->request->hasFile('image_url')) {
            $file = $this->request->file('file');
            $image_url = gr_save_file($file, 'packages', 'all');
            $package->image_url = $image_url;
        }
        $package->created_by = $this->user_id;
        $package->updated_by = $this->user_id;
        $package->status = 1; //active by default
        $package->save();

        return response()->json($package, 200);
    }

    /**
     * Update the package with $id
     * @param int $id [id of the package to be updated]
     * @return void
     */
    public function update_package($id)
    {
        $this->validate($this->request, [
            'title' => 'required|string|max:255',
            'image_url' => 'file|image|max:1024',
            'description' => 'string',
            'price' => 'required|numeric|min:0',
            'max_slot' => 'required|int|min:1',
            'status' => 'int|min:0|max:1'
        ],
            [
                'image_url.max' => 'Package image cannot be bigger than 1 MB'
            ]);

        $package = Package::find($id);

        $existingPackage = Package::where('title', $this->request['title'])
            ->where('id', '!=', $package->id)
            ->first();

        if (!empty($existingPackage)) {
            return response()->json('This package title has been taken.', 422);
        }

        if ($package->max_slot > $this->request['max_slot']) {
            return response()->json('You can’t decrease the max number of players', 422);
        }
        $oldPackageTitle = $package->title;

        $package->title = $this->request['title'];
        $package->price = $this->request['price'];
        $package->max_slot = $this->request['max_slot'];
        $package->description = isset($this->request['description']) ? $this->request['description'] : '';
        if (isset($this->request['image_url']) && !empty($this->request['image_url']) && $this->request->hasFile('image_url')) {
            //remove the old profile image
            if (!empty($package->image_url)) {
                gr_delete_file($package->image_url);
            }
            $file = $this->request->file('image_url');
            $image_url = gr_save_file($file, 'packages', 'all');
            $package->image_url = $image_url;
        }
        $package->updated_by = $this->user_id;
        if (isset($this->request['status'])) {
            $package->status = $this->request['status'];
        }

        // Send email to franchise user. to notify package change
//        $franchises = Package::select([
//            'package.title',
//            'package.description',
//            'package.price',
//            'package.max_slot',
//            'franchise.email',
//            'franchise.title as franchise_title'
//        ])->leftJoin('rel_club_package', 'package.id', '=', 'rel_club_package.package_id')
//            ->leftJoin('franchise', 'rel_club_package.franchise_id', '=', 'franchise.franchise_id')
//            ->where('package.id', $id)
//            ->get();
//
        $package->save();
//
//        $franchises->each(function($franchise) use ($oldPackageTitle){
//            $franchise->old_package_title = $oldPackageTitle;
//            Mail::send('emails.package-change', ['content' => $franchise], function($message) use ($franchise){
//                $message->subject('Package change nitification');
//                $message->to($franchise->email);
//            });
//        });

        return response()->json($package);
    }

    /**
     * Delete the package with $id
     * @param int $id [id of the package to be updated]
     * @return void
     */
    public function delete_package($id)
    {
        //make sure this packege is not assign to any club
        $rel_club_package = RelClubPackage::where('package_id', $id)->first();
        if (!empty($rel_club_package)) {
            return response()->json('You have clubs assigned to this package', 403);
        }
        Package::find($id)->delete();
        return response('Package Deleted', 200);
    }
}
