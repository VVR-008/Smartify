# 🌟 Smartify - Voice-Enabled IoT Automation System

![GitHub](https://github.com/VVR-008/Smartify/blob/main/LICENSE)
![GitHub stars](https://img.shields.io/github/stars/VVR-008/Smartify?style=social)
![GitHub issues](https://img.shields.io/github/issues/VVR-008/Smartify)

**Project ID**: G168  
**Student**: Vislavath Vishal Raj  
**Branch**: Computer Science and Engineering (CSE)  
**College**: Keshav Memorial Institute of Technology  

Smartify is a cutting-edge, **offline voice-controlled IoT system** that simplifies appliance control using voice commands. Powered by **ESP32-S3** for wake-word detection and **ESP32** for relay-based control, Smartify operates without internet dependency, ensuring **speed**, **privacy**, and **energy efficiency**. Ideal for homes 🏠, offices 🏢, hotels 🏨, and outdoor spaces 🌳, it scales effortlessly to control lights, fans, and more.

## 📝 Abstract

Smartify leverages **Edge AI** to deliver real-time, offline voice automation. Using **Edge Impulse** for wake-word recognition and WiFi-based ESP32 communication, it offers:  
- **Real-time appliance control** with minimal latency  
- **Enhanced privacy** through local processing  
- **Scalability** for multi-device and multi-environment setups  

*Placeholder: Include a high-quality diagram/photo of the Smartify setup (ESP32-S3, ESP32, and appliances).*

## 🎯 Objectives

- 🛠️ Develop an efficient, offline, and scalable voice automation system  
- 🧠 Train and deploy a wake-word recognition model via Edge Impulse  
- 🌐 Enable seamless ESP32-to-ESP32 communication over WiFi  
- 🔌 Ensure zero internet dependency for reliable operation  

## 🧠 Problem Statement

Design a smart, voice-activated system using Edge AI and ESP32 boards to control appliances with simple commands. The system must be:  
- **Offline-capable** for privacy and reliability  
- **Energy-efficient** for sustainability  
- **Real-time** for instant response  

## 🔍 Smartify vs. Conventional Systems

| Feature                | Conventional Systems (e.g., Alexa, Google Home) | Smartify                     |
|------------------------|-----------------------------------------------|------------------------------|
| **Processing**         | Cloud-based 🌐                                | Offline (Edge AI) 🧠         |
| **Latency**            | High due to internet dependency               | Low (local processing) ⚡    |
| **Privacy**            | Data sent to cloud 🔒                         | Local processing 🔐          |
| **Internet Dependency**| Constantly required                           | None 🚫                     |

## 🧱 System Architecture

Smartify uses a simple yet powerful architecture with two ESP32 boards:  
```
┌────────────────────┐             ┌─────────────────────┐
│   ESP32-S3 Board   │ -- WiFi --> │     ESP32 Board     │
│ (Wake Word Engine) │             │ (Relay Controller)  │
└────────────────────┘             └─────────────────────┘
        │                                   │
        ▼                                   ▼
  Microphone                         Appliances (Fan, Light)
Edge Impulse Model                     Relay Module
```

## 🛠️ Hardware Components

- 🎤 **ESP32-S3** (with built-in microphone for wake-word detection)  
- ⚙️ **ESP32 Board** (for appliance control)  
- 🔌 **Relay Module** (to switch appliances)  
- 💡 **Appliances** (LED, Fan, Bulb)  
- 🔋 **Power Source** (3.3V / 5V)  
- 📡 **WiFi Router** (for ESP32 communication)  

## 💻 Software Requirements

- 🧠 **Edge Impulse Studio** (wake-word model training)  
- 💾 **Arduino IDE** (ESP32 programming)  
- 🚀 **Edge Impulse CLI** (model deployment)  
- 🛠️ **C++ / Arduino Framework** (firmware development)  

## 🗣️ Voice Commands

| Command       | Functionality            |
|---------------|--------------------------|
| `Hello ESP`   | Wake word trigger 🎤     |
| `light on`    | Turns the light ON 💡    |
| `off light`   | Turns the light OFF 🌑   |

## 📥 Wake Word Model

- Trained model: [Edge Impulse Studio Project](https://studio.edgeimpulse.com/studio/560219)  
- Deployment: Extract the model and place it in `esp32s3-wakeup/edge-impulse-library/`

## 🎬 Milestone Videos

| Milestone | Link |
|-----------|------|
| 1         | [▶️ Watch](https://youtu.be/DYXQHowh-Yw) |
| 2         | [▶️ Watch](https://youtu.be/AVJk5DDtgkE) |

## ✅ Results

- ⚡ **Real-time control**: Instant appliance response via voice  
- 🧠 **High accuracy**: 90%+ wake-word recognition offline  
- 📶 **Reliable communication**: Stable ESP32-to-ESP32 WiFi and relay activation  
- 🌐 **Web interface**: Real-time toggling via WebSocket  

## 🔮 Future Scope

- 📱 Mobile dashboard for remote control  
- 🏠 Multi-room automation support  
- 🔗 Integration with ZigBee, MQTT, or Bluetooth  
- 📊 Real-time appliance usage and power analytics  

## 🚀 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VVR-008/Smartify.git
   ```
2. **Set Up Edge Impulse**:
   - Train and export the wake-word model from [Edge Impulse Studio](https://studio.edgeimpulse.com/studio/560219).
   - Place the model in `esp32s3-wakeup/edge-impulse-library/`.
3. **Program ESP32 Boards**:
   - Install [Arduino IDE](https://www.arduino.cc/en/software).
   - Upload the firmware to ESP32-S3 and ESP32 boards using the provided code.
4. **Connect Hardware**:
   - Wire the ESP32-S3, ESP32, relay module, and appliances as per the architecture diagram.
5. **Run the System**:
   - Power the boards and test voice commands like "Hello ESP" or "light on."

## 🤝 Contributing

Contributions are welcome! Please follow these steps:  
1. Fork the repository.  
2. Create a new branch (`git checkout -b feature-branch`).  
3. Commit your changes (`git commit -m "Add feature"`).  
4. Push to the branch (`git push origin feature-branch`).  
5. Open a pull request.  

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Built with 💡 Innovation and 🔌 IoT  
**Keshav Memorial Institute of Technology**
