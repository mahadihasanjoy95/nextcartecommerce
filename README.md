# NextCart

A full-stack e-commerce platform built as a monorepo — Spring Boot backend, React storefront, React admin dashboard, and Flutter mobile app.

---

## Repository Structure

```
nextcartecommerce/
├── nextcart_backend/          # Spring Boot REST API
├── nextcart_frontend/         # React customer storefront
├── nextcart_admin_frontend/   # React admin dashboard
└── nextcart_mobile/           # Flutter mobile app
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 25, Spring Boot 4.x, Spring Security, JWT |
| Database | MySQL 8 |
| Storage | AWS S3 |
| Auth | JWT + Google OAuth2 |
| Frontend | React 18, Vite |
| Mobile | Flutter |
| API Docs | Swagger / OpenAPI |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2, Nginx |

---

## Getting Started

### Prerequisites

- Java 25
- Maven 3.9+
- MySQL 8
- Node.js 20+
- Flutter SDK (for mobile)

### Backend

1. Create a MySQL database named `nextcart`
2. In IntelliJ, open **Run/Debug Configurations** → your Spring Boot config → **Modify options** → **Environment variables**
3. Add all variables listed in [`application.properties.example`](nextcart_backend/src/main/resources/application.properties.example) with your real values
4. Run the application — starts on `http://localhost:8081`
5. API docs at `http://localhost:8081/swagger-ui.html`

### Frontend (Customer Storefront)

```bash
cd nextcart_frontend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Admin Dashboard

```bash
cd nextcart_admin_frontend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:3001`

### Mobile

```bash
cd nextcart_mobile
flutter pub get
flutter run
```

---

## Environment Variables

All secrets are injected via environment variables — nothing is hardcoded in committed files.

See [`nextcart_backend/src/main/resources/application.properties.example`](nextcart_backend/src/main/resources/application.properties.example) for the full list of required variables.

---

## CI/CD

GitHub Actions workflows deploy automatically to EC2 on push to `master`:

| Workflow | Trigger path | Deploy target |
|----------|-------------|---------------|
| `backend.yml` | `nextcart_backend/**` | EC2 → systemd service |
| `frontend.yml` | `nextcart_frontend/**` | EC2 → Nginx `/var/www/nextcart-frontend/` |
| `admin-frontend.yml` | `nextcart_admin_frontend/**` | EC2 → Nginx `/var/www/nextcart-admin/` |

Required GitHub Secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `VITE_API_BASE_URL`

---

## API Endpoints

Base URL: `http://localhost:8081/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all active products |
| GET | `/products/{id}` | Product details by ID |
| GET | `/products/slug/{slug}` | Product details by slug |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/register` | Register new user |
| GET | `/oauth2/authorization/google` | Google OAuth2 login |

Full interactive docs at `/swagger-ui.html`

---

## License

[MIT](LICENSE)
