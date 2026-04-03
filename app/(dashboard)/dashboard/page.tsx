import type { Metadata } from "next"
import Link from "next/link"
import { Package, Plus } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "대시보드",
}

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">상품 관리</h1>
          <p className="text-sm text-muted-foreground">
            Notion 어드민에서 상품을 관리합니다
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/products/new">
            <Plus className="size-4" />
            상품 추가
          </Link>
        </Button>
      </div>

      <Separator />

      {/* 시작하기 섹션 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">시작하기</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4" />
                상품 목록 보기
              </CardTitle>
              <CardDescription>
                Notion DB에 저장된 모든 상품을 확인합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products">목록 보기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="size-4" />
                새 상품 등록
              </CardTitle>
              <CardDescription>
                폼을 통해 Notion에 새 상품을 등록합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products/new">등록하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 설정 섹션 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">설정</h2>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Notion API 연동</CardTitle>
            <CardDescription>
              Notion API Key와 Database ID를 설정하여 연동합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/settings">설정 열기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
