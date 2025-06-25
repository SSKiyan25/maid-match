<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class JobLocation extends Model
{
    use HasFactory;

    protected $table = 'job_location';

    protected $fillable = [
        'job_posting_id',
        'brgy',
        'city',
        'landmark',
        'is_hidden',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'directions',
        'is_archived',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_archived' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeNotHidden($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeByCity($query, $city)
    {
        return $query->where('city', 'LIKE', "%{$city}%");
    }

    public function scopeByBarangay($query, $brgy)
    {
        return $query->where('brgy', 'LIKE', "%{$brgy}%");
    }

    public function scopeByProvince($query, $province)
    {
        return $query->where('province', 'LIKE', "%{$province}%");
    }

    public function scopeWithCoordinates($query)
    {
        return $query->whereNotNull('latitude')
            ->whereNotNull('longitude');
    }

    public function scopeWithinRadius($query, $latitude, $longitude, $radiusKm = 10)
    {
        $haversine = "(6371 * acos(cos(radians(?)) 
                     * cos(radians(latitude)) 
                     * cos(radians(longitude) - radians(?)) 
                     + sin(radians(?)) 
                     * sin(radians(latitude))))";

        return $query->whereRaw("{$haversine} <= ?", [$latitude, $longitude, $latitude, $radiusKm]);
    }

    /**
     * Accessors
     */
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->brgy ? "Brgy. {$this->brgy}" : null,
            $this->city,
            $this->province,
        ]);

        return implode(', ', $parts);
    }

    public function getDisplayAddressAttribute()
    {
        if ($this->is_hidden) {
            return "{$this->city}" . ($this->province ? ", {$this->province}" : "");
        }

        return $this->full_address;
    }

    public function getShortAddressAttribute()
    {
        if ($this->is_hidden) {
            return $this->city;
        }

        return "Brgy. {$this->brgy}, {$this->city}";
    }

    public function getHasCoordinatesAttribute()
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    public function getHasLandmarkAttribute()
    {
        return !empty($this->landmark);
    }

    // API for Google Maps not yet implemented
    public function getMapUrlAttribute()
    {
        if (!$this->has_coordinates) {
            $address = urlencode($this->full_address);
            return "https://www.google.com/maps/search/?api=1&query={$address}";
        }

        return "https://www.google.com/maps/search/?api=1&query={$this->latitude},{$this->longitude}";
    }

    public function getDirectionsUrlAttribute()
    {
        if (!$this->has_coordinates) {
            $address = urlencode($this->full_address);
            return "https://www.google.com/maps/dir/?api=1&destination={$address}";
        }

        return "https://www.google.com/maps/dir/?api=1&destination={$this->latitude},{$this->longitude}";
    }

    /**
     * Helper Methods
     */
    public function hide()
    {
        $this->update(['is_hidden' => true]);
    }

    public function unhide()
    {
        $this->update(['is_hidden' => false]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function setCoordinates($latitude, $longitude)
    {
        $this->update([
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }

    public function calculateDistanceTo($latitude, $longitude)
    {
        if (!$this->has_coordinates) {
            return null;
        }

        $earthRadius = 6371; // km

        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($latitude);
        $lonTo = deg2rad($longitude);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }

    public function isWithinRadius($latitude, $longitude, $radiusKm = 10)
    {
        $distance = $this->calculateDistanceTo($latitude, $longitude);
        return $distance !== null && $distance <= $radiusKm;
    }

    public function getNearbyJobs($radiusKm = 10, $limit = 10)
    {
        if (!$this->has_coordinates) {
            return collect();
        }

        return self::withCoordinates()
            ->withinRadius($this->latitude, $this->longitude, $radiusKm)
            ->whereHas('jobPosting', function ($query) {
                $query->active()->notArchived();
            })
            ->with('jobPosting')
            ->limit($limit)
            ->get();
    }

    /**
     * Static Methods
     */
    public static function searchByLocation($searchTerm)
    {
        return self::where(function ($query) use ($searchTerm) {
            $query->where('city', 'LIKE', "%{$searchTerm}%")
                ->orWhere('brgy', 'LIKE', "%{$searchTerm}%")
                ->orWhere('province', 'LIKE', "%{$searchTerm}%")
                ->orWhere('landmark', 'LIKE', "%{$searchTerm}%");
        });
    }

    public static function getPopularLocations($limit = 10)
    {
        return self::select('city', DB::raw('count(*) as job_count'))
            ->whereHas('jobPosting', function ($query) {
                $query->active()->notArchived();
            })
            ->groupBy('city')
            ->orderBy('job_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public static function geocodeAddress($address)
    {
        // This would integrate with a geocoding service like Google Maps API
        // For now, return null - implement based on your preferred service
        return [
            'latitude' => null,
            'longitude' => null,
        ];
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-capitalize city and barangay names
        static::saving(function ($location) {
            $location->city = ucwords(strtolower($location->city));
            $location->brgy = ucwords(strtolower($location->brgy));

            if ($location->province) {
                $location->province = ucwords(strtolower($location->province));
            }
        });

        // Try to geocode address if coordinates are missing
        static::created(function ($location) {
            if (!$location->has_coordinates) {
                $coordinates = self::geocodeAddress($location->full_address);
                if ($coordinates['latitude'] && $coordinates['longitude']) {
                    $location->setCoordinates($coordinates['latitude'], $coordinates['longitude']);
                }
            }
        });
    }
}