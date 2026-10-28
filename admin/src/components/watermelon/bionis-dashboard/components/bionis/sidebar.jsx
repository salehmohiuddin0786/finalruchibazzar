"use client";

import { useState, useEffect } from 'react'
import {
  BookOpenIcon,
  CreditCardIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon as LucideUserIcon,
} from 'lucide-react'
import {
  ArrowRightIcon,
  CloseIcon,
  QuestionIcon,
  SidebarCollapseIcon,
  ToggleIcon,
  UserIcon,
} from './icons'
import { BionisLogo } from './logo'
import { DashboardLink, useDashboardNavigation } from './navigation'
import { useTheme } from './theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { currentUser, navigationGroups, } from '../../data'
import { cn } from '@/lib/utils'

const menuButtonClassName = cn(
  'h-12 gap-2.5 rounded-xl border border-transparent px-3 text-base tracking-tight text-muted-foreground transition-colors',
  'aria-[current=page]:border-border aria-[current=page]:bg-background aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground aria-[current=page]:shadow-[1px_2px_12px_rgba(158,158,158,0.08)]',
  'dark:aria-[current=page]:border-transparent dark:aria-[current=page]:bg-sidebar-accent dark:aria-[current=page]:shadow-[1px_2px_12px_rgba(0,0,0,0.25)]',
  'hover:bg-sidebar-accent data-open:bg-background data-open:text-sidebar-accent-foreground dark:data-open:bg-sidebar-accent',
  '[&_svg]:size-5!',
  'group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden',
)

function NavItem({ item }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { pathname } = useDashboardNavigation()
  const isActive =
    item.href === '/'
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={item.name}
      className={menuButtonClassName}
    >
      <DashboardLink
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => {
          if (isMobile) setOpenMobile(false)
        }}
      >
        <item.icon />
        <span>{item.name}</span>
        {item.badge ? (
          <SidebarMenuBadge className="sidebar-badge-shadow static ml-auto rounded bg-background px-2 py-1.5 text-sm text-muted-foreground group-aria-[current=page]/menu-button:font-medium group-aria-[current=page]/menu-button:text-sidebar-accent-foreground">
            {item.badge}
          </SidebarMenuBadge>
        ) : null}
      </DashboardLink>
    </SidebarMenuButton>
  )
}

function HelpItem() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className={menuButtonClassName}>
            <QuestionIcon />
            <span>Help</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          className="bionis-dashboard w-56"
        >
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-foreground">Need help?</p>
            <p>Guides, docs, and support for Bionis.</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="https://docs.bionis.com" target="_blank" rel="noreferrer">
                <BookOpenIcon />
                Documentation
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href="https://bionis.com/support"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircleIcon />
                Contact support
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function DarkModeItem() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = isDark ? 'Light Mode' : 'Dark Mode'

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        className={menuButtonClassName}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        <ToggleIcon pressed={isDark} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function ProfileItem() {
  const [partnerInfo, setPartnerInfo] = useState({
    name: "Ruchi Partner",
    email: "partner@ruchibazaar.in",
  })

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("restaurant") ||
        sessionStorage.getItem("restaurant")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.name) {
          setPartnerInfo({
            name: parsed.name,
            email: parsed.email || "partner@ruchibazaar.in",
          })
        }
      }
    } catch (e) {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("restaurant")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("restaurant")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/Login"
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip="Profile & Account" className={menuButtonClassName}>
            <UserIcon />
            <span>Profile</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          className="bionis-dashboard w-60 shadow-lg border-gray-200"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900">
                {partnerInfo.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{partnerInfo.email}</p>
              <span className="mt-1 inline-block text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                2% Commission Partner
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <DashboardLink href="/Profile" className="flex items-center gap-2 cursor-pointer">
                <LucideUserIcon className="size-4" />
                <span>Restaurant Settings</span>
              </DashboardLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DashboardLink href="/Earnings" className="flex items-center gap-2 cursor-pointer">
                <CreditCardIcon className="size-4" />
                <span>Earnings & Settlements</span>
              </DashboardLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className="cursor-pointer text-red-600 hover:bg-red-50"
          >
            <LogOutIcon className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function CollapseControl({
  collapsed,
  onToggle,
}


) {
  if (!collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex size-9.5 shrink-0 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
        aria-label="Collapse sidebar"
      >
        <SidebarCollapseIcon className="-rotate-90" />
      </button>
    )
  }

  return (
    <div className="relative size-11 shrink-0">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all ease-linear group-hover:scale-75 group-hover:opacity-0">
        <BionisLogo className="size-6" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex scale-75 items-center justify-center opacity-0 transition-all ease-linear group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={onToggle}
          className="flex size-11 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label="Expand sidebar"
        >
          <SidebarCollapseIcon className="rotate-90" />
        </button>
      </div>
    </div>
  )
}

function CommissionGuaranteeCard() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 rounded-2xl border border-red-200/70 p-3.5',
        'bg-gradient-to-br from-red-50/80 via-orange-50/40 to-white',
        'group-data-[collapsible=icon]:hidden',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-lg bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-tight text-white uppercase shadow-xs">
          2% Commission
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex size-5 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-100 hover:text-gray-700"
          aria-label="Dismiss banner"
        >
          <CloseIcon className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold text-gray-900 leading-tight">
          Adilabad Store Promise
        </p>
        <p className="text-[11px] leading-relaxed text-gray-600">
          98% net food revenue directly to your bank account. Weekly settlements with verified bank UTR numbers.
        </p>
      </div>

      <DashboardLink
        href="/Earnings"
        className="inline-flex items-center justify-between text-xs font-bold text-red-600 hover:text-red-700 pt-1"
      >
        <span>View Payout Ledger</span>
        <ArrowRightIcon className="size-3.5" />
      </DashboardLink>
    </div>
  )
}

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === 'collapsed'
  const [restaurantName, setRestaurantName] = useState("Ruchi Bazaar")

  useEffect(() => {
    try {
      const r = localStorage.getItem("restaurant")
      if (r) {
        const parsed = JSON.parse(r)
        if (parsed.name) setRestaurantName(parsed.name)
      }
    } catch (e) {}
  }, [])

  return (
    <Sidebar collapsible="icon" className="h-full border-r border-gray-200/80 bg-white shadow-xs">
      <SidebarHeader
        className={cn(
          'h-16 flex-row items-center border-b border-sidebar-border transition-[padding] md:h-20',
          collapsed ? 'justify-start px-3' : 'justify-between gap-3 px-4',
        )}
      >
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <BionisLogo className="size-8 shrink-0" />
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-bold text-gray-900 leading-tight">
                {restaurantName}
              </span>
              <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
                Partner Panel
              </span>
            </div>
          </div>
        )}
        <CollapseControl collapsed={collapsed} onToggle={toggleSidebar} />
      </SidebarHeader>

      <SidebarContent className="gap-3 overflow-x-hidden overflow-y-auto px-3 py-4 group-data-[collapsible=icon]:overflow-y-auto!">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="gap-1.5 p-0">
            <SidebarGroupLabel className="h-auto px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <NavItem item={item} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-4 border-t border-sidebar-border px-3 py-3">
        <CommissionGuaranteeCard />
        <SidebarMenu className="gap-1">
          <HelpItem />
          <DarkModeItem />
          <ProfileItem />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
