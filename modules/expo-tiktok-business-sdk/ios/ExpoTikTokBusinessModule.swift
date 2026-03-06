import ExpoModulesCore
import TikTokBusinessSDK

public class ExpoTikTokBusinessModule: Module {
  private var isInitialized = false
  
  public func definition() -> ModuleDefinition {
    Name("ExpoTikTokBusinessModule")
    
    // Async function for initialization — waits for SDK completion before resolving
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
                print("[TikTok Business SDK] ✅ Initialized successfully")
                print("[TikTok Business SDK] 📱 App ID (short): \(appId)")
                print("[TikTok Business SDK] 📱 Bundle ID: \(Bundle.main.bundleIdentifier ?? "unknown")")
                print("[TikTok Business SDK] 🔑 TikTok App ID (long): \(tiktokAppId)")
                print("[TikTok Business SDK] 🔐 App Secret: \(appSecret.prefix(8))...")
                print("[TikTok Business SDK] 🐛 Debug mode: ON")
              } else {
                print("[TikTok Business SDK] ✅ Initialized (production mode)")
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
    
    // Track event using TikTokBaseEvent + trackTTEvent (recommended API)
    Function("trackEvent") { (eventName: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] ❌ WARNING: SDK not initialized. Call initialize() first.")
        return
      }
      
      print("[TikTok Business SDK] 📤 Tracking event: \(eventName)")
      let event = TikTokBaseEvent(eventName: eventName, eventId: nil)
      
      if let properties = properties {
        print("[TikTok Business SDK] 📋 Properties: \(properties)")
        for (key, value) in properties {
          if let stringValue = value as? String {
            _ = event.addProperty(withKey: key, value: stringValue)
          } else if let numberValue = value as? NSNumber {
            _ = event.addProperty(withKey: key, value: numberValue)
          } else if let boolValue = value as? Bool {
            _ = event.addProperty(withKey: key, value: NSNumber(value: boolValue))
          }
        }
      }
      
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
      print("[TikTok Business SDK] ✅ Event sent via trackTTEvent (flushed)")
    }
    
    // Track purchase event (TikTokBaseEvent + trackTTEvent)
    Function("trackPurchase") { (value: Double, currency: String, contents: [[String: Any]], properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] Warning: SDK not initialized. Call initialize() first.")
        return
      }
      
      let event = TikTokBaseEvent(eventName: "Purchase", eventId: nil)
      _ = event.addProperty(withKey: "value", value: NSNumber(value: value))
      _ = event.addProperty(withKey: "currency", value: currency)
      
      if let props = properties {
        for (key, val) in props {
          if let stringValue = val as? String {
            _ = event.addProperty(withKey: key, value: stringValue)
          } else if let numberValue = val as? NSNumber {
            _ = event.addProperty(withKey: key, value: numberValue)
          } else if let boolValue = val as? Bool {
            _ = event.addProperty(withKey: key, value: NSNumber(value: boolValue))
          }
        }
      }
      
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
    }
    
    // Track search event (TikTokBaseEvent + trackTTEvent)
    Function("trackSearch") { (query: String, properties: [String: Any]?) -> Void in
      guard self.isInitialized else {
        print("[TikTok Business SDK] Warning: SDK not initialized. Call initialize() first.")
        return
      }
      
      let event = TikTokBaseEvent(eventName: "Search", eventId: nil)
      _ = event.addProperty(withKey: "search_string", value: query)
      
      if let props = properties {
        for (key, value) in props {
          if let stringValue = value as? String {
            _ = event.addProperty(withKey: key, value: stringValue)
          } else if let numberValue = value as? NSNumber {
            _ = event.addProperty(withKey: key, value: numberValue)
          } else if let boolValue = value as? Bool {
            _ = event.addProperty(withKey: key, value: NSNumber(value: boolValue))
          }
        }
      }
      
      TikTokBusiness.trackTTEvent(event)
      TikTokBusiness.explicitlyFlush()
    }
    
    // Flush pending events to TikTok servers immediately
    Function("flush") { () -> Void in
      guard self.isInitialized else { return }
      TikTokBusiness.explicitlyFlush()
      print("[TikTok Business SDK] 📤 Flush called")
    }
  }
}
