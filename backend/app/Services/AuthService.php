<?php

namespace App\Services;

use App\Models\User;
use App\Models\Member;
// use App\Mail\NewUserTemporaryPasswordMail;
use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AuthService
{
    public function authenticate(array $credentials, string $ip)
    {
        $throttleKey = Str::transliterate(Str::lower($credentials['email']) . '|' . $ip);

        // 1. Suriin kung lumampas na sa 5 beses ang pagsubok
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $minutes = ceil($seconds / 60);
            $minuteText = $minutes == 1 ? 'minute' : 'minutes';

            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$minutes} {$minuteText}."],
            ]);
        }

        $user = User::where('email', $credentials['email'])->first();

        // 2. Kung mali ang credentials o hindi nahanap ang user
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, 900); // 900 seconds = 15 minutes

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        // 3. 🔒 Suriin kung ang account ay ACTIVE (`is_active` ay true)
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account is currently inactive or restricted. Please contact the system administrator for assistance.'],
            ]);
        }

        // 4. Kung matagumpay at active ang user, i-clear ang attempts
        RateLimiter::clear($throttleKey);

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
                'is_active' => false,
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
                'cluster_id'          => $data['cluster_id'] ?? null,
                'member_position'    => $data['member_position'] ?? null,
                'member_status'      => $data['member_status'] ?? 'Active',
                'membership_date'    => $data['membership_date'] ?? null,
                'rec_for_baptism'    => $data['rec_for_baptism'] ?? false,
                'rec_for_membership' => $data['rec_for_membership'] ?? false,
                'comment'            => $data['comment'] ?? null,

                // Audit Fields
                'user_added'         => auth()->id(),
                'user_updated'       => auth()->id(),

                'interviewby_member_id' => $data['interviewby_member_id'] ?? null,
            ]);

            // 3. ATTACH SPIRITUAL GIFTS (Heto yung idinagdag natin)
            if (!empty($data['spiritual_gifts']) && is_array($data['spiritual_gifts'])) {
                // I-sync ang array of IDs sa member na kakagawa lang
                $member->spiritualGifts()->sync($data['spiritual_gifts']);
            }

            // Mail::to($user->email)->send(new NewUserTemporaryPasswordMail($tempPassword));

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

    public function getPaginatedUsers(Request $request, ?string $role = null)
    {
        return User::with(['member'])
            // 1. FILTER: is_active (Kukuha ng true o false mula sa query params)
            ->when($request->filled('is_active'), function ($query) use ($request) {
                $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
                $query->where('is_active', $isActive);
            })
            // 2. FILTER: role
            ->byRole($role)
            ->orderBy('id', 'desc')
            // 3. SEARCH
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    // Search sa 'users' table (halimbawa: email)
                    $q->where('email', 'ILIKE', "%{$search}%")
                        // Search sa related 'member' table gamit ang whereHas
                        ->orWhereHas('member', function ($memberQuery) use ($search) {
                            $memberQuery->where('first_name', 'ILIKE', "%{$search}%")
                                ->orWhere('last_name', 'ILIKE', "%{$search}%");
                        });
                });
            })
            ->paginate(10);
    }

    public function getMyProfile(Request $request)
    {
        $userId = auth()->id();

        return Member::with([
            'user',
            'Church',
            'Cluster',
            'spiritualGifts',
            'familyMembership.family.familyMembers.member'
        ])
            ->where('user_id', $userId)
            ->first();
    }

    public function getMemberById($id)
    {
        return Member::with([
            'user', // 👈 Para makuha rin ang data mula sa users table (tulad ng email)
            'Church',
            'Cluster',
            'spiritualGifts',
            'familyMembership.family.familyMembers.member'
        ])
            ->find($id);
    }
}
