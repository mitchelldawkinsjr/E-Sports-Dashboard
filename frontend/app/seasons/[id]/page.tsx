'use client';

import { useQuery } from '@tanstack/react-query';
import { seasonsApi, teamsApi, matchesApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrganization } from '@/lib/organization-context';

export default function SeasonDetailPage() {
  const params = useParams();
  const seasonId = params.id as string;
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const { data: season, isLoading: seasonLoading, error: seasonError } = useQuery({
    queryKey: ['season', orgId, seasonId],
    queryFn: () => seasonsApi.get(orgId, seasonId),
    enabled: !!orgId && !!seasonId,
  });

  const { data: teamsData } = useQuery({
    queryKey: ['teams', orgId, seasonId],
    queryFn: () => teamsApi.list(orgId),
    enabled: !!orgId,
  });

  const { data: matchesData } = useQuery({
    queryKey: ['matches', orgId, seasonId],
    queryFn: () => matchesApi.list(orgId),
    enabled: !!orgId,
  });

  if (seasonLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (seasonError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Error loading season</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Please select an organization first.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const seasonData = season?.data || season;
  const allTeams = teamsData?.data?.data || teamsData?.data || [];
  const teams = allTeams.filter((team: any) => team.season_id === parseInt(seasonId));
  const allMatches = matchesData?.data?.data || matchesData?.data || [];
  const matches = allMatches.filter((match: any) => match.season_id === parseInt(seasonId));

  return (
    <div className="p-8">
      <Link
        href="/seasons"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Seasons
      </Link>

      {/* Season Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-3xl mb-2">{seasonData?.name}</CardTitle>
              <CardDescription>{seasonData?.description || 'No description'}</CardDescription>
            </div>
            <Badge
              variant={
                seasonData?.status === 'active'
                  ? 'default'
                  : seasonData?.status === 'completed'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {seasonData?.status || 'draft'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Game Title</span>
              <p className="font-medium">
                {seasonData?.game_title?.name || seasonData?.gameTitle?.name || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Start Date</span>
              <p className="font-medium">
                {seasonData?.start_date
                  ? new Date(seasonData.start_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">End Date</span>
              <p className="font-medium">
                {seasonData?.end_date
                  ? new Date(seasonData.end_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Teams</span>
              <p className="font-medium">{teams.length}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Teams Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Teams ({teams.length})</CardTitle>
              <Button asChild size="sm">
                <Link href={`/teams/new?orgId=${orgId}&seasonId=${seasonId}`}>+ Add Team</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teams.length > 0 ? (
                teams.map((team: any) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-3">
                        <div className="font-medium">{team.name}</div>
                        {team.coach && (
                          <div className="text-sm text-muted-foreground">
                            Coach: {team.coach.name}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No teams yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Matches Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Matche ({matches.length})</CardTitle>
              <Button asChild size="sm">
                <Link href={`/matches/new?orgId=${orgId}&seasonId=${seasonId}`}>+ Schedule Match</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches.length > 0 ? (
                matches.slice(0, 5).map((match: any) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-3">
                        <div className="font-medium">{match.name || 'Match'}</div>
                        <div className="text-sm text-muted-foreground">
                          {match.participants?.map((p: any) => p.team?.name).join(' vs ') || 'TBD'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {match.scheduled_at
                            ? new Date(match.scheduled_at).toLocaleString()
                            : 'Not scheduled'}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No matches yet</p>
              )}
              {matches.length > 5 && (
                <Link
                  href={`/matches?orgId=${orgId}&seasonId=${seasonId}`}
                  className="block text-center text-sm text-primary hover:underline mt-2"
                >
                  View all matches →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href={`/standings?orgId=${orgId}&seasonId=${seasonId}`}>View Standings</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/matches/new?orgId=${orgId}&seasonId=${seasonId}`}>Schedule Match</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/teams/new?orgId=${orgId}&seasonId=${seasonId}`}>Add Team</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
