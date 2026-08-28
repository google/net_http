# WebChannel iOS Demo App

An iOS demo app (built with SwiftUI) to test and verify bidirectional communication with `webchannel.sandbox.google.com` using the Objective-C WebChannel client implementation (`WCWebChannelClient`).

The UI is optimized for devices ranging from compact screens like iPhone SE to iPads, providing real-time visibility into connection status, received messages, HTTP headers, and error details.

---

## 📱 Key Features

- **One-Tap Connect & Test**:
  - Connects to `https://webchannel.sandbox.google.com/staging/channel/generator`
  - Automatically sends the generator test payload (requesting 3 echoed messages) upon connection establishment
- **Real-Time Console Log**:
  - Color-coded log entries for OPEN, SEND, RECV, HEADER, ERROR, and CLOSE events
  - Auto-scroll / manual scroll toggle, clear logs, and log sharing (iOS 16+ ShareLink)
- **Custom Payload Transmission**:
  - Send custom JSON / text messages interactively during an active session
- **Connection Configuration Sheet**:
  - Configurable Base Endpoint URL
  - Configurable `HTTPSessionIDParam` (default: `gsessionid`)
  - Configurable `fastHandshake` toggle (default: OFF)

---

## 🚀 Running on iPhone SE (Physical Device)

### 1. Open the Workspace
Make sure to open **`WebChanneliOSDemo.xcworkspace`** in Xcode (not the `.xcodeproj` file).

```bash
cd objc/demo/WebChanneliOSDemo
open WebChanneliOSDemo.xcworkspace
```

### 2. Configure Code Signing (First time only)
1. Select the top-level **`WebChanneliOSDemo`** project in Xcode's left navigator
2. Navigate to the **`Signing & Capabilities`** tab
3. Ensure **`Automatically manage signing`** is checked
4. In the **`Team`** dropdown, select your Apple ID (Personal Team)
5. If the Bundle Identifier conflicts, append a unique suffix (e.g. `com.yourname.webchannel.demo`)

### 3. Setup iPhone SE
1. Connect your iPhone SE to your Mac using a Lightning or USB-C cable
2. Unlock your iPhone; when prompted with "**Trust This Computer?**", tap **Trust** and enter your passcode
3. **Enable Developer Mode** (iOS 16+):
   - On your iPhone, go to **Settings** > **Privacy & Security** > **Developer Mode**
   - Turn it **ON** and restart the device as instructed

### 4. Build and Run on Device
1. In Xcode's top toolbar, click the run destination selector and choose your connected **iPhone SE**
2. Press `Cmd + R` (or click the ▶️ Run button) to build and install the app onto your device

### 5. Trust Developer Certificate (First time on free Apple ID)
If a "Untrusted Developer" prompt appears on your iPhone when launching:
1. Open **Settings** > **General** > **VPN & Device Management** on your iPhone
2. Under "Developer App", tap your Apple ID account
3. Tap **Trust "[Your Account Name]"**

---

## 🏗️ Architecture

- **UI Layer**: SwiftUI ([`ContentView.swift`](WebChanneliOSDemo/ContentView.swift))
- **State Management & Bridge**: [`WebChannelManager.swift`](WebChanneliOSDemo/WebChannelManager.swift)
  - Implements the `WCWebChannelClientHandlerDelegate` protocol
  - Dispatches background callback events to the `@MainActor` for UI updates
- **Core Library**: Objective-C WebChannel ([`objc/imported_src`](../../imported_src))
  - Integrated via CocoaPods local path reference (`pod 'WebChannel', :path => '../../'`)
