<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visitorId' => $this->visitor_id,

            // Personal Information
            'fullName' => $this->first_name . ' ' . $this->last_name,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'birthday' => $this->birthday,
            'ageGroup' => $this->age_group,
            'gender' => $this->gender,

            // Visit Details
            'dateVisited' => $this->date_visited,
            'serviceTime' => $this->service_time,
            'welcomeBy' => $this->welcome_by,

            // Location
            'address' => [
                'barangay' => $this->barangay,
                'city' => $this->city,
                'province' => $this->province,
            ],

            // Life & Church Background
            'lifeStage' => $this->life_stage,
            'lifeStageOther' => $this->life_stage_other,
            'currentChurch' => $this->current_church,

            // Contact Information
            'mobileNumber' => $this->mobile_number,
            'email' => $this->email,
            'facebookName' => $this->facebook_name,

            // Referral & Notes
            'heardFromInvitee' => $this->heard_from_invitee,
            'heardFromDetails' => $this->heard_from_details,
            'prayerRequests' => $this->prayer_requests,
            'remarks' => $this->remarks,

            // Timestamps
            'createdAt' => $this->created_at ? $this->created_at->format('Y-m-d H:i') : null,
            'updatedAt' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i') : null,
            'welcome_by' => $this->welcome_by,
        ];
    }
}
