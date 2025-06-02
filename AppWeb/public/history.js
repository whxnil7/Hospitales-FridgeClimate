// Guardar datos en el historial local
function saveToHistory(temp, hum, timestamp) {
    const history = JSON.parse(localStorage.getItem('sensorHistory') || '[]');
    
    history.push({
        timestamp: timestamp,
        temperature: temp,
        humidity: hum
    });
    
    // Mantener solo datos de los últimos 7 días
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const filteredHistory = history.filter(item => new Date(item.timestamp) > oneWeekAgo);
    
    localStorage.setItem('sensorHistory', JSON.stringify(filteredHistory));
}

// Obtener datos históricos por rango de tiempo
function getHistoryData(startTime, endTime) {
    const history = JSON.parse(localStorage.getItem('sensorHistory') || '[]');
    return history.filter(item => {
        const itemTime = new Date(item.timestamp);
        return itemTime >= startTime && itemTime <= endTime;
    });
}

export { saveToHistory, getHistoryData };