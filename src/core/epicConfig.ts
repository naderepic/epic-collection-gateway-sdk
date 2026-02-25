import { EpicPayConfig } from './types';

const portalFromEnv = 'https://checkout.epicpay.co';
const apiBaseFromEnv = 'https://zppicbcegi.execute-api.af-south-1.amazonaws.com/prod/api/v1';

export const epicConfig: EpicPayConfig = {
  environment: '',
  apiBase: apiBaseFromEnv,
  headers: {},
  redirectUrl: portalFromEnv,
  clientId: '',
  clientSecret: '',
  dryRun: true,
  onEvent: undefined,
};

export function setConfig(config: Partial<EpicPayConfig>) {
  Object.assign(epicConfig, config);
}

export function emit(type: string, payload: any = {}) {
  try {
    if (epicConfig.onEvent) {
      epicConfig.onEvent({ type, payload, timestamp: Date.now() });
    }
  } catch (error) {
    console.error('[EpicPay] Event emission error:', error);
  }
}
