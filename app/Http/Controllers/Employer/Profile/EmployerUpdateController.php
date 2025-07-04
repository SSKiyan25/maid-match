<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\EmployerRequest;

class EmployerUpdateController extends Controller
{
    public function update(EmployerRequest $request)
    {
        $employer = auth()->user()->employer;

        $employer->fill($request->validated());
        $employer->save();

        return redirect()->back()->with('success', 'Employer information updated successfully!');
    }
}
