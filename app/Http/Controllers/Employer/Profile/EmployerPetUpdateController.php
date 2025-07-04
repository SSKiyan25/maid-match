<?php

namespace App\Http\Controllers\Employer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\EmployerPetRequest;
use App\Models\Employer\EmployerPet;
use Illuminate\Support\Facades\Storage;

class EmployerPetUpdateController extends Controller
{
    public function update(EmployerPetRequest $request, EmployerPet $pet)
    {
        // Ensure the pet belongs to the authenticated employer
        $employer = auth()->user()->employer;
        if ($pet->employer_id !== $employer->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validatedWithEmployer();

        // Handle photo upload only if a new file is uploaded
        if ($request->hasFile('photo_url')) {
            // Delete old photo if exists
            if ($pet->photo_url && Storage::disk('public')->exists($pet->photo_url)) {
                Storage::disk('public')->delete($pet->photo_url);
            }
            $data['photo_url'] = $request->file('photo_url')->store('pet_photos', 'public');
        } else {
            // If no new photo uploaded, retain the old photo
            $data['photo_url'] = $pet->photo_url;
        }

        $pet->fill($data);
        $pet->save();

        return redirect()->back()->with('success', 'Pet information updated successfully!');
    }

    public function store(EmployerPetRequest $request)
    {
        $data = $request->validatedWithEmployer();

        // Handle photo upload
        if ($request->hasFile('photo_url')) {
            $data['photo_url'] = $request->file('photo_url')->store('pet_photos', 'public');
        }

        EmployerPet::create($data);

        return redirect()->back()->with('success', 'Pet added successfully!');
    }

    public function destroy(EmployerPet $pet)
    {
        $employer = auth()->user()->employer;
        if ($pet->employer_id !== $employer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete photo if exists
        if ($pet->photo_url && Storage::disk('public')->exists($pet->photo_url)) {
            Storage::disk('public')->delete($pet->photo_url);
        }

        $pet->delete();

        return redirect()->back()->with('success', 'Pet removed successfully!');
    }
}
