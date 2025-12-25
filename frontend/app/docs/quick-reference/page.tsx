'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Building2, Calendar, Users, Gamepad2, TrendingUp, Megaphone, Bell } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QuickReferencePage() {
  return (
    <div className="p-8 max-w-6xl">
      <Link href="/docs" className="mb-4 text-primary hover:underline inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Documentation
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Quick Reference</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          One-page quick reference for common tasks and navigation
        </p>
      </div>

      <div className="space-y-8">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Login</strong>: http://localhost:4000</li>
              <li>Email: <code className="bg-muted px-1 rounded">admin@esports.local</code> | Password: <code className="bg-muted px-1 rounded">password</code></li>
              <li><strong className="text-foreground">Select Organization</strong>: Use dropdown in sidebar</li>
              <li><strong className="text-foreground">Navigate</strong>: Use sidebar menu items</li>
            </ol>
          </CardContent>
        </Card>

        {/* Navigation Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle>📍 Navigation Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organizations
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/orgs</code></TableCell>
                  <TableCell>Manage organizations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Seasons
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/seasons</code></TableCell>
                  <TableCell>Competition seasons</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teams
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/teams</code></TableCell>
                  <TableCell>Teams and rosters</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Matches
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/matches</code></TableCell>
                  <TableCell>Schedule and results</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Standings
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/standings</code></TableCell>
                  <TableCell>League rankings</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Announcements
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/announcements</code></TableCell>
                  <TableCell>Organization updates</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TableCell>
                  <TableCell><code className="bg-muted px-1 rounded">/notifications</code></TableCell>
                  <TableCell>Your notifications</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Common Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Common Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Create Organization</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sidebar → Organizations</li>
                <li>Click "Create Organization"</li>
                <li>Fill name, slug, description</li>
                <li>Click "Create"</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Create Season</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sidebar → Seasons</li>
                <li>Click "Create Season"</li>
                <li>Fill name, dates, game title</li>
                <li>Click "Create"</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Submit Match Result</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sidebar → Matches</li>
                <li>Click match card</li>
                <li>Scroll to "Submit Result"</li>
                <li>Enter scores (1=win, 0=loss) for each game</li>
                <li>Add notes (optional)</li>
                <li>Click "Submit Result"</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Confirm Match Result</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sidebar → Matches</li>
                <li>Click match card</li>
                <li>Scroll to "Confirm Result"</li>
                <li>Review submitted results</li>
                <li>Click "Confirm Result" or "Dispute Result"</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Match Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Match Result Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">1.</span>
                <span>Match Created (draft)</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">2.</span>
                <span>Match Scheduled</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">3.</span>
                <span>Match Played → Awaiting Results</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">4.</span>
                <span>Team 1 Submits Result</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">5.</span>
                <span>Team 2 Submits Result → Results Submitted</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">6.</span>
                <span>Team 2 Confirms → Results Confirmed</span>
              </div>
              <div className="ml-6 text-muted-foreground">↓</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">7.</span>
                <span>Standings Updated Automatically</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Status Guide */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Match Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Actions Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">draft</code></TableCell>
                  <TableCell>Just created</TableCell>
                  <TableCell>Edit, Schedule, Submit Result</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">scheduled</code></TableCell>
                  <TableCell>Date/time set</TableCell>
                  <TableCell>Submit Result, Edit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">awaiting_results</code></TableCell>
                  <TableCell>Waiting for scores</TableCell>
                  <TableCell>Submit Result</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">results_submitted</code></TableCell>
                  <TableCell>Both teams submitted</TableCell>
                  <TableCell>Confirm Result, Dispute</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">results_confirmed</code></TableCell>
                  <TableCell>Results verified</TableCell>
                  <TableCell>View (final)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">disputed</code></TableCell>
                  <TableCell>Under review</TableCell>
                  <TableCell>View only</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="bg-muted px-1 rounded">canceled</code></TableCell>
                  <TableCell>Match canceled</TableCell>
                  <TableCell>View only</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Score Submission */}
        <Card>
          <CardHeader>
            <CardTitle>🔢 Score Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Best-of-3 Example:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Game 1: Enter <code className="bg-muted px-1 rounded">1</code> (your team won)</li>
                <li>Game 2: Enter <code className="bg-muted px-1 rounded">0</code> (your team lost)</li>
                <li>Game 3: Enter <code className="bg-muted px-1 rounded">1</code> (your team won)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Best-of-5 Example:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Game 1: <code className="bg-muted px-1 rounded">1</code></li>
                <li>Game 2: <code className="bg-muted px-1 rounded">0</code></li>
                <li>Game 3: <code className="bg-muted px-1 rounded">1</code></li>
                <li>Game 4: <code className="bg-muted px-1 rounded">1</code></li>
                <li>Game 5: (not needed if you won 3)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🆘 Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Can't see data</TableCell>
                  <TableCell>Check organization selection in sidebar</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Can't submit result</TableCell>
                  <TableCell>Verify match status and team relationship</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Can't confirm result</TableCell>
                  <TableCell>Wait for both teams to submit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Missing features</TableCell>
                  <TableCell>Check your role permissions</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="pt-4 border-t flex gap-4">
          <Link href="/docs/user-guide" className="flex-1">
            <Button variant="outline" className="w-full">
              ← View Full User Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

