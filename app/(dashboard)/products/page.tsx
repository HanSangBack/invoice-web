import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/notion"
import { ProductTable } from "./_components/product-table"
import type { Product } from "@/types"

export const metadata: Metadata = {
  title: "상품 목록",
  description: "등록된 상품 목록을 확인합니다",
}

export const revalidate = 60 // ISR: 60초마다 재생성

export default async function ProductsPage() {
  let products: Product[] = []
  let error: string | null = null

  try {
    products = await getProducts()
  } catch (err) {
    error = err instanceof Error ? err.message : "상품 목록을 불러올 수 없습니다"
    console.error("Error fetching products:", err)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">상품 목록</h1>
          <p className="text-sm text-muted-foreground">
            총 {products.length}개의 상품이 등록되어 있습니다
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/products/new">
            <Plus className="size-4" />
            상품 추가
          </Link>
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
          <p className="text-sm text-destructive font-medium">
            ⚠️ {error}
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            .env.local 파일에서 Notion API Key와 Database ID를 확인해주세요.
          </p>
        </div>
      )}

      {/* 상품 테이블 */}
      <ProductTable products={products} />
    </div>
  )
}
