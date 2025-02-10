console.log('file loaded')
const CACHE_NAME = 'api-image-cache-v1';
import { IMAGE_SOURCE_URL, IMAGE_SOURCE_PATHNAME } from "./src/constants";

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Check if the request is for an image from your API
  if (url.origin === IMAGE_SOURCE_URL /*&& url.pathname.startsWith(IMAGE_SOURCE_PATHNAME)*/) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          console.log(`Serving from cache: ${request.url}`);
          return cachedResponse;
        }

        console.log(`Fetching from network: ${request.url}`);
        return fetch(request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});