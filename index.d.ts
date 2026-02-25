export type EpicPayEnvironment = 'sandbox' | 'production';

export interface EpicPayInitOptions {
  merchantId?: string;
  environment?: EpicPayEnvironment;
  onEvent?: (event: { type: string; payload?: any; timestamp: number }) => void;
  apiBase?: string;
  headers?: Record<string, string>;
  paymentMethodsUrl?: string;
  theme?: Record<string, string>;
}

export interface OpenPaymentSheetParams {
  amount: number;
  currency?: string; // e.g., '₦', 'USD'
  customer?: Record<string, any>;
  paymentMethods?: Array<'card' | 'bank' | 'epic'> | 'auto';
}

export interface PaymentResultSucceeded {
  status: 'succeeded';
  method: 'card' | 'bank' | 'epic';
  amount: number;
  currency: string;
  transactionId: string;
}

export interface PaymentResultCancelled {
  status: 'cancelled';
}

export interface PaymentResultFailed {
  status: 'failed';
  method?: 'card' | 'bank' | 'epic';
  error: string;
}

export type PaymentResult = PaymentResultSucceeded | PaymentResultCancelled | PaymentResultFailed;

export function initEpicPay(options?: EpicPayInitOptions): void;
export function openPaymentSheet(params: OpenPaymentSheetParams): Promise<PaymentResult>;
export function closePaymentSheet(): void;

declare const EpicPay: {
  initEpicPay: typeof initEpicPay;
  openPaymentSheet: typeof openPaymentSheet;
  closePaymentSheet: typeof closePaymentSheet;
};

export default EpicPay;
