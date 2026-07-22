<?php

namespace App\Http\Requests\Cluster;

use Illuminate\Foundation\Http\FormRequest;

class StoreClusterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'church_id'   => 'required|integer|exists:churches,id',
            'name'        => 'required|string|max:255',
            'code'        => 'nullable|string|max:255',
            'member_id'     => 'nullable|integer',
            'is_active'   => 'boolean',
        ];
    }
}
