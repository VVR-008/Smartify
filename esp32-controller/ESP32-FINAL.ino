#include <ESPmDNS.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <Preferences.h>

String ssid, password;
Preferences preferences;

WebServer server(80);
WebSocketsClient webSocket;

const int LIGHTPIN = 18;
const int FANPIN = 19;
const int SWITCH = 21; 

bool lightStatus = false;
bool fanStatus = false;
int lastButtonState = LOW; // Track the last button state

String messageType = "";
String deviceid = "";
String action="";
unsigned long lastDebounceTime = 0; // Last time the pin state was toggled
unsigned long debounceDelay = 50;

void setup() {
  Serial.begin(115200);

  pinMode(LIGHTPIN, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  pinMode(SWITCH, INPUT); // Initialize the SWITCH pin as input

  digitalWrite(LIGHTPIN, LOW);
  digitalWrite(FANPIN, LOW);

  // Load WiFi credentials from preferences
  preferences.begin("wifi-creds", false);
  ssid = preferences.getString("ssid", "");
  password = preferences.getString("password", "");
  preferences.end();

  if (ssid != "" && password != "") {
    connectToWiFi();
  } else {
    startAccessPoint();
  }

  server.on("/", HTTP_GET, handleRoot);
  server.on("/submit", HTTP_POST, handleSubmit);
  server.begin();
  Serial.println("Server started");

  webSocket.onEvent(webSocketEvent);
  lastButtonState = digitalRead(SWITCH); 
}

// void loop() {
//   server.handleClient();
//   webSocket.loop();

//   // Monitor the switch for state changes
//   int reading = digitalRead(SWITCH);

//   // Check if the switch state has changed
//   if (reading != lastButtonState) {
//     lastDebounceTime = millis(); // Reset the debounce timer
//   }

//   // Only toggle the light if the debounce delay has passed
//   if ((millis() - lastDebounceTime) > debounceDelay) {
//     // Check if the button is pressed (assuming LOW means pressed)
//     if (reading == LOW && lastButtonState == HIGH) {
//       toggleLight(); // Toggle light only on button press
//     }
//   }

//   // Save the current state as the last state
//   lastButtonState = reading;
// }
void loop() {
  // Check if Serial Monitor is connected
  while (!Serial) {
    // Attempt to connect to WiFi if not connected
    if (WiFi.status() != WL_CONNECTED) {
      connectToWiFi();
    } else {
      // If WiFi is connected, handle server and WebSocket events
      server.handleClient();
      webSocket.loop();
    }
    delay(1000); // Add delay to avoid overloading
  }

  // Monitor web server and WebSocket events when Serial Monitor is available
  server.handleClient();
  webSocket.loop();

  // Monitor the switch for state changes
  int reading = digitalRead(SWITCH);

  // Check if the switch state has changed
  if (reading != lastButtonState) {
    lastDebounceTime = millis(); // Reset the debounce timer
  }

  // Only toggle the light if the debounce delay has passed
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // Check if the button is pressed (assuming LOW means pressed)
    if (reading == LOW && lastButtonState == HIGH) {
      toggleLight(); // Toggle light only on button press
    }
  }

  // Save the current state as the last state
  lastButtonState = reading;
}


void toggleLight() {
  if (lightStatus == false) {
    digitalWrite(LIGHTPIN, HIGH);
    lightStatus = true;
    String jsonstring = createJsonMessage("LIGHT",  "Light_Device-01", "true");
    webSocket.sendTXT(jsonstring);
    Serial.println("Light turned ON via physical switch.");
  } else {
    digitalWrite(LIGHTPIN, LOW);
    lightStatus = false;
    String jsonstring = createJsonMessage("LIGHT","Light_Device-01","false");
    webSocket.sendTXT(jsonstring);
    Serial.println("Light turned OFF via physical switch.");
  }
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid.c_str(), password.c_str());

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(1000);
    Serial.print("Connecting...");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi");

    if (MDNS.begin("esp32")) {
      Serial.println("mDNS responder started");

      MDNS.queryService("_websocket", "_tcp"); // Discover WebSocket service

      while (true) {
        int n = MDNS.queryService("_websocket", "_tcp");
        if (n) {
          for (int i = 0; i < n; i++) {
            String hostname = MDNS.hostname(i);
            IPAddress ip = MDNS.IP(i);
            int port = MDNS.port(i);
            Serial.print("Discovered WebSocket service: ");
            Serial.print(hostname);
            Serial.print(" IP: ");
            Serial.print(ip);
            Serial.print(" Port: ");
            Serial.println(port);
            webSocket.begin(ip, port, "/");
            break;
          }
          break;
        }
        delay(1000);
      }

      webSocket.onEvent(webSocketEvent);

      String html = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; text-align: center;'>"
                    "<h2 style='color: #007BFF;'>Wi-Fi Connected!</h2>"
                    "<p style='font-size: 18px;'>Device IP: " + WiFi.localIP().toString() + "</p>"
                    "<p style='font-size: 18px;'>Device will now reboot...</p>"
                    "</body></html>";
      server.send(200, "text/html", html);
    } else {
      server.send(200, "text/html", "<html><body><h2>Failed to connect to WiFi</h2></body></html>");
    }
  } else {
    Serial.println("\nFailed to connect to WiFi. Starting AP mode.");
    startAccessPoint();
  }
}

void startAccessPoint() {
  WiFi.softAP("ESP32_Config", "123456789");
  Serial.println("Access Point Started");

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP Address: ");
  Serial.println(IP);
}

void handleSubmit() {
  if (server.hasArg("ssid") && server.hasArg("password")) {
    ssid = server.arg("ssid");
    password = server.arg("password");

    // Save credentials to preferences
    preferences.begin("wifi-creds", false);
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.end();

    connectToWiFi();
    server.send(200, "text/html", "<html><body><h2>WiFi credentials saved. Rebooting...</h2></body></html>");
    delay(2000);
    ESP.restart();
  }
}

void handleRoot() {
  String html = "<html><head><style>"
                "body { font-family: 'Arial', sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; color: #333; }"
                "h2 { text-align: center; color: #2a2a2a; font-size: 36px; margin-top: 50px; }"
                "form { display: flex; flex-direction: column; align-items: center; margin-top: 30px; }"
                "input[type='text'], input[type='password'] { width: 100%; max-width: 400px; padding: 15px; margin: 10px 0; font-size: 16px; border-radius: 8px; border: 1px solid #ddd; box-sizing: border-box; }"
                "input[type='submit'] { width: 100%; max-width: 420px; padding: 15px; background-color: #4CAF50; color: white; font-size: 18px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; transition: background-color 0.3s ease; }"
                "input[type='submit']:hover { background-color: #45a049; }"
                ".container { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; }"
                ".footer { text-align: center; font-size: 14px; color: #777; margin-top: 30px; }"
                ".message { font-size: 18px; color: #2a2a2a; text-align: center; margin-top: 20px; }"
                "</style></head><body>"
                "<div class='container'>"
                "<h2>Wi-Fi Configuration</h2>"
                "<form method='POST' action='/submit'>"
                "<input type='text' name='ssid' placeholder='Enter SSID' required><br>"
                "<input type='password' name='password' placeholder='Enter Password' required><br>"
                "<input type='submit' value='Save & Connect'>"
                "</form>"
                "<div class='footer'>"
                "<p>Device will reboot after successful connection.</p>"
                "</div>"
                "</div>"
                "</body></html>";

  server.send(200, "text/html", html);
}

void webSocketEvent(WStype_t eventType, uint8_t* payload, size_t length) {
  String message = String((char*)payload);
  switch (eventType) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket server");
      webSocket.sendTXT("{\"type\":\"DEVICE_LIST\",\"deviceid\":\"Light_Device-01\"}");
      webSocket.sendTXT("{\"type\":\"DEVICE_LIST\",\"deviceid\":\"Fan_Device-01\"}");
      break;
    case WStype_TEXT:
      Serial.println("Message received: " + message);
      handleDeviceControl(message); 
     
      break;
    case WStype_BIN:
      break;
  }
}

String createJsonMessage(const char* Ctype, const char* deviceid, const char* status) {
  StaticJsonDocument<200> doc;

  doc["type"] = "DEVICE_STATUS";
  doc["Ctype"] = Ctype;
  doc["deviceid"] = deviceid;
  doc["status"] = status;

  String jsonString;
  serializeJson(doc, jsonString);

  return jsonString;
}


void sendMessageToServer(const char* message) {
  if (webSocket.isConnected()) {
    webSocket.sendTXT(message);
    Serial.println("Message sent to server: " + String(message));
  } else {
    Serial.println("Not connected to WebSocket server, message not sent.");
  }
}
void parseJsonMessage(const String &message) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) {
    Serial.println("Failed to parse JSON message: " + String(error.c_str()));
    return;
  }
  messageType = doc["type"].as<String>();
  deviceid = doc["deviceid"].as<String>();
  action = doc["action"].as<String>();

  Serial.println("Parsed messageType: " + messageType);
  Serial.println("Parsed deviceid: " + deviceid);
  Serial.println("Parsed action: " + action);
}

void handleDeviceControl(const String& message) {
  if (message.startsWith("{") && message.endsWith("}")) {
    parseJsonMessage(message);

    if (messageType == "LIGHT_CONTROL" && deviceid == "Light_Device-01") {
      if (action == "ON" && !lightStatus) {
        digitalWrite(LIGHTPIN, HIGH);
        lightStatus = true;
        String jsonstring = createJsonMessage("LIGHT", "Light_Device-01", "true");
        webSocket.sendTXT(jsonstring);
      } else if (action == "OFF" && lightStatus) {
        digitalWrite(LIGHTPIN, LOW);
        lightStatus = false;
        String jsonstring = createJsonMessage("LIGHT", "Light_Device-01", "false");
        webSocket.sendTXT(jsonstring);
      }
    }
    if (messageType == "FAN_CONTROL" && deviceid == "Fan_Device-01") {
      if (action == "ON" && !fanStatus) {
        digitalWrite(FANPIN, HIGH);
        fanStatus = true;
        String jsonstring = createJsonMessage("FAN", "Fan_Device-01", "true");
        webSocket.sendTXT(jsonstring);
      } else if (action == "OFF" && fanStatus) {
        digitalWrite(FANPIN, LOW);
        fanStatus = false;
        String jsonstring = createJsonMessage("FAN", "Fan_Device-01", "false");
        webSocket.sendTXT(jsonstring);
      }
    }
  }
}