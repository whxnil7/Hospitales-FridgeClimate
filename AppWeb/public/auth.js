import { auth } from './firebase-config.js';

const loginForm = document.getElementById('login-form');
const userDetails = document.getElementById('user-details');
const userEmailSpan = document.getElementById('user-email');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Función para manejar el login
function setupAuth() {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        loginError.textContent = '';

        if (!email || !password) {
            loginError.textContent = 'Por favor, ingrese correo y contraseña.';
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                loginError.textContent = error.message;
            });
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });
}

// Escuchar cambios de autenticación
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(user => {
        callback(user);
    });
}

export { setupAuth, onAuthStateChanged };