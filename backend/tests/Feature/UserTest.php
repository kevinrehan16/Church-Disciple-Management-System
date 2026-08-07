<?php

namespace Tests\Feature;

use App\Mail\NewUserTemporaryPasswordMail;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->createSchema();
    }

    protected function createSchema(): void
    {
        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('model_has_permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('members');
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role', 30)->default('member');
            $table->boolean('must_change_password')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('mem_id', 30)->unique();
            $table->string('nickname', 30)->nullable();
            $table->string('last_name', 60);
            $table->string('first_name', 60);
            $table->string('middle_name', 60)->nullable();
            $table->string('gender', 7);
            $table->date('birthday')->nullable();
            $table->integer('age')->default(0);
            $table->string('spouse_name', 100)->nullable();
            $table->string('father_name', 100)->nullable();
            $table->string('mother_name', 100)->nullable();
            $table->string('facebook_name', 100)->nullable();
            $table->string('lifestage', 12)->nullable();
            $table->string('mobile_number', 20);
            $table->string('contact_details', 100)->nullable();
            $table->string('home_address', 150)->nullable();
            $table->string('country', 30)->nullable();
            $table->string('region', 30)->nullable();
            $table->string('city', 30)->nullable();
            $table->string('barangay', 30)->nullable();
            $table->string('occupation', 50)->nullable();
            $table->string('industry', 50)->nullable();
            $table->string('college_school', 100)->nullable();
            $table->string('college_degree', 100)->nullable();
            $table->string('high_school', 100)->nullable();
            $table->date('received_jesus')->nullable();
            $table->string('baptized_immersion', 3)->default('No');
            $table->date('baptized_date')->nullable();
            $table->string('picture', 191)->nullable();
            $table->text('purpose_reg')->nullable();
            $table->string('prev_church', 100)->nullable();
            $table->string('church_affiliation', 60)->nullable();
            $table->unsignedBigInteger('church_id')->nullable();
            $table->unsignedBigInteger('cluster_id')->nullable();
            $table->string('member_position', 30)->nullable();
            $table->string('member_status', 15)->default('Active');
            $table->date('membership_date')->nullable();
            $table->boolean('rec_for_baptism')->default(false);
            $table->boolean('rec_for_membership')->default(false);
            $table->text('comment')->nullable();
            $table->string('user_added', 60)->nullable();
            $table->string('user_updated', 60)->nullable();
            $table->unsignedBigInteger('interviewby_member_id')->nullable();
            $table->integer('position_rank')->nullable();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 191)->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
        });

        Schema::create('model_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->string('model_type');
            $table->uuid('model_id');
            $table->index(['model_id', 'model_type']);
        });

        Schema::create('model_has_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id');
            $table->string('model_type');
            $table->uuid('model_id');
            $table->index(['model_id', 'model_type']);
        });

        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['permission_id', 'role_id']);
        });
    }

    protected function actingAsAdminUser(): User
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $role = Role::findOrCreate('admin', 'sanctum');
        $admin->assignRole($role);

        return $admin;
    }

    public function test_admin_can_register_a_new_member_user(): void
    {
        Mail::fake();
        $admin = $this->actingAsAdminUser();

        $payload = [
            'email' => 'member@example.com',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'gender' => 'Male',
            'mobile_number' => '09171234567',
            'nickname' => 'Juan',
            'birthday' => '1995-01-15',
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'User registered successfully')
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'email',
                    'role',
                    'member' => ['firstName', 'lastName', 'mobile'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'member@example.com',
            'role' => 'member',
        ]);

        $createdUser = User::where('email', 'member@example.com')->firstOrFail();
        $this->assertTrue((bool) $createdUser->must_change_password);
        $this->assertTrue($createdUser->member()->exists());

        Mail::assertSent(NewUserTemporaryPasswordMail::class, function ($mail) use ($payload) {
            return $mail->hasTo($payload['email']);
        });
    }

    public function test_registration_returns_validation_errors_for_invalid_payload(): void
    {
        Mail::fake();
        $admin = $this->actingAsAdminUser();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/register', [
                'email' => 'not-an-email',
                'first_name' => '',
                'last_name' => '',
                'gender' => 'Unknown',
                'mobile_number' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'first_name', 'last_name', 'gender', 'mobile_number']);

        $this->assertDatabaseCount('users', 1);
        Mail::assertNothingSent();
    }

    public function test_registration_persists_user_and_member_records_with_expected_data(): void
    {
        Mail::fake();
        $admin = $this->actingAsAdminUser();

        $payload = [
            'email' => 'integrity@example.com',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'gender' => 'Female',
            'mobile_number' => '09991234567',
            'nickname' => 'Mia',
            'occupation' => 'Teacher',
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/register', $payload);

        $response->assertStatus(201);

        $user = User::where('email', 'integrity@example.com')->firstOrFail();
        $member = Member::where('user_id', $user->id)->firstOrFail();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'integrity@example.com',
            'role' => 'member',
            'must_change_password' => true,
        ]);

        $this->assertDatabaseHas('members', [
            'user_id' => $user->id,
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'gender' => 'Female',
            'mobile_number' => '09991234567',
            'nickname' => 'Mia',
            'occupation' => 'Teacher',
        ]);

        $this->assertNotEmpty($member->mem_id);
        $this->assertSame($user->id, $member->user_id);
    }
}
