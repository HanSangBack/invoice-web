import type { ProductCategory, SiteConfig } from "@/types"

export const SITE_CONFIG: SiteConfig = {
  name: "상품 관리 어드민",
  description: "Notion을 CMS로 활용하여 상품 정보를 관리하는 어드민 시스템",
  url: "https://example.com",
  nav: [
    { label: "Home", href: "/" },
    { label: "대시보드", href: "/dashboard" },
  ],
  footerLinks: [
    {
      title: "Links",
      items: [
        { label: "Documentation", href: "#docs" },
        { label: "Support", href: "#support" },
      ],
    },
  ],
}

export const PRODUCT_CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: "전자제품", value: "전자제품" },
  { label: "의류", value: "의류" },
  { label: "기타", value: "기타" },
]

// 페이지네이션
export const ITEMS_PER_PAGE = 10

// 정렬 옵션
export const DEFAULT_SORT = "latest"

export const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "가격 낮은순", value: "price_asc" },
  { label: "가격 높은순", value: "price_desc" },
] as const
