<?php

namespace App\Http\Requests\SpiritualGift;

use Illuminate\Foundation\Http\FormRequest;

class SpiritualGiftQueryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set permissions/policies here if needed
    }

    public function rules(): array
    {
        return [
            'search'    => ['nullable', 'string', 'max:100'],
            'category'  => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
            'per_page'  => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function prepareForValidation(): void
    {
        // Cast string booleans from GET URL params (e.g., ?is_active=true)
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }
}
