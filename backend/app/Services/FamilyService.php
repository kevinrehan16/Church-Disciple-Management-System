<?php

namespace App\Services;

use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Exception;

class FamilyService
{
    /**
     * Lumikha ng bagong Pamilya (Household)
     */
    public function createFamily(array $data): Family
    {
        // Gagamit tayo ng DB Transaction para siguradong safe ang data
        return DB::transaction(function () use ($data) {

            $familyName = $data['family_name'] ?? null;
            $headMemberId = $data['head_member_id'] ?? null;

            // Enterprise Logic: Auto-generate family name kung Head lang ang binigay
            if (empty($familyName) && !empty($headMemberId)) {
                $headMember = Member::findOrFail($headMemberId);

                // Sa halip na "$headMember->last_name . ' Family'" lang:
                // Isama natin ang First Name ng Head para natatangi agad!
                $familyName = $headMember->first_name . ' ' . $headMember->last_name . ' Family';
                // Magiging: "Mike Macandog Family"
            }

            // Kung parehong empty ang family_name at head, mag-error tayo
            if (empty($familyName)) {
                throw new Exception('Kailangan ng Family Name o Head Member para makabuo ng pamilya.');
            }

            // 1. Likhain ang Family record
            $family = Family::create([
                'family_name' => $familyName,
                'head_member_id' => $headMemberId,
                'address_line1' => $data['address_line1'] ?? null,
                'city' => $data['city'] ?? null,
            ]);

            // 2. Kung may Head, i-add siya agad sa family_members table bilang 'Head' role
            if ($headMemberId) {
                $familyMember = FamilyMember::updateOrCreate(
                    ['member_id' => $headMemberId], // Hanapin kung existing na si member_id
                    [
                        'family_id' => $family->id,  // Ilipat o i-set sa bagong Family ID
                        'role' => 'Head'             // I-update ang role maging Head
                    ]
                );
            }

            return $family;
        });
    }

    /**
     * Mag-add ng umiiral na Member sa isang Pamilya
     */
    public function addMemberToFamily(Family $family, array $data): FamilyMember
    {
        return DB::transaction(function () use ($family, $data) {
            $memberId = $data['member_id'];
            $role = $data['role'];

            // Enterprise Check: Kung ang role ay 'Head', kailangan nating i-update ang families table
            if ($role === 'Head') {
                // Babala: Sa enterprise app, karaniwang may logic dito kung ano ang mangyayari sa *dating* Head.
                // For now, i-update lang natin ang families table.
                $family->update(['head_member_id' => $memberId]);
            }

            // Likhain ang junction record
            return FamilyMember::create([
                'family_id' => $family->id,
                'member_id' => $memberId,
                'role' => $role,
            ]);
        });
    }

    /**
     * Alisin ang isang miyembro sa pamilya
     */
    public function removeMemberFromFamily(FamilyMember $familyMemberRecord): bool
    {
        return DB::transaction(function () use ($familyMemberRecord) {
            $family = $familyMemberRecord->family;

            // Enterprise Logic: Kung ang tinanggal ay ang kasalukuyang Head ng pamilya
            if ($family->head_member_id === $familyMemberRecord->member_id) {
                // I-set sa null ang head sa families table
                $family->update(['head_member_id' => null]);
            }

            return $familyMemberRecord->delete();
        });
    }
}
