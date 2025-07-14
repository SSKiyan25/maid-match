<?php

namespace App\Http\Controllers\Agency\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\AgencyPhotoRequest;
use App\Models\Agency\AgencyPhoto;
use Illuminate\Support\Facades\Storage;

class PhotoUpdateController extends Controller
{
    public function store(AgencyPhotoRequest $request)
    {
        $agency = auth()->user()->agency;
        $data = $request->validated();

        // Handle multiple photo uploads
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photoFile) {
                $photoData = $data;
                $photoData['url'] = $photoFile->store('agency_photos', 'public');
                $photoData['agency_id'] = $agency->id;
                AgencyPhoto::create($photoData);
            }
        }

        return redirect()->back()->with('success', 'Photo(s) added successfully!');
    }

    public function update(AgencyPhotoRequest $request, AgencyPhoto $photo)
    {
        $agency = auth()->user()->agency;
        if ($photo->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();

        // Handle photo upload only if a new file is uploaded
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($photo->url && Storage::disk('public')->exists($photo->url)) {
                Storage::disk('public')->delete($photo->url);
            }
            $data['url'] = $request->file('photo')->store('agency_photos', 'public');
        } else {
            // If no new photo uploaded, retain the old photo
            $data['url'] = $photo->url;
        }

        $photo->fill($data);
        $photo->save();

        return redirect()->back()->with('success', 'Photo updated successfully!');
    }

    public function destroy(AgencyPhoto $photo)
    {
        $agency = auth()->user()->agency;
        if ($photo->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete photo file if exists
        if ($photo->url && Storage::disk('public')->exists($photo->url)) {
            Storage::disk('public')->delete($photo->url);
        }

        $photo->delete();

        return redirect()->back()->with('success', 'Photo removed successfully!');
    }
}
