<?php

namespace App\Services;

use App\Models\Visitor;

class VisitorService
{

    public function getAllVisitors(array $filters = [])
    {
        $query = Visitor::query();

        // I-check kung may 'search' sa array at hindi ito blanko
        if (isset($filters['search']) && $filters['search'] !== '') {
            $searchTerm = $filters['search'];

            // Naka-group na OR WHERE para hindi masira ang ibang conditions sa future
            $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('last_name', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('visitor_id', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'ILIKE', "%{$searchTerm}%")
                    ->orWhere('mobile_number', 'ILIKE', "%{$searchTerm}%");
            });
        }

        // Ang paginate() na ang bahalang bumasa ng 'page' parameter na ipinadala ng frontend
        return $query->latest()->paginate(10);
    }
}
