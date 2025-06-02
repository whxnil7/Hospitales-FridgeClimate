import { db } from './firebase-config.js';

let tempChart, humChart;
const labels = [];
const dataTemp = [];
const dataHum = [];

// Inicializar gráficos
function initCharts() {
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                },
                title: {
                    display: true,
                    text: 'Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Valor'
                }
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x'
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                }
            }
        }
    };

    const tempCtx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperatura (°C)',
                borderColor: 'rgba(255, 99, 71, 1)',
                backgroundColor: 'rgba(255, 99, 71, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: chartOptions
    });

    const humCtx = document.getElementById('humChart').getContext('2d');
    humChart = new Chart(humCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Humedad (%)',
                borderColor: 'rgba(4, 159, 170, 1)',
                backgroundColor: 'rgba(4, 159, 170, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: chartOptions
    });
}

// Actualizar gráficos con nuevos datos
function updateCharts(temp, hum, timestamp) {
    if (temp !== null) {
        tempChart.data.labels.push(timestamp);
        tempChart.data.datasets[0].data.push({x: timestamp, y: temp});
    }
    
    if (hum !== null) {
        humChart.data.labels.push(timestamp);
        humChart.data.datasets[0].data.push({x: timestamp, y: hum});
    }
    
    // Mantener un máximo de 100 puntos
    if (tempChart.data.labels.length > 100) {
        tempChart.data.labels.shift();
        tempChart.data.datasets[0].data.shift();
        humChart.data.labels.shift();
        humChart.data.datasets[0].data.shift();
    }
    
    tempChart.update();
    humChart.update();
}

export { initCharts, updateCharts };