const CACHE_NAME = "v1";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/service-worker.js",
  "https://dummyjson.com/products",
];

let connectionType = "4g";

const metrics = {
  cacheHits: 0,
  cacheMisses: 0,
};

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponsePromise = caches.match(e.request);

      const timeout = getTimeout(connectionType);
      const fetchPromise = fetchWithTimeout(e.request, timeout)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            cache.put(e.request, responseClone);
          }
          return networkResponse;
        })
        .catch((e) => {
          console.log("Fetch failed:", e);
          return new Response("Network error occurred", { status: 408 });
        });
      const cachedResponse = await cachedResponsePromise;
      if (cachedResponse) {
        metrics.cacheHits++;
        return cachedResponse;
      } else {
        metrics.cacheMisses++;
        return fetchPromise;
      }
    })
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("message", (e) => {
  if (e.data) {
    const { type, url } = e.data;

    switch (type) {
      case "SET_CONNECTION_TYPE":
        connectionType = e.data.connectionType;
        break;
      case "ADD_TO_CACHE":
        caches.open(CACHE_NAME).then((cache) => {
          fetch(url)
            .then((response) => {
              if (response.status === 200) {
                cache.put(url, response);
                console.log(`${url} added to cache`);
              } else {
                console.log(
                  `Unable to add ${url} to cache. Status: ${response.status}`
                );
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => {
                    client.postMessage({
                      type: "CACHE_ERROR",
                      message: `Unable to add ${url} to cache.`,
                    });
                  });
                });
              }
            })
            .catch((e) => {
              console.log(`Error add ${url} to cache: ${e}`);
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: "CACHE_ERROR",
                    message: `Unable to add ${url} to cache.`,
                  });
                });
              });
            });
        });
        break;
      case "REMOVE_FROM_CACHE":
        caches.open(CACHE_NAME).then((cache) => {
          cache
            .delete(url)
            .then((succsess) => {
              if (succsess) {
                console.log(`${url} removed from cache`);
              } else {
                console.log(`${url} not found in cache`);
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => {
                    client.postMessage({
                      type: "CACHE_ERROR",
                      message: `${url} not found in cache.`,
                    });
                  });
                });
              }
            })
            .catch((e) => {
              console.log(`Error add ${url} to cache: ${e}`);
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: "CACHE_ERROR",
                    message: `Unable to add ${url} to cache.`,
                  });
                });
              });
            });
        });
        break;
      case "UPDATE_CACHE":
        caches
          .open(CACHE_NAME)
          .then((cache) => {
            fetch(url).then((response) => {
              if (response.status === 200) {
                cache.put(url, response);
                console.log(`${url} updated in cache`);
              } else {
                console.error(
                  `Не вдалося оновити ${url} в кеші. Статус: ${response.status}`
                );
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) =>
                    client.postMessage({
                      type: "CACHE_ERROR",
                      message: `Не вдалося оновити ${url} в кеші. Статус: ${response.status}`,
                    })
                  );
                });
              }
            });
          })
          .catch((error) => {
            console.log(`Помилка при оновленні ${url} в кеші:`, error);
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) =>
                client.postMessage({
                  type: "CACHE_ERROR",
                  message: `Помилка при оновленні ${url} в кеші: ${error.message}`,
                })
              );
            });
          });
        break;
      case "GET_METRICS":
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "METRICS",
              metrics: metrics,
            });
          });
        });
        break;
      default:
        console.log(`Unkonw message ${type}`);
        break;
    }
  }
});

const getTimeout = (connectionType) => {
  switch (connectionType) {
    case "slow-2g":
      return 20000;
    case "2g":
      return 15000;
    case "3g":
      return 10000;
    default:
      return 8000;
  }
};

const fetchWithTimeout = (request, timeout) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request time out"));
    }, timeout);
    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
};
