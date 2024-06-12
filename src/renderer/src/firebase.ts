// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCq_sD5wE8cjzkKzK5enFP2auFbbgLl578',
  authDomain: 'softeng-aol.firebaseapp.com',
  projectId: 'softeng-aol',
  storageBucket: 'softeng-aol.appspot.com',
  messagingSenderId: '370527600551',
  appId: '1:370527600551:web:de3a4aae34127b6b68c082'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
