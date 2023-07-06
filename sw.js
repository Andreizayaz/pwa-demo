const staticCacheName = "s-app-v3";
const dynamicCacheName = "d-app-v3";

const assetUrls = ["index.html", "/js/index.js", "/style.css", "offline.html"];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
  //console.log("[SW]: installed");
});

self.addEventListener("activate", async (event) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
  //console.log("[SW]: activated");
});

self.addEventListener("fetch", (event) => {
  //console.log("Fetch", event.request.url);

  const { request } = event;

  const url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    console.error(e);
    const cached = await caches.match(request);
    return cached ?? (await caches.match("/offline.html"));
  }
}
