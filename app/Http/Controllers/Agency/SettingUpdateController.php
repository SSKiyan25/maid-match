<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agency\AgencySettingRequest;
use App\Models\Agency\AgencySetting;

class SettingUpdateController extends Controller
{
    public function update(AgencySettingRequest $request, AgencySetting $setting)
    {
        $agency = auth()->user()->agency;

        // Ensure the setting belongs to the current agency
        if ($setting->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();
        $setting->fill($data);
        $setting->save();

        return redirect()->back()->with('success', 'Agency settings updated successfully!');
    }
}
