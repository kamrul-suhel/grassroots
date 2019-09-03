<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController {

    /*
     * Set up pagination option
     */
    public $perPage = 12;

    public function __construct(Request $request)
    {
        $request->has('per_page') ? $this->perPage = $request->perPage : null;
    }
}
