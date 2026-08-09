<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class MemberFactory extends Factory
{
    protected $model = \App\Models\Member::class;

    public function definition(): array
    {
        $cities = ['Parañaque City', 'Las Piñas City', 'Pasay City', 'Taguig City', 'Makati City'];
        $barangays = ['BF Homes', 'Don Bosco', 'Marcelo Green', 'San Antonio', 'Moonwalk', 'San Martin de Porres'];

        // Mga pinagpilian mong member positions
        $positions = [
            'Senior Pastor',
            'Pastor',
            'Pastoral Staff',
            'Deacon',
            'Elder',
            'Growth Group Leader',
            'Growth Group Member',
            'No Growth Group'
        ];

        return [
            'user_id' => User::factory(),
            'mem_id' => 'GCFNVL-' . $this->faker->unique()->numerify('#######'),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'birthday' => $this->faker->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d'),
            'mobile_number' => '09' . $this->faker->numerify('#########'),
            'city' => $this->faker->randomElement($cities),
            'barangay' => $this->faker->randomElement($barangays),
            'church_id' => $this->faker->randomElement([1, 2, 3]),
            // Random member position
            'member_position' => $this->faker->randomElement($positions),
        ];
    }
}
