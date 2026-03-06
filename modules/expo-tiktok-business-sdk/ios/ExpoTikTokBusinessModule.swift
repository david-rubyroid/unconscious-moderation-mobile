import ExpoModulesCore
import TikTokBusinessSDK

public class ExpoTikTokBusinessModule: Module {
  private var isInitialized = false

  private func addProperties(_ props: [String: Any]?, to event: TikTokBaseEvent) {
    guard let props = props else { return }
    for (key, value) in props {
      if let v = value as? String { _ = event.addProperty(withKey: key, value: v) }
      else if let v = value as? NSNumber { _ = event.addProperty(withKey: key, value: v) }
      else if let v = value as? Bool { _ = event.addProperty(withKey: key, value: NSNumber(value: v)) }
    }
  }

  public func definition() -> ModuleDefinition {
    Name("ExpoTikTokBusinessModule")

    AsyncFunction("initialize") { (config: [String: Any]) async throws -> Void in
      guard let appId = config["appId"] as? String else {
        throw Exception(name: "InitializationError", description: "TikTok appId is required")
      }

      guard let tiktokAppId = config["tiktokAppId"] as? String else {
        throw Exception(name: "InitializationError", description: "TikTok tiktokAppId is required")
      }

      guard let appSecret = config["appSecret"] as? String else {
        throw Exception(name: "InitializationError", description: "TikTok App Secret is required")
      }

      let debugMode = config["debugMode"] as? Bool ?? false

      guard let tiktokConfig = TikTokConfig(
        accessToken: appSecret,
        appId: appId,
        tiktokAppId: tiktokAppId
      ) else {
        throw Exception(name: "InitializationError", description: "Failed to create TikTok configuration")
      }

      if debugMode {
        tiktokConfig.setLogLevel(TikTokLogLevelDebug)
      }

      try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
        TikTokBusiness.initializeSdk(tiktokConfig) { [weak self] success, error in
          if success {
            Task { @MainActor in
              self?.isInitialized = true
              if debugMode {
                print("[TikTok Business SDK] ✅ Initialized")
              }
              continuation.resume()
            }
          } else {
            print("[TikTok Business SDK] ❌ Initialization FAILED")
            if let error = error {
              print("[TikTok Business SDK] ❌ Error: \(error.localizedDescription)")
            }
            continuation.resume(throwing: error ?? NSError(domain: "ExpoTikTokBusiness", code: -1, userInfo: [NSLocalizedDescriptionKey: "TikTok SDK initialization failed"]))
          }
        }
      }
    }
    
    Function("trackEvent") { (eventName: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] ❌ WARNING: SDK not initialized. Call initialize() first.")
        return
      }
      let event = TikTokBaseEvent(eventName: eventName, eventId: nil)
      self.addProperties(properties, to: event)
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
    }

    Function("trackPurchase") { (value: Double, currency: String, contents: [[String: Any]], properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] ❌ WARNING: SDK not initialized. Call initialize() first.")
        return
      }
      let event = TikTokBaseEvent(eventName: "Purchase", eventId: nil)
      _ = event.addProperty(withKey: "value", value: NSNumber(value: value))
      _ = event.addProperty(withKey: "currency", value: currency)
      self.addProperties(properties, to: event)
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
    }

    Function("trackSearch") { (query: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] ❌ WARNING: SDK not initialized. Call initialize() first.")
        return
      }
      let event = TikTokBaseEvent(eventName: "Search", eventId: nil)
      _ = event.addProperty(withKey: "search_string", value: query)
      self.addProperties(properties, to: event)
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
    }

    Function("flush") { () -> Void in
      guard self.isInitialized else { return }
      TikTokBusiness.explicitlyFlush()
    }
  }
}
