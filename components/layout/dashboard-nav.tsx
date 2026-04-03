"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Plus, Settings, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type DashboardNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "상품 목록", href: "/products", icon: Package },
  { label: "상품 추가", href: "/products/new", icon: Plus },
  { label: "설정", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        대시보드
      </p>
      {DASHBOARD_NAV.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            <ChevronRight
              className={cn(
                "ml-auto size-3 transition-opacity",
                isActive ? "opacity-50" : "opacity-0 group-hover:opacity-50"
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
