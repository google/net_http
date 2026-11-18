import SwiftUI

@main
struct WebChanneliOSDemoApp: App {
    init() {
        NetworkFailureQlog.configureAtStartupIfRequested()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
