export interface EpicPayConfig {
  environment?: 'sandbox' | 'production' | string;
  apiBase?: string;
  headers?: Record<string, string>;
  /** Full URL to the hosted payment portal for redirect flow */
  redirectUrl?: string;
  /** Optional client id provided to integrator page */
  clientId?: string;
  /** Optional client secret provided to integrator page */
  clientSecret?: string;
  /** If true, do not actually redirect; only log what would happen. */
  dryRun?: boolean;
  onEvent?: (event: PaymentEvent) => void;
}

export interface ThemeConfig {
  colorPrimaryViolet?: string;
  borderColor?: string;
  fontColor?: string;
  black?: string;
  white?: string;
  inputBackground?: string;
  tabBackground?: string;
}

export interface PaymentMethod {
  identityKey: string;
  methodName: string;
  icon?: string;
}

export interface PaymentSheetProps {
  amount: number;
  currency?: string;
  customer?: CustomerInfo;
  paymentMethods?: PaymentMethod[] | 'auto';
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
  onClose?: () => void;
}

export interface CustomerInfo {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export interface PaymentResult {
  status: 'succeeded' | 'failed' | 'cancelled';
  method?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentError {
  status: 'failed';
  method?: string;
  error: string;
}

export interface PaymentEvent {
  type: string;
  payload: any;
  timestamp: number;
}
