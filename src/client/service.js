self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener('push', pushEvent => {
  const data = pushEvent.data.json();
  const promiseChain = self.registration.showNotification(data.title,
    {
      body: data.body
    });

  pushEvent.waitUntil(promiseChain);
})

