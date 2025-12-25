'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rosterApi, playerProfilesApi, teamsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AddRosterPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const teamId = params.id as string;
  const orgId = currentOrganization?.id?.toString() || '';

  const [formData, setFormData] = useState({
    player_profile_id: '',
    position: '',
    jersey_number: '',
  });
  const [error, setError] = useState('');

  // Fetch team
  const { data: teamData } = useQuery({
    queryKey: ['team', orgId, teamId],
    queryFn: () => teamsApi.get(orgId, teamId),
    enabled: !!orgId && !!teamId,
  });

  // Fetch available player profiles
  const { data: profilesData } = useQuery({
    queryKey: ['player-profiles', orgId],
    queryFn: () => playerProfilesApi.list(orgId),
    enabled: !!orgId,
  });

  const team = teamData?.data;
  const profiles = profilesData?.data?.data || [];

  // Filter out players already on the team
  const existingPlayerIds = team?.roster_entries
    ?.filter((entry: any) => entry.is_active)
    .map((entry: any) => entry.player_profile_id) || [];
  const availableProfiles = profiles.filter(
    (profile: any) => !existingPlayerIds.includes(profile.id)
  );

  const addPlayer = useMutation({
    mutationFn: (data: any) => rosterApi.add(orgId, teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', orgId, teamId] });
      queryClient.invalidateQueries({ queryKey: ['roster', orgId, teamId] });
      router.push(`/teams/${teamId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to add player to roster');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    addPlayer.mutate({
      ...formData,
      player_profile_id: parseInt(formData.player_profile_id),
      jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
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
        href={`/teams/${teamId}`}
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Team
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add Player to Roster</CardTitle>
          <CardDescription>
            {team && (
              <span>
                Adding player to: <Badge variant="outline">{team.name}</Badge>
              </span>
            )}
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
              <Label htmlFor="player_profile_id">Player *</Label>
              <Select
                value={formData.player_profile_id}
                onValueChange={(value) => setFormData({ ...formData, player_profile_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a player" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map((profile: any) => (
                    <SelectItem key={profile.id} value={profile.id.toString()}>
                      {profile.display_name}
                      {profile.in_game_name && ` (${profile.in_game_name})`}
                      {profile.user && ` - ${profile.user.email}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableProfiles.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No available players. All players are already on this team or you need to create player profiles first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., Top, Jungle, Mid, ADC, Support"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jersey_number">Jersey Number</Label>
              <Input
                id="jersey_number"
                type="number"
                min="0"
                max="99"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={addPlayer.isPending || availableProfiles.length === 0}>
                {addPlayer.isPending ? 'Adding...' : 'Add Player'}
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
