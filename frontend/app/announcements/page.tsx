'use client';

import { useQuery } from '@tanstack/react-query';
import { announcementsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import Link from 'next/link';

export default function AnnouncementsPage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcements', orgId],
    queryFn: () => announcementsApi.list(orgId),
    enabled: !!orgId,
  });

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

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-32" />
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
          title="Error loading announcements"
          description="Failed to load announcements. Please try again."
        />
      </div>
    );
  }

  const announcements = data?.data?.data || [];

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Button asChild>
          <Link href="/announcements/new">+ New Announcement</Link>
        </Button>
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement: any) => (
            <Card
              key={announcement.id}
              className={`border-l-4 ${
                announcement.is_pinned
                  ? 'border-yellow-500 bg-yellow-50/10 dark:bg-yellow-900/20'
                  : 'border-primary'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{announcement.title}</CardTitle>
                  {announcement.is_pinned && (
                    <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Pinned
                    </Badge>
                  )}
                  <Badge variant="secondary">{announcement.scope}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap mb-4">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <div>
                    {announcement.creator && (
                      <span>By {announcement.creator.name || announcement.creator.email}</span>
                    )}
                    {announcement.season && (
                      <span className="ml-2">• Season: {announcement.season.name}</span>
                    )}
                  </div>
                  <div>
                    {announcement.published_at
                      ? new Date(announcement.published_at).toLocaleDateString()
                      : 'Draft'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <Empty
              title="No announcements yet"
              description="Create your first announcement to get started."
              action={
                <Button asChild>
                  <Link href="/announcements/new">Create First Announcement</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
