## Project Identity

This repository is a mono-repo for the NextCart project.

Top-level structure:
- `nextcart_backend` → Spring Boot backend
- `nextcart_frontend` → React frontend
- `nextcart_mobile` → Flutter mobile app

The current primary focus is the backend inside `nextcart_backend`.

## Current Goal

The immediate goal is very narrow and practical:

Frontend and mobile must be able to fetch:
1. product list
2. product details

That means the backend priority is only the minimum product slice needed to support:
- React storefront homepage
- Flutter mobile product listing screen
- Flutter/mobile/web product details screen

Do not expand scope unnecessarily.

## Current Backend Scope

Build only what is required for:
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- optionally `GET /api/v1/products/slug/{slug}`
- simple product create/update APIs for Postman/testing

Do not start with:
- Spring Security
- RBAC
- cart
- checkout
- orders
- payments
- notifications
- Redis
- file upload
- admin invitation flow
- advanced inventory
- microservices

## Backend Stack

Use:
- Java 25
- Spring Boot 4.x
- Spring Web MVC
- Spring Data JPA
- MySQL
- Maven
- Jakarta Validation
- Swagger / OpenAPI

Prefer simple, working, production-minded implementation over overengineering.

## Package Root

Backend Java package root:
`com.mhjoy.nextcart`

Main application class should stay under the package root so Spring component scanning works correctly.

## Preferred Backend Package Style

Inside each backend module, prefer this package structure:

- `controller`
- `dto.request`
- `dto.response`
- `entity`
- `enums`
- `repository`
- `service`
- `service.serviceImpl`
- `exception` later if needed
- `mapper` later if needed

For now, avoid adding packages unless they are actually needed.

## DTO Naming Convention

Always use `Dto` suffix for DTOs.

Examples:
- `CreateProductRequestDto`
- `UpdateProductRequestDto`
- `ProductListResponseDto`
- `ProductDetailsResponseDto`
- `ProductResponseDto`

Do not mix suffix and non-suffix styles.

## API Response Standard

Use the existing shared response wrappers:
- `ApiResponse<T>`
- `PageResponse<T>`

All controller responses should follow that structure consistently.

## Product Module Rules

The first functional module is `product`.

The current product goal is only public read functionality plus simple admin/dev write support.

### Public read requirements
- product list
- product details

### Product list should expose
- `id`
- `name`
- `slug`
- `shortDescription`
- `basePrice`
- `salePrice`
- `currency`
- `thumbnailUrl`
- `featured`
- `newArrival`

### Product details should expose
- `id`
- `name`
- `slug`
- `shortDescription`
- `description`
- `basePrice`
- `salePrice`
- `currency`
- `thumbnailUrl`
- `featured`
- `newArrival`
- `status`

### Product business rules
- only `ACTIVE` products are visible in public APIs
- slug must be unique
- sale price cannot be greater than base price
- keep implementation simple and testable
- no authentication required yet

## Entity Design Preference

Do not make `Product` an everything-table.

Current acceptable `Product` fields include:
- `id`
- `name`
- `slug`
- `shortDescription`
- `description`
- `productType`
- `status`
- `category`
- `brand`
- `featured`
- `newArrival`
- `trackInventory`
- `inStock`
- `basePrice`
- `salePrice`
- `currency`
- `thumbnailUrl`
- `metaTitle`
- `metaDescription`
- `publishedAt`

Use:
- `ProductType`
- `ProductStatus`

Enums should live in:
- `product.enums`

Not inside `entity`.

## Validation Preference

Prefer DTO-level validation first.

Use:
- `@Valid` in controllers
- Jakarta validation annotations on DTOs
- custom validation annotations if needed

Do not clutter service implementations with avoidable request-level null/blank/format validation.

Service layer should mainly handle:
- database lookups
- business rules
- persistence
- relation resolution
- duplicate checks like slug uniqueness

Note:
partial update DTOs will still naturally require some field presence checks.

## Service Layer Preference

Keep service code clean and focused.

Prefer:
- validation at DTO level
- small helper methods
- minimal repetition
- readable business flow

Avoid:
- excessive inline null-check-heavy mapping logic
- overengineering
- mixing too many responsibilities

MapStruct can be introduced later if it clearly improves readability.

## Swagger / OpenAPI Standard

Add Swagger documentation on every controller method.

Use:
- `@Tag` on controller
- `@Operation` on each endpoint
- `@ApiResponses` on each endpoint

Keep summaries short and descriptions clear.

Use business-oriented tag names such as:
- `Product Management`
- `Category Management`
- `Brand Management`

## Coding Preferences

Preferred style:
- consistency over cleverness
- explicit naming
- minimal but clean abstractions
- production-minded defaults
- readable code for solo development

Avoid:
- introducing features outside the current milestone
- speculative architecture
- premature microservices
- unnecessary generic abstractions

## Current Development Priority

Priority order right now:

1. backend project loads correctly as Maven
2. application starts
3. database connection works
4. product entity + repository works
5. product list API works
6. product details API works
7. frontend/mobile consume product APIs
8. simple create/update APIs for Postman
9. Swagger docs visible and correct

## Non-Goals Right Now

Do not work on these unless explicitly requested:
- Spring Security
- JWT
- refresh token flow
- RBAC
- user management
- admin invitation
- cart
- checkout
- order placement
- payment integration
- webhook handling
- analytics
- audit logging
- Redis caching
- file storage
- advanced inventory
- product variants beyond what is immediately necessary

## When Generating Code

When asked to generate code:
1. respect existing package names
2. respect existing DTO naming conventions
3. use current response wrappers
4. avoid changing unrelated files
5. keep output directly usable
6. optimize for immediate visible progress

## Preferred Output Style For Assistance

When helping with implementation, structure responses like this:
1. quick explanation
2. required files
3. final code
4. sample request/response JSON
5. notes about dependencies
6. notes about migrations if relevant

## Repository Setup Reminder

The backend Maven root is:
- `nextcart_backend`

If the IDE does not detect Spring beans or dependencies correctly, ensure:
- `nextcart_backend` is loaded as the Maven project
- not the mono-repo top-level folder

## Future Direction

After the product list/details milestone is stable, the likely next scope is:
- category APIs
- brand APIs
- better product search/filtering
- simple admin/dev product creation flow
- then later cart and checkout

Until then, stay disciplined and keep the scope small.