<?php

namespace App\Http\Requests\GrowthGroupMember;

use Illuminate\Foundation\Http\FormRequest;

class AddGrowthGroupMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_id' => 'required|exists:members,id',
            'role' => 'sometimes|string|in:member,co-leader',
            'joined_at' => 'nullable|date',
        ];
    }
}
