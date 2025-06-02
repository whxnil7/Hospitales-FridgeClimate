import { auth, db } from './firebase-config.js';
import { setupAuth, onAuthStateChanged } from './auth.js';
import { initCharts, updateCharts } from './charts.js';
import { saveToHistory, getHistoryData } from './history.js';

// Inicialización de la aplicación
function initApp() {
    setupAuth();
    initCharts();
    
    // Configurar controles de tiempo
    setupTimeControls();
    
    // Escuchar cambios de autenticación
    onAuthStateChanged(user => {
        if (user) {
            // Usuario autenticado
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('user-details').style.display = 'block';
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('data-content').style.display = 'block';
            
            // Iniciar monitoreo de sensores
            startSensorMonitoring();
        } else {
            // Usuario no autenticado
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('user-details').style.display = 'none';
            document.getElementById('data-content').style.display = 'none';
        }
    });
}

// Configurar controles de rango de tiempo
function setupTimeControls() {
    const applyRangeBtn = document.getElementById('apply-range');
    const showRealtimeBtn = document.getElementById('show-realtime');
    
    applyRangeBtn.addEventListener('click', () => {
        const startTime = new Date(document.getElementById('start-time').value);
        const endTime = new Date(document.getElementById('end-time').value);
        loadHistoricalData(startTime, endTime);
    });
    
    showRealtimeBtn.addEventListener('click', () => {
        startSensorMonitoring();
    });
    
    // Configurar valores por defecto (últimas 24 horas)
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    document.getElementById('start-time').value = yesterday.toISOString().slice(0, 16);
    document.getElementById('end-time').value = now.toISOString().slice(0, 16);
}

// Cargar datos históricos
function loadHistoricalData(startTime, endTime) {
    const historyData = getHistoryData(startTime, endTime);
    
    // Actualizar gráficos con datos históricos
    // (Implementación similar a updateCharts pero con datos históricos)
}

// Monitoreo en tiempo real de sensores
function startSensorMonitoring() {
    const tempRef = db.ref('sensores/1/temperatura');
    const humRef = db.ref('sensores/1/humedad');
    
    tempRef.on('value', snapshot => {
        const temp = snapshot.val();
        if (temp !== null) {
            document.getElementById('temp-reading').textContent = `${temp.toFixed(2)} °C`;
            
            // Obtener humedad para sincronizar
            humRef.once('value').then(humSnapshot => {
                const hum = humSnapshot.val();
                const timestamp = new Date();
                updateCharts(temp, hum, timestamp);
                saveToHistory(temp, hum, timestamp);
            });
        }
    });
    
    humRef.on('value', snapshot => {
        const hum = snapshot.val();
        if (hum !== null) {
            document.getElementById('hum-reading').textContent = `${hum.toFixed(2)} %`;
        }
    });
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);