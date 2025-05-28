// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey:"AIzaSyDQ_5dTrtBEVQj8FY689lgt5QB_SWfF4Go",
    authDomain:"loomfashion-81bbf.firebaseapp.com",
    projectId: "loomfashion-81bbf",
    storageBucket: "loomfashion-81bbf.firebasestorage.app",
    messagingSenderId: "998463507364",
    appId: "1:998463507364:web:eff7a4a4b6f4ecd6dc8f31",
    measurementId: "G-FV4H5W3VMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize messaging only in browser environment
let messaging = null;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging initialization error:', error);
  }
}

// Request permission and get token
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    if (!messaging) {
      console.error('Firebase messaging not initialized');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: "BMF5EvnW1cwel4yjY9lFLuMtH6Pdr9RZZ9TdmlvxxQeUBsEew7IsUJkEoutJfTGVaWifxDqWvo5fMJCJu5z9bJg" // Replace with your actual VAPID key
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { auth, messaging };