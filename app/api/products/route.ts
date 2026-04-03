import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createProduct, getProducts } from "@/lib/notion"
import { ProductFormValues } from "@/types"
import { revalidatePath } from "next/cache"

// 상품 폼 검증 스키마
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productFormSchema: any = z.object({
  name: z.string().min(1, "상품명은 필수입니다").max(100),
  category: z.enum(["전자제품", "의류", "기타"]),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z.number().min(0, "재고는 0 이상이어야 합니다").optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  releaseDate: z.string().optional(),
})

// GET /api/products - 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    const products = await getProducts(
      category ? { category: category as any } : undefined
    )

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "상품 목록을 가져올 수 없습니다",
      },
      { status: 500 }
    )
  }
}

// POST /api/products - 상품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Zod 검증
    const validatedData = productFormSchema.parse(body)

    // 상품 생성
    const product = await createProduct(validatedData as ProductFormValues)

    // 상품 목록 페이지 revalidate
    revalidatePath("/products")

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "상품이 등록되었습니다",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/products error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "입력 데이터가 유효하지 않습니다",
          details: (error as any).errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "상품 생성에 실패했습니다",
      },
      { status: 500 }
    )
  }
}
