// Core
export { setConfig, epicConfig } from './core/epicConfig';
export * from './core/types';
import { redirectToPortal, startEpicCollectionPayment } from './core/api';
export { redirectToPortal, startEpicCollectionPayment } from './core/api';
export type { EpicPayEnvironment } from './core/api';
export type { RedirectToPortalParams, StartEpicCollectionPaymentOptions, EpicCollectioncustomerDetails } from './core/api';

// Convenience API: default export wraps main functions
const EpicCollectionSdk = { redirectToPortal, startEpicCollectionPayment };
export default EpicCollectionSdk;
