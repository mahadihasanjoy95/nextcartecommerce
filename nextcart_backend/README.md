# Backend Starter Direction

Implement the backend as a modular Spring Boot monolith using Java 25 and Spring Boot 4.0.5.

The initial focus is not authentication or RBAC. The first goal is to deliver product-related APIs quickly so the backend can power both the React storefront homepage and a future Flutter mobile app.

## Initial Development Priority

1. `common`
2. `catalog`
3. `files`
4. `inventory`
5. `pricing`
6. `admin-lite`
7. `audit`

Later phases will introduce:

8. `cart`
9. `checkout`
10. `orders`
11. `payments`
12. `identity`
13. `rbac`
14. `users`
15. `notifications`
16. `support`
17. `analytics`

## Core Principle

Build visible business functionality first.

The first milestone is a working product catalog backend that supports:
- homepage product listing
- product details
- category and brand browsing
- product search and filtering
- product creation and update from Postman
- product image upload
- basic stock visibility
- basic price display

This allows immediate integration with:
- React frontend
- Flutter mobile app

Authentication, Spring Security, refresh tokens, admin invitation flow, and dynamic RBAC will be added later after the product foundation is stable.

## Key Technical Choices

- Java 25
- Spring Boot 4.0.5
- Spring Web MVC
- Spring Data JPA
- MySQL
- Flyway
- Redis
- MapStruct
- Lombok
- Micrometer
- OpenTelemetry

## Current Scope

### Phase 1: Catalog Foundation
- create product
- update product
- get product details
- list products for storefront
- list featured products
- list products by category
- search and filter products
- create and manage categories
- create and manage brands
- manage variants
- upload product images
- basic inventory quantity support
- basic pricing support
- publish/unpublish product

### Phase 2: Commerce Flow
- cart APIs
- checkout APIs
- order creation
- payment initiation
- payment webhook handling

### Phase 3: Platform Security and Management
- Spring Security
- admin login
- access token and refresh token flow
- user management
- dynamic RBAC
- audit logging
- Redis caching for permissions

## Initial Deliverables

- product creation API
- product update API
- product listing API
- product details API
- category API
- brand API
- product variant API
- product image upload API
- Redis cache for product listing and product details
- audit trail for product changes

## Suggested Package Direction

The project should remain modular, but the internal code structure should be simple and consistent.

Example package style inside each module:

- controller
- service
- repository
- entity
- dto
- mapper
- config
- exception

## Initial API Priority

Public/storefront:
- `GET /api/v1/products`
- `GET /api/v1/products/{slug}`
- `GET /api/v1/categories`
- `GET /api/v1/brands`

Admin/dev:
- `POST /api/v1/admin/products`
- `PUT /api/v1/admin/products/{id}`
- `POST /api/v1/admin/categories`
- `POST /api/v1/admin/brands`
- `POST /api/v1/admin/products/{id}/images`
- `PATCH /api/v1/admin/products/{id}/status`
- `PATCH /api/v1/admin/variants/{id}/stock`

## Redis Usage in Initial Phase

Redis should be introduced early, but only for high-value reads:
- homepage product list cache
- featured product cache
- product details cache
- category tree cache

Do not overuse Redis in the first phase.

## IntelliJ Run Notes

- Open the project from the repository root so IntelliJ can detect the correct Maven structure.
- If IntelliJ does not auto-import Maven, open the root `pom.xml` manually.
- Do not mark the repository root as a Java source folder.
- The correct source root is `backend/src/main/java`.
- For local startup, use the `local` profile.
- Main class: `com.fashioncommerce.FashionCommerceApplication`
- Suggested VM option:
  - `-Dspring.profiles.active=local`

## Current Non-Goals

The following are intentionally postponed:
- Spring Security
- JWT authentication
- refresh token flow
- dynamic RBAC
- customer accounts
- admin invitation flow
- checkout security hardening
- notification workflows
- analytics dashboards

These will be added after the catalog foundation is complete and integrated successfully with frontend clients.