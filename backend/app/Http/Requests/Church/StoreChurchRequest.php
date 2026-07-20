<?php

namespace App\Http\Requests\Church;

use Illuminate\Foundation\Http\FormRequest;

class StoreChurchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Baguhin depende sa auth permissions mo
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:churches,code',
            'address' => 'nullable|string',
            'contact_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'is_main_campus' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
