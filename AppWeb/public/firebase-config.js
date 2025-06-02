// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDU-v8CcaXQIm8Zj14sQGrNJ7I98DxAGOU",
    authDomain: "hospital-esp32-1.firebaseapp.com",
    databaseURL: "https://hospital-esp32-1-default-rtdb.firebaseio.com",
    projectId: "hospital-esp32-1",
    storageBucket: "hospital-esp32-1.firebasestorage.app",
    messagingSenderId: "361688945081",
    appId: "1:361688945081:web:cf6b86ee6dffe359a4a668",
    measurementId: "G-2L3FVTKQPJ"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

export { auth, db };