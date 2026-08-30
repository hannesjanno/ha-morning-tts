import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  callService,
} from 'home-assistant-js-websocket';

export async function connectHomeAssistant({ baseUrl, token, onEntities }) {
  const auth = createLongLivedTokenAuth(baseUrl, token);
  const connection = await createConnection({ auth });

  const unsubscribe = subscribeEntities(connection, (entities) => {
    onEntities?.(entities);
  });

  return {
    connection,
    unsubscribe,
    callService: (domain, service, serviceData = {}, target = {}) =>
      callService(connection, domain, service, serviceData, target),
  };
}

// Do not commit a Home Assistant token to GitHub.
// We will add secure runtime configuration when the real entity mapping is ready.
