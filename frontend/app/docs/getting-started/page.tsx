'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GettingStartedPage() {
  return (
    <div className="p-8 max-w-4xl">
      <Link href="/docs" className="mb-4 text-primary hover:underline inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Documentation
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Getting Started</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Quick start guide for new users
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Login */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <CardTitle>Log In</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Access the application at <strong className="text-foreground">http://localhost:4000</strong>
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Email:</strong> <code className="bg-background px-1 rounded">admin@esports.local</code></li>
                <li><strong>Password:</strong> <code className="bg-background px-1 rounded">password</code></li>
              </ul>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Enter your credentials and click "Sign In"</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Select Organization */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <CardTitle>Select Organization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              After logging in, you'll need to select or create an organization. Organizations are the top-level containers for all your competition data.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Use the organization selector at the top of the sidebar</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>If you don't have an organization, click "Create new organization"</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Navigate */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <CardTitle>Explore the Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The sidebar provides quick access to all major features:
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Organizations</strong> - Manage your organizations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Seasons</strong> - Create competition seasons</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Teams</strong> - Manage teams and rosters</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Matches</strong> - Schedule and manage matches</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Standings</strong> - View league rankings</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span><strong>Announcements</strong> - View and create announcements</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: First Workflow */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                4
              </div>
              <CardTitle>Run Your First Season</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Follow this workflow to get started:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Create a Season</strong>
                <p className="text-sm ml-6 mt-1">Go to Seasons → Create Season. Fill in the season name, dates, and game title.</p>
              </li>
              <li>
                <strong className="text-foreground">Create Teams</strong>
                <p className="text-sm ml-6 mt-1">Go to Teams → Create Team. Select the season and fill in team details.</p>
              </li>
              <li>
                <strong className="text-foreground">Add Players</strong>
                <p className="text-sm ml-6 mt-1">Navigate to a team detail page and click "+ Add Player" to build your roster.</p>
              </li>
              <li>
                <strong className="text-foreground">Schedule Matches</strong>
                <p className="text-sm ml-6 mt-1">Go to Matches → Create Match. Select teams, date/time, and best-of setting.</p>
              </li>
              <li>
                <strong className="text-foreground">Submit Results</strong>
                <p className="text-sm ml-6 mt-1">After a match, navigate to the match detail page and submit results.</p>
              </li>
              <li>
                <strong className="text-foreground">View Standings</strong>
                <p className="text-sm ml-6 mt-1">Go to Standings and select your season to see updated rankings.</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Ready to learn more? Check out these resources:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/docs/user-guide">
              <Button variant="default" className="w-full justify-between">
                <span>Read the Full User Guide</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/quick-reference">
              <Button variant="outline" className="w-full justify-between">
                <span>View Quick Reference</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

