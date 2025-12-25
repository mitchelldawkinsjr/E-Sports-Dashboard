'use client';

import { useQuery } from '@tanstack/react-query';
import { orgsApi } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';

export default function OrganizationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      try {
        const response = await orgsApi.list();
        return response.data;
      } catch (err: any) {
        // If 404 or no orgs, return empty array
        if (err.response?.status === 404) {
          return { data: [] };
        }
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-40" />
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
          title="Error loading organizations"
          description="Failed to load organizations. Please try again."
        />
      </div>
    );
  }

  const organizations = data?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button asChild>
          <Link href="/orgs/new">Create Organization</Link>
        </Button>
      </div>

      {organizations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org: any) => (
            <Link key={org.id} href={`/orgs/${org.id}`}>
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {org.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {org.description || 'No description'}
                  </p>
                  <Badge variant={org.is_active ? 'default' : 'secondary'}>
                    {org.is_active ? 'Active' : 'Inactive'}
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
              title="No organizations found"
              description="Create your first organization to get started."
              action={
                <Button asChild>
                  <Link href="/orgs/new">Create Organization</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
