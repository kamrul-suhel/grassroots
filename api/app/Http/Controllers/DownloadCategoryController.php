<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DownloadCategory;
use Auth;
use DB;

class DownloadCategoryController extends Controller
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
        $this->user_id = Auth::id();
        $this->franchise_id = Auth::getPayload()->get('franchise_id');
        $this->club_id = Auth::getPayLoad()->get('club_id');
    }

    public function list()
    {
        $categories = DownloadCategory::select('id', 'title')
            ->where('club_id', $this->club_id)
            ->orderBy('title', 'ASC')
            ->get();

        return response()->json($categories);
    }

    /**
     * Create download category
     */
    public function create()
    {
        // Validate request
        $this->validate($this->request, [
            'club_id' => 'exists:club,club_id',
            'category' => 'string|min:1'
        ]);

        $category = new DownloadCategory();
        $category->club_id = $this->request->club_id;
        $category->title = $this->request->category;
        $category->created_by = $this->user_id;
        $category->updated_by = $this->user_id;
        $category->save();

        return response()->json("success");
    }

}
