<?php

namespace App\Http\Requests\JobPosting;

use Illuminate\Foundation\Http\FormRequest;

class JobLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their job locations, or admins
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'brgy' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'directions' => ['nullable', 'string', 'max:1000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_hidden' => ['nullable', 'boolean'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['job_posting_id'] = ['sometimes', 'integer', 'exists:job_postings,id'];
            $rules['brgy'] = ['sometimes', 'string', 'max:100'];
            $rules['city'] = ['sometimes', 'string', 'max:100'];
            $rules['province'] = ['sometimes', 'string', 'max:100'];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'job_posting_id.required' => 'Job posting ID is required.',
            'job_posting_id.exists' => 'Selected job posting does not exist.',
            'brgy.required' => 'Barangay is required.',
            'brgy.max' => 'Barangay name cannot exceed 100 characters.',
            'city.required' => 'City is required.',
            'city.max' => 'City name cannot exceed 100 characters.',
            'province.required' => 'Province is required.',
            'province.max' => 'Province name cannot exceed 100 characters.',
            'postal_code.max' => 'Postal code cannot exceed 10 characters.',
            'landmark.max' => 'Landmark description cannot exceed 255 characters.',
            'directions.max' => 'Directions cannot exceed 1000 characters.',
            'latitude.numeric' => 'Latitude must be a valid number.',
            'latitude.between' => 'Latitude must be between -90 and 90 degrees.',
            'longitude.numeric' => 'Longitude must be a valid number.',
            'longitude.between' => 'Longitude must be between -180 and 180 degrees.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'job_posting_id' => 'job posting',
            'brgy' => 'barangay',
            'city' => 'city',
            'province' => 'province',
            'postal_code' => 'postal code',
            'landmark' => 'landmark',
            'directions' => 'directions',
            'latitude' => 'latitude',
            'longitude' => 'longitude',
            'is_hidden' => 'privacy setting',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean and prepare text fields
        if ($this->has('brgy')) {
            $data['brgy'] = trim($this->brgy);
        }

        if ($this->has('city')) {
            $data['city'] = trim($this->city);
        }

        if ($this->has('province')) {
            $data['province'] = trim($this->province);
        }

        if ($this->has('postal_code')) {
            $data['postal_code'] = trim($this->postal_code) ?: null;
        }

        if ($this->has('landmark')) {
            $data['landmark'] = trim($this->landmark) ?: null;
        }

        if ($this->has('directions')) {
            $data['directions'] = trim($this->directions) ?: null;
        }

        // Convert numeric values
        if ($this->has('job_posting_id')) {
            $data['job_posting_id'] = (int) $this->job_posting_id;
        }

        if ($this->has('latitude')) {
            $data['latitude'] = is_numeric($this->latitude) ? (float) $this->latitude : null;
        }

        if ($this->has('longitude')) {
            $data['longitude'] = is_numeric($this->longitude) ? (float) $this->longitude : null;
        }

        // Convert boolean values
        foreach (['is_hidden', 'is_archived'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate job posting ownership
            if ($this->job_posting_id && auth()->user()->hasRole('employer')) {
                $jobPosting = \App\Models\JobPosting::find($this->job_posting_id);

                if ($jobPosting && $jobPosting->employer_id !== auth()->user()->employer->id) {
                    $validator->errors()->add('job_posting_id', 'You can only add locations to your own job postings.');
                }
            }

            // Validate coordinates consistency (both or neither)
            $hasLatitude = !is_null($this->latitude);
            $hasLongitude = !is_null($this->longitude);

            if ($hasLatitude && !$hasLongitude) {
                $validator->errors()->add('longitude', 'Longitude is required when latitude is provided.');
            }

            if ($hasLongitude && !$hasLatitude) {
                $validator->errors()->add('latitude', 'Latitude is required when longitude is provided.');
            }

            // Validate Philippine coordinates if provided
            if ($hasLatitude && $hasLongitude) {
                // Philippines latitude range: approximately 5°N to 21°N
                // Philippines longitude range: approximately 117°E to 127°E
                if ($this->latitude < 5 || $this->latitude > 21) {
                    $validator->errors()->add('latitude', 'Latitude should be within Philippines range (5°N to 21°N).');
                }

                if ($this->longitude < 117 || $this->longitude > 127) {
                    $validator->errors()->add('longitude', 'Longitude should be within Philippines range (117°E to 127°E).');
                }
            }

            // Validate text fields are not just spaces
            foreach (['brgy', 'city', 'province'] as $field) {
                if ($this->$field && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst($field) . ' cannot be empty or just spaces.');
                }
            }

            // Validate Philippine postal code format if provided
            if ($this->postal_code) {
                if (!preg_match('/^\d{4}$/', $this->postal_code)) {
                    $validator->errors()->add('postal_code', 'Postal code should be 4 digits for Philippines (e.g., 1234).');
                }
            }

            // Validate common Philippine cities and provinces
            if ($this->city) {
                $commonCities = [
                    'manila',
                    'quezon city',
                    'makati',
                    'pasig',
                    'taguig',
                    'mandaluyong',
                    'marikina',
                    'pasay',
                    'parañaque',
                    'muntinlupa',
                    'las piñas',
                    'caloocan',
                    'malabon',
                    'navotas',
                    'valenzuela',
                    'pateros',
                    'cebu city',
                    'davao city',
                    'iloilo city',
                    'bacolod',
                    'cagayan de oro',
                    'zamboanga city',
                    'antipolo',
                    'tarlac city',
                    'baguio'
                ];

                $cityLower = strtolower($this->city);
                // This is just a warning system - not blocking validation
            }

            // Check for duplicate location for the same job posting
            if ($this->job_posting_id && $this->isMethod('POST')) {
                $existingLocation = \App\Models\JobLocation::where('job_posting_id', $this->job_posting_id)
                    ->notArchived()
                    ->first();

                if ($existingLocation) {
                    $validator->errors()->add('job_posting_id', 'This job posting already has a location. Please update the existing location instead.');
                }
            }

            // Validate landmark format
            if ($this->landmark && strlen($this->landmark) < 5) {
                $validator->errors()->add('landmark', 'Landmark description should be more descriptive (at least 5 characters).');
            }

            // Validate directions format
            if ($this->directions && str_word_count($this->directions) < 3) {
                $validator->errors()->add('directions', 'Directions should be more detailed (at least 3 words).');
            }
        });
    }

    /**
     * Get validated data with auto-geocoding attempt.
     */
    public function validatedWithGeocoding(): array
    {
        $validated = $this->validated();

        // If coordinates are not provided, try to geocode the address
        if (empty($validated['latitude']) || empty($validated['longitude'])) {
            $address = implode(', ', array_filter([
                $validated['brgy'] ?? null,
                $validated['city'] ?? null,
                $validated['province'] ?? null,
            ]));

            // Attempt geocoding (implement based on your preferred service)
            $coordinates = \App\Models\JobLocation::geocodeAddress($address);

            if ($coordinates['latitude'] && $coordinates['longitude']) {
                $validated['latitude'] = $coordinates['latitude'];
                $validated['longitude'] = $coordinates['longitude'];
            }
        }

        return $validated;
    }

    /**
     * Get available provinces for frontend.
     */
    public static function getPhilippineProvinces(): array
    {
        return [
            'Metro Manila' => 'Metro Manila',
            'Cebu' => 'Cebu',
            'Laguna' => 'Laguna',
            'Cavite' => 'Cavite',
            'Bulacan' => 'Bulacan',
            'Rizal' => 'Rizal',
            'Pampanga' => 'Pampanga',
            'Batangas' => 'Batangas',
            'Nueva Ecija' => 'Nueva Ecija',
            'Pangasinan' => 'Pangasinan',
            'Davao del Sur' => 'Davao del Sur',
            'Iloilo' => 'Iloilo',
            'Negros Occidental' => 'Negros Occidental',
            'Misamis Oriental' => 'Misamis Oriental',
            'Zamboanga del Sur' => 'Zamboanga del Sur',
            // Need More
        ];
    }

    /**
     * Get common Metro Manila cities.
     */
    public static function getMetroManilaCities(): array
    {
        return [
            'Manila' => 'Manila',
            'Quezon City' => 'Quezon City',
            'Makati' => 'Makati',
            'Pasig' => 'Pasig',
            'Taguig' => 'Taguig',
            'Mandaluyong' => 'Mandaluyong',
            'Marikina' => 'Marikina',
            'Pasay' => 'Pasay',
            'Parañaque' => 'Parañaque',
            'Muntinlupa' => 'Muntinlupa',
            'Las Piñas' => 'Las Piñas',
            'Caloocan' => 'Caloocan',
            'Malabon' => 'Malabon',
            'Navotas' => 'Navotas',
            'Valenzuela' => 'Valenzuela',
            'Pateros' => 'Pateros',
        ];
    }

    /**
     * Get location input guidelines.
     */
    public static function getLocationGuidelines(): array
    {
        return [
            'address_format' => [
                'Use complete barangay names (e.g., "Barangay San Lorenzo")',
                'Include city and province for clarity',
                'Postal codes are optional but helpful',
            ],
            'coordinates' => [
                'Latitude and longitude are optional',
                'Will be automatically geocoded if not provided',
                'Helps with accurate location mapping',
                'Must be within Philippines range',
            ],
            'privacy' => [
                'Use "is_hidden" to show only city/province publicly',
                'Full address visible only to matched employers/maids',
                'Exact coordinates never shown publicly',
            ],
            'landmarks' => [
                'Include nearby malls, schools, or famous buildings',
                'Help maids identify the area easily',
                'Be specific but not too personal',
            ],
            'directions' => [
                'Provide public transportation options',
                'Include jeepney/bus routes if applicable',
                'Mention parking availability',
            ],
            'validation' => [
                'All location fields are validated',
                'One location per job posting',
                'Can be updated anytime',
            ]
        ];
    }
}