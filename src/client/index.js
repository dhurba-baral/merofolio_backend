const publicVapidKey = "BKUewihHNqZsFYslvLFrIJzokdTWSuCMYwXn39LxdM6P0q8WJ41c8ItvPOozKbxkXOxz97tDyAryq_3oNeTsljw"
const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}


const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');

  }
}

const send = async () => {
  //registering service worker
  try {
    const register = await navigator.serviceWorker.register('service.js', {
      scope: '/'
    })
    console.log('Service worker registered')

    //register push
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publicVapidKey)
    })
    console.log(JSON.stringify(subscription))
    console.log('Push registered')

    console.log('Sending push')

    //TEST PUSH
    await fetch('http://localhost:5000/notify', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.log(error)
  }
}
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const main = async () => {
  check();
  const permission = await requestNotificationPermission();
  // const swRegistration = await registerServiceWorker();
  send();
}

// main();