"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Calendar, 
  Users, 
  ChevronRight, 
  Building2, 
  Gamepad2, 
  TrendingUp,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useOrganization } from "@/lib/organization-context"
import { authApi } from "@/lib/api"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Organizations",
    href: "/orgs",
    icon: Building2,
  },
  {
    title: "Seasons",
    href: "/seasons",
    icon: Calendar,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    title: "Matches",
    href: "/matches",
    icon: Gamepad2,
  },
  {
    title: "Standings",
    href: "/standings",
    icon: TrendingUp,
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: Megaphone,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: BookOpen,
  },
]

type SidebarProps = {
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
  className?: string
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { organizations, currentOrganization, setCurrentOrganization, isLoading } = useOrganization()
  const [mounted] = useState(() => typeof window !== "undefined")

  const handleLogout = async () => {
    await authApi.logout()
    router.push('/login')
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-primary/50">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white">
            <path
              d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase leading-none tracking-wider text-foreground">Esports</span>
          <span className="text-sm font-bold uppercase leading-none tracking-wider text-primary">Dashboard</span>
        </div>
      </div>

      {/* Organization Selector */}
      <div className="border-b border-border p-4">
        {!mounted ? (
          <div className="text-xs text-muted-foreground">Loading organizations…</div>
        ) : isLoading ? (
          <div className="text-xs text-muted-foreground">Loading organizations…</div>
        ) : organizations.length > 0 ? (
          <div className="rounded-lg border border-sidebar-accent/50 bg-sidebar-accent/30 p-2">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Organization</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-md border border-border bg-sidebar hover:bg-sidebar-accent text-left font-semibold"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Active org</span>
                    <span className="text-sm font-medium text-sidebar-foreground">
                      {currentOrganization?.name || 'Select organization'}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="w-56 max-h-72 overflow-auto"
              >
                <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => {
                      setCurrentOrganization(org)
                      onNavigate?.()
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      currentOrganization?.id === org.id && "bg-sidebar-accent"
                    )}
                  >
                    <Building2 className="h-4 w-4" />
                    {org.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orgs/new" onClick={onNavigate}>+ Create new organization</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-sidebar-accent/20 p-3 text-xs text-muted-foreground">
            No organizations yet. <Link href="/orgs/new" className="text-primary underline" onClick={onNavigate}>Create one</Link> to get started.
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-2 hover:bg-sidebar-accent"
            >
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">User</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2" onClick={onNavigate}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function Sidebar({ variant = "desktop", onNavigate, className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return null
  }

  if (variant === "mobile") {
    return (
      <div className={cn("h-full w-full bg-sidebar text-sidebar-foreground", className)}>
        <SidebarNav onNavigate={onNavigate} />
      </div>
    )
  }

  if (isMobile) {
    return null
  }

  return (
    <aside className={cn("fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-border bg-sidebar md:flex", className)}>
      <SidebarNav />
    </aside>
  )
}

export { SidebarNav }

