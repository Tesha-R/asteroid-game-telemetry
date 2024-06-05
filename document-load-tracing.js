// document-load-tracing.js

import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});
