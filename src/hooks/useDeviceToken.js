import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../config/firebase';

const useDeviceToken = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeToken = async () => {
      try {
        const deviceToken = await requestNotificationPermission();
        if (deviceToken) {
          setToken(deviceToken);
        }
      } catch (err) {
        console.error('Error getting device token:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeToken();

    // Set up message listener
    const unsubscribe = onMessageListener().then((payload) => {
      if (payload) {
        // Handle foreground messages here
        console.log('Received foreground message:', payload);
      }
    });

    return () => {
      // Cleanup if needed
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return { token, loading, error };
};

export default useDeviceToken; 