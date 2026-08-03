<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ilagay ang auth logic kung kinakailangan
    }

    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'middle_name' => 'sometimes|string|max:255',
            'nickname' => 'sometimes|string|max:255',
            'birthday' => 'sometimes|date',
            'age' => 'sometimes|integer',
            'gender' => 'sometimes|string|in:Male,Female',
            'lifestage' => 'sometimes|string|max:255',
            'mobile_number' => 'sometimes|string|max:255',
            'facebook_name' => 'sometimes|string|max:255',
            'father_name' => 'sometimes|string|max:255',
            'mother_name' => 'sometimes|string|max:255',
            'spouse_name' => 'sometimes|string|max:255',
            'home_address' => 'sometimes|string',
            'barangay' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'region' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'occupation' => 'sometimes|string|max:255',
            'industry' => 'sometimes|string|max:255',
            'high_school' => 'sometimes|string|max:255',
            'college_school' => 'sometimes|string|max:255',
            'college_degree' => 'sometimes|string|max:255',
            'received_jesus' => 'sometimes|date',
            'baptized_immersion' => 'sometimes|boolean',
            'rec_for_baptism' => 'sometimes|boolean',
            'baptized_date' => 'sometimes|date',
            'spiritual_gifts' => 'sometimes|array',
            'spiritual_gifts.*' => 'exists:spiritual_gifts,id', // Sinisigurong valid IDs ang nanggaling sa multi-select
            'purpose_reg' => 'sometimes|string',
            'prev_church' => 'sometimes|string|max:255',
            'church_affiliation' => 'sometimes|string|max:255',
            'church_id' => 'sometimes|string|max:255',
            'picture' => 'sometimes|string',
            'member_position' => 'sometimes|string|max:255',
            'rec_for_membership' => 'sometimes|boolean',
            'comment' => 'sometimes|string',
            'member_status' => 'sometimes|string|in:Active,Inactive',
        ];
    }
}
