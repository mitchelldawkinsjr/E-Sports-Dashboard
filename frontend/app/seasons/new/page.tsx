'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seasonsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function NewSeasonPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const [formData, setFormData] = useState({
    game_title_id: '',
    ruleset_preset_id: '',
    name: '',
    slug: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState('');

  const createSeason = useMutation({
    mutationFn: (data: any) => seasonsApi.create(orgId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['seasons', orgId] });
      router.push(`/seasons/${response.data.id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create season');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    createSeason.mutate({
      ...formData,
      slug,
      game_title_id: parseInt(formData.game_title_id),
      ruleset_preset_id: formData.ruleset_preset_id ? parseInt(formData.ruleset_preset_id) : null,
    });
  };

  if (!orgId) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Please select an organization first.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/seasons"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Seasons
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Season</CardTitle>
          <CardDescription>
            Create a new competition season for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Season Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                pattern="[a-z0-9-]+"
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from name if left empty
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game_title_id">Game Title ID *</Label>
              <Input
                id="game_title_id"
                type="number"
                value={formData.game_title_id}
                onChange={(e) => setFormData({ ...formData, game_title_id: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the game title ID (check database for available IDs)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  min={formData.start_date}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createSeason.isPending}>
                {createSeason.isPending ? 'Creating...' : 'Create Season'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
