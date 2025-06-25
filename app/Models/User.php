<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'facebook_id',
        'avatar',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationships
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function employer(): HasOne
    {
        return $this->hasOne(Employer::class);
    }

    public function maid(): HasOne
    {
        return $this->hasOne(Maid::class);
    }

    /**
     * Helper methods
     */
    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    public function isMaid()
    {
        return $this->role === 'maid';
    }

    public function isEmployer()
    {
        return $this->role === 'employer';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isAgency()
    {
        return $this->role === 'agency';
    }

    public function getFullNameAttribute()
    {
        return $this->profile ? $this->profile->first_name . ' ' . $this->profile->last_name : null;
    }
}