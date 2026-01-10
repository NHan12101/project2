<?php

namespace App\Http\Controllers;

use App\Services\AI\AIContentService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    public function generate(Request $request, AIContentService $ai)
    {
        return response()->json(
            $ai->generatePost($request->all())
        );
    }
}
