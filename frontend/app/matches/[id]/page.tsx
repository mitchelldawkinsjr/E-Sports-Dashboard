'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useOrganization } from '@/lib/organization-context';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const matchId = params.id as string;
  const orgId = currentOrganization?.id?.toString() || '';
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['match', orgId, matchId],
    queryFn: () => matchesApi.get(orgId, matchId),
    enabled: !!matchId,
  });

  const [scores, setScores] = useState<(number | null)[]>([]);
  const [notes, setNotes] = useState('');

  const submitResult = useMutation({
    mutationFn: (data: any) => matchesApi.submitResult(orgId, matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', orgId, matchId] });
      queryClient.invalidateQueries({ queryKey: ['matches', orgId] });
      queryClient.invalidateQueries({ queryKey: ['standings', orgId] });
      setScores([]);
      setNotes('');
      toast({
        title: 'Result submitted',
        description: 'Your result has been submitted and is awaiting confirmation.',
      });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to submit result',
        variant: 'destructive',
      });
    },
  });

  const confirmResult = useMutation({
    mutationFn: (data: any) => matchesApi.confirmResult(orgId, matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', orgId, matchId] });
      queryClient.invalidateQueries({ queryKey: ['matches', orgId] });
      queryClient.invalidateQueries({ queryKey: ['standings', orgId] });
      toast({
        title: 'Result confirmed',
        description: 'The match result has been confirmed and standings updated.',
      });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to confirm result',
        variant: 'destructive',
      });
    },
  });

  const handleSubmitResult = async () => {
    // Validate all scores are filled
    const match = data?.data;
    const bestOf = match?.best_of || 3;
    
    if (scores.length !== bestOf) {
      toast({
        title: 'Error',
        description: `Please enter scores for all ${bestOf} games`,
        variant: 'destructive',
      });
      return;
    }

    // Validate scores are 0 or 1 (not null)
    const validScores = scores.filter((score) => score !== null && score !== undefined) as number[];
    if (validScores.length !== bestOf) {
      toast({
        title: 'Error',
        description: `Please enter scores for all ${bestOf} games`,
        variant: 'destructive',
      });
      return;
    }

    // Validate scores are 0 or 1
    if (validScores.some((score) => score !== 0 && score !== 1)) {
      toast({
        title: 'Error',
        description: 'Scores must be 0 (loss) or 1 (win)',
        variant: 'destructive',
      });
      return;
    }

    submitResult.mutate({ scores: validScores, notes: notes || null });
  };

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
          <AlertDescription>Error loading match</AlertDescription>
        </Alert>
      </div>
    );
  }

  const match = data.data;

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: 'outline',
      scheduled: 'default',
      awaiting_results: 'secondary',
      in_progress: 'secondary',
      results_submitted: 'secondary',
      results_confirmed: 'default',
      disputed: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/matches"
        className="mb-4 text-primary hover:underline inline-block"
      >
        ← Back to Matches
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{match.name || `Match #${match.id}`}</CardTitle>
            </div>
            <Badge variant={getStatusVariant(match.status)}>
              {match.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Scheduled</h3>
              <p className="text-lg font-semibold">
                {match.scheduled_at
                  ? new Date(match.scheduled_at).toLocaleString()
                  : 'Not scheduled'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Best Of</h3>
              <p className="text-lg font-semibold">{match.best_of}</p>
            </div>
          </div>

          {/* Participants */}
          {match.participants && match.participants.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Teams</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {match.participants.map((participant: any) => (
                  <Card key={participant.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">
                        {participant.team?.name || `Team ${participant.team_id}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">Side: {participant.side}</p>
                      {participant.score !== null && (
                        <p className="text-lg font-bold mt-2">Score: {participant.score}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Result Submission */}
          {(match.status === 'awaiting_results' || match.status === 'scheduled' || match.status === 'draft') && (
            <div className="border-t pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Result</CardTitle>
                  <CardDescription>
                    Enter scores for each game in the best-of-{match.best_of} series. 
                    Use <strong>1</strong> for a win, <strong>0</strong> for a loss.
                    The backend will automatically determine which team you're submitting for based on your coach relationship.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Game Scores</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Array.from({ length: match.best_of || 3 }).map((_, gameIndex) => (
                          <div key={gameIndex} className="space-y-2">
                            <Label htmlFor={`game-${gameIndex}`} className="text-sm font-medium">
                              Game {gameIndex + 1}
                            </Label>
                            <Input
                              id={`game-${gameIndex}`}
                              type="number"
                              min="0"
                              max="1"
                              step="1"
                              value={scores[gameIndex] !== null && scores[gameIndex] !== undefined ? scores[gameIndex] : ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                
                                if (value === '') {
                                  const newScores = [...scores];
                                  newScores[gameIndex] = null;
                                  setScores(newScores);
                                } else {
                                  const numValue = parseInt(value, 10);
                                  if (!isNaN(numValue) && (numValue === 0 || numValue === 1)) {
                                    const newScores = [...scores];
                                    // Ensure array is long enough
                                    while (newScores.length <= gameIndex) {
                                      newScores.push(null);
                                    }
                                    newScores[gameIndex] = numValue;
                                    setScores(newScores);
                                  }
                                }
                              }}
                              placeholder="0 or 1"
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                              {scores[gameIndex] === 1 ? '✓ Win' : scores[gameIndex] === 0 ? '✗ Loss' : 'Enter 0 or 1'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Add any notes about the match result..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={handleSubmitResult} 
                        disabled={submitResult.isPending}
                        className="flex-1"
                      >
                        {submitResult.isPending ? 'Submitting...' : 'Submit Result'}
                      </Button>
                    </div>

                    {scores.some((s) => s !== null && s !== undefined) && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Current Scores:</p>
                        <p className="text-sm text-muted-foreground">
                          {scores.map((score, idx) => (
                            <span key={idx} className="mr-2">
                              Game {idx + 1}: {score === 1 ? '✓ Win' : score === 0 ? '✗ Loss' : '?'}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Result Submissions */}
          {match.result_submissions && match.result_submissions.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Result Submissions</h2>
              <div className="space-y-4">
                {match.result_submissions.map((submission: any) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {submission.team?.name || `Team ${submission.team_id}`}
                          </CardTitle>
                          <CardDescription>
                            Submitted: {new Date(submission.created_at).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {submission.scores && (
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Scores:</p>
                          <pre className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {JSON.stringify(submission.scores, null, 2)}
                          </pre>
                        </div>
                      )}
                      {submission.notes && (
                        <p className="text-sm text-muted-foreground">{submission.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Result Confirmation */}
          {match.status === 'results_submitted' && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Result</h2>
              <CardDescription className="mb-4">
                Review the submitted result and confirm if it's correct.
              </CardDescription>
              <div className="flex gap-4">
                <Button
                  onClick={() => confirmResult.mutate({ is_confirmed: true })}
                  disabled={confirmResult.isPending}
                >
                  {confirmResult.isPending ? 'Confirming...' : 'Confirm Result'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to dispute this result? This will require official review.'
                      )
                    ) {
                      toast({
                        title: 'Coming soon',
                        description: 'Dispute functionality coming soon',
                      });
                    }
                  }}
                >
                  Dispute Result
                </Button>
              </div>
            </div>
          )}

          {/* Confirmed Result */}
          {match.status === 'results_confirmed' && (
            <div className="border-t pt-6 mt-6">
              <Alert>
                <AlertDescription>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <div>
                      <p className="font-medium">Result Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        This match result has been confirmed and standings have been updated.
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
