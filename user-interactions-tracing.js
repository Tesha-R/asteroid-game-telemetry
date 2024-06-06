import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
// ...general opentelemetry configuration

registerInstrumentations({
  instrumentations: [
    new UserInteractionInstrumentation({
      eventNames: ['submit', 'click', 'keypress'],
    }),
  ],
});
