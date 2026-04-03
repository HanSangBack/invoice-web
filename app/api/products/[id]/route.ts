import { NextRequest, NextResponse } from "next/server"
import { getProductById } from "@/lib/notion"

// GET /api/products/[id] - 상품 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "상품을 찾을 수 없습니다",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("GET /api/products/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "상품 조회 중 오류가 발생했습니다",
      },
      { status: 500 }
    )
  }
}
