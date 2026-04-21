## Repository overview

This is a mono-repo:
- `nextcart_backend` → Spring Boot backend
- `nextcart_frontend` → React frontend
- `nextcart_mobile` → Flutter mobile app

The current active work is in `nextcart_backend`.

## Current goal

Only implement the minimum backend product slice needed so frontend and mobile can fetch:
- product list
- product details

## Current backend stack

- Java 25
- Spring Boot 4.x
- Spring Data JPA
- MySQL
- Maven
- Swagger / OpenAPI
- Jakarta Validation

## Scope rules

Do:
- product entity/repository/service/controller
- product list API
- product details API
- simple create/update APIs for Postman
- DTO validation
- Swagger docs on controllers

Do not do unless asked:
- Spring Security
- RBAC
- cart
- checkout
- orders
- payments
- Redis
- file upload
- admin invitation
- microservices

## Package root

Use:
`com.mhjoy.nextcart`

## DTO naming

Use `Dto` suffix consistently.

## API response standard

Use existing wrappers:
- `ApiResponse<T>`
- `PageResponse<T>`

## Product rules

- only `ACTIVE` products visible publicly
- slug unique
- sale price <= base price

## Structure preference

Inside backend modules prefer:
- controller
- dto.request
- dto.response
- entity
- enums
- repository
- service
- service.serviceImpl

## Working style

- keep implementation minimal and production-minded
- prefer DTO validation over noisy service validation
- avoid overengineering
- avoid unrelated changes

## IDE/Maven note

The Maven project root is `nextcart_backend`.
If the IDE is not detecting beans or dependencies, load `nextcart_backend/pom.xml` as the Maven project.