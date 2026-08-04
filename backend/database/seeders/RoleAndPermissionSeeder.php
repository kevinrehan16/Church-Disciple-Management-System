<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // I-reset ang cached roles at permissions para maiwasan ang conflict
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. I-define ang mga Granular Permissions ng System
        $permissions = [
            // System & Organization
            'manage_system',

            // Dashboard Management
            'manage_dashboard',
            'view_dashboard',

            // Profile Management
            'manage_profiles',
            'view_profiles',
            'edit_profiles',

            // Churches Management
            'manage_churches',
            'view_churches',
            'create_churches',
            'edit_churches',
            'delete_churches',

            // User Management
            'manage_users',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',

            // Member Management
            'manage_members',
            'view_members',
            'create_members',
            'edit_members',
            'delete_members',

            // Visitor Management
            'manage_visitors',
            'view_visitors',
            'create_visitors',
            'edit_visitors',
            'delete_visitors',

            // Pastor Management
            'manage_pastors',
            'view_pastors',
            'create_pastors',
            'edit_pastors',
            'delete_pastors',

            // Elder Management
            'manage_elders',
            'view_elders',
            'create_elders',
            'edit_elders',
            'delete_elders',

            // Deacon Management
            'manage_deacons',
            'view_deacons',
            'create_deacons',
            'edit_deacons',
            'delete_deacons',

            // GM_Cluster Management
            'manage_gm_clusters',
            'view_gm_clusters',
            'create_gm_clusters',
            'edit_gm_clusters',
            'delete_gm_clusters',

            // GM_GrowthGroup Management
            'manage_gm_growth_groups',
            'view_gm_growth_groups',
            'create_gm_growth_groups',
            'edit_gm_growth_groups',
            'delete_gm_growth_groups',

            // GM_Ggli Management
            'manage_gm_ggli',
            'view_gm_ggli',
            'create_gm_ggli',
            'edit_gm_ggli',
            'delete_gm_ggli',

            // GS_Cluster Management
            'manage_gs_clusters',
            'view_gs_clusters',
            'create_gs_clusters',
            'edit_gs_clusters',
            'delete_gs_clusters',

            // GS_GrowthGroup Management
            'manage_gs_growth_groups',
            'view_gs_growth_groups',
            'create_gs_growth_groups',
            'edit_gs_growth_groups',
            'delete_gs_growth_groups',

            // GS_Ggli Management
            'manage_gs_ggli',
            'view_gs_ggli',
            'create_gs_ggli',
            'edit_gs_ggli',
            'delete_gs_ggli',

            // Reports & Analytics (Idinagdag para sa leadership oversight)
            'view_reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'sanctum']
            );
        }

        // 2. I-setup ang mga Roles at i-assign ang kaukulang Permissions

        // A. Super Admin (May hawak ng lahat ng kapangyarihan sa sistema)
        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin'],
            ['guard_name' => 'sanctum']
        );
        $superAdmin->givePermissionTo(Permission::all());

        // B. Senior Pastor (Oversight sa buong simbahan, miyembro, pastors, at ulat)
        $seniorPastor = Role::firstOrCreate(
            ['name' => 'senior_pastor'],
            ['guard_name' => 'sanctum']
        );
        $seniorPastor->givePermissionTo([
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
            'manage_churches',
            'view_churches',
            'view_members',
            'create_members',
            'edit_members',
            'delete_members',
            'view_visitors',
            'view_pastors',
            'view_elders',
            'view_deacons',
            'manage_gm_clusters',
            'view_gm_clusters',
            'manage_gm_growth_groups',
            'view_gm_growth_groups',
            'manage_gs_clusters',
            'view_gs_clusters',
            'manage_gs_growth_groups',
            'view_gs_growth_groups',
            'view_reports',
        ]);

        // C. Admin (Pangangasiwa sa mga user, operasyon, at buong data)
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            ['guard_name' => 'sanctum']
        );
        $admin->givePermissionTo([
            'manage_dashboard',
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
            'manage_users',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
            'manage_members',
            'view_members',
            'create_members',
            'edit_members',
            'delete_members',
            'manage_visitors',
            'view_visitors',
            'create_visitors',
            'edit_visitors',
            'delete_visitors',
            'view_pastors',
            'view_elders',
            'view_deacons',
            'view_reports',
        ]);

        // D. Pastor (Ministry, spiritual oversight sa miyembro, visitors, at cell groups)
        $pastor = Role::firstOrCreate(
            ['name' => 'pastor'],
            ['guard_name' => 'sanctum']
        );
        $pastor->givePermissionTo([
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
            'view_churches',
            'view_members',
            'create_members',
            'edit_members',
            'manage_visitors',
            'view_visitors',
            'create_visitors',
            'edit_visitors',
            'manage_gm_clusters',
            'view_gm_clusters',
            'manage_gm_growth_groups',
            'view_gm_growth_groups',
            'manage_gm_ggli',
            'view_gm_ggli',
            'view_reports',
        ]);

        // E. Staff (Day-to-day encoding, creation, at updating ng mga records at visitors)
        $staff = Role::firstOrCreate(
            ['name' => 'staff'],
            ['guard_name' => 'sanctum']
        );
        $staff->givePermissionTo([
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
            'view_members',
            'create_members',
            'edit_members',
            'manage_visitors',
            'view_visitors',
            'create_visitors',
            'edit_visitors',
            'view_gm_growth_groups',
            'view_gs_growth_groups',
        ]);

        // F. GG Leader (Pag-handle, pag-create, at pag-monitor ng sariling Growth/Cell Group at members)
        $ggLeader = Role::firstOrCreate(
            ['name' => 'gg_leader'],
            ['guard_name' => 'sanctum']
        );
        $ggLeader->givePermissionTo([
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
            'view_members',
            'create_members',
            'view_visitors',
            'create_visitors',
            'manage_gm_growth_groups',
            'view_gm_growth_groups',
            'manage_gm_ggli',
            'view_gm_ggli',
        ]);

        // G. Member (Standard baseline access para sa sariling profile at pagtingin)
        $member = Role::firstOrCreate(
            ['name' => 'member'],
            ['guard_name' => 'sanctum']
        );
        $member->givePermissionTo([
            'view_dashboard',
            'view_profiles',
            'edit_profiles',
        ]);
    }
}
