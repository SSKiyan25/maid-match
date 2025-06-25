<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaidDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'maid_id',
        'type',
        'title',
        'url',
        'description',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    /**
     * Document types
     */
    const DOCUMENT_TYPES = [
        'id' => 'National ID',
        'passport' => 'Passport',
        'certificate' => 'Certificate',
        'resume' => 'Resume/CV',
        'reference' => 'Reference Letter',
        'medical' => 'Medical Certificate',
        'other' => 'Other Document',
    ];

    /**
     * Required documents for verification
     */
    const REQUIRED_DOCUMENTS = [
        'id' => 'Valid ID (National ID or Passport)',
        'resume' => 'Resume or CV',
        'medical' => 'Medical Certificate',
    ];

    /**
     * Relationships
     */
    public function maid(): BelongsTo
    {
        return $this->belongsTo(Maid::class);
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRequired($query)
    {
        return $query->whereIn('type', array_keys(self::REQUIRED_DOCUMENTS));
    }

    public function scopeOptional($query)
    {
        return $query->whereNotIn('type', array_keys(self::REQUIRED_DOCUMENTS));
    }

    public function scopeVerificationDocuments($query)
    {
        return $query->whereIn('type', ['id', 'passport', 'medical']);
    }

    public function scopeProfessionalDocuments($query)
    {
        return $query->whereIn('type', ['resume', 'certificate', 'reference']);
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::DOCUMENT_TYPES[$this->type] ?? ucfirst($this->type);
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

    public function getIsImageAttribute()
    {
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        return in_array(strtolower($this->file_extension), $imageExtensions);
    }

    public function getIsPdfAttribute()
    {
        return strtolower($this->file_extension) === 'pdf';
    }

    public function getIsRequiredAttribute()
    {
        return array_key_exists($this->type, self::REQUIRED_DOCUMENTS);
    }

    public function getDownloadUrlAttribute()
    {
        return route('maid.documents.download', $this->id);
    }

    public function getViewUrlAttribute()
    {
        if ($this->is_image || $this->is_pdf) {
            return route('maid.documents.view', $this->id);
        }
        return $this->download_url;
    }

    /**
     * Helper Methods
     */
    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function delete()
    {
        // Delete the file from storage
        if (Storage::exists($this->url)) {
            Storage::delete($this->url);
        }

        // Delete the record
        return parent::delete();
    }

    public function exists()
    {
        return Storage::exists($this->url);
    }

    public function isViewable()
    {
        return $this->is_image || $this->is_pdf;
    }

    public function isValid()
    {
        return $this->exists() && !$this->is_archived;
    }

    /**
     * Static Methods
     */
    public static function getDocumentTypes()
    {
        return self::DOCUMENT_TYPES;
    }

    public static function getRequiredDocuments()
    {
        return self::REQUIRED_DOCUMENTS;
    }

    public static function getRequiredDocumentTypes()
    {
        return array_keys(self::REQUIRED_DOCUMENTS);
    }

    public static function getMissingRequiredDocuments(Maid $maid)
    {
        $existingTypes = $maid->documents()
            ->notArchived()
            ->required()
            ->pluck('type')
            ->toArray();

        $requiredTypes = self::getRequiredDocumentTypes();

        return array_diff($requiredTypes, $existingTypes);
    }

    public static function hasAllRequiredDocuments(Maid $maid)
    {
        return empty(self::getMissingRequiredDocuments($maid));
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Clean up file when deleting document
        static::deleting(function ($document) {
            if (Storage::exists($document->url)) {
                Storage::delete($document->url);
            }
        });
    }
}