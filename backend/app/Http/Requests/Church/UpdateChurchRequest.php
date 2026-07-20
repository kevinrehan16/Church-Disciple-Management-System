<?php

namespace App\Http\Requests\Church;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChurchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $churchId = $this->route('church')?->id ?? $this->route('church');

        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('churches', 'code')->ignore($churchId)
            ],
            'address' => 'nullable|string',
            'contact_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'is_main_campus' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
