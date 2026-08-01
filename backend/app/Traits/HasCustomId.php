<?php

namespace App\Traits;

use App\Services\CustomIdService;

trait HasCustomId
{
    public static function bootHasCustomId()
    {
        static::creating(function ($model) {
            // I-define ang prefix at column name sa Model mo kung kinakailangan
            $prefix = property_exists($model, 'idPrefix') ? $model->idPrefix : 'APP-0000001';
            $column = property_exists($model, 'idColumn') ? $model->idColumn : 'custom_id';

            if (empty($model->$column)) {
                $model->$column = CustomIdService::generate(get_class($model), $prefix, $column);
            }
        });
    }
}
