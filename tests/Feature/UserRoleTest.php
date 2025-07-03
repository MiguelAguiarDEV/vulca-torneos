<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can be created with admin role.
     */
    public function test_user_can_be_created_with_admin_role(): void
    {
        $user = User::factory()->admin()->create();

        $this->assertEquals(User::ROLE_ADMIN, $user->role);
        $this->assertTrue($user->isAdmin());
        $this->assertFalse($user->isUser());
    }

    /**
     * Test that a user can be created with regular user role.
     */
    public function test_user_can_be_created_with_user_role(): void
    {
        $user = User::factory()->create();

        $this->assertEquals(User::ROLE_USER, $user->role);
        $this->assertTrue($user->isUser());
        $this->assertFalse($user->isAdmin());
    }

    /**
     * Test admin scope.
     */
    public function test_admin_scope_filters_admin_users(): void
    {
        User::factory()->count(3)->create();
        User::factory()->admin()->count(2)->create();

        $adminUsers = User::admins()->get();
        $this->assertCount(2, $adminUsers);

        foreach ($adminUsers as $user) {
            $this->assertTrue($user->isAdmin());
        }
    }

    /**
     * Test user scope.
     */
    public function test_user_scope_filters_regular_users(): void
    {
        User::factory()->count(3)->create();
        User::factory()->admin()->count(2)->create();

        $regularUsers = User::users()->get();
        $this->assertCount(3, $regularUsers);

        foreach ($regularUsers as $user) {
            $this->assertTrue($user->isUser());
        }
    }

    /**
     * Test get roles method.
     */
    public function test_get_roles_returns_available_roles(): void
    {
        $roles = User::getRoles();
        
        $this->assertContains(User::ROLE_USER, $roles);
        $this->assertContains(User::ROLE_ADMIN, $roles);
        $this->assertCount(2, $roles);
    }
}
