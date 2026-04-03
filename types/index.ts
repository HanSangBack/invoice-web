import type { LucideIcon } from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon?: LucideIcon
  external?: boolean
  badge?: string
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  nav: NavItem[]
  footerLinks: {
    title: string
    items: NavItem[]
  }[]
}

export type TechStackItem = {
  name: string
  version: string
  description: string
  href: string
  badgeLabel?: string
}

// Product Types
export type ProductCategory = "전자제품" | "의류" | "기타"

export type Product = {
  id: string // Notion page ID
  name: string
  category: ProductCategory
  price: number
  stock: number
  description?: string
  imageUrl?: string
  releaseDate?: string
  createdAt: string
  updatedAt: string
  notionUrl?: string
}

export type ProductFormValues = {
  name: string
  category: ProductCategory
  price: number
  stock?: number
  description?: string
  imageUrl?: string
  releaseDate?: string
}
