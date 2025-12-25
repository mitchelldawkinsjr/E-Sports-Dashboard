'use client';

import { useQuery } from '@tanstack/react-query';
import { teamsApi } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { useOrganization } from '@/lib/organization-context';

export default function TeamsPage() {
  const { currentOrganization } = useOrganization();
  const selectedOrgId = currentOrganization?.id?.toString() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['teams', selectedOrgId],
    queryFn: () => teamsApi.list(selectedOrgId),
    enabled: !!selectedOrgId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Empty
          title="Error loading teams"
          description="Failed to load teams. Please try again."
        />
      </div>
    );
  }

  const teams = data?.data?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button asChild>
          <Link href="/teams/new">Create Team</Link>
        </Button>
      </div>

      {!selectedOrgId ? (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No organization selected"
              description="Please select an organization first."
            />
          </CardContent>
        </Card>
      ) : teams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team: any) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {team.logo_url ? (
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={team.logo_url} alt={team.name} />
                        <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                        <span className="text-white font-bold">{team.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {team.name}
                      </h2>
                      {team.coach && (
                        <p className="text-sm text-muted-foreground">
                          Coach: {team.coach.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {team.description || 'No description'}
                  </p>
                  <Badge variant={team.is_active ? 'default' : 'secondary'}>
                    {team.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No teams found"
              description="Create your first team to get started."
              action={
                <Button asChild>
                  <Link href="/teams/new">Create Team</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
