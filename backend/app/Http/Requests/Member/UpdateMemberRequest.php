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
            'middle_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'birthday' => 'nullable|date',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string|in:Male,Female',
            'lifestage' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:255',
            'facebook_name' => 'nullable|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'spouse_name' => 'nullable|string|max:255',
            'home_address' => 'nullable|string',
            'barangay' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'high_school' => 'nullable|string|max:255',
            'college_school' => 'nullable|string|max:255',
            'college_degree' => 'nullable|string|max:255',
            'received_jesus' => 'nullable|date',
            'baptized_immersion' => 'nullable|boolean',
            'rec_for_baptism' => 'nullable|boolean',
            'baptized_date' => 'nullable|date',
            'spiritual_gifts' => 'nullable|array',
            'spiritual_gifts.*' => 'exists:spiritual_gifts,id', // Sinisigurong valid IDs ang nanggaling sa multi-select
            'purpose_reg' => 'nullable|string',
            'prev_church' => 'nullable|string|max:255',
            'church_affiliation' => 'nullable|string|max:255',
            'church_id' => 'nullable|integer|exists:churches,id',
            'cluster_id' => 'nullable|integer|exists:clusters,id',
            'interviewby_member_id' => 'nullable|integer|exists:members,id',
            'picture' => 'nullable|string',
            'member_position' => 'nullable|string|max:255',
            'rec_for_membership' => 'nullable|boolean',
            'comment' => 'nullable|string',
            'member_status' => 'sometimes|string|in:Active,Inactive',
            'membership_date' => 'nullable|date',
        ];
    }
}
