"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { productFormSchema, type ProductFormInput } from "@/lib/validation"
import { PRODUCT_CATEGORIES } from "@/lib/constants"
import type { ProductCategory } from "@/types"

export function ProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      category: "전자제품",
      stock: 0,
    },
  })

  const selectedCategory = watch("category")

  const onSubmit = async (data: ProductFormInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      interface ApiErrorResponse {
        success: false
        error: string
        details?: Array<{ path: string[]; message: string }>
      }

      interface ApiSuccessResponse {
        success: true
        data: unknown
      }

      const result = (await response.json()) as ApiErrorResponse | ApiSuccessResponse

      if (!response.ok) {
        if ("details" in result && result.details) {
          result.details.forEach((error) => {
            toast.error(`${error.path.join(".")}: ${error.message}`)
          })
        } else if ("error" in result) {
          toast.error(result.error || "상품 등록에 실패했습니다")
        }
        return
      }

      toast.success("상품이 등록되었습니다")
      router.push("/products")
      router.refresh()
    } catch (error) {
      console.error("Product form submission error:", error)
      toast.error("상품 등록 중 오류가 발생했습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 상품 등록</CardTitle>
        <CardDescription>
          상품 정보를 입력하면 Notion DB에 자동으로 저장됩니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 상품명 */}
          <div className="space-y-2">
            <Label htmlFor="name">상품명 *</Label>
            <Input
              id="name"
              placeholder="상품명을 입력하세요"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* 카테고리와 가격 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue("category", value as ProductCategory)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격 (₩) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                {...register("price")}
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* 재고와 출시일 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stock">재고 (개)</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                {...register("stock")}
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">출시일</Label>
              <Input
                id="releaseDate"
                type="date"
                {...register("releaseDate")}
                disabled={isSubmitting}
              />
              {errors.releaseDate && (
                <p className="text-sm text-destructive">{errors.releaseDate.message}</p>
              )}
            </div>
          </div>

          {/* 상품 이미지 URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">이미지 URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("imageUrl")}
              disabled={isSubmitting}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* 상품 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상품 설명</Label>
            <Textarea
              id="description"
              placeholder="상품에 대한 설명을 입력하세요"
              rows={4}
              {...register("description")}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <Separator />

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? "등록 중..." : "상품 등록"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.back()}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
