<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function authenticate(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        return $user;
    }

    public function registerUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // 1. Create User
            $user = User::create([
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => 'member', // Default role
            ]);

            // 2. Create Member Profile
            $user->member()->create([
                'mem_id'          => 'MEM-' . time(),

                // Personal Information
                'first_name'         => $data['first_name'],
                'last_name'          => $data['last_name'],
                'middle_name'        => $data['middle_name'] ?? null,
                'nickname'           => $data['nickname'] ?? null,
                'gender'             => $data['gender'],
                'birthday'           => $data['birthday'] ?? null,
                'age'                => $data['age'] ?? 0,

                // Family & Social
                'spouse_name'        => $data['spouse_name'] ?? null,
                'father_name'        => $data['father_name'] ?? null,
                'mother_name'        => $data['mother_name'] ?? null,
                'facebook_name'      => $data['facebook_name'] ?? null,
                'lifestage'          => $data['lifestage'] ?? null,

                // Contact & Address
                'mobile_number'      => $data['mobile_number'],
                'contact_details'    => $data['contact_details'] ?? null,
                'home_address'       => $data['home_address'] ?? null,
                'country'            => $data['country'] ?? null,
                'region'             => $data['region'] ?? null,
                'city'               => $data['city'] ?? null,
                'barangay'           => $data['barangay'] ?? null,

                // Professional & Education
                'occupation'         => $data['occupation'] ?? null,
                'industry'           => $data['industry'] ?? null,
                'college_school'     => $data['college_school'] ?? null,
                'college_degree'     => $data['college_degree'] ?? null,
                'high_school'        => $data['high_school'] ?? null,

                // Church / Membership Info
                'received_jesus'     => $data['received_jesus'] ?? null,
                'baptized_immersion' => $data['baptized_immersion'] ?? false,
                'baptized_date'      => $data['baptized_date'] ?? null,
                'picture'            => $data['picture'] ?? null,
                'purpose_reg'        => $data['purpose_reg'] ?? null,
                'prev_church'        => $data['prev_church'] ?? null,
                'church_affiliation' => $data['church_affiliation'] ?? null,
                'church_id'       => $data['church_id'] ?? null,
                'member_position'    => $data['member_position'] ?? null,
                'member_status'      => $data['member_status'] ?? 'Active',
                'membership_date'    => $data['membership_date'] ?? null,
                'rec_for_baptism'    => $data['rec_for_baptism'] ?? false,
                'rec_for_membership' => $data['rec_for_membership'] ?? false,
                'comment'            => $data['comment'] ?? null,

                // Audit Fields (Hindi galing sa request, galing sa system)
                'user_added'         => auth()->id(), // Sino ang nag-register
                'user_updated'       => auth()->id(),
            ]);

            return $user;
        });
    }
}
