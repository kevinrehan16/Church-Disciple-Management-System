<?php

namespace App\Http\Requests\Visitor;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Siguraduhin mong naka-auth logic ka kung kailangan
    }

    public function rules(): array
    {
        return [
            // Basic Info
            'first_name'         => 'required|string|max:255',
            'last_name'          => 'required|string|max:255',
            'date_visited'       => 'required|date',
            'service_time'       => 'required|string|max:50',
            'birthday'           => 'required|date',
            'age_group'          => 'required|string|max:50',
            'gender'             => 'required|in:Male,Female',

            // Address
            'barangay'           => 'required|string|max:255',
            'city'               => 'required|string|max:255',
            'province'           => 'nullable|string|max:255',

            // Life-Stage
            'life_stage'         => 'required|string|max:100',
            'life_stage_other'   => 'nullable|string|max:255',
            'current_church'     => 'nullable|string|max:255',

            // Contacts
            'mobile_number'      => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'facebook_name'      => 'nullable|string|max:255',

            // Referral
            'heard_from_invitee' => 'nullable|string|max:255',
            'heard_from_details' => 'nullable|string|max:255',

            // Notes
            'prayer_requests'    => 'nullable|string',
            'remarks'            => 'nullable|string',
            'welcome_by'         => 'nullable|string|max:255',
        ];
    }
}
