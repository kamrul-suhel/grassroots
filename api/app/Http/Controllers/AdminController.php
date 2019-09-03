<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;


class AdminController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        $this->middleware('auth');
        $this->middleware('role:admin');
    }
}
