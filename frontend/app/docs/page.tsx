'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Zap, HelpCircle, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to use the Esports Dashboard platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/docs/user-guide">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>User Guide</CardTitle>
              </div>
              <CardDescription>
                Comprehensive step-by-step guide for all features. Perfect for new users learning the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Read guide</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/docs/quick-reference">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quick Reference</CardTitle>
              </div>
              <CardDescription>
                One-page quick reference card with common tasks, shortcuts, and workflows. Print-friendly format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>View reference</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/docs/getting-started">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </div>
              <CardDescription>
                Quick start guide for new users. Learn the basics of logging in, navigating, and using core features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Get started</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="h-full border-dashed">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Technical Documentation</CardTitle>
            </div>
            <CardDescription>
              For developers: API documentation, architecture details, and deployment guides.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See the README.md file in the project repository for technical documentation.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
        <p className="text-sm text-muted-foreground">
          If you can't find what you're looking for, check the troubleshooting sections in the User Guide,
          or review the Quick Reference for common tasks and shortcuts.
        </p>
      </div>
    </div>
  );
}

