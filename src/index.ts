// Core
export { setConfig, epicConfig } from './core/epicConfig';
export * from './core/types';
import { initEpicPay, redirectToPortal, parsePaymentResponseFromUrl, startEpicCollectionPayment } from './core/api';
export { initEpicPay, redirectToPortal, parsePaymentResponseFromUrl, startEpicCollectionPayment } from './core/api';
export type { EpicPayInitOptions, EpicPayEnvironment } from './core/api';
export type { RedirectToPortalParams, StartEpicCollectionPaymentOptions, EpicCollectioncustomerDetails } from './core/api';

// Convenience API: default export wraps main functions
const EpicCollectionSdk = { initEpicPay, redirectToPortal, parsePaymentResponseFromUrl, startEpicCollectionPayment };
export default EpicCollectionSdk;
