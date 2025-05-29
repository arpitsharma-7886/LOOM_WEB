importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDQ_5dTrtBEVQj8FY689lgt5QB_SWfF4Go",
  authDomain: "loomfashion-81bbf.firebaseapp.com",
  projectId: "loomfashion-81bbf",
  storageBucket: "loomfashion-81bbf.firebasestorage.app",
  messagingSenderId: "998463507364",
  appId: "1:998463507364:web:eff7a4a4b6f4ecd6dc8f31",
  measurementId: "G-FV4H5W3VMQ"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/loom_2.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 