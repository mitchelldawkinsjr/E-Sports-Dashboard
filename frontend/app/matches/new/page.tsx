'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesApi, seasonsApi, teamsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function NewMatchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const [formData, setFormData] = useState({
    season_id: '',
    division_id: '',
    name: '',
    scheduled_at: '',
    best_of: '3',
    team_ids: ['', ''],
  });
  const [error, setError] = useState('');

  // Fetch seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', orgId],
    queryFn: () => seasonsApi.list(orgId),
    enabled: !!orgId,
  });

  // Fetch teams for selected season
  const { data: teamsData } = useQuery({
    queryKey: ['teams', orgId, formData.season_id],
    queryFn: () => teamsApi.list(orgId),
    enabled: !!orgId && !!formData.season_id,
  });

  const seasons = seasonsData?.data?.data || [];
  const teams = teamsData?.data?.data || [];

  const createMatch = useMutation({
    mutationFn: (data: any) => matchesApi.create(orgId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['matches', orgId] });
      router.push(`/matches/${response.data.id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create match');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate team IDs
    const teamIds = formData.team_ids.filter((id) => id !== '');
    if (teamIds.length !== 2) {
      setError('Please select exactly 2 teams');
      return;
    }

    createMatch.mutate({
      season_id: parseInt(formData.season_id),
      division_id: formData.division_id ? parseInt(formData.division_id) : null,
      name: formData.name || `Match ${new Date().toLocaleString()}`,
      scheduled_at: formData.scheduled_at,
      best_of: parseInt(formData.best_of),
      team_ids: teamIds.map((id) => parseInt(id)),
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
        href="/matches"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Matches
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Match</CardTitle>
          <CardDescription>
            Schedule a new match between two teams
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
                onValueChange={(value) => {
                  setFormData({ ...formData, season_id: value, team_ids: ['', ''] });
                }}
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
              <Label htmlFor="team1">Team 1 *</Label>
              <Select
                value={formData.team_ids[0]}
                onValueChange={(value) => {
                  const newTeamIds = [...formData.team_ids];
                  newTeamIds[0] = value;
                  setFormData({ ...formData, team_ids: newTeamIds });
                }}
                required
                disabled={!formData.season_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter((team: any) => team.id.toString() !== formData.team_ids[1])
                    .map((team: any) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team2">Team 2 *</Label>
              <Select
                value={formData.team_ids[1]}
                onValueChange={(value) => {
                  const newTeamIds = [...formData.team_ids];
                  newTeamIds[1] = value;
                  setFormData({ ...formData, team_ids: newTeamIds });
                }}
                required
                disabled={!formData.season_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter((team: any) => team.id.toString() !== formData.team_ids[0])
                    .map((team: any) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Match Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Auto-generated if left empty"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Scheduled At *</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="best_of">Best Of *</Label>
                <Select
                  value={formData.best_of}
                  onValueChange={(value) => setFormData({ ...formData, best_of: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Best of 1</SelectItem>
                    <SelectItem value="3">Best of 3</SelectItem>
                    <SelectItem value="5">Best of 5</SelectItem>
                    <SelectItem value="7">Best of 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createMatch.isPending}>
                {createMatch.isPending ? 'Creating...' : 'Create Match'}
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
