#include <Arduino.h>

#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

#include <Firebase_ESP_Client.h>

// Provide the token generation process info
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "Xiomi"
#define WIFI_PASSWORD "dddddddd"

// Insert Firebase project API Key
#define API_KEY "AIzaSyAWMN1uEa2Bq9miiIDYitGHmVXG-DiXXaM"

// Insert RTDB URL
#define DATABASE_URL "https://agroturbox-default-rtdb.firebaseio.com/"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

// Global variables for sensor data
float humidity;
bool rain;
float soilMoisture;
float temp;

// Function to set random values for sensor data
void setRandomSensorValues()
{
  humidity = random(60, 101);                           // Random humidity between 60% and 100%
  rain = random(0, 2);                                  // Randomly true (1) or false (0)
  soilMoisture = random(50, 90) + random(0, 10) / 10.0; // Random soil moisture between 50.0 and 90.9
  temp = random(25, 40) + random(0, 10) / 10.0;         // Random temp between 25.0°C and 40.9°C
}

// Function to write sensor values to Firebase
void writeDataToFirebase()
{
  Serial.println("Writing random sensor data to Firebase...");

  if (Firebase.RTDB.setFloat(&fbdo, "/device/0001/data/humidity", humidity))
    Serial.println("Humidity updated successfully.");
  else
    Serial.println("Failed to update humidity: " + fbdo.errorReason());

  if (Firebase.RTDB.setBool(&fbdo, "/device/0001/data/rain", rain))
    Serial.println("Rain updated successfully.");
  else
    Serial.println("Failed to update rain: " + fbdo.errorReason());

  if (Firebase.RTDB.setFloat(&fbdo, "/device/0001/data/soilMoisture", soilMoisture))
    Serial.println("Soil moisture updated successfully.");
  else
    Serial.println("Failed to update soil moisture: " + fbdo.errorReason());

  if (Firebase.RTDB.setFloat(&fbdo, "/device/0001/data/temp", temp))
    Serial.println("Temperature updated successfully.");
  else
    Serial.println("Failed to update temperature: " + fbdo.errorReason());
}

void setup()
{
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("Firebase connection successful!");
    signupOK = true;
  }
  else
  {
    Serial.printf("Firebase Sign-Up Error: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback; // Token generation callback
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop()
{
  // Only update every 1 minute (60000 milliseconds)
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis >= 60000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();

    // Set random values
    setRandomSensorValues();

    // Write to Firebase
    writeDataToFirebase();

    // Print the random sensor values
    Serial.println("\nRandom Sensor Data:");
    Serial.print("Humidity: ");
    Serial.println(humidity);
    Serial.print("Rain: ");
    Serial.println(rain ? "Yes" : "No");
    Serial.print("Soil Moisture: ");
    Serial.println(soilMoisture);
    Serial.print("Temperature: ");
    Serial.println(temp);
    Serial.println("----------------------");
  }
}
