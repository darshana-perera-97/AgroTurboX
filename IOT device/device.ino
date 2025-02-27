#include <Arduino.h>

#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "Xiomi"
#define WIFI_PASSWORD "dddddddd"

// Firebase credentials
#define API_KEY "AIzaSyCwAMrMTk96PffuW7a4yEKifshfGoCQBZ4"
#define DATABASE_URL "https://sms-server-adef0-default-rtdb.firebaseio.com/"

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long previousMillis = 0;
unsigned long updateMillis = 0;
bool signupOK = false;

// Global sensor values
float soilMoisture = 40.5;
float temp = 25.3;
float humidity = 60.2;
bool rain = false; // false = no rain, true = raining

// Function to connect to Wi-Fi
void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConnected to Wi-Fi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Function to connect to Firebase
void connectToFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase authentication successful");
    signupOK = true;
  } else {
    Serial.printf("Firebase signup failed: %s\n", config.signer.signupError.message.c_str());
  }

  // Assign token status callback function
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// Function to print the whole Firebase database
void printFirebaseDatabase() {
  Serial.println("\nFetching Firebase database content...");

  if (Firebase.RTDB.get(&fbdo, "/")) { // Fetch whole database
    if (fbdo.dataTypeEnum() == fb_json) { // Check if the data is JSON
      Serial.println("Database content:");
      Serial.println(fbdo.jsonString()); // Print database JSON
    } else {
      Serial.println("Database contains non-JSON data.");
    }
  } else {
    Serial.println("Failed to fetch Firebase database");
    Serial.println("Reason: " + fbdo.errorReason());
  }
}

// Function to update sensor data in Firebase
void updateFirebaseData() {
  Serial.println("\nUpdating sensor data in Firebase...");

  String path = "device/0001/data/";

  bool success = true;

  success &= Firebase.RTDB.setFloat(&fbdo, path + "soilMoisture", soilMoisture);
  success &= Firebase.RTDB.setFloat(&fbdo, path + "temp", temp);
  success &= Firebase.RTDB.setFloat(&fbdo, path + "humidity", humidity);
  success &= Firebase.RTDB.setBool(&fbdo, path + "rain", rain);

  if (success) {
    Serial.println("Sensor data updated successfully!");
  } else {
    Serial.println("Failed to update Firebase!");
    Serial.println("Reason: " + fbdo.errorReason());
  }
}

void setup() {
  Serial.begin(115200);

  connectToWiFi();
  connectToFirebase();
}

void loop() {
  if (Firebase.ready() && signupOK) {
    
    // Fetch database content every 1 minute
    if (millis() - previousMillis > 60000 || previousMillis == 0) {
      previousMillis = millis();
      printFirebaseDatabase();
    }

    // Update sensor values in Firebase every 30 seconds
    if (millis() - updateMillis > 30000 || updateMillis == 0) {
      updateMillis = millis();

      // Simulate sensor data updates (in a real case, read from sensors)
      soilMoisture = random(30, 60); // Fake data (30% to 60%)
      temp = random(20, 35); // Fake data (20°C to 35°C)
      humidity = random(40, 80); // Fake data (40% to 80%)
      rain = random(0, 2); // Randomly switch between 0 (false) and 1 (true)

      updateFirebaseData();
    }
  }
}
