'use client';

import { useQuery } from '@tanstack/react-query';
import { orgsApi, seasonsApi, teamsApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrganizationDetailPage() {
  const params = useParams();
  const orgId = params.id as string;

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => orgsApi.get(orgId),
    enabled: !!orgId,
  });

  const { data: seasons } = useQuery({
    queryKey: ['seasons', orgId],
    queryFn: () => seasonsApi.list(orgId),
    enabled: !!orgId,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', orgId],
    queryFn: () => teamsApi.list(orgId),
    enabled: !!orgId,
  });

  if (orgLoading) {
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

  const organization = org?.data;

  return (
    <div className="p-8">
      <Link
        href="/orgs"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Organizations
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{organization?.name}</CardTitle>
              <CardDescription>{organization?.description || 'No description'}</CardDescription>
            </div>
            <Badge variant={organization?.is_active ? 'default' : 'secondary'}>
              {organization?.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Seasons */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Seasons</CardTitle>
              <Button asChild size="sm">
                <Link href={`/seasons/new?orgId=${orgId}`}>+ New</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {seasons?.data?.data?.length ? (
                (seasons.data.data ?? []).map((season: any) => (
                  <Link
                    key={season.id}
                    href={`/seasons/${season.id}`}
                  >
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-3">
                        <div className="font-medium">{season.name}</div>
                        <div className="text-sm text-muted-foreground">{season.status}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No seasons yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Teams */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Teams</CardTitle>
              <Button asChild size="sm">
                <Link href={`/teams/new?orgId=${orgId}`}>+ New</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teams?.data?.data?.length ? (
                (teams.data.data ?? []).map((team: any) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-3">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.coach?.name || 'No coach'}
                        </div>
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
      </div>
    </div>
  );
}
