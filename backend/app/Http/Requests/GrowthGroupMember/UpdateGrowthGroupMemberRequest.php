<?php

namespace App\Http\Requests\GrowthGroupMember;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGrowthGroupMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => 'required|string|in:member,co-leader',
            'joined_at' => 'nullable|date',
        ];
    }
}
