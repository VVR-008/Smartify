#include <final_inferencing.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <Preferences.h>
#include <I2S.h>

WebServer server(80);
#define SAMPLE_RATE 16000U
#define SAMPLE_BITS 16

String ssid, password;
Preferences preferences;
String serverUrl = ""; // Global variable for the server URL

// Audio inference structure definition
typedef struct {
  int16_t *buffer;      // Pointer to the audio buffer
  size_t buf_count;     // Current buffer count
  size_t n_samples;     // Number of samples required
  volatile int buf_ready; // Flag to indicate buffer readiness
} inference_t;

// Global instance
inference_t inference;

/** Audio buffers and selectors */
static const uint32_t sample_buffer_size = 2048;
static signed short sampleBuffer[sample_buffer_size];
static bool debug_nn = false;  // Set to true to debug features from the raw signal
static bool record_status = true;

void setup() {

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
    ; // Wait for Serial connection
  Serial.println("Edge Impulse Inferencing Demo");

  // Configure the LED
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH); // Turn off

  // Initialize I2S
  I2S.setAllPins(-1, 42, 41, -1, -1);
  if (!I2S.begin(PDM_MONO_MODE, SAMPLE_RATE, SAMPLE_BITS)) {
    Serial.println("Failed to initialize I2S!");
    while (1)
      ;
  }

  // Print model settings


  if (!microphone_inference_start(EI_CLASSIFIER_RAW_SAMPLE_COUNT)) {
    ei_printf("ERR: Could not allocate audio buffer (size %d).\n", EI_CLASSIFIER_RAW_SAMPLE_COUNT);
    return;
  }

}

enum State {
    WAIT_FOR_WIFI,
    HANDLE_VOICE_COMMANDS
};

// Initialize current state
State current_state = WAIT_FOR_WIFI;

void loop() {
    server.handleClient();

    switch (current_state) {
        case WAIT_FOR_WIFI: {
            static unsigned long wifiStartTime = millis();
            static bool apStarted = false;

            if (WiFi.status() == WL_CONNECTED) {
                if (!serverUrl.isEmpty()) {
                    Serial.println("Wi-Fi connected and Server URL valid!");
                    current_state = HANDLE_VOICE_COMMANDS; // Transition to voice commands
                } else {
                    Serial.println("Wi-Fi connected, but Server URL not set. Retrying...");
                    delay(1000); // Retry every second
                }
            } else {
                if (!apStarted) {
                    startAccessPoint(); // Start AP mode only once
                    apStarted = true;  // Mark AP as started
                }
                Serial.println("Waiting for Wi-Fi connection...");
                delay(1000); // Retry every second
            }

            // Timeout for Wi-Fi connection or credential input
            if (millis() - wifiStartTime > 120000) { // 2-minute timeout
                Serial.println("Wi-Fi setup timed out. Restarting...");
                ESP.restart(); // Reset the system
            }
            break;
        }

        case HANDLE_VOICE_COMMANDS: {
            if (WiFi.status() != WL_CONNECTED) {
                Serial.println("Lost Wi-Fi connection. Returning to WAIT_FOR_WIFI...");
                current_state = WAIT_FOR_WIFI; // Return to Wi-Fi connection state
                break;
            }
            handleVoiceCommands(); // Process voice commands
            break;
        }

        default:
            Serial.println("Unknown state. Restarting...");
            ESP.restart(); // Reset the system for safety
            break;
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

    // Start mDNS
if (MDNS.begin("esp32")) {
  Serial.println("mDNS started.");
  unsigned long discoveryStart = millis();
  while (millis() - discoveryStart < 15000) { // 15-second timeout
    int n = MDNS.queryService("http", "tcp");
    if (n > 0) {
      serverUrl = "http://" + MDNS.IP(0).toString() + ":" + String(MDNS.port(0)) + "/modeldata";
      Serial.println("Server URL set to: " + serverUrl);
      break;
    }
    delay(1000); // Wait before retrying
  }
  if (serverUrl.isEmpty()) {
    Serial.println("Failed to discover HTTP service within timeout.");
  }
} 
else {
  Serial.println("mDNS failed to start.");
}

  } else {
    Serial.println("\nFailed to connect to WiFi.");
  }
}


void sendPostRequest(const String& serverUrl, const String& jsonMessage) {
  // Retry logic if the server URL is empty
  int retries = 0;
  while (serverUrl.isEmpty() && retries < 5) {
    Serial.println("Server URL not yet discovered. Retrying...");
    delay(2000); // Wait for 2 seconds before retrying
    retries++;
  }

  if (serverUrl.isEmpty()) {
    Serial.println("Error: Server URL still not set after retries. Skipping message send.");
    return; // Return early if URL is still empty after retries
  }

  HTTPClient http;
  Serial.println("Sending message to server: " + serverUrl);

  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonMessage);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Server response: " + response);
  } else {
    Serial.println("Error sending message: " + String(httpResponseCode));
  }

  http.end();
}




void startAccessPoint() {
  WiFi.softAP("ESP32S3_Config", "123456789");
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
String createJsonMessage(const char* voicetype, const char* deviceid) {
  StaticJsonDocument<200> doc;

  doc["voicetype"] = voicetype;
  doc["deviceid"] = deviceid;

  String jsonString;
  serializeJson(doc, jsonString);

  return jsonString;
}

void handleVoiceCommands() {
  Serial.println("Listening for voice commands...");
  if (!microphone_inference_record()) {
    Serial.println("Error capturing audio!");
    return;
  }

  signal_t signal;
  signal.total_length = EI_CLASSIFIER_RAW_SAMPLE_COUNT;
  signal.get_data = &microphone_audio_signal_get_data;

  ei_impulse_result_t result = {0};
  EI_IMPULSE_ERROR r = run_classifier(&signal, &result, debug_nn);
  if (r != EI_IMPULSE_OK) {
    Serial.print("Error running classifier: ");
    Serial.println(r);
    return;
  }

  int best_index = -1;
  float best_score = 0.0;

  for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
    ei_printf("    %s: ", result.classification[ix].label);
    ei_printf_float(result.classification[ix].value);
    ei_printf("\n");

    if (result.classification[ix].value > best_score) {
      best_score = result.classification[ix].value;
      best_index = ix;
    }
  }

  if (best_index >= 0 && best_score > 0.70) {
    ei_printf("Command detected: %s with confidence: ", result.classification[best_index].label);
    ei_printf_float(best_score);
    ei_printf("\n");

    if (strcmp(result.classification[best_index].label, "lights on") == 0) {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("Action: Light on");
      String jsonMessage = createJsonMessage("lighton", "Light_Device-01");
      sendPostRequest(serverUrl, jsonMessage);
    } else if (strcmp(result.classification[best_index].label, "off lights") == 0) {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Action: Light off");
      String jsonMessage = createJsonMessage("lightoff", "Light_Device-01");
      sendPostRequest(serverUrl, jsonMessage);
    }
  } else {
    ei_printf("No valid command detected.\n");
  }
}

// Rest of the audio inference helper functions remain unchanged { "lights on", "noise", "off lights" };
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
static void audio_inference_callback(uint32_t n_bytes) {
  for (int i = 0; i < n_bytes >> 1; i++) {
    inference.buffer[inference.buf_count++] = sampleBuffer[i];
    if (inference.buf_count >= inference.n_samples) {
      inference.buf_count = 0;
      inference.buf_ready = 1;
    }
  }
}

static void capture_samples(void *arg) {
  const int32_t i2s_bytes_to_read = (uint32_t)arg;
  size_t bytes_read;
  while (record_status) {
    esp_i2s::i2s_read(esp_i2s::I2S_NUM_0, (void *)sampleBuffer, i2s_bytes_to_read, &bytes_read, 100);

    if (bytes_read > 0) {
      for (int x = 0; x < bytes_read / 2; x++) {
        sampleBuffer[x] = (int16_t)(sampleBuffer[x]) * 8;
      }

      if (record_status) {
        audio_inference_callback(i2s_bytes_to_read);
      }
    }
  }
  vTaskDelete(NULL);
}

static bool microphone_inference_start(uint32_t n_samples) {
  inference.buffer = (int16_t *)malloc(n_samples * sizeof(int16_t));
  if (!inference.buffer) {
    return false;
  }

  inference.buf_count = 0;
  inference.n_samples = n_samples;
  inference.buf_ready = 0;

  ei_sleep(100);
  record_status = true;

  xTaskCreate(capture_samples, "CaptureSamples", 1024 * 32, (void *)sample_buffer_size, 10, NULL);
  return true;
}

static bool microphone_inference_record(void) {
  while (inference.buf_ready == 0) {
    delay(10);
  }
  inference.buf_ready = 0;
  return true;
}

static int microphone_audio_signal_get_data(size_t offset, size_t length, float *out_ptr) {
  numpy::int16_to_float(&inference.buffer[offset], out_ptr, length);
  return 0;
}

static void microphone_inference_end(void) {
  free(sampleBuffer);
  ei_free(inference.buffer);
}

