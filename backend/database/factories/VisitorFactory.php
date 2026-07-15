<?php

namespace Database\Factories;

use App\Models\Visitor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Visitor>
 */
class VisitorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'visitor_id' => 'VIS-' . $this->faker->unique()->numberBetween(1000, 9999),
            'date_visited' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'service_time' => $this->faker->randomElement(['8 am', '10:30 am', '4 pm']),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'birthday' => $this->faker->date(),
            'age_group' => $this->faker->randomElement(['12 & below', '13-17', '18-27', '28-43', '44-55', '60 & above']),
            'gender' => $this->faker->randomElement(['Male', 'Female']),

            'barangay' => $this->faker->streetName(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),

            'life_stage' => $this->faker->randomElement(['Single', 'Married', 'Widowed', 'Divorced', 'Separated']),
            'current_church' => $this->faker->optional()->company(),

            'mobile_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'facebook_name' => $this->faker->userName(),

            'heard_from_invitee' => $this->faker->name(),
            'heard_from_details' => $this->faker->randomElement(['Walk-In', 'Social Media', 'Website', 'Friend']),

            'prayer_requests' => $this->faker->paragraph(),
            'remarks' => $this->faker->sentence(),
            'welcome_by' => $this->faker->name(),
        ];
    }
}
