<?php

namespace App\Http\Requests\User;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            // Auth Credentials
            'email'         => 'required|email|unique:users,email',
            // 'password'      => 'required|min:8',

            // Personal Info
            'nickname'      => 'nullable|string|max:30',
            'first_name'    => 'required|string|max:50',
            'last_name'     => 'required|string|max:50',
            'middle_name'   => 'nullable|string|max:50',
            'gender'        => 'required|string|in:Male,Female,Other',
            'birthday'      => 'nullable|date',
            'age'           => 'nullable|integer|min:0',

            // Family & Social
            'spouse_name'   => 'nullable|string|max:60',
            'father_name'   => 'nullable|string|max:60',
            'mother_name'   => 'nullable|string|max:60',
            'facebook_name' => 'nullable|string|max:60',
            'lifestage'     => 'nullable|string|max:20',

            // Contact & Address
            'mobile_number'   => 'required|string|max:20',
            'contact_details' => 'nullable|string|max:100',
            'home_address'    => 'nullable|string|max:150',
            'country'         => 'nullable|string|max:30',
            'region'          => 'nullable|string|max:30',
            'city'            => 'nullable|string|max:30',
            'barangay'        => 'nullable|string|max:30',

            // Professional & Education
            'occupation'     => 'nullable|string|max:50',
            'industry'       => 'nullable|string|max:50',
            'college_school' => 'nullable|string|max:150',
            'college_degree' => 'nullable|string|max:100',
            'high_school'    => 'nullable|string|max:150',

            // Religious & Church Membership
            'received_jesus'      => 'nullable|date',
            'baptized_immersion'  => 'nullable|boolean', // Assuming boolean base sa migration
            'baptized_date'       => 'nullable|date',
            'picture'             => 'nullable|string|max:20', // Or 'image' if file upload
            'purpose_reg'         => 'nullable|string|max:200',
            'prev_church'         => 'nullable|string|max:50',
            'church_affiliation'  => 'nullable|string|max:60',
            'church_id'           => 'nullable|string|max:30',
            'cluster_id'          => 'nullable|string|max:30',
            'member_position'     => 'nullable|string|max:30',
            'member_status'       => 'nullable|string|max:20',
            'membership_date'     => 'nullable|date',
            'rec_for_baptism'     => 'nullable|boolean',
            'rec_for_membership'  => 'nullable|boolean',
            'comment'             => 'nullable|string',

            'spiritual_gifts'     => 'nullable|array',
            'spiritual_gifts.*'   => 'integer|exists:spiritual_gifts,id',

            'user_added'    => 'nullable|string|max:20',
            'user_updated'  => 'nullable|string|max:20',
        ];
    }
}
