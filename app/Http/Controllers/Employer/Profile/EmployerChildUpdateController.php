<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\EmployerChildRequest;
use App\Models\Employer\EmployerChild;
use Illuminate\Support\Facades\Storage;

class EmployerChildUpdateController extends Controller
{
    public function update(EmployerChildRequest $request, EmployerChild $child)
    {
        // Ensure the child belongs to the authenticated employer
        $employer = auth()->user()->employer;
        if ($child->employer_id !== $employer->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validatedWithEmployer();

        // Handle photo upload only if a new file is uploaded
        if ($request->hasFile('photo_url')) {
            // Delete old photo if exists
            if ($child->photo_url && Storage::disk('public')->exists($child->photo_url)) {
                Storage::disk('public')->delete($child->photo_url);
            }
            $data['photo_url'] = $request->file('photo_url')->store('children_photos', 'public');
        } else {
            // If no new photo uploaded, retain the old photo
            $data['photo_url'] = $child->photo_url;
        }

        $child->fill($data);
        $child->save();

        return redirect()->back()->with('success', 'Child information updated successfully!');
    }

    public function store(EmployerChildRequest $request)
    {
        $data = $request->validatedWithEmployer();

        // Handle photo upload
        if ($request->hasFile('photo_url')) {
            $data['photo_url'] = $request->file('photo_url')->store('children_photos', 'public');
        }

        EmployerChild::create($data);

        return redirect()->back()->with('success', 'Child added successfully!');
    }

    public function destroy(EmployerChild $child)
    {
        $employer = auth()->user()->employer;
        if ($child->employer_id !== $employer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete photo if exists
        if ($child->photo_url && Storage::disk('public')->exists($child->photo_url)) {
            Storage::disk('public')->delete($child->photo_url);
        }

        $child->delete();

        return redirect()->back()->with('success', 'Child removed successfully!');
    }
}
