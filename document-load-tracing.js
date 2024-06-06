// document-load-tracing.js

import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});
