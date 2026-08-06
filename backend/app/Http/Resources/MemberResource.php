<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $membership = $this->familyMembership;
        $family = $membership ? $membership->family : null;

        return [
            // Users info
            'email' => $this->user->email,
            'role' => $this->user->role,
            // Identifiers
            'id' => $this->id,
            'mem_id' => $this->mem_id,

            // Name Info
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'full_name' => trim("{$this->first_name} {$this->middle_name} {$this->last_name}"),
            'nickname' => $this->nickname,

            // Personal & Family
            'gender' => $this->gender,
            'birthday' => $this->birthday ? $this->birthday : null,
            'age' => $this->age,
            'lifestage' => $this->lifestage,
            'spouse_name' => $this->spouse_name,
            'father_name' => $this->father_name,
            'mother_name' => $this->mother_name,
            'facebook_name' => $this->facebook_name,

            // Contact & Address
            'mobile_number' => $this->mobile_number,
            'contact_details' => $this->contact_details,
            'home_address' => $this->home_address,
            'country' => $this->country,
            'region' => $this->region,
            'city' => $this->city,
            'barangay' => $this->barangay,

            // Professional & Education
            'occupation' => $this->occupation,
            'industry' => $this->industry,
            'college_school' => $this->college_school,
            'college_degree' => $this->college_degree,
            'high_school' => $this->high_school,

            // Religious & Membership
            'received_jesus' => $this->received_jesus,
            'baptized_immersion' => $this->baptized_immersion, // 'Yes'/'No'
            'baptized_date' => $this->baptized_date,
            'picture' => $this->picture,
            'purpose_reg' => $this->purpose_reg,
            'prev_church' => $this->prev_church,
            'church_affiliation' => $this->church_affiliation,
            'church_id' => $this->church_id,
            'member_position' => $this->member_position,
            'member_status' => $this->member_status,
            'membership_date' => $this->membership_date,

            // Flags (Boolean converted)
            'rec_for_baptism' => (bool) $this->rec_for_baptism,
            'rec_for_membership' => (bool) $this->rec_for_membership,

            'comment' => $this->comment,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'interviewby_member_id' => $this->interviewby_member_id,

            // CHURCH DATA
            'church_name' => $this->church?->name,
            'church_code' => $this->church?->code,
            'church_address' => $this->church?->address,
            'church_contact_number' => $this->church?->contact_number,
            'church_email' => $this->church?->email,

            // CLUSTER DATA
            'cluster_id' => $this->cluster?->id,
            'cluster_name' => $this->cluster?->name,
            'cluster_code' => $this->cluster?->code,
            'cluster_leader_name'       => trim(($this->cluster?->leader?->first_name ?? '') . ' ' . ($this->cluster?->leader?->last_name ?? '')),

            // SPIRITUAL GIFTS
            'spiritual_gifts' => SpiritualGiftResource::collection($this->whenLoaded('spiritualGifts')),

            // FAMILY
            'family' => $family ? [
                'id' => $family->id,
                'family_name' => $family->family_name,
                'my_role' => $membership->role,

                // Ginamitan natin ng reject() para siguradong tanggal ang sarili mo
                'members' => $family->familyMembers
                    ->reject(fn($fm) => (int) $fm->member_id === (int) $this->id)
                    ->map(function ($fm) {
                        return [
                            'member_id' => $fm->member_id,
                            'full_name' => $fm->member->first_name . ', ' . $fm->member->last_name ?? null,
                            'role' => $fm->role,
                        ];
                    })->values(),
            ] : null,

        ];
    }
}
