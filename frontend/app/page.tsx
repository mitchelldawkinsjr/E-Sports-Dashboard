'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Gamepad2, Users, TrendingUp, Megaphone, Bell, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);
  
  // Don't render anything if not authenticated (will redirect)
  if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
    return null;
  }
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden border-b border-border bg-gradient-to-r from-card via-cyan-950/30 to-card">
        <div className="absolute inset-0 bg-[url('/gaming-arena-abstract.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground shadow-lg shadow-primary/50">
            <Zap className="mr-1 h-3 w-3" />
            Esports Platform
          </Badge>
          <h1 className="mb-4 text-5xl font-bold text-balance">Compete at the Highest Level</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Manage your esports organization, teams, matches, and competitions
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Quick Access Cards */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Quick Access</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/orgs">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Organizations
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage your esports organization, teams, and members
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/seasons">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Seasons
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create and manage competition seasons
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/teams">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Teams
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage teams, rosters, and player profiles
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/matches">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                      <Gamepad2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Matches
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Schedule matches and manage results
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/standings">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Standings
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View league standings and statistics
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/announcements">
              <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
                      <Megaphone className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      Announcements
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View organization and season announcements
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
