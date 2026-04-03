# 상품 등록 & 관리 어드민 - PRD (Product Requirements Document)

**프로젝트명**: 상품 등록 & 관리 어드민 (Product Registration & Management Admin)  
**작성일**: 2026-04-02  
**버전**: 1.0 (MVP)  
**상태**: Draft

---

## 1. 제품 개요 (Product Overview)

### 1.1 제품명
**상품 등록 & 관리 어드민**

### 1.2 한 줄 요약
Notion을 CMS로 활용하여 웹 폼에서 상품 정보를 입력하면 자동으로 Notion DB에 저장되고, 목록을 실시간으로 확인할 수 있는 간단한 어드민 툴입니다.

### 1.3 핵심 가치 제안 (Value Proposition)
- **노코드 CMS**: 개발자가 아닌 마케팅/기획팀도 Notion으로 콘텐츠 관리 가능
- **실시간 동기화**: 웹 폼 입력 → Notion DB 자동 저장 → 즉시 조회
- **간단한 인터페이스**: 복잡한 어드민 시스템 없이 필요한 기능만 제공
- **비용 효율**: 별도 데이터베이스 불필요, Notion API만으로 구축

### 1.4 사용 사례 (Use Cases)
1. **이커머스 팀**: 상품 추가 시 자동으로 Notion 상품 DB 업데이트
2. **콘텐츠 팀**: 블로그 포스트/상품 정보를 Notion에서 관리
3. **재고 관리**: 상품 목록을 웹과 Notion에서 동시 관리
4. **팀 협업**: 비개발자도 Notion 권한으로 콘텐츠 검수 가능

### 1.5 대상 사용자
- **1차 사용자**: 상품 등록자 (마케팅팀, 기획팀)
- **2차 사용자**: 콘텐츠 검수자 (Notion 접근)

---

## 2. 문제 정의 & 목표 (Problem & Goals)

### 2.1 현재 문제점
| 문제 | 영향 |
|------|------|
| **수동 입력의 중복**: 웹 폼 입력 후 Excel/Notion에 다시 입력 | 시간 낭비, 휴먼 에러 |
| **데이터 동기화 불일치**: 여러 곳에 분산된 상품 정보 | 일관성 부족 |
| **관리 복잡도**: 별도 데이터베이스 필요 | 운영 비용, 학습 곡선 |
| **비개발자 의존성**: 콘텐츠 변경마다 개발팀 요청 필요 | 속도 저하 |

### 2.2 비즈니스 목표
- ✅ 상품 등록 소요 시간 **50% 단축** (수동 입력 → 자동 저장)
- ✅ **100% 데이터 일관성** 유지 (단일 소스 of truth: Notion)
- ✅ 비개발자 **셀프 서비스** 가능 (웹 폼 + Notion 접근)
- ✅ **0개의 외부 의존성** (별도 DB 불필요)

### 2.3 기술 목표
- ✅ Notion API 통합 (read/write 양방향)
- ✅ 서버 기반 폼 검증 및 에러 처리
- ✅ **< 1초 페이지 로드** (ISR/캐싱 활용)
- ✅ **모바일 우선** 반응형 디자인 (WCAG 2.1 준수)

---

## 3. 사용자 페르소나 (User Personas)

### 페르소나 1: 상품 등록자 (Content Creator)
| 항목 | 내용 |
|------|------|
| **이름** | 김마케팅 (마케팅 담당자) |
| **직책** | 마케팅 담당자 |
| **기술 수준** | 낮음~중간 (엑셀, Notion 사용 가능) |
| **목표** | 상품 정보 빠르게 입력 → 웹에 즉시 반영 |
| **통증점** | 매번 폼 입력 + Notion 수정 필요 |
| **선호도** | 직관적 UI, 최소한의 클릭 수 |

**행동 흐름**:
1. 상품 추가 페이지 방문
2. 상품명, 가격, 설명 입력 (3분)
3. 저장 → 자동으로 Notion DB에 추가
4. 웹에서 실시간 목록 반영 확인

---

### 페르소나 2: 콘텐츠 검수자 (Content Reviewer)
| 항목 | 내용 |
|------|------|
| **이름** | 이팀장 (기획팀장) |
| **직책** | 기획팀장 |
| **기술 수준** | 중간 (Notion 숙련) |
| **목표** | 웹과 Notion에서 동시에 상품 정보 검토 |
| **통증점** | 웹 폼과 Notion 데이터 불일치 확인 필요 |
| **선호도** | 명확한 상태 표시, 편집 용이 |

**행동 흐름**:
1. 웹 상품 목록 또는 Notion DB 확인
2. 상품 상세 페이지에서 정보 검증
3. Notion에서 직접 수정 가능 (권한 있을 시)
4. 웹 페이지에 자동 반영

---

## 4. 핵심 기능 (Core Features)

### Feature 1: 상품 추가 폼 (Product Registration Form)
웹 기반 폼에서 상품 정보를 입력하고 Notion DB에 저장

#### 입력 필드
| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| 상품명 | Text | ✅ | 최대 100자 |
| 카테고리 | Select (Notion Multi-select) | ✅ | 목록: 전자제품, 의류, 기타 |
| 가격 | Number | ✅ | 0 이상 |
| 재고 | Number | ❌ | 기본값 0 |
| 설명 | Textarea | ❌ | 최대 500자 |
| 이미지 URL | Text | ❌ | 유효한 URL 형식 |
| 출시일 | Date | ❌ | 과거 또는 현재 날짜 |

#### Acceptance Criteria
- [ ] 모든 필드 클라이언트 & 서버 검증
- [ ] 저장 시간 < 2초 (Notion API 호출)
- [ ] 오류 시 사용자 친화적 메시지 표시
- [ ] 저장 후 성공 토스트 & 자동 목록 새로고침
- [ ] 모바일에서 터치 친화적 입력 (텍스트 크기, 패딩)

---

### Feature 2: Notion DB 자동 저장 (Auto-save to Notion)
웹 폼 데이터를 실시간으로 Notion Database에 동기화

#### 기술 구현
```
웹 폼 입력 → 클라이언트 검증 → API Route (/api/products) 
  → Notion API 호출 → Notion DB에 새 row 생성 → 응답
```

#### 동기화 규칙
- **1:1 매핑**: 폼 필드 ↔ Notion 컬럼
- **타입 변환**: 
  - Text → Rich Text
  - Number → Number
  - Date → Date
  - Select → Multi-select (Notion)
- **충돌 처리**: 동일 상품명 시 덮어쓰기 또는 새로 생성 (정책 정의 필요)

#### Acceptance Criteria
- [ ] 저장 성공 시 Notion에서 즉시 확인 가능
- [ ] 네트워크 오류 시 재시도 로직 (Exponential Backoff)
- [ ] API 레이트 제한 처리 (429 에러)
- [ ] 감사 로그 남기기 (누가 언제 저장했는지)

---

### Feature 3: 상품 목록 조회 (Product List)
Notion DB에서 상품 목록을 조회하고 웹에 표시

#### 목록 항목 표시
- 상품명, 카테고리, 가격, 재고, 최근 수정일
- 상세 페이지 링크

#### 필터링 & 정렬
| 기능 | 내용 |
|------|------|
| **필터** | 카테고리별 필터 (Select) |
| **정렬** | 최신순, 가격순 (오름/내림) |
| **검색** | 상품명 검색 (텍스트) |
| **페이지네이션** | 10개 항목/페이지 |

#### 캐싱 전략
- **ISR (Incremental Static Regeneration)**: 60초마다 백그라운드 재생성
- **On-demand Revalidation**: 상품 저장 후 즉시 캐시 무효화

#### Acceptance Criteria
- [ ] 초기 로드 < 1s (캐시 히트 시)
- [ ] Notion DB에 100개 이상 상품 시에도 성능 유지
- [ ] 필터/정렬 적용 시 클라이언트 사이드 처리 (재요청 X)
- [ ] 빈 목록 시 "상품 없음" 안내 메시지

---

### Feature 4: 상품 상세 페이지 (Product Detail Page)
개별 상품의 상세 정보를 표시하고 편집 가능

#### 표시 정보
- 상품명, 카테고리, 가격, 재고
- 상품 설명, 이미지
- 작성일, 수정일
- (선택) Notion 링크 (직접 편집용)

#### Acceptance Criteria
- [ ] 동적 라우팅: `/products/[productId]`
- [ ] 상품이 없을 시 404 페이지 표시
- [ ] 반응형 이미지 (srcset, lazy loading)
- [ ] 공유 시 메타 태그 적용 (OG Image, 설명)

---

### Feature 5: 상품 상세 편집 (Optional for v1.1)
웹 폼에서 기존 상품 정보 수정

#### Acceptance Criteria
- [ ] 상세 페이지에서 "편집" 버튼 → 폼 모드 전환
- [ ] 기존 데이터 프리필 (pre-fill)
- [ ] 저장 시 Notion DB 업데이트
- [ ] 삭제 기능 (소프트 삭제: 상태 변경)

**상태**: ❌ MVP 범위 제외 (v1.1에서 추가)

---

## 5. 사용자 플로우 (User Flows)

### Flow 1: 상품 등록 (Happy Path)
```
1. 사용자가 "/" (홈) 또는 "/products/new" 방문
2. 상품 추가 폼 표시
3. 필드 입력:
   - 상품명: "무선 이어폰"
   - 카테고리: "전자제품" 선택
   - 가격: "29,900" 입력
   - 설명: "고음질 사운드..." 입력
   - (선택) 이미지 URL 입력
4. "저장" 버튼 클릭
5. 클라이언트 검증 통과
6. API 요청 전송 → /api/products POST
7. 서버: Notion API 호출 → DB에 새 row 추가
8. 응답: { success: true, productId: "uuid" }
9. 성공 토스트 표시: "상품이 저장되었습니다"
10. 목록 페이지로 자동 이동 또는 상세 페이지 표시
```

### Flow 2: 상품 목록 조회
```
1. 사용자가 "/products" 방문
2. 서버: Notion API에서 상품 데이터 조회 (ISR/캐시)
3. 목록 렌더링:
   - 카테고리별 필터 UI
   - 10개 항목 + 페이지네이션
4. 사용자가 카테고리 필터 선택
5. 클라이언트 사이드 필터 적용 (즉시)
6. 사용자가 상품 클릭 → /products/[id] 상세 페이지 이동
```

### Flow 3: 상품 상세 조회
```
1. 사용자가 /products/[productId] 방문
2. 서버: Notion API에서 해당 상품 데이터 조회
3. 페이지 렌더링:
   - 상품 이미지 (반응형, lazy loading)
   - 상품명, 카테고리, 가격, 재고
   - 상세 설명
   - 메타 태그 (OG Image, description)
4. (선택) "Notion에서 편집" 버튼 → Notion URL 오픈
5. (선택) "목록으로 돌아가기" 버튼 → /products 이동
```

### Flow 4: 오류 처리
```
1. 사용자가 폼 입력 후 "저장" 클릭
2. 네트워크 오류 발생 (Notion API 타임아웃)
3. 에러 토스트 표시: "저장에 실패했습니다. 다시 시도하세요."
4. 재시도 버튼 표시 (또는 자동 재시도)
5. 재시도 성공 → 성공 메시지
```

---

## 6. 기술 아키텍처 (Technical Architecture)

### 6.1 시스템 다이어그램
```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
├─────────────────────────────────────────────────────────┤
│  React Components (Next.js Pages)                       │
│  - Product Form (/products/new)                          │
│  - Product List (/products)                              │
│  - Product Detail (/products/[id])                       │
│  - Client Validation (react-hook-form + Zod)            │
└───────────────────────────┬─────────────────────────────┘
                            │
                     HTTP/HTTPS
                            │
┌───────────────────────────▼─────────────────────────────┐
│               Next.js Server (App Router)                │
├─────────────────────────────────────────────────────────┤
│  API Routes:                                             │
│  - POST /api/products (저장)                            │
│  - GET /api/products (목록 조회)                        │
│  - GET /api/products/[id] (상세 조회)                   │
│                                                         │
│  Server Components:                                      │
│  - Layout (헤더, 푸터)                                   │
│  - Pages (서버 렌더링, ISR 적용)                        │
│                                                         │
│  Client Components (_components/):                      │
│  - ProductForm.tsx (폼 입력)                            │
│  - ProductList.tsx (필터, 정렬)                         │
│  - ProductCard.tsx (목록 항목)                          │
└───────────────────────────┬─────────────────────────────┘
                            │
                    HTTPS (Bearer Token)
                            │
┌───────────────────────────▼─────────────────────────────┐
│              Notion API (External Service)               │
├─────────────────────────────────────────────────────────┤
│  - Retrieve Database (GET /databases/[id])              │
│  - Query Database (POST /databases/[id]/query)          │
│  - Create Page (POST /pages)                            │
│  - Update Page (PATCH /pages/[id])                      │
│                                                         │
│  Product Database Schema:                               │
│  - Name (title)                                         │
│  - Category (multi-select)                              │
│  - Price (number)                                       │
│  - Stock (number)                                       │
│  - Description (rich_text)                              │
│  - Image URL (text)                                     │
│  - Created At (created_time, auto)                      │
│  - Modified At (last_edited_time, auto)                 │
└─────────────────────────────────────────────────────────┘
```

### 6.2 데이터 플로우
```
사용자 입력
    ↓
클라이언트 검증 (react-hook-form + Zod)
    ↓ (검증 성공)
API Route 호출 (/api/products)
    ↓
서버 검증 (재검증)
    ↓ (검증 성공)
Notion API 호출
    ├─ 에러 처리 (429, 404 등)
    └─ 성공 → Notion DB에 새 row 추가
    ↓
응답 반환 { success: true, id: "..." }
    ↓
클라이언트: 캐시 무효화 (revalidateTag / revalidatePath)
    ↓
목록 페이지 새로고침 (ISR 또는 클라이언트 갱신)
```

### 6.3 주요 기술 선택 사항

#### Q1: 캐싱 전략?
**선택**: ISR (Incremental Static Regeneration)
- **이유**: 목록 페이지가 자주 변경되지 않음, 60초 주기 재생성으로 충분
- **구현**: `revalidate: 60` in `page.tsx`
- **추가**: 상품 저장 후 `revalidateTag("products")` 호출

```typescript
// app/(dashboard)/dashboard/products/page.tsx
export const revalidate = 60 // ISR: 60초마다 재생성
export default async function ProductsPage() { ... }
```

#### Q2: 상태 관리?
**선택**: React Context + useReducer (로컬 상태)
- **이유**: 클라이언트 검증만 필요, 글로벌 상태 불필요
- **대안**: Zustand / Redux (오버엔지니어링)

```typescript
// hooks/useProductForm.ts
export function useProductForm() {
  const [form, setForm] = useState<Product>(defaultValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  // ...
}
```

#### Q3: API 오류 처리?
**선택**: 재시도 로직 + 지수 백오프 (Exponential Backoff)
- **이유**: Notion API는 레이트 제한 있음, 일시적 오류 가능
- **구현**: `async-retry` 라이브러리 또는 수동 구현

```typescript
async function callNotionAPI(data: Product) {
  return retry(
    () => notion.pages.create({ ...data }),
    { retries: 3, factor: 2, minTimeout: 1000 }
  )
}
```

---

## 7. API 설계 (API Design)

### 7.1 엔드포인트 목록

#### POST /api/products
**목적**: 새 상품 생성 (Notion DB에 저장)

**요청**:
```json
{
  "name": "무선 이어폰",
  "category": "전자제품",
  "price": 29900,
  "stock": 50,
  "description": "고음질 사운드...",
  "imageUrl": "https://example.com/image.jpg",
  "releaseDate": "2026-04-02"
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "notionPageId": "abc123...",
  "message": "상품이 저장되었습니다"
}
```

**에러** (400 Bad Request):
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "details": [
    { "field": "name", "message": "상품명은 필수입니다" },
    { "field": "price", "message": "가격은 0 이상이어야 합니다" }
  ]
}
```

---

#### GET /api/products
**목적**: 상품 목록 조회 (캐싱됨)

**쿼리 파라미터**:
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `category` | string | - | 카테고리 필터 |
| `sort` | string | `latest` | 정렬: `latest`, `price_asc`, `price_desc` |
| `limit` | number | 10 | 페이지 크기 |
| `offset` | number | 0 | 시작 위치 |

**응답** (200 OK):
```json
{
  "success": true,
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "무선 이어폰",
      "category": "전자제품",
      "price": 29900,
      "stock": 50,
      "image": "https://example.com/image.jpg",
      "createdAt": "2026-04-02T10:00:00Z",
      "modifiedAt": "2026-04-02T10:00:00Z"
    }
  ],
  "total": 150,
  "hasMore": true
}
```

---

#### GET /api/products/[id]
**목적**: 개별 상품 조회

**응답** (200 OK):
```json
{
  "success": true,
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "무선 이어폰",
    "category": "전자제품",
    "price": 29900,
    "stock": 50,
    "description": "고음질 사운드...",
    "imageUrl": "https://example.com/image.jpg",
    "releaseDate": "2026-04-02",
    "createdAt": "2026-04-02T10:00:00Z",
    "modifiedAt": "2026-04-02T10:00:00Z",
    "notionPageUrl": "https://notion.so/..."
  }
}
```

**에러** (404 Not Found):
```json
{
  "success": false,
  "error": "PRODUCT_NOT_FOUND",
  "message": "상품을 찾을 수 없습니다"
}
```

---

### 7.2 에러 코드
| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `VALIDATION_ERROR` | 400 | 폼 입력 검증 실패 |
| `NOTION_AUTH_ERROR` | 401 | Notion API 인증 실패 |
| `NOTION_RATE_LIMIT` | 429 | Notion API 레이트 제한 |
| `NOTION_ERROR` | 500 | Notion API 오류 |
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |
| `INTERNAL_ERROR` | 500 | 내부 서버 오류 |

---

## 8. 데이터 모델 (Data Model)

### 8.1 Notion Database 스키마
**데이터베이스명**: Products  
**ID**: `NOTION_DATABASE_ID` (환경 변수)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| **Name** | Title | ✅ | 상품명 |
| **Category** | Multi-select | ✅ | 카테고리 (전자제품, 의류, 기타) |
| **Price** | Number | ✅ | 가격 (한국 원화) |
| **Stock** | Number | ❌ | 재고 수량 |
| **Description** | Rich Text | ❌ | 상세 설명 |
| **Image URL** | Text | ❌ | 이미지 URL |
| **Release Date** | Date | ❌ | 출시 날짜 |
| **Created At** | Created Time | - | 자동 생성 |
| **Modified At** | Last Edited Time | - | 자동 업데이트 |

### 8.2 TypeScript 타입 정의
```typescript
// types/index.ts

export type Product = {
  id: string                    // UUID 또는 Notion Page ID
  name: string                  // 상품명
  category: ProductCategory     // 카테고리
  price: number                 // 가격 (원화)
  stock?: number                // 재고 (선택)
  description?: string          // 설명
  imageUrl?: string             // 이미지 URL
  releaseDate?: Date            // 출시일
  createdAt: Date               // 생성일
  modifiedAt: Date              // 수정일
  notionPageId: string          // Notion Page ID (링크용)
}

export type ProductCategory = "전자제품" | "의류" | "기타"

export type ProductFormData = Omit<Product, "id" | "createdAt" | "modifiedAt" | "notionPageId">

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  details?: Record<string, any>
}

export type ValidationError = {
  field: string
  message: string
}
```

### 8.3 Validation Schema (Zod)
```typescript
// lib/validation.ts

import { z } from "zod"

export const productSchema = z.object({
  name: z.string()
    .min(1, "상품명은 필수입니다")
    .max(100, "상품명은 100자 이하여야 합니다"),
  
  category: z.enum(["전자제품", "의류", "기타"]),
  
  price: z.number()
    .min(0, "가격은 0 이상이어야 합니다")
    .max(9999999, "가격이 너무 큽니다"),
  
  stock: z.number().min(0, "재고는 0 이상이어야 합니다").optional(),
  
  description: z.string()
    .max(500, "설명은 500자 이하여야 합니다")
    .optional(),
  
  imageUrl: z.string().url("유효한 URL이 아닙니다").optional(),
  
  releaseDate: z.date().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
```

---

## 9. 화면 구성 (Screen Design)

### 9.1 홈 페이지 (/)
**목적**: 최근 등록된 상품 미리보기 & 상품 등록 버튼

```
┌─────────────────────────────────────────────┐
│  [Logo]          [Home] [Products] [Add]    │  ← Header
├─────────────────────────────────────────────┤
│                                             │
│  상품 등록 & 관리 어드민                     │
│  간단하고 빠른 상품 관리                     │
│                                             │
│  [+ 상품 추가하기]  [상품 목록보기]         │  ← CTA
│                                             │
├─────────────────────────────────────────────┤
│  최근 등록된 상품 (3개)                     │
│                                             │
│  [상품1]  [상품2]  [상품3]                  │  ← Card List
│                                             │
├─────────────────────────────────────────────┤
│ 기술 스택 | Notion API | Next.js | Tailwind │  ← Footer
└─────────────────────────────────────────────┘
```

#### 컴포넌트
- `Header.tsx` (공통)
- `Hero.tsx` (환영 섹션)
- `CTASection.tsx` (행동 유도)
- `RecentProducts.tsx` (최근 상품, 서버 컴포넌트)
- `Footer.tsx` (공통)

---

### 9.2 상품 추가 페이지 (/products/new)
**목적**: 상품 등록 폼

```
┌─────────────────────────────────────────────┐
│  [Logo]          [Home] [Products] [Add]    │
├─────────────────────────────────────────────┤
│                                             │
│  상품 추가                                   │
│                                             │
│  상품명 *                                    │
│  [_______________________]                  │
│                                             │
│  카테고리 *                                  │
│  [▼ 선택해주세요]                           │
│                                             │
│  가격 * (원화)                              │
│  [____________]                            │
│                                             │
│  재고                                        │
│  [____________]                            │
│                                             │
│  설명                                        │
│  [_________________________]                │
│  [_________________________]                │
│                                             │
│  이미지 URL                                 │
│  [_________________________]                │
│                                             │
│  출시일                                      │
│  [____-__-__]  ← Date Picker               │
│                                             │
│  [저장]  [취소]                             │
│                                             │
├─────────────────────────────────────────────┤
│ © 2026 ...                                  │
└─────────────────────────────────────────────┘
```

#### 컴포넌트
- `ProductForm.tsx` (클라이언트, react-hook-form)
- `FormField.tsx` (공통 입력 필드)
- `SelectField.tsx` (카테고리 선택)
- `DatePicker.tsx` (출시일)

#### 기능
- ✅ 필드별 실시간 검증 (온포커스/온블러)
- ✅ 저장 버튼 로딩 상태
- ✅ 성공/실패 토스트 알림
- ✅ 오류 필드 하이라이트 (빨간 테두리 + 메시지)

---

### 9.3 상품 목록 페이지 (/products)
**목적**: 상품 목록 조회 & 필터링

```
┌─────────────────────────────────────────────┐
│  [Logo]          [Home] [Products] [Add]    │
├─────────────────────────────────────────────┤
│                                             │
│  상품 목록                                   │
│                                             │
│  카테고리: [▼ 전체] 정렬: [▼ 최신순]       │
│  [검색]                                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────┐  ┌───────────────┐     │
│  │ [이미지]      │  │ [이미지]      │     │
│  │ 상품1         │  │ 상품2         │     │
│  │ 가격: 29,900  │  │ 가격: 49,900  │     │
│  │ [상세보기]    │  │ [상세보기]    │     │
│  └───────────────┘  └───────────────┘     │
│                                             │
│  ┌───────────────┐  ┌───────────────┐     │
│  │ [이미지]      │  │ [이미지]      │     │
│  │ 상품3         │  │ 상품4         │     │
│  │ 가격: 15,900  │  │ 가격: 69,900  │     │
│  │ [상세보기]    │  │ [상세보기]    │     │
│  └───────────────┘  └───────────────┘     │
│                                             │
│  [◀ 이전] [1] [2] [3] [다음 ▶]             │
│                                             │
├─────────────────────────────────────────────┤
│ © 2026 ...                                  │
└─────────────────────────────────────────────┘
```

#### 컴포넌트
- `ProductFilter.tsx` (필터 UI)
- `ProductGrid.tsx` (그리드 레이아웃)
- `ProductCard.tsx` (개별 상품 카드)
- `Pagination.tsx` (페이지네이션)

#### 기능
- ✅ 카테고리 필터 (다중 선택 가능 옵션)
- ✅ 정렬 (최신순, 가격 오름/내림)
- ✅ 검색 (상품명)
- ✅ 페이지네이션 (10개/페이지)
- ✅ 반응형 (모바일: 1열, 태블릿: 2열, 데스크톱: 3~4열)

---

### 9.4 상품 상세 페이지 (/products/[productId])
**목적**: 개별 상품 상세 정보

```
┌─────────────────────────────────────────────┐
│  [Logo]          [Home] [Products] [Add]    │
├─────────────────────────────────────────────┤
│                                             │
│  [◀ 목록으로]                               │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [         이미지          ]        │   │  ← 좌측 (40%)
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 상품명: 무선 이어폰                 │   │  ← 우측 (60%)
│  │ 카테고리: 전자제품                   │   │
│  │ 가격: 29,900원                       │   │
│  │ 재고: 50개                           │   │
│  │ 출시일: 2026-04-02                   │   │
│  │                                     │   │
│  │ 설명:                               │   │
│  │ 고음질 사운드를 경험하세요...        │   │
│  │                                     │   │
│  │ [🔗 Notion에서 편집] [공유]         │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│ © 2026 ...                                  │
└─────────────────────────────────────────────┘
```

#### 컴포넌트
- `ProductDetail.tsx` (상세 정보)
- `ProductImage.tsx` (반응형 이미지)
- `ProductActions.tsx` (버튼: 편집, 공유, Notion 링크)

#### 기능
- ✅ 반응형 레이아웃 (모바일: 1열, 데스크톱: 2열)
- ✅ Lazy loading 이미지
- ✅ OG 메타 태그 (공유 시 썸네일, 제목, 설명)
- ✅ 작은 화면에서 터치 친화적

---

## 10. 비기능 요구사항 (Non-Functional Requirements)

### 10.1 성능 (Performance)
| 지표 | 목표 | 측정 방법 |
|------|------|---------|
| **페이지 로드 시간** | < 1s (캐시) / < 2s (콜드) | Lighthouse, Core Web Vitals |
| **API 응답 시간** | < 500ms (Notion API 호출 포함) | 개발자 도구, 로깅 |
| **첫 바이트 시간 (TTFB)** | < 100ms | WebPageTest |
| **번들 크기** | < 150KB (gzip) | Bundleanalyzer |

### 10.2 보안 (Security)
- ✅ **HTTPS only**: 모든 통신 암호화
- ✅ **환경 변수**: `NOTION_API_KEY` 서버에만 저장 (`.env.local`)
- ✅ **CORS**: 신뢰할 수 있는 도메인만 허용
- ✅ **입력 검증**: 클라이언트 + 서버 양쪽 검증
- ✅ **속도 제한**: API 엔드포인트별 레이트 제한 (e.g., 100 req/min)
- ✅ **CSP**: Content Security Policy 헤더 설정
- ✅ **이미지 검증**: URL 형식 및 도메인 화이트리스트

### 10.3 접근성 (Accessibility)
- ✅ **WCAG 2.1 AA 준수**
  - 적절한 ARIA 라벨
  - 키보드 네비게이션 지원 (Tab, Enter, Escape)
  - 충분한 색상 대비 (WCAG AA: 4.5:1)
  - 폰트 크기 최소 16px
- ✅ **스크린 리더 지원**: 시맨틱 HTML, alt 텍스트
- ✅ **포커스 표시**: 명확한 포커스 아웃라인

### 10.4 모바일 & 반응형 (Mobile & Responsive)
- ✅ **모바일 우선 디자인**: 320px 이상 모든 화면 지원
- ✅ **터치 친화적**: 터치 영역 최소 48x48px
- ✅ **뷰포트**: 적절한 meta viewport 설정
- ✅ **이미지 최적화**: WebP, srcset, lazy loading

### 10.5 SEO (Search Engine Optimization)
- ✅ **메타 태그**: title, description, OG image (동적)
- ✅ **구조화된 데이터**: JSON-LD (Product schema)
- ✅ **URL 구조**: `/products`, `/products/[id]` 캐시 친화적
- ✅ **sitemap.xml**: 모든 페이지 등재
- ✅ **robots.txt**: 크롤링 가능 설정

### 10.6 확장성 & 유지보수 (Scalability & Maintainability)
- ✅ **타입 안전성**: TypeScript strict mode
- ✅ **코드 구조**: App Router, Server/Client 컴포넌트 분리
- ✅ **에러 처리**: 체계적인 에러 로깅
- ✅ **문서화**: JSDoc, README.md, 개발 가이드

---

## 11. MVP 범위 정의

### ✅ MVP에 포함 (Phase 1)
- [x] Notion Database 읽기/쓰기 (CRUD 중 CR 필수, U/D 선택)
- [x] 상품 추가 폼 (웹 인터페이스)
- [x] Notion DB에 자동 저장
- [x] 상품 목록 페이지 (필터, 정렬, 검색)
- [x] 상품 상세 페이지
- [x] 반응형 디자인 (모바일 우선)
- [x] 기본 스타일링 (shadcn/ui + Tailwind)
- [x] 폼 검증 (react-hook-form + Zod)
- [x] 에러 처리 및 토스트 알림
- [x] 성능 최적화 (ISR, 이미지 최적화)

### ❌ MVP에 미포함 (Phase 1.1+)
- [ ] 상품 편집 (PATCH /api/products/[id])
- [ ] 상품 삭제 (DELETE /api/products/[id])
- [ ] 사용자 인증 (로그인/회원가입)
- [ ] 권한 관리 (역할별 접근 제어)
- [ ] 대량 업로드 (CSV/Excel import)
- [ ] 고급 분석 & 리포팅
- [ ] 이메일 알림 (상품 저장 시 마케팅팀 알림)
- [ ] 다국어 지원 (초기: 한국어만)
- [ ] 결제 통합
- [ ] 실시간 협업 (여러 사용자 동시 편집)

---

## 12. 구현 단계 (Implementation Roadmap)

### Phase 1: 기초 설정 (Week 1)
**목표**: 개발 환경 구성, Notion API 연동

#### Task 1.1: 프로젝트 초기화
- [ ] Next.js 16 프로젝트 생성 (이미 존재하므로 건너뜀)
- [ ] 필요한 패키지 설치
  ```bash
  npm install @notionhq/client       # Notion API
  npm install react-hook-form        # 폼 관리
  npm install zod @hookform/resolvers # 검증
  npm install sonner                  # 토스트
  ```

#### Task 1.2: 타입 정의 및 상수
- [ ] `types/index.ts` 작성 (Product, ProductCategory 등)
- [ ] `lib/constants.ts` 업데이트 (기본값, 카테고리 목록)
- [ ] `lib/validation.ts` 작성 (Zod 스키마)

#### Task 1.3: Notion API 헬퍼
- [ ] `lib/notion-api.ts` 작성
  - `initNotionClient()` - 클라이언트 초기화
  - `queryProducts()` - 상품 목록 조회
  - `getProduct(id)` - 개별 상품 조회
  - `createProduct(data)` - 상품 생성
- [ ] 환경 변수 설정
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`

#### Task 1.4: 디렉토리 구조 생성
```
app/(dashboard)/
├── products/
│   ├── layout.tsx
│   ├── page.tsx (목록)
│   ├── new/
│   │   └── page.tsx (추가 폼)
│   ├── [id]/
│   │   └── page.tsx (상세)
│   └── _components/
│       ├── product-form.tsx
│       ├── product-list.tsx
│       ├── product-card.tsx
│       └── product-detail.tsx

lib/
├── notion-api.ts
├── validation.ts
├── constants.ts

types/
└── index.ts
```

---

### Phase 2: 상품 추가 기능 (Week 1-2)
**목표**: 웹 폼 → Notion DB 저장

#### Task 2.1: API Route 구현
- [ ] `app/api/products/route.ts` (POST)
  - 요청 검증 (Zod)
  - Notion API 호출
  - 에러 처리 (재시도 로직)
  - 응답 반환

```typescript
// app/api/products/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  const validated = productSchema.parse(data) // Zod 검증
  
  try {
    const notion = initNotionClient()
    const page = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: validated.name } }] },
        Category: { multi_select: [{ name: validated.category }] },
        Price: { number: validated.price },
        // ... 기타 필드
      }
    })
    
    return NextResponse.json({
      success: true,
      productId: page.id
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "NOTION_ERROR"
    }, { status: 500 })
  }
}
```

#### Task 2.2: 클라이언트 폼 컴포넌트
- [ ] `components/products/_components/product-form.tsx`
  - react-hook-form 설정
  - 필드별 검증 (onBlur)
  - 실시간 에러 표시
  - API 호출 및 로딩 상태
  - 성공/실패 토스트

```typescript
// components/products/_components/product-form.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "@/lib/validation"
import { toast } from "sonner"

export function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productSchema)
  })
  
  async function onSubmit(data: ProductInput) {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error()
      
      toast.success("상품이 저장되었습니다")
      form.reset()
      // 목록 새로고침 또는 상세 페이지 이동
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도하세요.")
    }
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

#### Task 2.3: 상품 추가 페이지
- [ ] `app/(dashboard)/products/new/page.tsx`
  - ProductForm 컴포넌트 임포트
  - 메타 데이터 설정

---

### Phase 3: 목록 & 상세 조회 (Week 2)
**목표**: 상품 목록 및 상세 페이지 구현

#### Task 3.1: 목록 조회 API
- [ ] `app/api/products/route.ts` (GET)
  - Notion API Query
  - 필터링 (카테고리)
  - 정렬 (최신순, 가격순)
  - 페이지네이션

#### Task 3.2: 목록 페이지
- [ ] `app/(dashboard)/products/page.tsx` (Server Component)
  - API 호출
  - ISR 설정 (`revalidate: 60`)
  - ProductList 컴포넌트에 데이터 전달

- [ ] `components/products/_components/product-list.tsx` (Client Component)
  - 필터 UI (카테고리 선택)
  - 정렬 UI (버튼)
  - 검색 UI (input)
  - ProductCard 목록
  - 페이지네이션

- [ ] `components/products/_components/product-card.tsx`
  - 상품 이미지 (lazy loading)
  - 상품명, 카테고리, 가격
  - "상세보기" 링크

#### Task 3.3: 상세 조회 API
- [ ] `app/api/products/[id]/route.ts` (GET)
  - Notion Page 조회
  - 에러 처리 (404)

#### Task 3.4: 상세 페이지
- [ ] `app/(dashboard)/products/[id]/page.tsx` (Server Component)
  - 동적 메타 데이터 (OG image, description)
  - API 호출

- [ ] `components/products/_components/product-detail.tsx`
  - 상품 이미지 (반응형)
  - 상품 정보 (이름, 카테고리, 가격, 재고, 설명)
  - 링크 (Notion 편집, 목록으로 돌아가기)

---

### Phase 4: 스타일링 & 최적화 (Week 2-3)
**목표**: 디자인 완성, 성능 최적화

#### Task 4.1: 기본 레이아웃
- [ ] `components/layout/header.tsx` 업데이트
  - Products 링크 추가
- [ ] Products 섹션 레이아웃
  - 제목, 설명, 주요 행동

#### Task 4.2: Tailwind CSS 스타일
- [ ] 폼 필드 스타일 (input, select, textarea)
- [ ] 카드 컴포넌트 (상품 카드)
- [ ] 버튼 및 상호작용 상태
- [ ] 반응형 그리드 (1/2/3/4 열)

#### Task 4.3: 이미지 최적화
- [ ] Next.js Image 컴포넌트 사용
  - `width`, `height` 설정
  - `loading="lazy"` 설정
  - `placeholder="blur"` (선택)

#### Task 4.4: 성능 최적화
- [ ] 번들 분석 (bundleanalyzer)
- [ ] 동적 import (선택적 페이지)
- [ ] 폰트 최적화 (system font 또는 google font)

#### Task 4.5: SEO & 메타 태그
- [ ] Root layout 메타 데이터
- [ ] Products 페이지 메타 데이터
- [ ] 동적 메타 데이터 (상세 페이지)
  ```typescript
  export async function generateMetadata({ params }) {
    const product = await getProduct(params.id)
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        image: product.imageUrl
      }
    }
  }
  ```

---

### Phase 5: 테스트 & 배포 (Week 3-4)
**목표**: 품질 보증, 운영 준비

#### Task 5.1: 기능 테스트
- [ ] 폼 검증 (필수 필드, 형식)
- [ ] API 오류 처리 (네트워크 오류, Notion API 오류)
- [ ] 빈 목록, 없는 상품 (404) 처리

#### Task 5.2: Playwright E2E 테스트 (선택)
```bash
npx playwright codegen http://localhost:3000
```

- [ ] 상품 추가 흐름
- [ ] 목록 필터링
- [ ] 상세 페이지 로드

#### Task 5.3: 성능 측정
- [ ] Lighthouse 점수 > 90
- [ ] Core Web Vitals 측정
- [ ] 번들 크기 확인

#### Task 5.4: 배포 준비
- [ ] 환경 변수 설정 (Vercel)
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
- [ ] 프리뷰 배포 테스트
- [ ] 프로덕션 배포

---

## 13. 성공 지표 (Success Metrics)

| 지표 | 초기 목표 | 3개월 목표 |
|------|---------|----------|
| **월간 상품 생성** | 10개 | 50개 |
| **페이지 로드 시간** | < 2s | < 1s |
| **API 응답 시간** | < 500ms | < 200ms |
| **폼 검증 성공률** | 95% | 99% |
| **에러율** | < 1% | < 0.1% |
| **접근성 점수 (Lighthouse)** | 90+ | 95+ |

---

## 14. 의존성 및 환경 설정

### 14.1 필요한 패키지
```bash
npm install @notionhq/client@^2.2.0
npm install react-hook-form@^7.72.0
npm install @hookform/resolvers@^5.2.2
npm install zod@^4.3.6
npm install sonner@^2.0.7
```

### 14.2 환경 변수 (.env.local)
```env
# Notion API
NOTION_API_KEY=ntn_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx
```

### 14.3 Next.js 설정 (next.config.ts)
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.example.com'  // 신뢰할 수 있는 이미지 도메인
      }
    ]
  }
}

export default nextConfig
```

---

## 15. 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 타입 체크
npx tsc --noEmit

# ESLint
npx eslint app/ components/ types/ lib/

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

---

## 16. 참고 자료 및 링크

| 항목 | URL |
|------|-----|
| Notion API 문서 | https://developers.notion.com/ |
| Next.js 16 문서 | https://nextjs.org/docs |
| react-hook-form | https://react-hook-form.com/ |
| Zod 검증 | https://zod.dev/ |
| shadcn/ui | https://ui.shadcn.com/ |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Vercel 배포 | https://vercel.com/docs |

---

## 17. 변경 이력

| 버전 | 날짜 | 변경 사항 |
|------|------|---------|
| 1.0 | 2026-04-02 | 초기 작성 (MVP) |

---

**상태**: Draft → Review → Approved → Development Start  
**작성자**: Product Manager  
**최종 검토일**: -  
**승인일**: -
