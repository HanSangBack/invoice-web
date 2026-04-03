import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "../_components/product-form"

export const metadata: Metadata = {
  title: "상품 등록",
  description: "새로운 상품을 등록합니다",
}

export default function ProductNewPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 뒤로가기 버튼 */}
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link href="/products" className="gap-2">
          <ChevronLeft className="size-4" />
          상품 목록으로
        </Link>
      </Button>

      {/* 폼 */}
      <ProductForm />
    </div>
  )
}
