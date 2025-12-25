'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const sections = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'dashboard', title: 'Dashboard Overview' },
  { id: 'organizations', title: 'Organizations' },
  { id: 'seasons', title: 'Seasons' },
  { id: 'teams', title: 'Teams' },
  { id: 'matches', title: 'Matches' },
  { id: 'standings', title: 'Standings' },
  { id: 'announcements', title: 'Announcements' },
  { id: 'notifications', title: 'Notifications' },
  { id: 'tips', title: 'Tips & Best Practices' },
];

export default function UserGuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-6xl">
      <Link href="/docs" className="mb-4 text-primary hover:underline inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Documentation
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">User Guide</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Comprehensive step-by-step guide for all features of the Esports Dashboard
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Accessing the Application</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Open your web browser and navigate to: <strong className="text-foreground">http://localhost:4000</strong></li>
                    <li>You'll see the login page</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Logging In</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Enter your email address in the <strong className="text-foreground">Email</strong> field</li>
                    <li>Enter your password in the <strong className="text-foreground">Password</strong> field</li>
                    <li>Click the <strong className="text-foreground">Sign In</strong> button</li>
                  </ol>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Demo Credentials:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Email:</strong> <code className="bg-background px-1 rounded">admin@esports.local</code></li>
                      <li><strong>Password:</strong> <code className="bg-background px-1 rounded">password</code></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">First Login Experience</h3>
                  <p className="text-muted-foreground">
                    After logging in, you'll be redirected to the dashboard homepage. If you don't have an organization selected, 
                    you'll need to create or select one.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Navigation Sidebar</h3>
                  <p className="text-muted-foreground mb-3">
                    The left sidebar provides quick access to all major features:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">🏢 Organizations</strong> - Manage your organizations</li>
                    <li><strong className="text-foreground">📅 Seasons</strong> - Create and manage competition seasons</li>
                    <li><strong className="text-foreground">👥 Teams</strong> - Manage teams and rosters</li>
                    <li><strong className="text-foreground">🎮 Matches</strong> - Schedule and manage matches</li>
                    <li><strong className="text-foreground">📊 Standings</strong> - View league standings</li>
                    <li><strong className="text-foreground">📢 Announcements</strong> - View and create announcements</li>
                    <li><strong className="text-foreground">🔔 Notifications</strong> - View your notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Organization Selector</h3>
                  <p className="text-muted-foreground mb-2">
                    At the top of the sidebar, you'll see the organization selector. Click it to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Switch between organizations</li>
                    <li>Create a new organization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">User Profile</h3>
                  <p className="text-muted-foreground mb-2">
                    At the bottom of the sidebar, click your profile to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Access settings</li>
                    <li>Logout</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Organizations */}
          <section id="organizations" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Organizations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Organizations are the top-level containers for all your competition data. Each organization is completely isolated from others.
                </p>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Viewing Organizations</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Organizations</strong> in the sidebar</li>
                    <li>You'll see a grid of all organizations you have access to</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating a New Organization</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Organizations</strong> in the sidebar</li>
                    <li>Click the <strong className="text-foreground">Create Organization</strong> button in the top right</li>
                    <li>Fill in the form:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li><strong className="text-foreground">Organization Name</strong> (required): Enter a descriptive name</li>
                        <li><strong className="text-foreground">Slug</strong> (required): URL-friendly identifier (auto-generated from name if left empty)</li>
                        <li><strong className="text-foreground">Description</strong> (optional): Add details about your organization</li>
                      </ul>
                    </li>
                    <li>Click <strong className="text-foreground">Create Organization</strong></li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seasons */}
          <section id="seasons" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Seasons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Seasons represent a competition period (e.g., "Spring 2024", "Championship Season").
                </p>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating a Season</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Seasons</strong> in the sidebar</li>
                    <li>Click <strong className="text-foreground">Create Season</strong> button</li>
                    <li>Fill in the form with season name, dates, and game title</li>
                    <li>Click <strong className="text-foreground">Create Season</strong></li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Teams */}
          <section id="teams" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating a Team</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Teams</strong> in the sidebar</li>
                    <li>Click <strong className="text-foreground">Create Team</strong> button</li>
                    <li>Select the season and fill in team details</li>
                    <li>Click <strong className="text-foreground">Create Team</strong></li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Adding a Player to Roster</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Navigate to the team detail page</li>
                    <li>Click <strong className="text-foreground">+ Add Player</strong> button</li>
                    <li>Select a player profile, position, and jersey number</li>
                    <li>Click <strong className="text-foreground">Add Player</strong></li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Matches */}
          <section id="matches" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating a Match</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Matches</strong> in the sidebar</li>
                    <li>Click <strong className="text-foreground">Create Match</strong> button</li>
                    <li>Select season, teams, scheduled time, and best-of setting</li>
                    <li>Click <strong className="text-foreground">Create Match</strong></li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Submitting Match Results</h3>
                  <p className="text-muted-foreground mb-3">
                    When a match is ready for results:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Navigate to the match detail page</li>
                    <li>Scroll to the <strong className="text-foreground">Submit Result</strong> section</li>
                    <li>For each game in the best-of series, enter:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li><strong className="text-foreground">1</strong> for a win</li>
                        <li><strong className="text-foreground">0</strong> for a loss</li>
                      </ul>
                    </li>
                    <li>(Optional) Add notes about the match</li>
                    <li>Click <strong className="text-foreground">Submit Result</strong></li>
                  </ol>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Example for Best-of-3:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Game 1: Enter <code className="bg-background px-1 rounded">1</code> (win)</li>
                      <li>Game 2: Enter <code className="bg-background px-1 rounded">0</code> (loss)</li>
                      <li>Game 3: Enter <code className="bg-background px-1 rounded">1</code> (win)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Confirming Match Results</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Navigate to the match detail page</li>
                    <li>Scroll to the <strong className="text-foreground">Confirm Result</strong> section</li>
                    <li>Review the submitted results</li>
                    <li>Click <strong className="text-foreground">Confirm Result</strong> to approve, or <strong className="text-foreground">Dispute Result</strong> if there's an issue</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Standings */}
          <section id="standings" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Standings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Viewing Standings</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Standings</strong> in the sidebar</li>
                    <li>Select a season from the dropdown</li>
                    <li>View the standings table showing rank, team name, wins, losses, points, and win percentage</li>
                  </ol>
                </div>
                <p className="text-muted-foreground">
                  Standings update automatically when match results are confirmed.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Announcements */}
          <section id="announcements" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating an Announcement</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Announcements</strong> in the sidebar</li>
                    <li>Click <strong className="text-foreground">+ New Announcement</strong> button</li>
                    <li>Fill in title, content, and scope (organization-wide or season-specific)</li>
                    <li>Optionally pin the announcement or schedule for later</li>
                    <li>Click <strong className="text-foreground">Create Announcement</strong></li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Notifications */}
          <section id="notifications" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Notifications alert you to important events like match scheduling, result submissions, and disputes.
                </p>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Viewing Notifications</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click <strong className="text-foreground">Notifications</strong> in the sidebar</li>
                    <li>View all your notifications</li>
                    <li>Click <strong className="text-foreground">Mark read</strong> on any unread notification</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tips & Best Practices */}
          <section id="tips" className="scroll-mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tips & Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Workflow Recommendations</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Start with Organizations</strong>: Create your organization first</li>
                    <li><strong className="text-foreground">Create Seasons</strong>: Set up seasons before creating teams</li>
                    <li><strong className="text-foreground">Build Teams</strong>: Create teams and add players to rosters</li>
                    <li><strong className="text-foreground">Schedule Matches</strong>: Create matches between teams</li>
                    <li><strong className="text-foreground">Submit Results</strong>: After matches, submit results promptly</li>
                    <li><strong className="text-foreground">Confirm Results</strong>: Review and confirm submitted results</li>
                    <li><strong className="text-foreground">Monitor Standings</strong>: Check standings regularly</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Use descriptive names for clarity</li>
                    <li>Fill in descriptions to help team members understand</li>
                    <li>Submit results promptly to keep standings up to date</li>
                    <li>Use announcements to keep your organization informed</li>
                    <li>Check notifications to stay on top of pending actions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t">
            <Link href="/docs/quick-reference">
              <Button variant="outline" className="w-full">
                View Quick Reference →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

