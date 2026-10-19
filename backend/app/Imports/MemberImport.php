<?php

namespace App\Imports;

use App\Models\Member;
use Carbon\Carbon;
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
        // Auto-compute ng age mula sa birthday kung mayroonman
        $birthday = !empty($row['birthday']) ? Carbon::parse($row['birthday']) : null;
        $age = $birthday ? $birthday->age : 0;

        return new Member([
            'user_id'       => $this->userId,
            'mem_id'        => $row['mem_id'] ?? 'MEM-' . strtoupper(uniqid()),
            'nickname'      => $row['nickname'] ?? null,
            'last_name'     => $row['last_name'],
            'first_name'    => $row['first_name'],
            'middle_name'   => $row['middle_name'] ?? null,
            'gender'        => $row['gender'] ?? 'Other',
            'birthday'      => $birthday ? $birthday->format('Y-m-d') : null,
            'age'           => $age, // Auto-computed
            'facebook_name' => $row['facebook_name'] ?? null,
            'lifestage'     => $row['lifestage'] ?? null,
            'mobile_number' => $row['mobile_number'] ?? '',
            'city'          => $row['city'] ?? null,
            'barangay'      => $row['barangay'] ?? null,
            'member_position' => $row['member_position'] ?? 'Follow Up',
        ]);
    }
}
