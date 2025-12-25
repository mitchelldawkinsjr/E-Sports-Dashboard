'use client';

import { useQuery } from '@tanstack/react-query';
import { seasonsApi } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { useOrganization } from '@/lib/organization-context';

export default function SeasonsPage() {
  const { currentOrganization } = useOrganization();
  const selectedOrgId = currentOrganization?.id?.toString() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['seasons', selectedOrgId],
    queryFn: () => seasonsApi.list(selectedOrgId),
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
          title="Error loading seasons"
          description="Failed to load seasons. Please try again."
        />
      </div>
    );
  }

  const seasons = data?.data?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seasons</h1>
        <Button asChild>
          <Link href="/seasons/new">Create Season</Link>
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
      ) : seasons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seasons.map((season: any) => (
            <Link key={season.id} href={`/seasons/${season.id}`}>
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {season.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {season.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{season.status}</Badge>
                    {season.start_date && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(season.start_date).toLocaleDateString()} -{' '}
                        {new Date(season.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No seasons found"
              description="Create your first season to get started."
              action={
                <Button asChild>
                  <Link href="/seasons/new">Create Season</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
