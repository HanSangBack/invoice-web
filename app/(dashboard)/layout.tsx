import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { SITE_CONFIG } from "@/lib/constants"
import { DashboardNav } from "@/components/layout/dashboard-nav"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | Dashboard | ${SITE_CONFIG.name}`,
  },
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] px-4 py-8">
      {/* 사이드바 - 데스크톱 전용 */}
      <aside className="hidden w-56 shrink-0 md:block">
        <DashboardNav />
      </aside>

      <Separator orientation="vertical" className="mx-4 hidden md:block" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
