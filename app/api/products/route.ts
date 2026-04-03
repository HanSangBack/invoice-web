import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createProduct, getProducts } from "@/lib/notion"
import { productFormSchema } from "@/lib/validation"
import type { ProductCategory } from "@/types"
import { revalidatePath } from "next/cache"

// GET /api/products - 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    const products = await getProducts(
      category
        ? { category: category as ProductCategory }
        : undefined
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
    const product = await createProduct(validatedData)

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
          details: error.issues,
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
