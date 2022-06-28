console.log("Hello from service worker");

const CACHE_NAME = "v1";

const excludeFromCache = ["www.google.com", "localhost:3000"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll([
        "/",
        "/src/views/app-product.js",
        "/src/views/app-cart.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (excludeFromCache.includes(url.host)) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((response) => {
            const clonnedResponse = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonnedResponse);
            });

            return response;
          })
          .catch(console.error)
      );
    })
  );
});
