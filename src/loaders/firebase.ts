import { initializeApp } from 'firebase/app';
import config from '../config';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(config.firebase);
// const analytics = getAnalytics(app);

export default app;
