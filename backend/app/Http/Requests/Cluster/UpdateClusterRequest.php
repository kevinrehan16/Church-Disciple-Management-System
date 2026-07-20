<?php

namespace App\Http\Requests\Cluster;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClusterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'church_id'   => 'sometimes|integer|exists:churches,id',
            'name'        => 'sometimes|string|max:255',
            'code'        => 'nullable|string|max:255',
            'head_id'     => 'nullable|integer',
            'is_active'   => 'boolean',
        ];
    }
}
