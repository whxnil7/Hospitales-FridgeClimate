#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <SPI.h>
#include <LoRa.h>

// Configuración básica
const int pinR = 25, pinG = 26, pinB = 27; // LED RGB
#define WIFI_SSID "F.R.I.D.A.Y"
#define WIFI_PASSWORD "T.Stark23"
#define FIREBASE_HOST "hospital-esp32-1-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "HwiG4snXVC7y57GgIBb5LdCUDPns5KkdwYWpTGwH"
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 2

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  
  // Inicialización LED
  pinMode(pinR, OUTPUT); pinMode(pinG, OUTPUT); pinMode(pinB, OUTPUT);
  setColor(0, 0, 255); // Azul: iniciando

  // Conexión WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println("WiFi conectado");
  
  // Firebase
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);

  // LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(915E6)) {
    Serial.println("Error LoRa"); 
    setColor(255, 0, 0); // Rojo: error
    while(1);
  }

  Serial.println("Sistema listo");
  setColor(0, 255, 0); // Verde: conectado
}

void loop() {
  if (LoRa.parsePacket()) {
    setColor(0, 255, 0); // Verde: recibiendo
    
    // Procesar datos
    String dato = "";
    while (LoRa.available()) dato += (char)LoRa.read();
    
    // Verificar formato del dato
    Serial.println("Dato recibido: " + dato);
    
    // Buscar posiciones de los valores
    int tempPos = dato.indexOf("temp=");
    int humPos = dato.indexOf("hum=");
    
    if (tempPos >= 0 && humPos >= 0) {
      // Extraer valores como strings
      String tempStr = dato.substring(tempPos + 5, dato.indexOf(',', tempPos));
      String humStr = dato.substring(humPos + 4);
      
      // Convertir a float
      float temp = tempStr.toFloat();
      float hum = humStr.toFloat();
      
      // Validar conversión
      if (!isnan(temp) && !isnan(hum)) {
        // Subir a Firebase
        if(Firebase.RTDB.setFloat(&fbdo, "/sensores/1/temperatura", temp) && 
           Firebase.RTDB.setFloat(&fbdo, "/sensores/1/humedad", hum)) {
          Serial.printf("Datos correctos: %.1f°C, %.1f%%\n", temp, hum);
        } else {
          Serial.println("Error Firebase: " + fbdo.errorReason());
        }
      } else {
        Serial.println("Error en conversión de datos");
      }
    } else {
      Serial.println("Formato incorrecto. Esperado: 'temp=valor,hum=valor'");
    }

    delay(500);
    setColor(0, 0, 255); // Azul: esperando
  }
}

void setColor(int r, int g, int b) {
  analogWrite(pinR, r); analogWrite(pinG, g); analogWrite(pinB, b);
}