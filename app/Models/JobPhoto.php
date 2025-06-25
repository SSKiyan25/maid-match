<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class JobPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'url',
        'caption',
        'type',
        'sort_order',
        'is_primary',
        'is_archived',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Photo types
     */
    const PHOTO_TYPES = [
        'household' => 'Household Overview',
        'room' => 'Room/Bedroom',
        'kitchen' => 'Kitchen',
        'workspace' => 'Workspace',
        'other' => 'Other',
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

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeSecondary($query)
    {
        return $query->where('is_primary', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('is_primary', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'asc');
    }

    public function scopeHousehold($query)
    {
        return $query->where('type', 'household');
    }

    public function scopeRooms($query)
    {
        return $query->where('type', 'room');
    }

    public function scopeKitchen($query)
    {
        return $query->where('type', 'kitchen');
    }

    public function scopeWorkspace($query)
    {
        return $query->where('type', 'workspace');
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::PHOTO_TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getFileNameAttribute()
    {
        return basename($this->url);
    }

    public function getFileExtensionAttribute()
    {
        return pathinfo($this->url, PATHINFO_EXTENSION);
    }

    public function getFileSizeAttribute()
    {
        if (Storage::exists($this->url)) {
            return Storage::size($this->url);
        }
        return null;
    }

    public function getFileSizeHumanAttribute()
    {
        $size = $this->file_size;
        if (!$size) return 'Unknown';

        $units = ['B', 'KB', 'MB', 'GB'];
        $power = $size > 0 ? floor(log($size, 1024)) : 0;

        return number_format($size / pow(1024, $power), 2, '.', ',') . ' ' . $units[$power];
    }

    public function getFullUrlAttribute()
    {
        // If it's already a full URL, return as is
        if (str_starts_with($this->url, 'http')) {
            return $this->url;
        }

        // Generate storage URL
        return Storage::url($this->url);
    }

    public function getThumbnailUrlAttribute()
    {
        // You might want to implement thumbnail generation
        // For now, return the original image
        return $this->full_url;
    }

    public function getDisplayCaptionAttribute()
    {
        return $this->caption ?: $this->type_label;
    }

    public function getIsValidAttribute()
    {
        return Storage::exists($this->url) && !$this->is_archived;
    }

    /**
     * Helper Methods
     */
    public function setPrimary()
    {
        // Remove primary flag from other photos in the same job posting
        $this->jobPosting->photos()
            ->where('id', '!=', $this->id)
            ->update(['is_primary' => false]);

        // Set this photo as primary
        $this->update(['is_primary' => true]);
    }

    public function removePrimary()
    {
        $this->update(['is_primary' => false]);
    }

    public function moveUp()
    {
        $upperPhoto = $this->jobPosting->photos()
            ->where('sort_order', '<', $this->sort_order)
            ->orderBy('sort_order', 'desc')
            ->first();

        if ($upperPhoto) {
            $tempOrder = $this->sort_order;
            $this->update(['sort_order' => $upperPhoto->sort_order]);
            $upperPhoto->update(['sort_order' => $tempOrder]);
        }
    }

    public function moveDown()
    {
        $lowerPhoto = $this->jobPosting->photos()
            ->where('sort_order', '>', $this->sort_order)
            ->orderBy('sort_order', 'asc')
            ->first();

        if ($lowerPhoto) {
            $tempOrder = $this->sort_order;
            $this->update(['sort_order' => $lowerPhoto->sort_order]);
            $lowerPhoto->update(['sort_order' => $tempOrder]);
        }
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);

        // If this was the primary photo, set another one as primary
        if ($this->is_primary) {
            $nextPrimary = $this->jobPosting->photos()
                ->notArchived()
                ->where('id', '!=', $this->id)
                ->ordered()
                ->first();

            if ($nextPrimary) {
                $nextPrimary->setPrimary();
            }
        }
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function exists()
    {
        return Storage::exists($this->url);
    }

    public function delete()
    {
        // Delete the file from storage
        if (Storage::exists($this->url)) {
            Storage::delete($this->url);
        }

        // If this was the primary photo, set another one as primary
        if ($this->is_primary) {
            $nextPrimary = $this->jobPosting->photos()
                ->notArchived()
                ->where('id', '!=', $this->id)
                ->ordered()
                ->first();

            if ($nextPrimary) {
                $nextPrimary->setPrimary();
            }
        }

        // Delete the record
        return parent::delete();
    }

    /**
     * Static Methods
     */
    public static function getPhotoTypes()
    {
        return self::PHOTO_TYPES;
    }

    public static function getNextSortOrder(JobPosting $jobPosting)
    {
        return $jobPosting->photos()->max('sort_order') + 1;
    }

    public static function reorderPhotos(JobPosting $jobPosting, array $photoIds)
    {
        foreach ($photoIds as $index => $photoId) {
            $jobPosting->photos()
                ->where('id', $photoId)
                ->update(['sort_order' => $index + 1]);
        }
    }

    public static function ensurePrimaryPhoto(JobPosting $jobPosting)
    {
        $hasPrimary = $jobPosting->photos()
            ->notArchived()
            ->primary()
            ->exists();

        if (!$hasPrimary) {
            $firstPhoto = $jobPosting->photos()
                ->notArchived()
                ->ordered()
                ->first();

            if ($firstPhoto) {
                $firstPhoto->setPrimary();
            }
        }
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-assign sort order when creating
        static::creating(function ($photo) {
            if (!$photo->sort_order) {
                $photo->sort_order = self::getNextSortOrder($photo->jobPosting);
            }
        });

        // Clean up file when deleting
        static::deleting(function ($photo) {
            if (Storage::exists($photo->url)) {
                Storage::delete($photo->url);
            }
        });

        // Ensure there's always a primary photo
        static::saved(function ($photo) {
            if ($photo->is_primary) {
                // Remove primary from other photos
                $photo->jobPosting->photos()
                    ->where('id', '!=', $photo->id)
                    ->update(['is_primary' => false]);
            }
        });
    }
}