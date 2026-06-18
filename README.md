# Ecommerce Web Application

A full-stack ecommerce storefront built with Next.js, Tailwind CSS, Firebase Authentication, MongoDB, Axios, and Cypress.

## Features

- Firebase login/signup with email/password, Google, and Twitter.
- Product browsing with search, category filters, and pagination.
- Product detail pages with image preview, ratings, and review submission.
- Shopping cart with quantity controls, removal, and checkout summary.
- Wishlist management for saved products and quick cart moves.
- Checkout flow with shipping information, payment options, and voucher display.

## Application Pages

- **Home**: promo banner, feature cards, and category navigation.
- **Product List**: searchable and paginated product discovery.
- **Product Detail**: detailed product view with reviews and similar items.
- **Cart**: empty state, item management, totals, and checkout path.
- **Checkout**: shipping form, payment selection, and order flow.
- **Wishlist**: saved favorites with add-to-cart actions.
- **Authentication**: login and signup with validation and notifications.

## Run Locally

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open the browser:

   ```text
   http://localhost:3000
   ```

4. Run linting:

   ```bash
   npm run lint
   ```

5. Run tests:

   ```bash
   npm test
   ```

6. Run Cypress e2e tests:

   ```bash
   npm run cy:run
   ```

## CI/CD Documentation

This repository uses a two-stage GitHub Actions pipeline to ensure code quality, automated testing, and safe deployments:

- **CI Pipeline** (`.github/workflows/ci.yml`): Lint, unit test, and build validation on every push/PR
- **CD Pipeline** (`.github/workflows/cd.yml`): Staging deployment, E2E testing, and production release (triggered on CI success)

### CI Pipeline – Code Quality & Testing

Runs automatically on every push to `master` and all pull requests.

#### Stages

1. **Install dependencies**
   - Uses `npm ci` for deterministic installs from `package-lock.json`

2. **Lint**
   - Runs `npm run lint` to enforce code style and quality rules

3. **Unit tests & coverage**
   - Runs `npm run test:ci` to validate component and business logic
   - Generates coverage report

4. **Build check**
   - Runs `npm run build` to verify the Next.js app compiles without errors

#### Configuration

- Node.js version: `22`
- NPM version: `11.6.2`
- Timeout: 10–20 min per job
- GitHub Secrets: Firebase and MongoDB credentials
- Uses YAML anchors to reduce boilerplate and improve maintainability

### CD Pipeline – Staging & Production Deployment

Triggered automatically when CI pipeline succeeds on `master` branch.

#### Stage 1: Deploy to Staging

- Builds Docker image with Next.js app and Firebase public keys
- Pushes image to Google Cloud Artifact Registry (tagged with commit SHA and `latest`)
- Deploys to Cloud Run staging service (asia-southeast2 region)
- Sets `NODE_ENV=staging` with staging MongoDB connection
- Makes staging URL available to next stages

#### Stage 2: Run Cypress E2E on Staging

- Waits for staging deployment to become healthy
- Runs full Cypress test suite against the live staging app (`npm run cy:run`)
- Captures screenshots and videos on test failures
- Uses test credentials from GitHub Secrets
- If any test fails, the pipeline stops before production deployment

#### Stage 3: Deploy to Production

- Only runs after staging deployment and E2E tests succeed
- Captures current production revision for rollback
- Deploys Docker image to Cloud Run production service
- Sets `NODE_ENV=production` with production MongoDB connection
- Executes smoke test (curl) to verify production is responsive
- **Automatic Rollback**: If smoke test fails, automatically rolls back to previous revision

#### Infrastructure Details

| Component      | Details                                                          |
| -------------- | ---------------------------------------------------------------- |
| **Hosting**    | Google Cloud Run (serverless containers)                         |
| **Registry**   | Google Cloud Artifact Registry (asia-southeast2)                 |
| **Regions**    | asia-southeast2 for all services                                 |
| **Image Tags** | commit SHA (e.g., `abc123def`) and `latest`                      |
| **Database**   | MongoDB (staging and production separate instances)              |
| **Secrets**    | GitHub Secrets for all credentials (Firebase, Admin SDK, DB_URI) |

#### Security & Environment Variables

All environment variables are managed via GitHub Secrets and injected at deployment time:

- **Build-time**: Firebase public keys (required for Next.js client)
- **Runtime**: Firebase Admin SDK credentials, MongoDB URI, NODE_ENV
- Cloud Run services are publicly accessible (`--allow-unauthenticated`)
- Staging and production use separate Firebase projects and MongoDB instances

## Credits

This project builds upon an open-source ecommerce starter template.

**Original Repository**: [DivyaGaurav21/next-ecommerce](https://github.com/DivyaGaurav21/next-ecommerce)  
**Original Author**: [Divya Gaurav](https://github.com/DivyaGaurav21)

**Extended & Maintained By**: Current Development Team

The project has been significantly extended with features including Firebase authentication, MongoDB integration, Cypress e2e testing, GitHub Actions CI/CD pipeline with staging and production deployments, and comprehensive test coverage.
