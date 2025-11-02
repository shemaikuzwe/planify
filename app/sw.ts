import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
  NetworkOnly,
  Serwist,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
const queue = new BackgroundSyncQueue("syncQueue", {
  maxRetentionTime: 60 * 60 * 24 * 7,
});
const backgroundSync = new BackgroundSyncPlugin("bsync", {
  maxRetentionTime: 24 * 60,
});
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
  fallbacks: {
    entries: [
      // {
      //   url: "/~offline",
      //   matcher({ request }) {
      //     return request.destination === "document";
      //   },
      // },
    ],
  },
});

self.addEventListener("fetch", (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== "POST") {
    return;
  }

  const backgroundSync = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return Response.error();
    }
  };

  event.respondWith(backgroundSync());
});

serwist.registerCapture(
  /\/api\/bsync/,
  new NetworkOnly({
    plugins: [backgroundSync],
  }),
  "POST",
);

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/logo2.png",
      badge: "/logo.png",
      vibrate: [100, 50, 100],
      data: data.data || {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();

  const relativeLink = event.notification.data?.link || "/";
  // Convert relative link to absolute URL based on the current service worker scope
  const urlToOpen = new URL(relativeLink, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        // If a window tab matching the targeted URL already exists, focus that;
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no matching tab exists, open a new one to the correct URL
        return clients.openWindow(urlToOpen);
      }),
  );
});

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SYNC") {
//     console.log("Service worker received SYNC message, starting sync.");
//     event.waitUntil(syncManager.sync());
//   }
// });

serwist.addEventListeners();
