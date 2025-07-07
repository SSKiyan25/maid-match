<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MaidController extends Controller
{
    public function create()
    {
        return inertia('Agency/Maids/Create');
    }
}
