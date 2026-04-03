"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductTableProps {
  products: Product[]
}

const categoryColors: Record<string, string> = {
  전자제품: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  의류: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  기타: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">등록된 상품이 없습니다</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/products/new">첫 상품 등록하기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>상품명</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead className="text-right">가격</TableHead>
            <TableHead className="text-right">재고</TableHead>
            <TableHead>출시일</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium max-w-xs truncate">
                {product.name}
              </TableCell>
              <TableCell>
                <Badge className={categoryColors[product.category]}>
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                ₩{product.price.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    product.stock === 0
                      ? "text-destructive font-medium"
                      : "text-foreground"
                  }
                >
                  {product.stock}개
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {product.releaseDate
                  ? new Date(product.releaseDate).toLocaleDateString("ko-KR")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                {product.notionUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a
                      href={product.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      <ExternalLink className="size-3" />
                      보기
                    </a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
