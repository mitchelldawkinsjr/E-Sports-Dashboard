'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, seasonsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function NewTeamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const [formData, setFormData] = useState({
    season_id: '',
    division_id: '',
    conference_id: '',
    name: '',
    slug: '',
    description: '',
    coach_id: '',
  });
  const [error, setError] = useState('');

  // Fetch seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', orgId],
    queryFn: () => seasonsApi.list(orgId),
    enabled: !!orgId,
  });

  const seasons = seasonsData?.data?.data || [];

  const createTeam = useMutation({
    mutationFn: (data: any) => teamsApi.create(orgId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['teams', orgId] });
      router.push(`/teams/${response.data.id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create team');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    createTeam.mutate({
      ...formData,
      slug,
      season_id: parseInt(formData.season_id),
      division_id: formData.division_id ? parseInt(formData.division_id) : null,
      conference_id: formData.conference_id ? parseInt(formData.conference_id) : null,
      coach_id: formData.coach_id ? parseInt(formData.coach_id) : null,
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
        href="/teams"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Teams
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
          <CardDescription>
            Create a new team for your organization
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
              <Label htmlFor="season_id">Season *</Label>
              <Select
                value={formData.season_id}
                onValueChange={(value) => setFormData({ ...formData, season_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season: any) => (
                    <SelectItem key={season.id} value={season.id.toString()}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createTeam.isPending}>
                {createTeam.isPending ? 'Creating...' : 'Create Team'}
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
