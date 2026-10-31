self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("nutrition-cache").then((cache) => {
      return cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          })
        );
      });
    })
  );
}); 