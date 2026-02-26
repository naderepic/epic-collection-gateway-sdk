# Epic Collection Gateway SDK

A lightweight TypeScript/JavaScript SDK for integrating **Epic Collections Web Checkout** into your web storefront. It handles authentication and redirect-flow initiation.

---

## Features

- **`startEpicCollectionPayment`** – Authenticate with the Epic Collections API and get the redirect URL to the hosted payment portal in one call.
- **`redirectToPortal`** – Build a portal redirect URL manually.
- Zero dependencies, ESM-only, full TypeScript types included.

---

## Installation

```bash
npm install epic-collection-gateway-sdk
```

---

## Quick Start

```ts
import { startEpicCollectionPayment } from "epic-collection-gateway-sdk";

const url = await startEpicCollectionPayment({
  environment: "sandbox",
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUrl: "https://your-site.com/order-result",
  amount: 2500,
  sessionId: "unique_order_session_id",
  customerDetails: { email: "user@example.com" },
});

// Navigate the user to the hosted payment portal
window.location.assign(url);
```

---

## API Reference

### `startEpicCollectionPayment(options)` → `Promise<string>`

Authenticates your session with the Epic Collections backend and returns the fully-qualified portal redirect URL. This is the **primary integration function** for most storefronts.

| Option | Type | Required | Description |
|---|---|---|---|
| `environment` | `string` | ✅ | Environment (sandbox or production). |
| `clientId` | `string` | ✅ | Issued from the Epic Collections Admin Portal (min 16 chars). |
| `clientSecret` | `string` | ✅ | Issued from the Epic Collections Admin Portal (min 16 chars). |
| `redirectUrl` | `string` | ✅ | Merchant callback URL — where the user lands after payment or cancellation. |
| `amount` | `number` | ✅ | Checkout amount (e.g. `2500` for ₦2,500). |
| `sessionId` | `string` | ✅ | Unique identifier for this checkout session / order (min 16 chars). |
| `customerDetails` | `EpicCollectioncustomerDetails` | — | Optional customer info forwarded to the portal. |

**`EpicCollectioncustomerDetails`**

```ts
interface EpicCollectioncustomerDetails {
  name?: string;
  email?: string;
  phone?: string;
}
```

---

### `redirectToPortal(params)` → `string`

Builds and returns the portal URL without making an auth API call.

| Param | Type | Required | Description |
|---|---|---|---|
| `amount` | `number` | ✅ | Checkout amount. |
| `sessionId` | `string` | ✅ | Unique checkout session ID. |
| `redirectUrl` | `string` | — | Overrides the default redirect URL. |
| `customerDetails` | `EpicCollectioncustomerDetails` | — | Optional customer metadata. |
| `additionalParams` | `Record<string, string \| number \| boolean>` | — | Any extra query params to append to the URL. |

```ts
import { redirectToPortal } from "epic-collection-gateway-sdk";

const url = redirectToPortal({
  amount: 2300,
  sessionId: "sess_123456789",
  redirectUrl: "https://your-site.com/order-result",
  customerDetails: { email: "user@example.com" },
});

window.location.assign(url);
```

---

## TypeScript Types

All types are exported from the package root:

```ts
import type {
  EpicPayEnvironment,
  StartEpicCollectionPaymentOptions,
  EpicCollectioncustomerDetails,
  RedirectToPortalParams,
  EpicPayConfig,
  PaymentEvent,
  PaymentResult,
  CustomerInfo,
} from "epic-collection-gateway-sdk";
```

---

## Default Export

A convenience object is available as the default export:

```ts
import EpicCollectionSdk from "epic-collection-gateway-sdk";

const { startEpicCollectionPayment, redirectToPortal } = EpicCollectionSdk;
```

---

## License

MIT
