'use client';

import { useQuery } from '@tanstack/react-query';
import { standingsApi, seasonsApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/lib/organization-context';
import { useState } from 'react';

export default function StandingsPage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');

  // Fetch seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', orgId],
    queryFn: () => seasonsApi.list(orgId),
    enabled: !!orgId,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['standings', orgId, selectedSeasonId],
    queryFn: () => standingsApi.get(orgId, selectedSeasonId),
    enabled: !!orgId && !!selectedSeasonId,
  });

  const seasons = seasonsData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-9 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Empty
          title="Error loading standings"
          description="Failed to load standings. Please try again."
        />
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className="p-8">
        <Empty
          title="No organization selected"
          description="Please select an organization first."
        />
      </div>
    );
  }

  const standings = data?.data?.standings_data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Standings</h1>
      </div>

      {/* Season Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Season</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
            <SelectTrigger className="w-full md:w-64">
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
        </CardContent>
      </Card>

      {!selectedSeasonId ? (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No season selected"
              description="Please select a season to view standings."
            />
          </CardContent>
        </Card>
      ) : standings.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Standings</CardTitle>
                <CardDescription>
                  Last updated:{' '}
                  {data?.data?.computed_at
                    ? new Date(data.data.computed_at).toLocaleString()
                    : 'N/A'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">MP</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((standing: any, index: number) => (
                  <TableRow
                    key={standing.team_id || index}
                    className={index === 0 ? 'bg-primary/10' : ''}
                  >
                    <TableCell className="font-medium">
                      {index + 1}
                      {index === 0 && <span className="ml-2">🏆</span>}
                    </TableCell>
                    <TableCell className="font-medium">
                      {standing.team_name || `Team ${standing.team_id}`}
                    </TableCell>
                    <TableCell className="text-center">{standing.wins || 0}</TableCell>
                    <TableCell className="text-center">{standing.losses || 0}</TableCell>
                    <TableCell className="text-center">{standing.draws || 0}</TableCell>
                    <TableCell className="text-center">{standing.matches_played || 0}</TableCell>
                    <TableCell className="text-center font-bold">{standing.points || 0}</TableCell>
                    <TableCell className="text-center">
                      {standing.win_percentage?.toFixed(1) || '0.0'}%
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
              title="No standings data available"
              description="Matches need to be completed and results confirmed to generate standings."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
