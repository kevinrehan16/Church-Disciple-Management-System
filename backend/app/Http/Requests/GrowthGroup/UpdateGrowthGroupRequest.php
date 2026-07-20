<?php

namespace App\Http\Requests\GrowthGroup;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGrowthGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $growthGroupId = $this->route('growth_group')?->id ?? $this->route('growth_group');

        return [
            'church_id'          => 'sometimes|integer|exists:churches,id',
            'name'               => 'sometimes|string|max:255',
            'code'               => ['nullable', 'string', 'max:100', Rule::unique('growth_groups', 'code')->ignore($growthGroupId)],
            'cluster_id'         => 'nullable|integer|exists:clusters,id',
            'leader_id'          => 'nullable|integer|exists:members,id',
            'meeting_day'        => 'nullable|string|max:50',
            'meeting_time'       => 'nullable|date_format:H:i:s,H:i',
            'location_type'      => 'nullable|in:onsite,online,hybrid',
            'venue_address'      => 'nullable|string',
            'target_demographic' => 'nullable|in:all,men,women,youth,couples,single_professionals',
            'is_active'          => 'boolean',
        ];
    }
}
