<?php

namespace App\Services;

class CustomIdService
{
    public static function generate(string $modelClass, string $prefix, string $column = 'mem_id', array $conditions = []): string
    {
        $query = $modelClass::query();

        if (!empty($conditions)) {
            $query->where($conditions);
        }

        $latestRecord = $query->latest('created_at')->first();

        if (!$latestRecord || empty($latestRecord->$column)) {
            $nextNumber = 1;
        } else {
            $lastId = $latestRecord->$column;
            $numberPart = preg_replace('/[^0-9]/', '', substr($lastId, -7));
            $nextNumber = intval($numberPart) + 1;
        }

        return $prefix . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
    }
}
