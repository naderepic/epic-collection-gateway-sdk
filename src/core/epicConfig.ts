import { EPIC_API_BASE, EPIC_PORTAL_URL } from './constants';
import { EpicPayConfig } from './types';

export const epicConfig: EpicPayConfig = {
  environment: '',
  apiBase: EPIC_API_BASE,
  headers: {},
  redirectUrl: EPIC_PORTAL_URL,
  clientId: '',
  clientSecret: '',
  dryRun: true,
};

export function setConfig(config: Partial<EpicPayConfig>) {
  Object.assign(epicConfig, config);
}
