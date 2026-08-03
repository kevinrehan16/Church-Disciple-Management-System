<?php

namespace App\Services;

class CustomIdService
{
    public static function generate(string $modelClass, string $prefix, string $column = 'mem_id', array $conditions = []): string
    {
        $maxRetries = 5;
        $attempt = 0;

        while ($attempt < $maxRetries) {
            $query = $modelClass::query();

            if (!empty($conditions)) {
                $query->where($conditions);
            }

            // Gamitin ang pinakataas o pinakahuling ID para masigurong tama ang base number
            $latestRecord = $query->orderBy('id', 'desc')->first();

            if (!$latestRecord || empty($latestRecord->$column)) {
                $nextNumber = 1;
            } else {
                $lastId = $latestRecord->$column;
                $numberPart = preg_replace('/[^0-9]/', '', substr($lastId, -7));
                $nextNumber = intval($numberPart) + 1 + $attempt; // Dinadagdagan kung may nag-conflict na
            }

            $candidateId = $prefix . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);

            // I-check kung nagagamit na ba ang ID na ito sa database para maiwasan ang duplicate
            $exists = $modelClass::where($column, $candidateId)->exists();

            if (!$exists) {
                // Kung wala pang gumagamit, ito na ang gagamitin!
                return $candidateId;
            }

            // Kung nagamit na pala (dahil sa sabay na request), ulitin ang loop para mag-generate ng panibago
            $attempt++;
        }

        // Ultimate fallback kung sakaling maubusan ng retries
        return $prefix . str_pad(mt_rand(1000000, 9999999), 7, '0', STR_PAD_LEFT);
    }
}
