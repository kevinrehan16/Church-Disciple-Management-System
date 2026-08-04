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
            'manage system',

            // Dashboard Management
            'manage dashboard',
            'view dashboard',

            // Profile Management
            'manage profiles',
            'view profiles',
            'edit profiles',

            // Churches Management
            'manage churches',
            'view churches',
            'create churches',
            'edit churches',
            'delete churches',

            // User Management
            'manage users',
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Member Management
            'manage members',
            'view members',
            'create members',
            'edit members',
            'delete members',

            // Visitor Management
            'manage visitors',
            'view visitors',
            'create visitors',
            'edit visitors',
            'delete visitors',

            // Pastor Management
            'manage pastors',
            'view pastors',
            'create pastors',
            'edit pastors',
            'delete pastors',

            // Elder Management
            'manage elders',
            'view elders',
            'create elders',
            'edit elders',
            'delete elders',

            // Deacon Management
            'manage deacons',
            'view deacons',
            'create deacons',
            'edit deacons',
            'delete deacons',

            // GM_Cluster Management
            'manage gm_clusters',
            'view gm_clusters',
            'create gm_clusters',
            'edit gm_clusters',
            'delete gm_clusters',

            // GM_GrowthGroup Management
            'manage gm_growth_groups',
            'view gm_growth_groups',
            'create gm_growth_groups',
            'edit gm_growth_groups',
            'delete gm_growth_groups',

            // GM_Ggli Management
            'manage gm_ggli',
            'view gm_ggli',
            'create gm_ggli',
            'edit gm_ggli',
            'delete gm_ggli',

            // GS_Cluster Management
            'manage gs_clusters',
            'view gs_clusters',
            'create gs_clusters',
            'edit gs_clusters',
            'delete gs_clusters',

            // GS_GrowthGroup Management
            'manage gs_growth_groups',
            'view gs_growth_groups',
            'create gs_growth_groups',
            'edit gs_growth_groups',
            'delete gs_growth_groups',

            // GS_Ggli Management
            'manage gs_ggli',
            'view gs_ggli',
            'create gs_ggli',
            'edit gs_ggli',
            'delete gs_ggli',

            // Reports & Analytics (Idinagdag para sa leadership oversight)
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. I-setup ang mga Roles at i-assign ang kaukulang Permissions

        // A. Super Admin (May hawak ng lahat ng kapangyarihan sa sistema)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // B. Senior Pastor (Oversight sa buong simbahan, miyembro, pastors, at ulat)
        $seniorPastor = Role::firstOrCreate(['name' => 'senior_pastor']);
        $seniorPastor->givePermissionTo([
            'view dashboard',
            'view profiles',
            'edit profiles',
            'manage churches',
            'view churches',
            'view members',
            'create members',
            'edit members',
            'delete members',
            'view visitors',
            'view pastors',
            'view elders',
            'view deacons',
            'manage gm_clusters',
            'view gm_clusters',
            'manage gm_growth_groups',
            'view gm_growth_groups',
            'manage gs_clusters',
            'view gs_clusters',
            'manage gs_growth_groups',
            'view gs_growth_groups',
            'view reports',
        ]);

        // C. Admin (Pangangasiwa sa mga user, operasyon, at buong data)
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'manage dashboard',
            'view dashboard',
            'view profiles',
            'edit profiles',
            'manage users',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage members',
            'view members',
            'create members',
            'edit members',
            'delete members',
            'manage visitors',
            'view visitors',
            'create visitors',
            'edit visitors',
            'delete visitors',
            'view pastors',
            'view elders',
            'view deacons',
            'view reports',
        ]);

        // D. Pastor (Ministry, spiritual oversight sa miyembro, visitors, at cell groups)
        $pastor = Role::firstOrCreate(['name' => 'pastor']);
        $pastor->givePermissionTo([
            'view dashboard',
            'view profiles',
            'edit profiles',
            'view churches',
            'view members',
            'create members',
            'edit members',
            'manage visitors',
            'view visitors',
            'create visitors',
            'edit visitors',
            'manage gm_clusters',
            'view gm_clusters',
            'manage gm_growth_groups',
            'view gm_growth_groups',
            'manage gm_ggli',
            'view gm_ggli',
            'view reports',
        ]);

        // E. Staff (Day-to-day encoding, creation, at updating ng mga records at visitors)
        $staff = Role::firstOrCreate(['name' => 'staff']);
        $staff->givePermissionTo([
            'view dashboard',
            'view profiles',
            'edit profiles',
            'view members',
            'create members',
            'edit members',
            'manage visitors',
            'view visitors',
            'create visitors',
            'edit visitors',
            'view gm_growth_groups',
            'view gs_growth_groups',
        ]);

        // F. GG Leader (Pag-handle, pag-create, at pag-monitor ng sariling Growth/Cell Group at members)
        $ggLeader = Role::firstOrCreate(['name' => 'gg_leader']);
        $ggLeader->givePermissionTo([
            'view dashboard',
            'view profiles',
            'edit profiles',
            'view members',
            'create members',
            'view visitors',
            'create visitors',
            'manage gm_growth_groups',
            'view gm_growth_groups',
            'manage gm_ggli',
            'view gm_ggli',
        ]);

        // G. Member (Standard baseline access para sa sariling profile at pagtingin)
        $member = Role::firstOrCreate(['name' => 'member']);
        $member->givePermissionTo([
            'view dashboard',
            'view profiles',
            'edit profiles',
        ]);
    }
}
