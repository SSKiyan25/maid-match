<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserPhotoRequest;
use App\Http\Resources\UserPhotoResource;
use App\Models\UserPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserPhotoController extends Controller
{

    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        $photos = UserPhoto::where('user_id', $userId)->get();
        
        return response()->json([
            'success' => true,
            'photos' => UserPhotoResource::collection($photos),
        ]);
    }

    public function store(UserPhotoRequest $request)
    {
        $data = $request->validated();

        // Handle file upload
        if ($request->hasFile('url')) {
            $path = $request->file('url')->store('user_photos', 'public');
            $data['url'] = $path;
        }

        $photo = UserPhoto::create($data);

        return response()->json([
            'success' => true,
            'photo' => new UserPhotoResource($photo),
        ]);
    }

    public function update(UserPhotoRequest $request, UserPhoto $userPhoto)
    {
        $data = $request->validated();

        // Handle file upload if present
        if ($request->hasFile('url')) {
            // Delete old file if exists
            if ($userPhoto->url && Storage::disk('public')->exists($userPhoto->url)) {
                Storage::disk('public')->delete($userPhoto->url);
            }
            $path = $request->file('url')->store('user_photos', 'public');
            $data['url'] = $path;
        }

        $userPhoto->update($data);

        return response()->json([
            'success' => true,
            'photo' => new UserPhotoResource($userPhoto),
        ]);
    }

    public function destroy(UserPhoto $userPhoto)
    {
        // Delete file from storage
        if ($userPhoto->url && Storage::disk('public')->exists($userPhoto->url)) {
            Storage::disk('public')->delete($userPhoto->url);
        }

        $userPhoto->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}