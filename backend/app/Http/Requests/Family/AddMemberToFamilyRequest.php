<?php

namespace App\Http\Requests\Family;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddMemberToFamilyRequest extends FormRequest
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
            // Ang member na ia-add ay dapat existing sa members table
            'member_id' => [
                'required',
                'exists:members,id',
                // PROTIP: Enterprise validation - siguraduhing wala pa siyang active family membership
                Rule::unique('family_members', 'member_id'),
            ],
            // Siguraduhing valid ang role
            'role' => 'required|in:Head,Spouse,Child,Dependent,Other',
        ];
    }

    // Opsyonal: Magandang error message para sa unique member_id
    public function messages(): array
    {
        return [
            'member_id.unique' => 'Ang miyembrong ito ay mayroon nang pamilyang kinabibilangan.',
        ];
    }
}
