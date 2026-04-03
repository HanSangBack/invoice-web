# 상품 등록 & 관리 어드민 - ROADMAP

**프로젝트명**: 상품 등록 & 관리 어드민 (Product Registration & Management Admin)  
**버전**: 1.0 (MVP)  
**작성일**: 2026-04-03  
**총 예상 기간**: 4주 (Phase 1~4)

---

## 개발 전략

### 구조 우선 접근법 (Structure-First Approach)
1. **Phase 1: 애플리케이션 골격 구축** - 의존성 최소화
   - 전체 라우트 구조 및 빈 페이지 생성
   - 공통 레이아웃 및 타입 정의
   - API Route 골격 및 Notion 헬퍼 구현
   - 다른 팀이 대기하지 않도록 인터페이스 확정

2. **Phase 2: UI/UX 완성** - 더미 데이터 활용
   - 모든 페이지 UI 완성 (하드코딩된 데이터)
   - 반응형 디자인 및 접근성 적용
   - 클라이언트 검증 및 폼 상호작용 구현
   - 전체 앱 플로우 체험 가능

3. **Phase 3: 핵심 기능 구현** - 실제 API 연동
   - Notion API 통합 (CRUD 중 CR)
   - API Route 구현 (재시도 로직, 에러 처리)
   - 더미 데이터를 실제 API로 교체
   - E2E 테스트 (Playwright MCP)

4. **Phase 4: 고급 기능 & 최적화** - 품질 보증
   - 이미지 최적화 (lazy loading, srcset)
   - 성능 최적화 (번들 분석, ISR)
   - 접근성 및 SEO 개선
   - 배포 파이프라인 구축

### 병렬 개발 가능
- **UI팀**: Phase 2에서 더미 데이터로 작업
- **API팀**: Phase 1 완료 후 Phase 3에서 API 구현
- **QA팀**: Phase 2 후 테스트 시작

---

## Phase 1: 애플리케이션 골격 구축 (1주)

**목표**: 전체 라우트 구조, 타입 정의, API 인터페이스 확정

### Task 1.1: 프로젝트 디렉토리 구조 및 라우트 생성
**난이도**: 낮음 | **예상 기간**: 2-3시간 | **의존성**: 없음

**설명**: 
Next.js 16 App Router를 활용하여 전체 프로젝트 구조를 생성합니다. 
라우트 그룹과 동적 라우팅을 설정하고, 모든 페이지에 기본 껍데기를 구현합니다.

**구현 사항**:
- [ ] 라우트 구조 생성
  ```
  app/
  ├── layout.tsx (루트 레이아웃)
  ├── page.tsx (홈페이지)
  ├── error.tsx (에러 바운더리)
  ├── loading.tsx (Suspense 폴백)
  ├── not-found.tsx (404 페이지)
  └── (dashboard)/
      ├── layout.tsx (대시보드 레이아웃)
      └── products/
          ├── layout.tsx
          ├── page.tsx (상품 목록)
          ├── new/
          │   └── page.tsx (상품 추가 폼)
          └── [id]/
              └── page.tsx (상품 상세)
  ```

- [ ] 각 페이지에 기본 Server Component 작성 (메타데이터 포함)
- [ ] `app/api/products/route.ts` - POST, GET 핸들러 껍데기
- [ ] `app/api/products/[id]/route.ts` - GET 핸들러 껍데기
- [ ] `next.config.ts` 검토 (보안 헤더, 이미지 설정)
- [ ] TypeScript 타입 안전성 확인 (`npx tsc --noEmit`)

**테스트**:
```bash
npm run dev
# 페이지 접근 가능 확인
# - http://localhost:3000/
# - http://localhost:3000/products
# - http://localhost:3000/products/new
# - http://localhost:3000/products/test-id
```

---

### Task 1.2: 타입 정의 및 상수 작성
**난이도**: 낮음 | **예상 기간**: 2-3시간 | **의존성**: Task 1.1

**설명**:
TypeScript 타입과 상수를 정의하여 프로젝트 전체에서 일관된 인터페이스를 사용합니다.
이를 통해 타입 안전성을 확보하고 개발 속도를 높입니다.

**구현 사항**:
- [ ] `types/index.ts` 작성
  ```typescript
  export type Product = {
    id: string
    name: string
    category: ProductCategory
    price: number
    stock?: number
    description?: string
    imageUrl?: string
    releaseDate?: Date
    createdAt: Date
    modifiedAt: Date
    notionPageId: string
  }
  
  export type ProductCategory = "전자제품" | "의류" | "기타"
  export type ProductFormData = Omit<Product, "id" | "createdAt" | "modifiedAt" | "notionPageId">
  export type ApiResponse<T> = { success: boolean; data?: T; error?: string; details?: Record<string, any> }
  ```

- [ ] `lib/constants.ts` 작성
  ```typescript
  export const PRODUCT_CATEGORIES = ["전자제품", "의류", "기타"] as const
  export const ITEMS_PER_PAGE = 10
  export const DEFAULT_SORT = "latest"
  export const SORT_OPTIONS = ["latest", "price_asc", "price_desc"] as const
  ```

- [ ] `lib/validation.ts` 작성 (Zod 스키마)
  ```typescript
  export const productSchema = z.object({
    name: z.string().min(1).max(100),
    category: z.enum(["전자제품", "의류", "기타"]),
    price: z.number().min(0).max(9999999),
    stock: z.number().min(0).optional(),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
    releaseDate: z.date().optional(),
  })
  ```

- [ ] 모든 타입 임포트 및 사용 가능 확인
- [ ] ESLint 통과 확인

**테스트**:
```bash
npx tsc --noEmit  # 타입 체크
npx eslint lib/ types/  # 린트
```

---

### Task 1.3: Notion API 헬퍼 구현
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 1.2

**설명**:
Notion API 클라이언트를 초기화하고, 기본 쿼리/생성 함수를 구현합니다.
재시도 로직과 에러 처리는 Phase 3에서 완성합니다.

**구현 사항**:
- [ ] `lib/notion-api.ts` 작성
  ```typescript
  import { Client } from "@notionhq/client"
  
  let notionClient: Client | null = null
  
  export function initNotionClient(): Client {
    if (!notionClient) {
      notionClient = new Client({
        auth: process.env.NOTION_API_KEY,
      })
    }
    return notionClient
  }
  
  export async function queryProducts(filters?: any) {
    // Phase 3에서 구현
    return [] as Product[]
  }
  
  export async function getProduct(id: string) {
    // Phase 3에서 구현
    return null as Product | null
  }
  
  export async function createProduct(data: ProductFormData) {
    // Phase 3에서 구현
    return { id: "", notionPageId: "" }
  }
  ```

- [ ] 환경 변수 설정
  ```
  .env.local:
  NOTION_API_KEY=ntn_xxxxxxxxxxxxx
  NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx
  ```

- [ ] Notion API 클라이언트 초기화 테스트 (콘솔 로그로 확인)
- [ ] 타입 안전성 확인 (`npx tsc --noEmit`)

**참고**:
- Notion API 문서: https://developers.notion.com/reference/intro

---

### Task 1.4: API Route 인터페이스 정의
**난이도**: 중간 | **예상 기간**: 2-3시간 | **의존성**: Task 1.2, Task 1.3

**설명**:
API Route의 요청/응답 인터페이스를 정의하고, 기본 에러 처리 구조를 설정합니다.
실제 로직은 Phase 3에서 구현합니다.

**구현 사항**:
- [ ] `app/api/products/route.ts` 작성
  ```typescript
  export async function POST(req: Request) {
    // Phase 3에서 구현
    return NextResponse.json({ success: false }, { status: 501 })
  }
  
  export async function GET(req: Request) {
    // Phase 3에서 구현
    return NextResponse.json({ success: false }, { status: 501 })
  }
  ```

- [ ] `app/api/products/[id]/route.ts` 작성
  ```typescript
  export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    // Phase 3에서 구현
    return NextResponse.json({ success: false }, { status: 501 })
  }
  ```

- [ ] 에러 응답 형식 확인 (400, 404, 500 등)
- [ ] NextResponse 임포트 및 기본 구조 확인

**테스트**:
```bash
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{}'
# { "success": false } 응답 확인
```

---

### Task 1.5: 공통 컴포넌트 및 레이아웃 골격
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 1.1

**설명**:
루트 레이아웃, 대시보드 레이아웃, 공통 헤더/푸터를 구현합니다.
Theme Provider와 기본 스타일을 설정합니다.

**구현 사항**:
- [ ] `app/layout.tsx` 업데이트
  ```typescript
  import { ThemeProvider } from "@/components/theme-provider"
  import { Header } from "@/components/layout/header"
  import { Footer } from "@/components/layout/footer"
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    )
  }
  ```

- [ ] `app/(dashboard)/layout.tsx` 작성
  - 대시보드 레이아웃 (sidebar + main content)
  - 반응형 네비게이션

- [ ] `components/layout/header.tsx` 업데이트
  - 로고, 네비게이션 링크 (Home, Products, Add)
  - 테마 토글 버튼

- [ ] `components/layout/footer.tsx` 업데이트
  - 저작권, 링크 (Github, 문서 등)

- [ ] `components/layout/mobile-sidebar.tsx` 작성
  - 모바일 네비게이션 (Sheet 컴포넌트)

- [ ] `components/theme-provider.tsx` 확인 (next-themes 설정)
- [ ] `globals.css` 확인 (Tailwind v4 설정)
- [ ] 모바일/데스크톱 반응형 확인

**테스트**:
```bash
npm run dev
# 홈페이지, Products, Add 페이지 헤더/푸터 표시 확인
# 모바일 뷰에서 모바일 사이드바 표시 확인
```

---

## Phase 2: UI/UX 완성 (1주)

**목표**: 모든 페이지 UI 완성 (더미 데이터 활용), 반응형 디자인, 클라이언트 상호작용

### Task 2.1: 홈페이지 UI 구현
**난이도**: 중간 | **예상 기간**: 2-3시간 | **의존성**: Task 1.5

**설명**:
홈페이지에 Hero 섹션, CTA 버튼, 최근 상품 미리보기를 구현합니다.
더미 데이터를 사용하여 전체 레이아웃을 확인합니다.

**구현 사항**:
- [ ] `app/page.tsx` 작성
  ```typescript
  export const metadata: Metadata = {
    title: "상품 등록 & 관리 어드민",
    description: "Notion을 CMS로 활용한 간단한 상품 관리",
  }
  
  export default function HomePage() {
    return (
      <div>
        <HeroSection />
        <CTASection />
        <RecentProductsSection products={dummyProducts} />
      </div>
    )
  }
  ```

- [ ] `components/home/hero-section.tsx` 작성
  - 제목: "상품 등록 & 관리 어드민"
  - 부제: "Notion을 CMS로 활용한 간단한 상품 관리"
  - 배경 (그라데이션 또는 이미지)
  - Tailwind로 스타일링

- [ ] `components/home/cta-section.tsx` 작성
  - "[+ 상품 추가하기]" 버튼
  - "[상품 목록보기]" 버튼
  - 링크: `/products/new`, `/products`

- [ ] `components/home/recent-products-section.tsx` 작성
  - 최근 3개 상품 카드
  - 더미 데이터 사용
  - shadcn/ui Card 컴포넌트 활용

- [ ] `app/page.tsx`에서 메타데이터 설정 (title, description, OG)
- [ ] 반응형 디자인 확인 (모바일/데스크톱)
- [ ] 접근성 확인 (시맨틱 HTML, alt 텍스트)

**더미 데이터**:
```typescript
const dummyProducts: Product[] = [
  {
    id: "1",
    name: "무선 이어폰",
    category: "전자제품",
    price: 29900,
    stock: 50,
    imageUrl: "https://via.placeholder.com/300x300?text=Wireless+Earphone",
    createdAt: new Date(),
    modifiedAt: new Date(),
    notionPageId: "abc123",
  },
  // ... 2개 추가
]
```

---

### Task 2.2: 상품 추가 폼 페이지 UI
**난이도**: 높음 | **예상 기간**: 4-5시간 | **의존성**: Task 1.5, Task 1.2

**설명**:
react-hook-form과 Zod를 활용한 상품 추가 폼을 구현합니다.
클라이언트 검증, 실시간 에러 표시, 로딩 상태를 구현합니다.

**구현 사항**:
- [ ] `app/(dashboard)/products/new/page.tsx` 작성
  ```typescript
  export const metadata: Metadata = {
    title: "상품 추가",
    description: "새로운 상품을 추가합니다",
  }
  
  export default function NewProductPage() {
    return (
      <div className="container max-w-2xl">
        <h1>상품 추가</h1>
        <ProductForm />
      </div>
    )
  }
  ```

- [ ] `components/products/_components/product-form.tsx` 작성
  ```typescript
  "use client"
  import { useForm } from "react-hook-form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { productSchema } from "@/lib/validation"
  
  export function ProductForm() {
    const form = useForm({
      resolver: zodResolver(productSchema),
      mode: "onBlur",
    })
    
    async function onSubmit(data: ProductInput) {
      // Phase 3에서 실제 API 호출
      console.log("Form submitted:", data)
    }
    
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 각 필드 렌더링 */}
        <button type="submit">저장</button>
        <button type="reset">취소</button>
      </form>
    )
  }
  ```

- [ ] 폼 필드 구현
  - 상품명 (text input)
  - 카테고리 (select)
  - 가격 (number input)
  - 재고 (number input)
  - 설명 (textarea)
  - 이미지 URL (text input)
  - 출시일 (date input)

- [ ] 각 필드에 대한 에러 메시지 표시
  - 필드 하이라이트 (빨간 테두리)
  - 에러 메시지 (빨간 텍스트)

- [ ] 저장 버튼 로딩 상태 (disabled, spinner)
- [ ] 성공/실패 토스트 (sonner) 준비 (Phase 3에서 활성화)
- [ ] 취소 버튼 (폼 초기화 또는 뒤로가기)
- [ ] 반응형 디자인 (모바일: 1열, 데스크톱: 2열 가능)
- [ ] 접근성 확인 (label, aria-describedby 등)

**테스트**:
```bash
npm run dev
# /products/new 접근
# 각 필드 입력 후 blur → 검증 메시지 확인
# 필수 필드 비운 상태로 저장 → 에러 표시 확인
# 모바일 뷰에서 터치 친화적 확인
```

---

### Task 2.3: 상품 목록 페이지 UI
**난이도**: 높음 | **예상 기간**: 5-6시간 | **의존성**: Task 1.5, Task 2.2 (검증 스키마)

**설명**:
상품 목록 페이지를 구현합니다. 필터, 정렬, 검색, 페이지네이션을 포함합니다.
더미 데이터를 사용하여 UI를 완성합니다. 클라이언트 사이드 처리를 구현합니다.

**구현 사항**:
- [ ] `app/(dashboard)/products/page.tsx` 작성 (Server Component)
  ```typescript
  export const metadata: Metadata = {
    title: "상품 목록",
    description: "등록된 모든 상품을 조회합니다",
  }
  export const revalidate = 60 // ISR: 60초
  
  export default async function ProductsPage() {
    // Phase 3에서 실제 API 호출
    const products = getDummyProducts()
    return <ProductListClient initialProducts={products} />
  }
  ```

- [ ] `components/products/_components/product-list.tsx` 작성 (Client Component)
  ```typescript
  "use client"
  export function ProductList({ initialProducts }: Props) {
    const [products, setProducts] = useState(initialProducts)
    const [category, setCategory] = useState<string | null>(null)
    const [sort, setSort] = useState("latest")
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    
    // 클라이언트 사이드 필터/정렬
    const filtered = useMemo(() => {
      return applyFilters(products, { category, sort, searchTerm })
    }, [products, category, sort, searchTerm])
    
    return (
      <div>
        <ProductFilter {...} />
        <ProductGrid products={paginated} />
        <Pagination {...} />
      </div>
    )
  }
  ```

- [ ] `components/products/_components/product-filter.tsx` 작성
  - 카테고리 선택 (Dropdown)
  - 정렬 옵션 (Select: 최신순, 가격 오름, 가격 내림)
  - 검색 필드 (Text input)
  - 각 변경 시 부모 상태 업데이트

- [ ] `components/products/_components/product-card.tsx` 작성
  - 상품 이미지 (placeholder 또는 dummy image)
  - 상품명, 카테고리, 가격
  - 재고 (옵션)
  - "상세보기" 링크 → `/products/[id]`
  - 카드 스타일 (그림자, hover 효과)

- [ ] `components/products/_components/product-grid.tsx` 작성
  - ProductCard 목록 렌더링
  - 반응형 그리드 (모바일: 1열, 태블릿: 2열, 데스크톱: 3~4열)
  - 빈 상태 메시지

- [ ] `components/ui/pagination.tsx` 작성 (shadcn/ui 또는 직접 구현)
  - 이전/다음 버튼
  - 페이지 번호 표시
  - 10개 항목/페이지

- [ ] 필터/정렬 적용 시 클라이언트 사이드 처리 (즉시 반응)
- [ ] 더미 데이터 20개 이상 생성 (페이지네이션 확인)
- [ ] 반응형 디자인 확인
- [ ] 접근성 확인

**더미 데이터**:
```typescript
function getDummyProducts(): Product[] {
  return Array.from({ length: 25 }, (_, i) => ({
    id: String(i + 1),
    name: `상품 ${i + 1}`,
    category: ["전자제품", "의류", "기타"][i % 3] as ProductCategory,
    price: 10000 + (i * 5000),
    stock: Math.floor(Math.random() * 100),
    imageUrl: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000),
    modifiedAt: new Date(Date.now() - i * 43200000),
    notionPageId: `notion_${i}`,
  }))
}
```

**테스트**:
```bash
npm run dev
# /products 접근
# 필터(카테고리) 선택 → 목록 업데이트 확인 (클라이언트 사이드)
# 정렬 변경 → 목록 정렬 확인
# 검색 → 상품명 필터 확인
# 페이지 번호 클릭 → 페이지 변경 확인
# 모바일 뷰에서 반응형 확인
```

---

### Task 2.4: 상품 상세 페이지 UI
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 1.5, Task 2.3

**설명**:
동적 라우팅을 활용한 상품 상세 페이지를 구현합니다.
반응형 레이아웃, OG 메타 태그, 공유 기능을 포함합니다.

**구현 사항**:
- [ ] `app/(dashboard)/products/[id]/page.tsx` 작성
  ```typescript
  export async function generateMetadata({ params }): Promise<Metadata> {
    // Phase 3에서 실제 API 호출
    const product = getDummyProduct(params.id)
    if (!product) return { title: "상품 없음" }
    
    return {
      title: product.name,
      description: product.description || `${product.price}원`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.imageUrl || "/placeholder.jpg" }],
      },
    }
  }
  
  export default async function ProductDetailPage({ params }: Props) {
    const product = getDummyProduct(params.id)
    if (!product) notFound()
    return <ProductDetail product={product} />
  }
  ```

- [ ] `components/products/_components/product-detail.tsx` 작성
  ```typescript
  export function ProductDetail({ product }: Props) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        {/* 좌측: 이미지 */}
        <ProductImage product={product} />
        
        {/* 우측: 정보 */}
        <div>
          <h1>{product.name}</h1>
          <p className="text-gray-600">{product.category}</p>
          <p className="text-2xl font-bold">{product.price.toLocaleString()}원</p>
          <p>재고: {product.stock || 0}개</p>
          <p className="text-gray-500">{product.description}</p>
          <ProductActions product={product} />
        </div>
      </div>
    )
  }
  ```

- [ ] `components/products/_components/product-image.tsx` 작성
  - Next.js Image 컴포넌트 사용 (lazy loading)
  - 대체 텍스트 (alt)
  - 반응형 크기 (width, height 동적)

- [ ] `components/products/_components/product-actions.tsx` 작성
  - "Notion에서 편집" 링크 (Phase 3에서 실제 URL)
  - "공유" 버튼 (Web Share API 또는 복사)
  - "목록으로 돌아가기" 링크

- [ ] `app/(dashboard)/products/[id]/not-found.tsx` 작성
  - 상품이 없을 때 표시

- [ ] 반응형 레이아웃 (모바일: 1열, 데스크톱: 2열)
- [ ] 더미 데이터로 여러 상품 확인
- [ ] OG 메타 태그 확인 (Share Debugger)
- [ ] 접근성 확인

**테스트**:
```bash
npm run dev
# /products/1 접근
# 상품 이미지, 정보 표시 확인
# Notion 링크 및 공유 버튼 확인
# /products/invalid-id 접근 → not-found 페이지 확인
# 모바일 뷰에서 반응형 확인
```

---

### Task 2.5: 모바일 반응형 디자인 및 접근성
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 2.1~2.4

**설명**:
모든 페이지를 모바일 우선 설계로 최적화합니다.
터치 친화적 UI, 충분한 색상 대비, 키보드 네비게이션을 구현합니다.

**구현 사항**:
- [ ] 모바일 뷰 확인 및 최적화
  - 모든 화면 320px 이상 지원
  - 텍스트 크기 최소 16px
  - 터치 영역 최소 48x48px

- [ ] 개선 사항
  - 메뉴 버튼 (모바일 사이드바 열기)
  - 폼 필드 패딩 증가 (터치 입력 용이)
  - 이미지 크기 조정 (모바일에서 너무 크지 않게)
  - 글꼴 크기 반응형 (sm, md, lg)

- [ ] 접근성 개선 (WCAG 2.1 AA)
  - 모든 이미지에 alt 텍스트
  - 색상 대비 확인 (텍스트: 4.5:1, UI: 3:1)
  - 키보드 네비게이션 (Tab, Enter, Escape)
  - 포커스 아웃라인 명확히
  - ARIA 라벨 추가 (aria-label, aria-describedby)
  - 시맨틱 HTML 사용 (button, form, heading 등)

- [ ] 스크린 리더 테스트 (옵션)
  - 폼 필드 라벨 연결
  - 에러 메시지 아너운스
  - 버튼 목적 명확히

- [ ] 모든 페이지에 대해 Lighthouse 접근성 점수 확인 (90+ 목표)

**테스트 체크리스트**:
- [ ] 모바일 (320px, 480px), 태블릿 (768px), 데스크톱 (1200px)에서 UI 확인
- [ ] 터치 테스트 (버튼, 링크 각각 48px 이상)
- [ ] 키보드 네비게이션 (Tab으로 모든 요소 접근 가능)
- [ ] 색상 대비 테스트 (Lighthouse 또는 WebAIM Contrast Checker)
- [ ] 스크린 리더 테스트 (nvda, jaws, voiceover)

---

## Phase 3: 핵심 기능 구현 (1.5주)

**목표**: Notion API 통합, 실제 데이터 연동, E2E 테스트

### Task 3.1: Notion API 통합 (쿼리 & 생성)
**난이도**: 높음 | **예상 기간**: 4-5시간 | **의존성**: Task 1.3, Task 1.2

**설명**:
Notion API를 통해 상품 데이터를 조회하고 생성합니다.
데이터 매핑, 타입 변환, 기본 에러 처리를 구현합니다.

**구현 사항**:
- [ ] `lib/notion-api.ts` 완성
  ```typescript
  export async function queryProducts(
    filters?: {
      category?: string
      limit?: number
      offset?: number
    }
  ): Promise<Product[]> {
    const notion = initNotionClient()
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: filters?.category ? {
        property: "Category",
        multi_select: { contains: filters.category }
      } : undefined,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      page_size: filters?.limit || 100,
      start_cursor: filters?.offset ? encodeURIComponent(String(filters.offset)) : undefined,
    })
    
    return response.results.map(page => notionPageToProduct(page))
  }
  
  export async function getProduct(id: string): Promise<Product | null> {
    const notion = initNotionClient()
    try {
      const page = await notion.pages.retrieve({ page_id: id })
      return notionPageToProduct(page as NotionPage)
    } catch (error) {
      if (error instanceof APIResponseError && error.status === 404) {
        return null
      }
      throw error
    }
  }
  
  export async function createProduct(data: ProductFormData): Promise<CreateProductResponse> {
    const notion = initNotionClient()
    const page = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: productToNotionProperties(data),
    })
    
    return {
      id: page.id.replace(/-/g, ""),
      notionPageId: page.id,
    }
  }
  
  // 헬퍼 함수
  function notionPageToProduct(page: NotionPage): Product {
    const props = page.properties
    return {
      id: page.id.replace(/-/g, ""),
      notionPageId: page.id,
      name: getTextProperty(props.Name),
      category: getSelectProperty(props.Category) as ProductCategory,
      price: getNumberProperty(props.Price),
      stock: getNumberProperty(props.Stock),
      description: getTextProperty(props.Description),
      imageUrl: getTextProperty(props["Image URL"]),
      releaseDate: getDateProperty(props["Release Date"]),
      createdAt: new Date(page.created_time),
      modifiedAt: new Date(page.last_edited_time),
    }
  }
  
  function productToNotionProperties(data: ProductFormData): Record<string, any> {
    return {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      Category: {
        multi_select: [{ name: data.category }],
      },
      Price: { number: data.price },
      Stock: { number: data.stock || 0 },
      Description: {
        rich_text: [{ text: { content: data.description || "" } }],
      },
      "Image URL": {
        rich_text: [{ text: { content: data.imageUrl || "" } }],
      },
      "Release Date": data.releaseDate
        ? { date: { start: data.releaseDate.toISOString().split("T")[0] } }
        : { date: null },
    }
  }
  ```

- [ ] Notion Database 스키마 검증
  - 컬럼 이름이 정확한지 확인
  - 각 컬럼 타입이 올바른지 확인 (Title, Multi-select, Number 등)

- [ ] 타입 안전성 확인 (`npx tsc --noEmit`)
- [ ] 개별 함수 테스트 (콘솔 로그로 데이터 확인)

**테스트**:
```typescript
// Node.js REPL에서 테스트
import { queryProducts, getProduct, createProduct } from "@/lib/notion-api"

const products = await queryProducts()
console.log(products)

const product = await getProduct("product-id")
console.log(product)
```

---

### Task 3.2: POST /api/products 구현 (상품 생성)
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 3.1, Task 1.2

**설명**:
상품 생성 API를 완성합니다. 검증, 재시도 로직, 에러 처리를 포함합니다.

**구현 사항**:
- [ ] `app/api/products/route.ts` POST 메소드 구현
  ```typescript
  export async function POST(req: Request) {
    try {
      // 1. 요청 파싱
      const body = await req.json()
      
      // 2. 검증
      const validated = productSchema.parse(body)
      
      // 3. Notion API 호출 (재시도 로직)
      const result = await retry(
        () => createProduct(validated),
        {
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 10000,
          randomizationFactor: 0.1,
        }
      )
      
      // 4. 캐시 무효화 (revalidateTag)
      revalidateTag("products")
      
      // 5. 응답
      return NextResponse.json(
        {
          success: true,
          productId: result.id,
          notionPageId: result.notionPageId,
          message: "상품이 저장되었습니다",
        },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: "VALIDATION_ERROR",
            details: error.errors.map(e => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        )
      }
      
      if (error instanceof APIResponseError) {
        if (error.status === 429) {
          return NextResponse.json(
            {
              success: false,
              error: "NOTION_RATE_LIMIT",
              message: "요청이 많습니다. 잠시 후 다시 시도하세요.",
            },
            { status: 429 }
          )
        }
        
        if (error.status === 401) {
          return NextResponse.json(
            {
              success: false,
              error: "NOTION_AUTH_ERROR",
              message: "Notion API 인증 실패",
            },
            { status: 401 }
          )
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          error: "INTERNAL_ERROR",
          message: "내부 서버 오류가 발생했습니다",
        },
        { status: 500 }
      )
    }
  }
  ```

- [ ] 재시도 로직 구현 (Exponential Backoff)
  - 최대 3회 재시도
  - 초기 대기: 1초, 배수: 2
  - 최대 대기: 10초

- [ ] 캐시 무효화 (revalidateTag 사용)
- [ ] 에러 응답 포맷 확인
- [ ] API 레이트 제한 처리 (429)
- [ ] 입력 검증 에러 처리 (400)

**테스트**:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 상품",
    "category": "전자제품",
    "price": 10000
  }'

# 응답 확인:
# { "success": true, "productId": "...", "notionPageId": "..." }

# Notion DB에서 상품 생성 확인
```

---

### Task 3.3: GET /api/products 구현 (목록 조회)
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 3.1, Task 1.2

**설명**:
상품 목록 조회 API를 완성합니다. 필터링, 정렬, 페이지네이션을 구현합니다.

**구현 사항**:
- [ ] `app/api/products/route.ts` GET 메소드 구현
  ```typescript
  export async function GET(req: Request) {
    try {
      const url = new URL(req.url)
      const category = url.searchParams.get("category") || undefined
      const sort = url.searchParams.get("sort") || "latest"
      const limit = parseInt(url.searchParams.get("limit") || "10")
      const offset = parseInt(url.searchParams.get("offset") || "0")
      
      // Notion API 호출
      const products = await queryProducts({
        category: category as ProductCategory | undefined,
        limit: Math.min(limit, 100), // 최대 100개
        offset: offset,
      })
      
      // 클라이언트 사이드 정렬 (필요시)
      // Phase 2에서 클라이언트 사이드로 처리했으므로 여기서는 생략 가능
      
      return NextResponse.json(
        {
          success: true,
          products,
          total: products.length,
          hasMore: products.length >= limit,
        },
        {
          headers: { "cache-control": "public, max-age=60" }, // 60초 캐시
        }
      )
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "INTERNAL_ERROR",
          message: "목록 조회 실패",
        },
        { status: 500 }
      )
    }
  }
  ```

- [ ] 쿼리 파라미터 파싱 및 검증
- [ ] 캐싱 헤더 설정 (Cache-Control)
- [ ] 에러 처리

**테스트**:
```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products?category=전자제품
curl http://localhost:3000/api/products?limit=20&offset=0
```

---

### Task 3.4: GET /api/products/[id] 구현 (상세 조회)
**난이도**: 낮음 | **예상 기간**: 1-2시간 | **의존성**: Task 3.1

**설명**:
상품 상세 조회 API를 완성합니다.

**구현 사항**:
- [ ] `app/api/products/[id]/route.ts` GET 메소드 구현
  ```typescript
  export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const product = await getProduct(params.id)
      
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: "PRODUCT_NOT_FOUND",
            message: "상품을 찾을 수 없습니다",
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        {
          success: true,
          product,
        },
        {
          headers: { "cache-control": "public, max-age=60" },
        }
      )
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "INTERNAL_ERROR",
        },
        { status: 500 }
      )
    }
  }
  ```

- [ ] 404 에러 처리
- [ ] 캐싱 헤더 설정

**테스트**:
```bash
curl http://localhost:3000/api/products/valid-id
curl http://localhost:3000/api/products/invalid-id
```

---

### Task 3.5: 클라이언트 폼 로직 (실제 API 호출)
**난이도**: 중간 | **예상 기간**: 2-3시간 | **의존성**: Task 3.2, Task 2.2

**설명**:
ProductForm 컴포넌트의 onSubmit 함수를 완성합니다.
실제 API 호출, 로딩 상태, 토스트, 캐시 무효화를 구현합니다.

**구현 사항**:
- [ ] `components/products/_components/product-form.tsx` 완성
  ```typescript
  "use client"
  import { useRouter } from "next/navigation"
  import { toast } from "sonner"
  
  export function ProductForm() {
    const router = useRouter()
    const form = useForm({
      resolver: zodResolver(productSchema),
      mode: "onBlur",
    })
    
    async function onSubmit(data: ProductInput) {
      try {
        form.setSubmitting(true)
        
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || "저장 실패")
        }
        
        const result = await res.json()
        
        // 성공 토스트
        toast.success("상품이 저장되었습니다", {
          description: result.message,
        })
        
        // 폼 초기화
        form.reset()
        
        // 목록 페이지로 이동 또는 상세 페이지로 이동
        router.push(`/products/${result.productId}`)
        // 또는
        // router.push("/products")
        // router.refresh() // ISR 캐시 무효화
      } catch (error) {
        toast.error("저장에 실패했습니다", {
          description: error instanceof Error ? error.message : "다시 시도하세요",
        })
      } finally {
        form.setSubmitting(false)
      }
    }
    
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 필드들 */}
        <button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>
    )
  }
  ```

- [ ] 로딩 상태 관리 (form.formState.isSubmitting)
- [ ] 에러 처리 및 토스트 표시
- [ ] 성공 시 라우터 이동
- [ ] 폼 초기화

**테스트**:
```bash
npm run dev
# /products/new 접근
# 폼 입력 및 저장
# Notion DB에서 상품 생성 확인
# 토스트 메시지 확인
# 상세 페이지로 이동 확인
```

---

### Task 3.6: 목록 페이지 실제 데이터 연동
**난이도**: 중간 | **예상 기간**: 2-3시간 | **의존성**: Task 3.3, Task 2.3

**설명**:
목록 페이지를 실제 Notion 데이터로 교체합니다.
ISR, 클라이언트 사이드 필터를 유지합니다.

**구현 사항**:
- [ ] `app/(dashboard)/products/page.tsx` 업데이트
  ```typescript
  import { Metadata } from "next"
  import { queryProducts } from "@/lib/notion-api"
  
  export const metadata: Metadata = {
    title: "상품 목록",
    description: "등록된 모든 상품을 조회합니다",
  }
  export const revalidate = 60 // ISR
  
  export default async function ProductsPage() {
    const products = await queryProducts({ limit: 100 })
    
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">상품 목록</h1>
        <ProductListClient initialProducts={products} />
      </div>
    )
  }
  ```

- [ ] `components/products/_components/product-list.tsx` 업데이트
  - initialProducts를 실제 데이터로 변경
  - 클라이언트 사이드 필터/정렬은 유지

- [ ] 상세 페이지도 실제 데이터 연동
  ```typescript
  // app/(dashboard)/products/[id]/page.tsx
  export const revalidate = 60
  
  export default async function ProductDetailPage({ params }: Props) {
    const product = await getProduct(params.id)
    if (!product) notFound()
    
    return (
      <div className="container py-8">
        <ProductDetail product={product} />
      </div>
    )
  }
  ```

- [ ] ISR 설정 확인 (revalidate: 60)
- [ ] 캐시 무효화 테스트 (새 상품 저장 후 목록 업데이트)

**테스트**:
```bash
npm run dev
# /products 접근 → 실제 Notion 데이터 표시
# 상품 저장 → 목록 자동 업데이트 확인
# /products/[id] 접근 → 실제 상품 상세 표시
```

---

### Task 3.7: Playwright E2E 테스트 (핵심 시나리오)
**난이도**: 높음 | **예상 기간**: 4-5시간 | **의존성**: Task 3.5, Task 3.6

**설명**:
Playwright MCP를 활용한 E2E 테스트를 작성합니다.
상품 추가 흐름, 목록 필터링, 상세 페이지 조회를 테스트합니다.

**구현 사항**:
- [ ] 테스트 시나리오 1: 상품 추가 흐름 (Happy Path)
  ```typescript
  // tests/e2e/product-add.spec.ts
  import { test, expect } from "@playwright/test"
  
  test("상품 추가 흐름 (Happy Path)", async ({ page }) => {
    // 1. 상품 추가 페이지 이동
    await page.goto("/products/new")
    
    // 2. 폼 필드 작성
    await page.fill('input[name="name"]', "테스트 상품")
    await page.selectOption('select[name="category"]', "전자제품")
    await page.fill('input[name="price"]', "29900")
    await page.fill('textarea[name="description"]', "테스트 설명")
    
    // 3. 저장 버튼 클릭
    await page.click('button[type="submit"]')
    
    // 4. 성공 토스트 확인
    await expect(page.locator("text=상품이 저장되었습니다")).toBeVisible()
    
    // 5. 상세 페이지로 이동 확인
    await expect(page).toHaveURL(/\/products\/[a-z0-9]+/)
    
    // 6. 상품 정보 확인
    await expect(page.locator("h1")).toContainText("테스트 상품")
    await expect(page.locator("text=29,900원")).toBeVisible()
  })
  ```

- [ ] 테스트 시나리오 2: 필터링
  ```typescript
  test("카테고리 필터링", async ({ page }) => {
    await page.goto("/products")
    
    // 전자제품 카테고리 선택
    await page.selectOption('select[name="category"]', "전자제품")
    
    // 목록 업데이트 확인
    const cards = page.locator('[data-testid="product-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    
    // 모든 카드가 전자제품 카테고리여야 함
    for (let i = 0; i < count; i++) {
      const category = await cards.nth(i).locator('[data-testid="category"]').textContent()
      expect(category).toContain("전자제품")
    }
  })
  ```

- [ ] 테스트 시나리오 3: 상세 페이지 로드
  ```typescript
  test("상세 페이지 로드", async ({ page }) => {
    // 1. 목록 페이지 이동
    await page.goto("/products")
    
    // 2. 첫 상품 클릭
    await page.locator('[data-testid="product-card"]').first().click()
    
    // 3. 상세 페이지 확인
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
    
    // 4. "목록으로" 버튼 클릭
    await page.click('button:has-text("목록으로")')
    
    // 5. 목록 페이지로 돌아옴
    await expect(page).toHaveURL(/\/products$/)
  })
  ```

- [ ] 테스트 시나리오 4: 에러 처리
  ```typescript
  test("폼 검증 에러", async ({ page }) => {
    await page.goto("/products/new")
    
    // 저장 (필드 미입력)
    await page.click('button[type="submit"]')
    
    // 에러 메시지 확인
    await expect(page.locator("text=상품명은 필수입니다")).toBeVisible()
  })
  ```

- [ ] 테스트 실행 및 통과 확인
  ```bash
  npx playwright test
  ```

- [ ] 커버리지: 주요 사용자 흐름 (Signup, Create, Read, Filter)
- [ ] 성능 확인: 페이지 로드 시간 < 3초

**테스트 대상 페이지**:
- `/products/new` (상품 추가)
- `/products` (목록)
- `/products/[id]` (상세)

**테스트 체크리스트**:
- [ ] 폼 입력 및 검증
- [ ] API 호출 및 성공/실패
- [ ] 토스트 알림
- [ ] 라우터 이동
- [ ] 필터링 및 정렬
- [ ] 404 처리

---

## Phase 4: 고급 기능 & 최적화 (1주)

**목표**: 성능, 접근성, SEO, 배포 준비

### Task 4.1: 이미지 최적화
**난이도**: 낮음 | **예상 기간**: 2-3시간 | **의존성**: Task 2.3, Task 2.4

**설명**:
Next.js Image 컴포넌트를 활용한 이미지 최적화를 구현합니다.
Lazy loading, srcset, placeholder를 설정합니다.

**구현 사항**:
- [ ] `components/products/_components/product-image.tsx` 완성
  ```typescript
  import Image from "next/image"
  
  export function ProductImage({ product }: Props) {
    return (
      <div className="relative w-full h-96">
        <Image
          src={product.imageUrl || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/..." // base64 placeholder
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  }
  ```

- [ ] ProductCard의 이미지도 최적화
- [ ] 원격 이미지 도메인 화이트리스트 추가 (`next.config.ts`)
  ```typescript
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.placeholder.com" },
      { protocol: "https", hostname: "*.example.com" },
    ]
  }
  ```

- [ ] Lighthouse 점수 확인 (이미지 최적화 부분)

**테스트**:
```bash
npm run build
lighthouse http://localhost:3000/products
# 이미지 최적화 점수 확인
```

---

### Task 4.2: 성능 최적화
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 3.6

**설명**:
번들 크기 분석, 동적 import, 폰트 최적화를 통해 성능을 개선합니다.

**구현 사항**:
- [ ] 번들 분석
  ```bash
  npm install --save-dev @next/bundle-analyzer
  ```
  
  `next.config.ts`:
  ```typescript
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  })
  
  export default withBundleAnalyzer({
    // ... config
  })
  ```
  
  ```bash
  ANALYZE=true npm run build
  # .next/static 폴더에서 번들 분석 리포트 확인
  ```

- [ ] 동적 import (선택적)
  ```typescript
  // ProductDetailPage에서 사용하지 않는 컴포넌트는 동적 로드
  const RelatedProducts = dynamic(() => import("@/components/related-products"), {
    loading: () => <div>로딩 중...</div>,
  })
  ```

- [ ] 폰트 최적화
  ```typescript
  // app/layout.tsx
  import { Geist, Geist_Mono } from "next/font/google"
  
  const geist = Geist({ subsets: ["latin"] })
  
  export default function RootLayout({ children }) {
    return (
      <html className={geist.className}>
        {/* ... */}
      </html>
    )
  }
  ```

- [ ] 번들 크기 목표: < 150KB (gzip)
- [ ] Core Web Vitals 측정 (LCP, FID, CLS)

**테스트**:
```bash
npm run build
# "Page Size" 확인 (gzip)

npx lighthouse http://localhost:3000
# Performance 점수 확인 (90+ 목표)
```

---

### Task 4.3: 접근성 개선 (WCAG 2.1 AA)
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 2.5, Task 2.2

**설명**:
WCAG 2.1 AA 표준을 충족하도록 접근성을 개선합니다.
ARIA 속성, 색상 대비, 키보드 네비게이션을 확인합니다.

**구현 사항**:
- [ ] ARIA 속성 추가
  ```typescript
  // ProductForm
  <input
    aria-label="상품명"
    aria-describedby="name-error"
  />
  <p id="name-error" className="text-red-500">
    {errors.name?.message}
  </p>
  ```

- [ ] 색상 대비 확인
  - 일반 텍스트: 4.5:1 (최소)
  - UI 요소: 3:1 (최소)
  - WebAIM Contrast Checker 활용

- [ ] 폼 라벨 연결
  ```typescript
  <label htmlFor="product-name">상품명 *</label>
  <input id="product-name" name="name" />
  ```

- [ ] 키보드 네비게이션 테스트
  - Tab으로 모든 포커스 가능 요소 접근 가능
  - Shift+Tab으로 역방향 이동 가능
  - Enter로 버튼 활성화
  - Escape로 모달/드롭다운 닫기

- [ ] 스크린 리더 테스트 (NVDA, JAWS, VoiceOver)
  - 페이지 구조 명확
  - 폼 필드 라벨 읽음
  - 에러 메시지 아너운스

**테스트**:
```bash
npx lighthouse http://localhost:3000 --view
# Accessibility 점수 확인 (90+ 목표)
```

---

### Task 4.4: SEO 최적화
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 2.1, Task 2.4

**설명**:
메타 태그, 구조화된 데이터, sitemap, robots.txt를 설정합니다.

**구현 사항**:
- [ ] 메타 태그 설정
  ```typescript
  // app/layout.tsx
  export const metadata: Metadata = {
    title: "상품 등록 & 관리 어드민",
    description: "Notion을 CMS로 활용한 간단한 상품 관리",
    metadataBase: new URL("https://yourdomain.com"),
    openGraph: {
      title: "상품 등록 & 관리 어드민",
      description: "Notion을 CMS로 활용한 간단한 상품 관리",
      url: "https://yourdomain.com",
      siteName: "Product Admin",
      images: [{ url: "/og-image.jpg" }],
    },
  }
  ```

- [ ] 동적 메타 태그 (상세 페이지)
  ```typescript
  // app/(dashboard)/products/[id]/page.tsx
  export async function generateMetadata({ params }): Promise<Metadata> {
    const product = await getProduct(params.id)
    
    return {
      title: product.name,
      description: product.description || `${product.price}원`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.imageUrl || "/placeholder.jpg" }],
      },
    }
  }
  ```

- [ ] JSON-LD 구조화된 데이터
  ```typescript
  // components/schema.tsx
  export function ProductSchema({ product }: Props) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.imageUrl,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "KRW"
            }
          })
        }}
      />
    )
  }
  ```

- [ ] `public/sitemap.xml` 생성
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://yourdomain.com/</loc>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://yourdomain.com/products</loc>
      <priority>0.8</priority>
    </url>
    <!-- 동적 페이지는 app/api/sitemap.ts로 생성 (선택) -->
  </urlset>
  ```

- [ ] `public/robots.txt` 생성
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Sitemap: https://yourdomain.com/sitemap.xml
  ```

- [ ] robots.txt와 sitemap.xml이 root에 있는지 확인

**테스트**:
```bash
curl https://yourdomain.com/robots.txt
curl https://yourdomain.com/sitemap.xml

# Google Search Console에서 sitemap 등록
```

---

### Task 4.5: 보안 강화
**난이도**: 중간 | **예상 기간**: 2-3시간 | **의존성**: Task 3.2, Task 1.3

**설명**:
보안 헤더, CORS, 입력 검증, 이미지 검증을 강화합니다.

**구현 사항**:
- [ ] CSP (Content Security Policy) 헤더 (이미 next.config.ts에 설정됨)
  ```typescript
  // next.config.ts
  headers: [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:"
        }
      ]
    }
  ]
  ```

- [ ] CORS 설정 (필요시)
  ```typescript
  // app/api/products/route.ts
  const headers = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://yourdomain.com",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type",
  }
  ```

- [ ] 환경 변수 검증
  ```typescript
  // lib/env.ts
  if (!process.env.NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is required")
  }
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is required")
  }
  ```

- [ ] 이미지 URL 검증
  ```typescript
  // lib/validation.ts
  const imageSchema = z.string().url().refine(
    (url) => {
      const allowedDomains = ["example.com", "cdn.example.com"]
      const domain = new URL(url).hostname
      return allowedDomains.some(d => domain === d || domain.endsWith("." + d))
    },
    "이미지 도메인이 허용되지 않습니다"
  )
  ```

- [ ] Rate Limiting (선택)
  ```bash
  npm install next-rate-limit
  ```

- [ ] 입력 sanitization (선택, sonner/toast는 XSS 방지)

**테스트**:
```bash
curl -i http://localhost:3000/
# Content-Security-Policy 헤더 확인

# OWASP ZAP 스캔 (선택)
```

---

### Task 4.6: 배포 준비 & 프로덕션 테스트
**난이도**: 중간 | **예상 기간**: 3-4시간 | **의존성**: Task 4.1~4.5

**설명**:
Vercel 배포를 준비하고, 프로덕션 빌드를 테스트합니다.

**구현 사항**:
- [ ] 환경 변수 설정 (Vercel)
  - NOTION_API_KEY
  - NOTION_DATABASE_ID
  - (선택) ALLOWED_ORIGIN

- [ ] 프로덕션 빌드 테스트
  ```bash
  npm run build
  npm start
  # http://localhost:3000 확인
  ```

- [ ] TypeScript 및 ESLint 최종 확인
  ```bash
  npx tsc --noEmit
  npx eslint app/ components/ types/ lib/ hooks/ --max-warnings 0
  ```

- [ ] 성능 측정 (Lighthouse)
  ```bash
  npm run build
  npm start
  npx lighthouse http://localhost:3000
  # Performance: 90+
  # Accessibility: 90+
  # Best Practices: 90+
  # SEO: 90+
  ```

- [ ] 배포 (Vercel)
  ```bash
  vercel deploy --prod
  ```

- [ ] 배포 후 테스트
  - 모든 페이지 로드 확인
  - 상품 추가 흐름 테스트
  - 목록 필터링 테스트
  - E2E 테스트 (프로덕션 환경)

- [ ] DNS 설정 (커스텀 도메인)
- [ ] SSL 인증서 확인

**체크리스트**:
- [ ] 빌드 성공 (no errors)
- [ ] 타입 안전성 (no errors)
- [ ] 린트 통과 (no warnings)
- [ ] Lighthouse 점수 > 90
- [ ] 프로덕션 로드 < 2초
- [ ] 모든 페이지 접근 가능
- [ ] API 호출 성공 (Network tab 확인)
- [ ] 에러 로깅 설정 (Sentry 선택)

---

## 진행 상황 추적

### Phase별 완료 기준

**Phase 1: 애플리케이션 골격**
- [ ] Task 1.1: 디렉토리 구조 & 라우트
- [ ] Task 1.2: 타입 & 상수
- [ ] Task 1.3: Notion API 헬퍼
- [ ] Task 1.4: API Route 인터페이스
- [ ] Task 1.5: 공통 컴포넌트

**Phase 2: UI/UX 완성**
- [ ] Task 2.1: 홈페이지 UI
- [ ] Task 2.2: 상품 추가 폼 UI
- [ ] Task 2.3: 상품 목록 UI
- [ ] Task 2.4: 상품 상세 UI
- [ ] Task 2.5: 반응형 & 접근성

**Phase 3: 핵심 기능**
- [ ] Task 3.1: Notion API 통합
- [ ] Task 3.2: POST /api/products
- [ ] Task 3.3: GET /api/products
- [ ] Task 3.4: GET /api/products/[id]
- [ ] Task 3.5: 클라이언트 폼 로직
- [ ] Task 3.6: 목록 페이지 실제 데이터
- [ ] Task 3.7: E2E 테스트

**Phase 4: 최적화 & 배포**
- [ ] Task 4.1: 이미지 최적화
- [ ] Task 4.2: 성능 최적화
- [ ] Task 4.3: 접근성 개선
- [ ] Task 4.4: SEO 최적화
- [ ] Task 4.5: 보안 강화
- [ ] Task 4.6: 배포 준비

---

## 주요 커맨드

```bash
# 개발 서버
npm run dev

# 타입 체크
npx tsc --noEmit

# ESLint
npx eslint app/ components/ types/ lib/ hooks/

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# E2E 테스트
npx playwright test

# 성능 분석
ANALYZE=true npm run build
```

---

## 참고 자료

| 항목 | URL |
|------|-----|
| Notion API | https://developers.notion.com/reference/intro |
| Next.js 16 | https://nextjs.org/docs |
| React 19 | https://react.dev |
| shadcn/ui | https://ui.shadcn.com/ |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| react-hook-form | https://react-hook-form.com/ |
| Zod | https://zod.dev/ |
| Playwright | https://playwright.dev/ |
| WCAG 2.1 | https://www.w3.org/WAI/WCAG21/quickref/ |
| Vercel Docs | https://vercel.com/docs |

---

**최종 상태**: Draft → In Progress → Completed  
**마지막 업데이트**: 2026-04-03
