# Creem SDK

A TypeScript SDK for interacting with the Creem API, providing seamless integration for payment processing, license management, and product operations.

> **Important**: The SDK is not intended for client-side use since it contains your API key. It is ONLY intended for server-side use especially in a serverless environment. In NextJS, you can use the SDK in server components and API routes (where 'use client' is not set). This is demonstrated in the example app where the SDK is used in the checkout completion page and other server-side locations.

## Note

This is a demonstration project for a [creem](https://creem.io) payment SDK. This example application is a monorepo built with [turbo](https://turbo.build/repo/docs/guides/monorepos/introduction), [supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs), and [next.js](https://nextjs.org/docs/getting-started). If you have any questions, please reach out to to me at [jannunziato@caltho.com](mailto:jannunziato@caltho.com).

## Quick Start

```typescript
import { CreemSDK } from '@creem/sdk'; 

const creem = new CreemSDK({
  apiKey: 'creem_your_api_key_here'
});
```

## Features

- 🔐 **License Management**: Activate, deactivate, and validate licenses
- 💳 **Payment Processing**: Handle checkouts and subscriptions
- 🏷️ **Product Management**: Create and manage products
- 💰 **Discount Codes**: Create and manage discount codes
- 📊 **Transaction Tracking**: Search and list transactions
- 🔒 **Security**: Webhook signature verification
- 👤 **Customer Management**: Access customer information and billing portals

## API Reference

### Authentication

The SDK automatically handles authentication using your API key. The environment (test/live) is determined by your API key prefix.

```typescript
// Test environment
const testCreem = new CreemSDK({ apiKey: 'creem_test_...' });

// Production environment
const prodCreem = new CreemSDK({ apiKey: 'creem_live_...' });
```

### Checkout Sessions

```typescript
// Create a checkout session
const session = await creem.createCheckoutSession({
  success_url: 'https://your-site.com/success',
  cancel_url: 'https://your-site.com/cancel',
  product_id: 'prod_xxx'
});
```

### License Management

```typescript
// Activate a license
const activation = await creem.activateLicense({
  license_key: 'LICENSE_KEY',
  instance_id: 'INSTANCE_ID'
});

// Validate a license
const validation = await creem.validateLicense({
  license_key: 'LICENSE_KEY',
  instance_id: 'INSTANCE_ID'
});

// Deactivate a license
const deactivation = await creem.deactivateLicense({
  license_key: 'LICENSE_KEY',
  instance_id: 'INSTANCE_ID'
});
```

### Product Operations

```typescript
// Create a product
const product = await creem.createProduct({
  name: 'My Product',
  price: 2999, // in cents
  currency: 'USD'
});

// Get product details
const product = await creem.getProduct('prod_xxx');

// List products
const products = await creem.listProducts({
  limit: 10,
  offset: 0
});
```

### Subscription Management

```typescript
// Get subscription details
const subscription = await creem.getSubscription({
  subscription_id: 'sub_xxx'
});

// Cancel subscription
const cancelledSub = await creem.cancelSubscription({
  id: 'sub_xxx'
});
```

### Security

```typescript
// Verify webhook signatures
const isValid = creem.verifyWebhookSignature(
  payload,
  signature,
  webhookSecret
);

// Verify redirect signatures
const isValidRedirect = creem.verifyRedirectSignature(
  redirectParams,
  signature
);
```

### Customer Management

```typescript
// Get customer details
const customer = await creem.getCustomer({
  customer_id: 'cust_xxx'
  // or
  email: 'customer@example.com'
});

// Create billing portal session
const session = await creem.createBillingPortalSession({
  customer_id: 'cust_xxx',
  return_url: 'https://your-site.com/account'
});
```

## Error Handling

The SDK throws errors for invalid requests or API failures. Always wrap API calls in try-catch blocks:

```typescript
try {
  const product = await creem.getProduct('prod_xxx');
} catch (error) {
  console.error('Error fetching product:', error.message);
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions for all methods and responses.

## Local Development with ngrok

To test webhooks locally, you'll need to expose your local server to the internet using ngrok. Here's how to set it up:

### 1. Update Package.json
Add the experimental HTTPS flag to your dev script in `./apps/web/package.json`:
```json
"dev": "next dev --turbopack --experimental-https"
```

### 2. Install ngrok

Choose your platform:

**macOS** ([installation guide](https://ngrok.com/docs/getting-started/?os=macos)):
```bash
brew install ngrok
```

**Windows** ([installation guide](https://ngrok.com/docs/getting-started/?os=windows)):
```bash
choco install ngrok
```

**Linux** ([installation guide](https://ngrok.com/docs/getting-started/?os=linux)):
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo gpg --dearmor -o /etc/apt/keyrings/ngrok.gpg && \
  echo "deb [signed-by=/etc/apt/keyrings/ngrok.gpg] https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

### 3. Configure ngrok

1. Sign up for an account at [ngrok dashboard](https://dashboard.ngrok.com/)
2. Get your auth token from the [ngrok auth dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Configure ngrok with your auth token ([source](https://ngrok.com/docs/getting-started/?os=macos#step-2-connect-your-account)):
```bash
ngrok config add-authtoken <YOUR_AUTH_TOKEN>
```

### 4. Run ngrok
In a separate terminal session ([source](https://ngrok.com/docs/getting-started/?os=macos#step-3-put-your-app-online)):
```bash
npm run ngrok
```

**Optional:** For a consistent URL, claim a FREE static domain on [ngrok domains dashboard](https://dashboard.ngrok.com/domains) and update your package.json ([source](https://ngrok.com/docs/getting-started/?os=macos#step-4-always-use-the-same-domain)):
```json
"ngrok": "ngrok http https://localhost:3000 --domain your-domain.ngrok-free.app"
```

### 5. Configure Supabase

Update `./supabase/config.toml` to include your ngrok URL:
```toml
additional_redirect_urls = [
  "https://your-domain.ngrok-free.app"
]
```

### 6. Start Services

1. Start/restart Supabase:
```bash
supabase start
```

2. Run your app:
```bash
npm run dev
```

### 7. Configure Webhooks

1. Access your app at your ngrok URL (e.g., `https://your-domain.ngrok-free.app`)
2. Set up webhook URL in [Creem dashboard](https://www.creem.io/developers/webhooks/new)
3. Configure product IDs in `./apps/web/app/page.tsx`

### 8. Test the Integration

1. Sign up/login at `/login` or `/signup`
2. Click a pricing card with a valid Creem product ID
3. For test mode, use [test cards](https://docs.creem.io/test-mode#testing-payments)
4. Monitor webhook logs in your terminal

### Environment Variables

Create a `.env` file with the following variables:

```env
CREEM_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CREEM_WEBHOOK_SECRET=
```