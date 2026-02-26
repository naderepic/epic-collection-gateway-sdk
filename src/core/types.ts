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
}
