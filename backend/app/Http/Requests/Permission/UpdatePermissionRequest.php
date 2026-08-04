<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Baguhin depende sa policy mo
    }

    public function rules(): array
    {
        // Kinukuha ang ID mula sa route parameters para ma-ignore ang kasalukuyang record sa unique check
        $permissionId = $this->route('id') ?? $this->route('permission');

        return [
            'name'       => 'required|string|max:255|unique:permissions,name,' . $permissionId,
            'guard_name' => 'nullable|string',
        ];
    }
}
