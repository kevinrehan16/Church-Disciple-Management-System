<?php

namespace App\Http\Requests\Password;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Siguruhing true para payagan ang request ng authenticated user
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'currentPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:8'],
            'confirmPassword' => ['required', 'same:newPassword'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.exists' => 'No account found with this email address.',
            'confirmPassword.same' => 'The new password and confirmation password must match.',
        ];
    }
}
