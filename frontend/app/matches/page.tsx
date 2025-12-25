'use client';

import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { useOrganization } from '@/lib/organization-context';

export default function MatchesPage() {
  const { currentOrganization } = useOrganization();
  const selectedOrgId = currentOrganization?.id?.toString() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['matches', selectedOrgId],
    queryFn: () => matchesApi.list(selectedOrgId),
    enabled: !!selectedOrgId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Empty
          title="Error loading matches"
          description="Failed to load matches. Please try again."
        />
      </div>
    );
  }

  const matches = data?.data?.data || [];

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: 'outline',
      scheduled: 'default',
      in_progress: 'secondary',
      results_confirmed: 'default',
      disputed: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Matches</h1>
        <Button asChild>
          <Link href="/matches/new">Create Match</Link>
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
      ) : matches.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match: any) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      <div className="font-medium">{match.name || `Match #${match.id}`}</div>
                      {match.participants && (
                        <div className="text-sm text-muted-foreground">
                          {match.participants
                            .map((p: any) => p.team?.name)
                            .filter(Boolean)
                            .join(' vs ') || 'TBD'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleString()
                        : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(match.status)}>
                        {match.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/matches/${match.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No matches found"
              description="Create your first match to get started."
              action={
                <Button asChild>
                  <Link href="/matches/new">Create Match</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
