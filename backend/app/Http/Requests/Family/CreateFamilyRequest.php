<?php

namespace App\Http\Requests\Family;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateFamilyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Kung Enterprise, pwedeng opsyonal muna ang family_name kung may head.
            // Ang Service na ang bahalang mag-generate ng pangalan (e.g. Reyes Family)
            'family_name' => 'nullable|string|max:255',

            // Opsyonal: Pwedeng lumikha ng pamilya na may Head agad.
            // Siguraduhing existing ang member_id sa members table.
            'head_member_id' => 'nullable|exists:members,id',

            'address_line1' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ];
    }
}
