import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

// ...general opentelemetry configuration

registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});
