<?php

namespace App\Imports;

use App\Models\Member;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class MemberImport implements ToModel, WithHeadingRow, SkipsEmptyRows
{
    protected $userId;

    // Pwede nating ipasa ang user_id kung sino ang nag-upload
    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row)
    {
        // Kung walang mem_id, laktawan o gawan ng fallback para ligtas
        $memId = $row['mem_id'] ?? 'MEM-' . strtoupper(uniqid());
        $email = $row['email'] ?? null;

        // 1. I-save o hanapin muna sa USERS table gamit ang email
        $user = null;
        if ($email) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'password' => Hash::make(Str::random(10)), // Hula-hula / temporary password
                    'role' => $row['member_position'] ?? 'Follow Up',
                    'must_change_password' => true,
                    'is_active' => false,
                ]
            );
        }

        // Auto-compute ng age mula sa birthday kung mayroonman
        $birthday = !empty($row['birthday']) ? Carbon::parse($row['birthday']) : null;
        $age = $birthday ? $birthday->age : 0;

        // 2. I-save sa MEMBERS table gamit ang firstOrCreate para maiwasan ang duplicate error
        return Member::firstOrCreate(
            ['mem_id' => $memId], // Batayan ng duplicate checking
            [
                'user_id'         => $user ? $user->id : $this->userId,
                'nickname'        => $row['nickname'] ?? null,
                'last_name'       => $row['last_name'] ?? null,
                'first_name'      => $row['first_name'] ?? null,
                'middle_name'     => $row['middle_name'] ?? null,
                'gender'          => $row['gender'] ?? 'Other',
                'birthday'        => $birthday ? $birthday->format('Y-m-d') : null,
                'age'             => $age, // Auto-computed
                'facebook_name'   => $row['facebook_name'] ?? null,
                'lifestage'       => $row['lifestage'] ?? null,
                'mobile_number'   => $row['mobile_number'] ?? '',
                'city'            => $row['city'] ?? null,
                'barangay'        => $row['barangay'] ?? null,
                'member_position' => $row['member_position'] ?? 'Follow Up',
            ]
        );
    }
}
