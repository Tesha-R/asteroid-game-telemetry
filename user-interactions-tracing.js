import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';

// ...general opentelemetry configuration

registerInstrumentations({
  instrumentations: [
    new UserInteractionInstrumentation({
      eventNames: ['submit', 'click', 'keypress'],
    }),
  ],
});
