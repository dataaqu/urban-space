'use client';

import { useEffect } from 'react';

/**
 * The domain previously hosted a different site that registered a service
 * worker. That SW stays installed on visitors' phones and serves its stale,
 * cached app shell on first load (a refresh then fetches the live site). The
 * current site ships no service worker, so nothing removes the old one — this
 * component does: it unregisters every service worker and clears their caches
 * on load. Safe to keep permanently; it's a no-op once nothing is registered.
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {});

    if (typeof caches !== 'undefined') {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {});
    }
  }, []);

  return null;
}
