import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

export function initializeFirebase() {
  try {
    let app;
    
    if (getApps().length === 0) {
      console.log('No Firebase apps found, using default configuration');
      app = getApp(); // This will use default configuration
    } else {
      console.log('Firebase app already initialized');
      app = getApp();
    }
    
    console.log('Firebase app name:', app.name);
    console.log('Firebase app initialized successfully');
    
    const auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
    
    return { app, auth };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Try to get default app anyway
    try {
      const app = getApp();
      const auth = getAuth(app);
      return { app, auth };
    } catch (fallbackError) {
      console.error('Fallback Firebase initialization failed:', fallbackError);
      throw error;
    }
  }
}

export function checkFirebaseConfig() {
  try {
    const app = getApp();
    const config = app.options;
    
    console.log('Firebase Config Check:');
    console.log('- Project ID:', config.projectId);
    console.log('- App ID:', config.appId);
    console.log('- API Key:', config.apiKey ? 'Present' : 'Missing');
    console.log('- Auth Domain:', config.authDomain);
    
    return config;
  } catch (error) {
    console.error('Firebase config check error:', error);
    return null;
  }
}
