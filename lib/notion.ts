import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { Product, ProductCategory } from "@/types"
import { getNotionConfig } from "./env"

// 싱글톤 패턴으로 Notion 클라이언트 관리
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    const { apiKey } = getNotionConfig()
    notionClient = new Client({ auth: apiKey })
  }
  return notionClient
}

// Notion 페이지에서 Product 타입으로 변환
 
export function parseProductFromNotionPage(page: PageObjectResponse): Product {
  const properties = page.properties as Record<string, any>

  return {
    id: page.id,
    name: getPropertyValue(properties.name) ?? "제목 없음",
    category: (getPropertyValue(properties.category) ?? "기타") as ProductCategory,
    price: parseInt(getPropertyValue(properties.price) ?? "0") || 0,
    stock: parseInt(getPropertyValue(properties.stock) ?? "0") || 0,
    description: getPropertyValue(properties.description) ?? undefined,
    imageUrl: getPropertyValue(properties.imageUrl) ?? undefined,
    releaseDate: getPropertyValue(properties.releaseDate) ?? undefined,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    notionUrl: page.url,
  }
}

// Notion 속성 값 추출 헬퍼
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPropertyValue(property: any): string | undefined {
  if (!property) return undefined

  switch (property.type) {
    case "title":
      return property.title[0]?.plain_text || undefined
    case "rich_text":
      return property.rich_text[0]?.plain_text || undefined
    case "number":
      return property.number?.toString() || undefined
    case "select":
      return property.select?.name || undefined
    case "date":
      return property.date?.start || undefined
    case "url":
      return property.url || undefined
    default:
      return undefined
  }
}

// Notion DB에서 모든 상품 조회
export async function getProducts(
  filters?: { category?: ProductCategory }
): Promise<Product[]> {
  const client = getNotionClient()
  const { databaseId } = getNotionConfig()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (client.databases as any).query({
      database_id: databaseId,
      filter: filters?.category
        ? {
            property: "category",
            select: {
              equals: filters.category,
            },
          }
        : undefined,
    })

    return (response.results as PageObjectResponse[])
      .map(parseProductFromNotionPage)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Failed to fetch products from Notion:", error)
    throw new Error("상품 목록을 가져올 수 없습니다")
  }
}

// 단일 상품 조회
export async function getProductById(productId: string): Promise<Product | null> {
  const client = getNotionClient()

  try {
    const page = (await client.pages.retrieve({
      page_id: productId,
    })) as PageObjectResponse

    return parseProductFromNotionPage(page)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
}

// 새 상품 생성
 
export async function createProduct(data: {
  name: string
  category: ProductCategory
  price: number
  stock?: number
  description?: string
  imageUrl?: string
  releaseDate?: string
}): Promise<Product> {
  const client = getNotionClient()
  const { databaseId } = getNotionConfig()

  try {
    const page = (await client.pages.create({
      parent: { database_id: databaseId },
      properties: {
        name: {
          title: [{ text: { content: data.name } }],
        },
        category: {
          select: { name: data.category },
        },
        price: {
          number: data.price,
        },
        stock: {
          number: data.stock || 0,
        },
        description: {
          rich_text: data.description
            ? [{ text: { content: data.description } }]
            : [],
        },
        imageUrl: {
          url: data.imageUrl || null,
        },
        releaseDate: {
          date: data.releaseDate
            ? { start: data.releaseDate }
            : null,
        },
      },
    })) as PageObjectResponse

    return parseProductFromNotionPage(page)
  } catch (error) {
    console.error("Failed to create product:", error)
    throw new Error("상품 생성에 실패했습니다")
  }
}

// 상품 업데이트 (선택적)
 
export async function updateProduct(
  productId: string,
  data: Partial<{
    name: string
    category: ProductCategory
    price: number
    stock: number
    description: string
    imageUrl: string
    releaseDate: string
  }>
): Promise<Product> {
  const client = getNotionClient()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {}

    if (data.name) {
      properties.name = {
        title: [{ text: { content: data.name } }],
      }
    }
    if (data.category) {
      properties.category = {
        select: { name: data.category },
      }
    }
    if (data.price !== undefined) {
      properties.price = { number: data.price }
    }
    if (data.stock !== undefined) {
      properties.stock = { number: data.stock }
    }
    if (data.description !== undefined) {
      properties.description = {
        rich_text: data.description
          ? [{ text: { content: data.description } }]
          : [],
      }
    }
    if (data.imageUrl !== undefined) {
      properties.imageUrl = { url: data.imageUrl || null }
    }
    if (data.releaseDate !== undefined) {
      properties.releaseDate = {
        date: data.releaseDate ? { start: data.releaseDate } : null,
      }
    }

    const page = (await client.pages.update({
      page_id: productId,
      properties,
    })) as PageObjectResponse

    return parseProductFromNotionPage(page)
  } catch (error) {
    console.error("Failed to update product:", error)
    throw new Error("상품 업데이트에 실패했습니다")
  }
}
