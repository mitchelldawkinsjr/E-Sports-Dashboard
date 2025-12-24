<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasOrganizationScope
{
    /**
     * Boot the trait.
     */
    protected static function bootHasOrganizationScope(): void
    {
        static::addGlobalScope('organization', function (Builder $builder) {
            if (request()->attributes->has('organization_id')) {
                $builder->where('organization_id', request()->attributes->get('organization_id'));
            }
        });
    }

    /**
     * Scope a query to a specific organization.
     */
    public function scopeForOrganization(Builder $query, int $organizationId): Builder
    {
        return $query->where('organization_id', $organizationId);
    }
}

