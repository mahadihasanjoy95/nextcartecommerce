# NextCart Mobile

Flutter mobile application for the NextCart Fashion House platform.

## Stack

- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Riverpod
- **HTTP Client**: Dio
- **Navigation**: go_router

## Backend Integration

The app consumes the Spring Boot backend REST API.

- **Base URL (local)**: `http://10.0.2.2:8081/api/v1` (Android emulator)
- **Base URL (iOS sim)**: `http://localhost:8081/api/v1`
- **API Docs (local)**: `http://localhost:8081/swagger-ui.html`

## Initial Milestone — Product Catalog Screens

The first deliverable connects the product catalog to native mobile screens.

### Target Screens

| Screen | API |
|---|---|
| Product Listing | `GET /api/v1/products` |
| Product Detail | `GET /api/v1/products/slug/{slug}` |

### Planned Screens

- Product listing: paginated product grid with thumbnail, name, price
- Product detail: full product information, pricing, stock badge, description
- Category browse: filter products by category
- Brand browse: filter products by brand

## Development Setup

```bash
# Get dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

## Non-Goals (Phase 1)

The following are intentionally deferred:

- User authentication and accounts
- Shopping cart and checkout
- Order history
- Push notifications
- Payment flows

These will be introduced after the catalog foundation is stable and integrated with both clients.
