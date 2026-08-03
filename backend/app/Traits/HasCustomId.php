<?php

namespace App\Traits;

use App\Services\CustomIdService;
use App\Models\Church;

trait HasCustomId
{
    public static function bootHasCustomId()
    {
        static::creating(function ($model) {
            $column = property_exists($model, 'idColumn') ? $model->idColumn : 'mem_id';

            // 1. Kunin ang Prefix base sa Church na pinag-rehistruhan
            $prefix = 'GCF-GEN-'; // Default fallback kung walang church_id
            $conditions = [];

            if (!empty($model->church_id)) {
                // Kunin ang Church record gamit ang church_id
                $church = Church::find($model->church_id);

                if ($church) {
                    // Halimbawa: GCFSM-
                    $prefix = strtoupper($church->code) . '-';
                }

                // 2. Para mag-start sa 0000001 ang bawat branch independently 
                $conditions['church_id'] = $model->church_id;
            }

            if (empty($model->$column)) {
                // Ipasa ang dynamic prefix at conditions sa Service
                $model->$column = CustomIdService::generate(
                    get_class($model),
                    $prefix,
                    $column,
                    $conditions
                );
            }
        });
    }
}
