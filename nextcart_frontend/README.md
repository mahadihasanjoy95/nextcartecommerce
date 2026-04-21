# NextCart Frontend

Customer-facing React storefront for **NextCart Fashion House**.

---

## Quick Start

```bash
cd nextcart_frontend
npm install
npm run dev          # → http://localhost:3000
```

> **Prerequisite:** Backend must be running at `http://localhost:8081`  
> See `nextcart_backend/` for backend setup.

---

## Tech Stack

| Tool | Purpose | Why chosen |
|---|---|---|
| **React 18** | UI framework | Industry standard, component model |
| **Vite** | Build tool | Fast HMR, modern ESM, much faster than CRA |
| **Tailwind CSS v3** | Styling | Utility-first, custom theme, zero CSS bloat |
| **TanStack Query v5** | Server state | Caching, loading/error states, no Redux needed |
| **React Router v6** | Routing | Standard, nested routes ready |
| **Axios** | HTTP client | Interceptors, timeout, consistent error handling |
| **react-icons** | Icon library | Tree-shakeable, huge set |

### Why TanStack Query (not Redux)?

The homepage only needs server state (product list from API).
TanStack Query handles fetching, caching, background refetching, and error states
out of the box — no boilerplate reducers or action creators needed.

When cart/user state is added, introduce a small **Zustand** store alongside it.
Redux would be overkill for a solo-developer project at this stage.

---

## Project Structure

```
src/
├── assets/              # Static assets (images, icons, fonts)
│
├── components/
│   ├── common/          # Reusable building blocks
│   │   ├── Badge.jsx        – Product status pill (featured / new / sale)
│   │   ├── Button.jsx       – Branded button (primary / outline / ghost)
│   │   ├── EmptyState.jsx   – Zero-results UI
│   │   ├── ErrorDisplay.jsx – API error UI with retry
│   │   ├── Loader.jsx       – Skeleton card grid
│   │   └── SectionTitle.jsx – Eyebrow + heading + decorative underline
│   │
│   ├── home/            # Homepage-specific sections
│   │   ├── HeroSection.jsx       – Full-width landing banner
│   │   └── FeatureHighlights.jsx – "Why shop with us" strip
│   │
│   ├── layout/          # Persistent shell components
│   │   ├── Navbar.jsx   – Sticky top nav (scroll shadow, mobile drawer)
│   │   └── Footer.jsx   – Site footer with links + newsletter
│   │
│   └── product/         # Product-domain components
│       ├── ProductCard.jsx  – Single product tile (image, price, badges)
│       └── ProductGrid.jsx  – Grid + filter tabs + pagination
│
├── constants/
│   ├── api.js           # ENDPOINTS, BASE_URL, DEFAULT_PAGE_SIZE
│   └── app.js           # NAV_LINKS, FOOTER_LINKS, PRODUCT_FILTERS, APP_NAME
│
├── hooks/
│   └── useProducts.js   # useProducts(), useProductBySlug()
│
├── pages/
│   └── HomePage/
│       └── index.jsx    # Assembles all homepage sections
│
├── services/
│   ├── apiClient.js     # Axios instance with interceptors
│   └── productService.js # getProducts(), getProductById(), getProductBySlug()
│
├── styles/
│   └── index.css        # Tailwind directives + custom component classes
│
└── utils/
    └── formatters.js    # formatPrice(), discountPercent(), truncate(), productPath()
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust:

```env
VITE_API_BASE_URL=http://localhost:8081
```

---

## API Integration Design

All HTTP traffic flows through a single Axios instance:

```
Component / Hook
    ↓  useProducts (hooks/useProducts.js)
    ↓  productService.getProducts() (services/productService.js)
    ↓  apiClient.get('/api/v1/products') (services/apiClient.js)
    ↓  Backend: GET http://localhost:8081/api/v1/products
```

---

## Adding New Pages

1. Create `src/pages/YourPage/index.jsx`
2. Add the route in `src/App.jsx`:
   ```jsx
   <Route path="/your-path" element={<YourPage />} />
   ```

### Product Details Page (next milestone)
- Route: `/products/:slug`
- Hook: `useProductBySlug(slug)` is already implemented in `hooks/useProducts.js`
- Service: `productService.getProductBySlug(slug)` is already implemented

### Cart Page (future)
- Introduce a Zustand store: `src/store/cartStore.js`
- No changes to the existing API layer needed

### Authentication (future)
- Add Zustand `authStore.js`
- Update `apiClient.js` request interceptor to attach `Authorization: Bearer <token>`

---

## Brand Colours

| Token | Hex | Usage |
|---|---|---|
| `brand-pink-500` | `#F43F6E` | Primary CTA, active states |
| `brand-pink-400` | `#FF5C88` | Hover highlights |
| `brand-pink-50`  | `#FFF0F3` | Soft backgrounds |
| `brand-yellow-400` | `#FBBF24` | New badges, star ratings |
| `surface` | `#FFFBF8` | Page background (warm white) |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Backend API Reference

| Endpoint | Usage |
|---|---|
| `GET /api/v1/products?page=0&size=12` | Product list (homepage grid) |
| `GET /api/v1/products/{id}` | Product details by ID |
| `GET /api/v1/products/slug/{slug}` | Product details by slug |
| Swagger UI | `http://localhost:8081/swagger-ui.html` |
