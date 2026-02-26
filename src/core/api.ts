import { setConfig, epicConfig } from './epicConfig';
import { EPIC_HEADERS } from './constants';

export type EpicPayEnvironment = 'sandbox' | 'production';


export interface RedirectToPortalParams {
  environment?: EpicPayEnvironment;
  amount: number;
  sessionId: string;
  additionalParams?: Record<string, string | number | boolean>;
  redirectUrl?: string;
  customerDetails?: EpicCollectioncustomerDetails;
}

export interface EpicCollectioncustomerDetails {
  name?: string;
  email?: string;
  phone?: string;
}

export interface StartEpicCollectionPaymentOptions {
  environment?: EpicPayEnvironment;
  clientId: string;
  clientSecret: string;
  /** Merchant callback URL where the shopper is sent back after payment/cancel */
  redirectUrl: string;
  amount: number;
  sessionId: string;
  customerDetails?: EpicCollectioncustomerDetails;
}

export function redirectToPortal(params: RedirectToPortalParams) {
  const { environment, amount, sessionId, additionalParams, redirectUrl } = params;
  const portal = epicConfig.redirectUrl || epicConfig.apiBase;
  if (!portal) {
    throw new Error('No redirectUrl configured. Call initEpicPay({ redirectUrl: "https://..." }).');
  }

  const qs: Record<string, string> = {
    amount: String(amount),
    sessionId,
  };
  if (redirectUrl) qs.redirectUrl = String(redirectUrl);
  if (epicConfig.clientId) qs.clientId = epicConfig.clientId;
  if (epicConfig.clientSecret) qs.clientSecret = epicConfig.clientSecret;
  if (environment) qs.environment = String(environment);
  if (additionalParams) {
    Object.keys(additionalParams).forEach((k) => {
      qs[k] = String((additionalParams as any)[k]);
    });
  }

  const search = Object.keys(qs)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(qs[k])}`)
    .join('&');
  const url = portal + (portal.includes('?') ? '&' : '?') + search;
  try { console.log('[EpicPay] redirectToPortal', { portal, amount, sessionId }); } catch { }
  try { console.log('[EpicPay] redirectToPortal URL:', url); } catch { }
  return url;
}

export async function startEpicCollectionPayment(options: StartEpicCollectionPaymentOptions) {
  const { environment, clientId, clientSecret, redirectUrl, amount, sessionId, customerDetails } = options;

  if (!environment || typeof environment !== 'string') {
    throw new Error('Invalid environment');
  }
  if (!clientId || typeof clientId !== 'string' || clientId.length < 16) {
    throw new Error('Invalid clientId');
  }
  if (!clientSecret || typeof clientSecret !== 'string' || clientSecret.length < 16) {
    throw new Error('Invalid clientSecret');
  }
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 16) {
    throw new Error('Invalid sessionId');
  }
  if (!redirectUrl || typeof redirectUrl !== 'string') {
    throw new Error('Invalid redirectUrl');
  }

  setConfig({
    environment,
    clientId,
    clientSecret,
  });

  const base = epicConfig.apiBase;
  if (!base) {
    throw new Error('No API base configured for authentication');
  }
  const authUrl = (base.endsWith('/') ? base.slice(0, -1) : base) + '/web-checkout/auth';
  const authRes = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...EPIC_HEADERS },
    body: JSON.stringify({
      environment,
      clientId,
      clientSecret,
      sessionId,
      amount,
      redirectUrl,
      customerDetails,
    }),
  });
  if (!authRes.ok) {
    throw new Error('Authentication request failed');
  }
  try {
    await authRes.json();
  } catch { }

  const additionalParams: Record<string, string> = {};
  additionalParams.clientSecret = clientSecret;
  if (customerDetails) {
    if (customerDetails.name) additionalParams.clientName = String(customerDetails.name);
    if (customerDetails.email) additionalParams.clientEmail = String(customerDetails.email);
    if (customerDetails.phone) additionalParams.clientPhone = String(customerDetails.phone);
  }

  return redirectToPortal({
    amount,
    sessionId,
    additionalParams,
    redirectUrl,
  });
}


