'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, rosterApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useOrganization } from '@/lib/organization-context';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function RemovePlayerButton({
  orgId,
  teamId,
  rosterId,
  playerName,
}: {
  orgId: string;
  teamId: string;
  rosterId: number;
  playerName: string;
}) {
  const queryClient = useQueryClient();

  const removePlayer = useMutation({
    mutationFn: () => rosterApi.remove(orgId, teamId, rosterId.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', orgId, teamId] });
      queryClient.invalidateQueries({ queryKey: ['roster', orgId, teamId] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to remove player');
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Remove</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Player</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {playerName} from the roster? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removePlayer.mutate()}
            disabled={removePlayer.isPending}
          >
            {removePlayer.isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentOrganization } = useOrganization();
  const teamId = params.id as string;
  const orgId = currentOrganization?.id?.toString() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['team', orgId, teamId],
    queryFn: () => teamsApi.get(orgId, teamId),
    enabled: !!orgId && !!teamId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Error loading team</AlertDescription>
        </Alert>
      </div>
    );
  }

  const team = data.data;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/teams"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Teams
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {team.logo_url ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={team.logo_url} alt={team.name} />
                    <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                    <span className="text-white font-bold text-2xl">{team.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <CardTitle className="text-3xl mb-2">{team.name}</CardTitle>
                  {team.description && (
                    <CardDescription>{team.description}</CardDescription>
                  )}
                </div>
              </div>
            </div>
            <Badge variant={team.is_active ? 'default' : 'secondary'}>
              {team.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Season</h3>
              <p className="text-lg font-semibold">{team.season?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Division</h3>
              <p className="text-lg font-semibold">{team.division?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Coach</h3>
              <p className="text-lg font-semibold">{team.coach?.name || 'No coach assigned'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roster Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Roster</CardTitle>
            <Button asChild>
              <Link href={`/teams/${teamId}/roster/add`}>+ Add Player</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {team.roster_entries && team.roster_entries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Jersey #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.roster_entries.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {entry.player_profile?.display_name ||
                        entry.player_profile?.user?.name ||
                        `Player ${entry.player_profile_id}`}
                      {entry.player_profile?.in_game_name && (
                        <span className="text-muted-foreground ml-2">
                          ({entry.player_profile.in_game_name})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{entry.position || 'N/A'}</TableCell>
                    <TableCell>{entry.jersey_number || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={entry.is_active ? 'default' : 'secondary'}>
                        {entry.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.is_active && (
                        <RemovePlayerButton
                          orgId={orgId}
                          teamId={teamId}
                          rosterId={entry.id}
                          playerName={entry.player_profile?.display_name || 'Player'}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No players on the roster yet.</p>
              <Button asChild>
                <Link href={`/teams/${teamId}/roster/add`}>Add First Player</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
