<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\NewUserTemporaryPasswordMail;
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
            $tempPassword = Str::random(10);

            // 1. Create User
            $user = User::create([
                'email'    => $data['email'],
                'password' => Hash::make($tempPassword),
                'role'     => 'member',
                'must_change_password' => true,
            ]);

            // 2. Create Member Profile (I-save natin sa $member variable)
            $member = $user->member()->create([
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
                'church_id'          => $data['church_id'] ?? null,
                'member_position'    => $data['member_position'] ?? null,
                'member_status'      => $data['member_status'] ?? 'Active',
                'membership_date'    => $data['membership_date'] ?? null,
                'rec_for_baptism'    => $data['rec_for_baptism'] ?? false,
                'rec_for_membership' => $data['rec_for_membership'] ?? false,
                'comment'            => $data['comment'] ?? null,

                // Audit Fields
                'user_added'         => auth()->id(),
                'user_updated'       => auth()->id(),
            ]);

            // 3. ATTACH SPIRITUAL GIFTS (Heto yung idinagdag natin)
            if (!empty($data['spiritual_gifts']) && is_array($data['spiritual_gifts'])) {
                // I-sync ang array of IDs sa member na kakagawa lang
                $member->spiritualGifts()->sync($data['spiritual_gifts']);
            }

            Mail::to($user->email)->send(new NewUserTemporaryPasswordMail($tempPassword));

            return $user;
        });
    }

    public function changePassword(array $data): bool
    {
        // 1. Hanapin ang user base sa email na ibinigay
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['We cannot find a user with that email address.'],
            ]);
        }

        // 2. Suriin kung tama ang current / temporary password
        if (!Hash::check($data['currentPassword'], $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['The provided current password is incorrect.'],
            ]);
        }

        // 3. I-update ang password at i-reset ang flag
        $user->password = Hash::make($data['newPassword']);
        $user->must_change_password = false;
        $user->save();

        return true;
    }
}
