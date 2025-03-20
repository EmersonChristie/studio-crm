import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

// Export routes for UploadThing, using the specified file router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter

  // Apply an (optional) custom config:
  // config: { ... },
});
