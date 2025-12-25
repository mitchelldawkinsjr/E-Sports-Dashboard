'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi, seasonsApi } from '@/lib/api';
import { useOrganization } from '@/lib/organization-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id?.toString() || '';

  const [formData, setFormData] = useState({
    season_id: '',
    title: '',
    content: '',
    scope: 'organization',
    is_pinned: false,
    published_at: '',
  });
  const [error, setError] = useState('');

  // Fetch seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', orgId],
    queryFn: () => seasonsApi.list(orgId),
    enabled: !!orgId,
  });

  const seasons = seasonsData?.data?.data || [];

  const createAnnouncement = useMutation({
    mutationFn: (data: any) => announcementsApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', orgId] });
      router.push('/announcements');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create announcement');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    createAnnouncement.mutate({
      ...formData,
      season_id: formData.season_id ? parseInt(formData.season_id) : null,
      published_at: formData.published_at || new Date().toISOString(),
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
        href="/announcements"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Announcements
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>
            Create a new announcement for your organization or season
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Scope *</Label>
              <Select
                value={formData.scope}
                onValueChange={(value) => setFormData({ ...formData, scope: value, season_id: '' })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization">Organization-wide</SelectItem>
                  <SelectItem value="season">Season-specific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.scope === 'season' && (
              <div className="space-y-2">
                <Label htmlFor="season_id">Season *</Label>
                <Select
                  value={formData.season_id}
                  onValueChange={(value) => setFormData({ ...formData, season_id: value })}
                  required
                >
                  <SelectTrigger>
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
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_pinned"
                checked={formData.is_pinned}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_pinned: checked as boolean })
                }
              />
              <Label htmlFor="is_pinned" className="cursor-pointer">
                Pin this announcement (show at top)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date (optional)</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to publish immediately
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createAnnouncement.isPending}>
                {createAnnouncement.isPending ? 'Creating...' : 'Create Announcement'}
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
