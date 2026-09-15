importScripts("https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js");

/* ============================================================
   MISE À JOUR AUTOMATIQUE : force ce fichier à prendre le relais
   immédiatement dès qu'une nouvelle version est déployée, sans
   attendre que l'app soit totalement fermée sur le téléphone.
   ============================================================ */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* ============================================================
   BADGE NUMÉROTÉ SUR L'ICÔNE (iPhone/iOS 16.4+ principalement —
   sur Android, Chrome affiche déjà ce badge automatiquement)
   ============================================================ */

// À chaque notification push reçue, on pose le badge avec le
// nombre de notifications actuellement en attente (+1 pour celle
// qui arrive, car OneSignal ne l'a pas encore affichée au moment
// où ce code s'exécute).
self.addEventListener("push", (event) => {
  if (!("setAppBadge" in self.registration)) return;
  event.waitUntil(
    (async () => {
      try {
        const notifs = await self.registration.getNotifications();
        await self.registration.setAppBadge(notifs.length + 1);
      } catch (e) {
        // Badging API non disponible sur cet appareil — on ignore.
      }
    })()
  );
});

// Quand l'utilisateur touche une notification, on considère qu'il
// a vu ses messages/annonces : le badge repart à zéro.
self.addEventListener("notificationclick", (event) => {
  if (!("clearAppBadge" in self.registration)) return;
  event.waitUntil(self.registration.clearAppBadge().catch(() => {}));
});
