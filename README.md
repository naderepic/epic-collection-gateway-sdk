# Epic Collection Gateway SDK

A lightweight TypeScript/JavaScript SDK for integrating **Epic Collections Web Checkout** into your web storefront. It handles authentication, redirect-flow initiation, and return-URL parsing — no backend proxy required on your end.

---

## Features

- **`startEpicCollectionPayment`** – Authenticate with the Epic Collections API and get the redirect URL to the hosted payment portal in one call.
- **`redirectToPortal`** – Build a portal redirect URL manually (useful when you already have credentials configured via `initEpicPay`).
- **`parsePaymentResponseFromUrl`** – Parse query-string / hash parameters on your return page after the user completes (or cancels) payment.
- **`initEpicPay`** – Optional global config initializer (environment, APIbase, event callbacks, etc.).
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

On your `redirectUrl` page, parse the response:

```ts
import { parsePaymentResponseFromUrl } from "epic-collection-gateway-sdk";

const result = parsePaymentResponseFromUrl();
// { status, paymentRef, sessionId, ... }
console.log(result);
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

**Example — React checkout button**

```tsx
import { startEpicCollectionPayment } from "epic-collection-gateway-sdk";

function CheckoutButton({ cartItems }: { cartItems: CartItem[] }) {
  const [paying, setPaying] = useState(false);
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    try {
      setPaying(true);
      const url = await startEpicCollectionPayment({
        environment: "sandbox",
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        redirectUrl: "https://your-site.com",
        amount: total,
        sessionId: crypto.randomUUID(), // unique per order
        customerDetails: { email: "user@example.com" },
      });
      window.location.assign(url);
    } catch (err) {
      console.error("Payment initiation failed:", err);
    } finally {
      setPaying(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={!cartItems.length || paying}>
      {paying ? "Processing…" : `Pay ₦${total.toFixed(2)}`}
    </button>
  );
}
```

---

### `redirectToPortal(params)` → `string`

Builds and returns the portal URL without making an auth API call. Use this if credentials are already set via `initEpicPay` and you want manual control.

| Param | Type | Required | Description |
|---|---|---|---|
| `amount` | `number` | ✅ | Checkout amount. |
| `sessionId` | `string` | ✅ | Unique checkout session ID. |
| `redirectUrl` | `string` | — | Overrides the `redirectUrl` set in `initEpicPay`. |
| `customerDetails` | `EpicCollectioncustomerDetails` | — | Optional customer metadata. |
| `additionalParams` | `Record<string, string \| number \| boolean>` | — | Any extra query params to append to the URL. |

> **Note:** `initEpicPay({ redirectUrl: "..." })` must be called before `redirectToPortal`, or a `redirectUrl` must be passed directly in params.

```ts
import { initEpicPay, redirectToPortal } from "epic-collection-gateway-sdk";

initEpicPay({
  redirectUrl: "https://pay.your-portal.com/checkout",
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
});

const url = redirectToPortal({
  amount: 2300,
  sessionId: "sess_123456789",
  redirectUrl: "https://your-site.com/order-result",
  customerDetails: { email: "user@example.com" },
});

window.location.assign(url);
```

---

### `parsePaymentResponseFromUrl(raw?)` → `Record<string, string>`

Parses query-string or hash parameters from the current page URL (or a custom string) and returns them as a plain object. Call this on your `redirectUrl` return page.

```ts
import { parsePaymentResponseFromUrl } from "epic-collection-gateway-sdk";

// Automatically reads window.location.search or window.location.hash
const result = parsePaymentResponseFromUrl();

if (result.status === "success") {
  console.log("Payment reference:", result.paymentRef);
  console.log("Session ID:", result.sessionId);
} else {
  console.warn("Payment not completed:", result.status);
}
```

You may also pass a raw query string:

```ts
const result = parsePaymentResponseFromUrl("?status=success&paymentRef=TXN_001");
```

---

### `initEpicPay(options?)` → `void`

Sets global SDK configuration. Call this once at app startup. All options are optional.

| Option | Type | Default | Description |
|---|---|---|---|
| `environment` | `'sandbox' \| 'production'` | `'sandbox'` | Target environment. |
| `apiBase` | `string` | — | Base URL for the Epic Collections API. |
| `redirectUrl` | `string` | — | Default portal redirect URL. |
| `clientId` | `string` | — | Client ID (can be passed here or per-call). |
| `clientSecret` | `string` | — | Client secret (can be passed here or per-call). |
| `headers` | `Record<string, string>` | — | Custom headers appended to API requests. |
| `onEvent` | `(event: PaymentEvent) => void` | — | Global event callback. |

```ts
import { initEpicPay } from "epic-collection-gateway-sdk";

initEpicPay({
  environment: "production",
  onEvent: (e) => console.log("[EpicPay event]", e.type, e.payload),
});
```

---

## TypeScript Types

All types are exported from the package root:

```ts
import type {
  EpicPayInitOptions,
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

| Type | Description |
|---|---|
| `EpicPayInitOptions` | Options for `initEpicPay()`. |
| `StartEpicCollectionPaymentOptions` | Options for `startEpicCollectionPayment()`. |
| `RedirectToPortalParams` | Params for `redirectToPortal()`. |
| `EpicCollectioncustomerDetails` | Optional customer fields forwarded to the portal. |
| `PaymentEvent` | Event object emitted via `onEvent`. Shape: `{ type, payload, timestamp }`. |
| `PaymentResult` | Result shape returned from the portal on the return URL. |

---

## Default Export

A convenience object is available as the default export:

```ts
import EpicCollectionSdk from "epic-collection-gateway-sdk";

const { startEpicCollectionPayment, redirectToPortal, parsePaymentResponseFromUrl, initEpicPay } = EpicCollectionSdk;
```

---

## Environment Variables (SDK-internal)

When bundling the SDK from source, the following `VITE_` environment variables are resolved at build time:

| Variable | Purpose |
|---|---|
| `VITE_PORTAL_URL` | Overrides the default payment portal base URL. |
| `VITE_EPIC_ENVIRONMENT` | Sets the default environment (`sandbox` / `production`). |

> These are for SDK development only. Integrators do **not** need to set these — pass `apiBase` / `redirectUrl` via `initEpicPay` or `startEpicCollectionPayment` instead.

---

## License

MIT
