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