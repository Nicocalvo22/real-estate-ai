"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building, Home, Search, BarChart3, Map, Heart, Settings, LogOut, AlertTriangle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  // TEMPORALMENTE DESHABILITADO:
  // const supabase = createClient()

  const handleSignOut = async () => {
    // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
    // await supabase.auth.signOut()
    console.log("Sesión cerrada (modo demo)")
    router.push("/")
    router.refresh()
  }

  // Color mapping for each tab
  const getTabColors = (route: string, isActive: boolean) => {
    const colors: { [key: string]: { bg: string, hover: string, text: string, icon: string } } = {
      '/dashboard': {
        bg: isActive ? 'bg-findy-electric/20 border-l-4 border-findy-electric' : 'hover:bg-findy-electric/10',
        hover: 'hover:bg-findy-electric/15',
        text: isActive ? 'text-findy-electric' : 'text-findy-lightgray hover:text-findy-electric',
        icon: isActive ? 'text-findy-electric' : 'text-findy-mediumgray'
      },
      '/dashboard/deals': {
        bg: isActive ? 'bg-findy-orange/20 border-l-4 border-findy-orange' : 'hover:bg-findy-orange/10',
        hover: 'hover:bg-findy-orange/15',
        text: isActive ? 'text-findy-orange' : 'text-findy-lightgray hover:text-findy-orange',
        icon: isActive ? 'text-findy-orange' : 'text-findy-mediumgray'
      },
      '/dashboard/chat': {
        bg: isActive ? 'bg-findy-fuchsia/20 border-l-4 border-findy-fuchsia' : 'hover:bg-findy-fuchsia/10',
        hover: 'hover:bg-findy-fuchsia/15',
        text: isActive ? 'text-findy-fuchsia' : 'text-findy-lightgray hover:text-findy-fuchsia',
        icon: isActive ? 'text-findy-fuchsia' : 'text-findy-mediumgray'
      },
      '/dashboard/analytics': {
        bg: isActive ? 'bg-findy-magenta/20 border-l-4 border-findy-magenta' : 'hover:bg-findy-magenta/10',
        hover: 'hover:bg-findy-magenta/15',
        text: isActive ? 'text-findy-magenta' : 'text-findy-lightgray hover:text-findy-magenta',
        icon: isActive ? 'text-findy-magenta' : 'text-findy-mediumgray'
      },
      '/dashboard/map': {
        bg: isActive ? 'bg-findy-skyblue/20 border-l-4 border-findy-skyblue' : 'hover:bg-findy-skyblue/10',
        hover: 'hover:bg-findy-skyblue/15',
        text: isActive ? 'text-findy-skyblue' : 'text-findy-lightgray hover:text-findy-skyblue',
        icon: isActive ? 'text-findy-skyblue' : 'text-findy-mediumgray'
      },
      '/dashboard/saved': {
        bg: isActive ? 'bg-red-500/20 border-l-4 border-red-500' : 'hover:bg-red-500/10',
        hover: 'hover:bg-red-500/15',
        text: isActive ? 'text-red-400' : 'text-findy-lightgray hover:text-red-400',
        icon: isActive ? 'text-red-400' : 'text-findy-mediumgray'
      },
      '/dashboard/settings': {
        bg: isActive ? 'bg-findy-mediumgray/20 border-l-4 border-findy-mediumgray' : 'hover:bg-findy-mediumgray/10',
        hover: 'hover:bg-findy-mediumgray/15',
        text: isActive ? 'text-findy-lightgray' : 'text-findy-mediumgray hover:text-findy-lightgray',
        icon: isActive ? 'text-findy-lightgray' : 'text-findy-mediumgray'
      }
    }
    return colors[route] || colors['/dashboard']
  }

  return (
    <div className={cn("pb-12 min-h-screen bg-gray-900 border-r border-gray-800", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white">
            <Building className="h-6 w-6 text-findy-electric" />
            <span className="bg-gradient-to-r from-findy-electric to-findy-fuchsia bg-clip-text text-transparent">
              RealEstate AI
            </span>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-2">
            <Link href="/dashboard">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard', pathname === '/dashboard').bg,
                getTabColors('/dashboard', pathname === '/dashboard').hover
              )}>
                <Home className={cn("h-4 w-4", getTabColors('/dashboard', pathname === '/dashboard').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard', pathname === '/dashboard').text)}>
                  Dashboard
                </span>
              </div>
            </Link>
            <Link href="/dashboard/deals">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/deals', pathname === '/dashboard/deals').bg,
                getTabColors('/dashboard/deals', pathname === '/dashboard/deals').hover
              )}>
                <AlertTriangle className={cn("h-4 w-4", getTabColors('/dashboard/deals', pathname === '/dashboard/deals').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/deals', pathname === '/dashboard/deals').text)}>
                  Deal Alerts
                </span>
              </div>
            </Link>
            <Link href="/dashboard/chat">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/chat', pathname === '/dashboard/chat').bg,
                getTabColors('/dashboard/chat', pathname === '/dashboard/chat').hover
              )}>
                <Search className={cn("h-4 w-4", getTabColors('/dashboard/chat', pathname === '/dashboard/chat').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/chat', pathname === '/dashboard/chat').text)}>
                  Findy
                </span>
              </div>
            </Link>
            <Link href="/dashboard/analytics">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/analytics', pathname === '/dashboard/analytics').bg,
                getTabColors('/dashboard/analytics', pathname === '/dashboard/analytics').hover
              )}>
                <BarChart3 className={cn("h-4 w-4", getTabColors('/dashboard/analytics', pathname === '/dashboard/analytics').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/analytics', pathname === '/dashboard/analytics').text)}>
                  Market Analytics
                </span>
              </div>
            </Link>
            <Link href="/dashboard/map">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/map', pathname === '/dashboard/map').bg,
                getTabColors('/dashboard/map', pathname === '/dashboard/map').hover
              )}>
                <Map className={cn("h-4 w-4", getTabColors('/dashboard/map', pathname === '/dashboard/map').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/map', pathname === '/dashboard/map').text)}>
                  Market Map
                </span>
              </div>
            </Link>
            <Link href="/dashboard/saved">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/saved', pathname === '/dashboard/saved').bg,
                getTabColors('/dashboard/saved', pathname === '/dashboard/saved').hover
              )}>
                <Heart className={cn("h-4 w-4", getTabColors('/dashboard/saved', pathname === '/dashboard/saved').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/saved', pathname === '/dashboard/saved').text)}>
                  Saved Properties
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-findy-mediumgray uppercase tracking-wider">Settings</h3>
          <div className="space-y-2">
            <Link href="/dashboard/settings">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                getTabColors('/dashboard/settings', pathname === '/dashboard/settings').bg,
                getTabColors('/dashboard/settings', pathname === '/dashboard/settings').hover
              )}>
                <Settings className={cn("h-4 w-4", getTabColors('/dashboard/settings', pathname === '/dashboard/settings').icon)} />
                <span className={cn("font-medium", getTabColors('/dashboard/settings', pathname === '/dashboard/settings').text)}>
                  Account Settings
                </span>
              </div>
            </Link>
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-red-500/10 group"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300" />
              <span className="font-medium text-red-400 group-hover:text-red-300">
                Sign Out
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
