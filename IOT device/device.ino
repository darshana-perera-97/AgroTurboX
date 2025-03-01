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
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();

    Serial.println("Fetching all data from Firebase...");

    // Retrieve the entire database
    if (Firebase.RTDB.getJSON(&fbdo, "/")) // Fetches the entire database
    {
      FirebaseJson &json = fbdo.jsonObject(); // Get the JSON object
      Serial.println("Database Data:");
      String jsonString;
      json.toString(jsonString, true); // Convert to String
      Serial.println(jsonString);      // Print the JSON data
    }
    else
    {
      Serial.println("FAILED to retrieve database");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
