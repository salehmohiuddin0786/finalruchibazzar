"use client";

import { useEffect, useRef, useState, } from 'react'
import {
  ActivityIcon,
  AlertTriangleIcon,
  BatteryChargingIcon,
  BellIcon,
  CheckCircleRegularIcon,
  CloseIcon,
  HeartbeatFilledIcon,
  HeartbeatIcon,
  MoonStarsIcon,
  NurseFilledIcon,
  SearchIcon,
  WalkIcon,
} from './icons'
import { DashboardLink, useDashboardNavigation } from './navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  currentUser,
  keyMetricsByTimeline,
  navigationGroups,
  notifications,
  profileHealthSummary,



} from '../../data'
import { cn } from '@/lib/utils'

const profileMetricIcons


 = {
  heart: HeartbeatIcon,
  walk: WalkIcon,
  moon: MoonStarsIcon,
  battery: BatteryChargingIcon,
  heartbeat: HeartbeatFilledIcon,
  nurse: NurseFilledIcon,
}

const profileMetricIconBgMap = {
  heart: 'var(--metric-heart)',
  walk: 'var(--metric-steps)',
  moon: 'var(--metric-sleep)',
  battery: 'var(--metric-recovery)',
  heartbeat: 'var(--metric-vital)',
  nurse: 'var(--metric-vital)',
}

const notificationIcons


 = {
  moon: MoonStarsIcon,
  check: CheckCircleRegularIcon,
  heart: HeartbeatIcon,
  alert: AlertTriangleIcon,
  activity: ActivityIcon,
  battery: BatteryChargingIcon,
}

const notificationToneClass


 = {
  warning: {
    icon: '!text-(--prediction-warn) [&_*]:!text-(--prediction-warn)',
    bg: 'bg-(--chart-warn-bg)',
  },
  success: {
    icon: '!text-(--vital-good) [&_*]:!text-(--vital-good)',
    bg: 'bg-(--vital-good)/10',
  },
  info: {
    icon: '!text-(--chart-period) [&_*]:!text-(--chart-period)',
    bg: 'bg-(--chart-period-bg)',
  },
  danger: {
    icon: '!text-(--prediction-danger) [&_*]:!text-(--prediction-danger)',
    bg: 'bg-(--prediction-danger)/10',
  },
}

function useCurrentNavItem() {
  const { pathname } = useDashboardNavigation()
  return (
    navigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.href === pathname) ?? navigationGroups[0].items[0]
  )
}

export function DashboardTopbar() {
  const currentNavItem = useCurrentNavItem()
  const PageIcon = currentNavItem.icon
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Ruchi Partner",
    email: "partner@ruchibazaar.in",
    city: "Adilabad, TG",
    rating: 4.8,
    commissionRate: 2,
    isOpen: true,
  })

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("restaurant") ||
        sessionStorage.getItem("restaurant")
      if (stored) {
        const parsed = JSON.parse(stored)
        setRestaurantInfo((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          city: parsed.address || parsed.city || "Adilabad, TG",
          rating: parsed.rating || 4.8,
          commissionRate: parsed.commissionRate || 2,
          isOpen: parsed.isOpen !== undefined ? parsed.isOpen : true,
        }))
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

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      window.location.href = `/Orders?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true)
    requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus()
    })
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()

        if (window.matchMedia('(width < 48rem)').matches) {
          setIsMobileSearchOpen(true)
          requestAnimationFrame(() => {
            mobileSearchInputRef.current?.focus()
          })
          return
        }

        searchInputRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setIsMobileSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b py-4 px-4 md:h-20 md:pr-8 md:pl-6 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      {isMobileSearchOpen ? (
        <div className="flex w-full items-center gap-2 md:hidden">
          <InputGroup className="h-11 flex-1 border-none bg-secondary py-1 pr-2 pl-3">
            <InputGroupAddon className="pl-0 text-muted-foreground">
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={mobileSearchInputRef}
              className="h-full px-1.5! text-sm tracking-tight placeholder:text-muted-foreground"
              aria-label="Search"
              placeholder="Search orders, items, transactions..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </InputGroup>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="size-11 shrink-0"
            aria-label="Close search"
            onClick={closeMobileSearch}
          >
            <CloseIcon />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <SidebarTrigger className="size-11 shrink-0 md:hidden [&_svg]:size-5!" />
            <div className="flex items-center gap-3">
              <PageIcon className="hidden size-5 shrink-0 md:block text-red-600" />
              <p className="truncate text-lg font-bold text-gray-900">
                {currentNavItem.name}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <InputGroup className="hidden h-11 w-72 max-w-full border-none bg-secondary py-1 pr-2 pl-3 md:flex">
              <InputGroupAddon className="pl-0 text-muted-foreground">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchInputRef}
                className="h-full px-1.5! text-sm tracking-tight placeholder:text-muted-foreground"
                aria-label="Search"
                placeholder="Search orders, items (Press Enter)..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </InputGroup>

            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="size-11 rounded-lg md:hidden"
              aria-label="Open search"
              onClick={openMobileSearch}
            >
              <SearchIcon className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="relative size-11 rounded-xl border-gray-200"
                  aria-label="Notifications"
                >
                  <BellIcon className="size-5!" />
                  {notifications.some((item) => item.unread) ? (
                    <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bionis-dashboard ml-3 w-80 p-0 shadow-xl border-gray-200"
              >
                <div className="flex items-center justify-between gap-3 border-b px-3.5 py-3 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-900">Partner Notifications</p>
                  <p className="text-xs font-medium text-red-600">
                    {notifications.filter((item) => item.unread).length} new
                  </p>
                </div>

                <div className="p-1.5 max-h-72 overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = notificationIcons[notification.icon] || CheckCircleRegularIcon
                    const tone = notificationToneClass[notification.tone] || notificationToneClass.info

                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 hover:bg-gray-50"
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                            tone.bg,
                            tone.icon,
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug text-gray-900">
                              {notification.title}
                            </p>
                            {notification.unread ? (
                              <span
                                aria-label="Unread"
                                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-600"
                              />
                            ) : null}
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                </div>

                <div className="border-t px-3.5 py-2.5 text-center bg-gray-50/50">
                  <DashboardLink
                    href="/Orders"
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                  >
                    View All Active Orders →
                  </DashboardLink>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto gap-2 px-1 py-1 rounded-xl hover:bg-gray-100/70"
                  aria-label="Restaurant profile"
                >
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="size-10 rounded-xl bg-muted object-cover border border-gray-200"
                  />
                  <div className="hidden flex-col items-start text-left md:flex pr-1">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {restaurantInfo.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{restaurantInfo.city}</span>
                      <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-600 font-medium">2% Fee</span>
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bionis-dashboard w-72 p-0 shadow-xl border-gray-200"
              >
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {restaurantInfo.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {restaurantInfo.email}
                      </p>
                      <p className="text-[11px] font-medium text-gray-500">
                        📍 {restaurantInfo.city}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        ★ {restaurantInfo.rating}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-red-50/60 p-2.5 border border-red-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide">
                        Commission Structure
                      </p>
                      <p className="text-xs text-red-950 font-medium">
                        2% Platform Fee • 98% Net Food
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-red-600 bg-white px-2 py-0.5 rounded-lg border border-red-200">
                      2.0%
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pt-1">
                    <DashboardLink
                      href="/Profile"
                      className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>Restaurant Profile & Hours</span>
                      <span className="text-gray-400">→</span>
                    </DashboardLink>
                    <DashboardLink
                      href="/Menu"
                      className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>Menu & Dish Management</span>
                      <span className="text-gray-400">→</span>
                    </DashboardLink>
                    <DashboardLink
                      href="/Earnings"
                      className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>Earnings & Bank Payouts</span>
                      <span className="text-gray-400">→</span>
                    </DashboardLink>
                    <DashboardLink
                      href="/Policies?tab=support"
                      className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>Partner Policies & Support</span>
                      <span className="text-gray-400">→</span>
                    </DashboardLink>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Log Out of Partner Account</span>
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </header>
  )
}
