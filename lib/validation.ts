import { z } from "zod"

// 상품 폼 검증 스키마
export const productFormSchema = z.object({
  name: z.string().min(1, "상품명은 필수입니다").max(100),
  category: z.enum(["전자제품", "의류", "기타"]),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z.number().min(0, "재고는 0 이상이어야 합니다").optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  releaseDate: z.string().optional(),
})

// 폼 입력값 타입 (Zod에서 자동 생성)
export type ProductFormInput = z.infer<typeof productFormSchema>
