<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->prepareTestDatabase();
    }

    protected function prepareTestDatabase(): void
    {
        // I-wipe ang buong Postgres schema kasama ang lahat ng dependent tables (growth_groups, families, etc.)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP SCHEMA public CASCADE;');
            DB::statement('CREATE SCHEMA public;');
        }

        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role', 30)->default('member');
            $table->boolean('must_change_password')->default(true);
            $table->boolean('is_active')->default(true);
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
            $table->uuidMorphs('tokenable');
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

    protected function createMemberUser(array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'email' => 'member@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'member',
            'must_change_password' => true,
            'is_active' => true,
        ], $overrides));

        $user->member()->create([
            'mem_id' => 'MEM-' . uniqid(),
            'first_name' => 'Test',
            'last_name' => 'Member',
            'gender' => 'Male',
            'mobile_number' => '09170000000',
        ]);

        return $user->fresh();
    }

    protected function createAdminUser(): User
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $role = Role::findOrCreate('admin', 'sanctum');
        $admin->assignRole($role);

        return $admin->fresh();
    }

    public function test_login_returns_user_and_token_for_valid_credentials(): void
    {
        $user = $this->createMemberUser(['email' => 'login@example.com']);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'login@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonPath('user.email', 'login@example.com');

        $this->assertNotEmpty($response->json('token'));
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_login_returns_validation_error_for_invalid_credentials(): void
    {
        $this->createMemberUser(['email' => 'badlogin@example.com']);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'badlogin@example.com',
            'password' => 'WrongPassword123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_change_password_updates_password_and_resets_requirement(): void
    {
        $user = $this->createMemberUser(['email' => 'change@example.com']);

        $response = $this->postJson('/api/v1/change-password', [
            'email' => 'change@example.com',
            'currentPassword' => 'Password123!',
            'newPassword' => 'NewPassword123!',
            'confirmPassword' => 'NewPassword123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Password successfully updated. You can now login.');

        $user->refresh();
        $this->assertTrue(Hash::check('NewPassword123!', $user->password));
        $this->assertFalse((bool) $user->must_change_password);
    }

    public function test_logout_revokes_the_current_access_token(): void
    {
        $user = $this->createMemberUser(['email' => 'logout@example.com', 'must_change_password' => false]);
        $user->createToken('auth_token');

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);

        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Successfully logged out');
    }

    public function test_super_admin_can_fetch_the_current_user_profile(): void
    {
        $admin = $this->createAdminUser();
        $admin->must_change_password = false;
        $admin->save();

        $superAdminRole = Role::findOrCreate('super_admin', 'sanctum');
        $admin->assignRole($superAdminRole);

        Sanctum::actingAs($admin, ['*']);

        $response = $this->getJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'email', 'role', 'createdAt', 'mustChangePassword', 'member'],
            ]);
    }
}
