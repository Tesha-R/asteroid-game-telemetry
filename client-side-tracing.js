// client-side-tracing.js

require('dotenv').config();

import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

const sdk = new HoneycombWebSDK({
  apiKey: process.env.HONEYCOMB_API_KEY,
  serviceName: 'asteroid-game-browser',
  instrumentations: [getWebAutoInstrumentations()], // add automatic instrumentation
});
sdk.start();
