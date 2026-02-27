# expo-tiktok-business-sdk

Custom Expo module for TikTok Business SDK integration.

## Platform Support

- ✅ **iOS** - Full support with official TikTok Business SDK 3.0+
- ❌ **Android** - Not yet implemented (TODO)

## Installation

This module is installed as a local dependency in the project:

```json
{
  "dependencies": {
    "expo-tiktok-business-sdk": "file:./modules/expo-tiktok-business-sdk"
  }
}
```

## iOS Setup

### 1. Add TikTok App ID to environment variables

In your `.env` file:

```
EXPO_PUBLIC_TIKTOK_APP_ID_IOS=your_tiktok_app_id_here
```

### 2. Configure the plugin

The config plugin will automatically:
- Add TikTok App ID to Info.plist
- Add required SKAdNetwork IDs for attribution

Add to `app.json`:

```json
{
  "plugins": [
    ["./modules/expo-tiktok-business-sdk/app.plugin.js"]
  ]
}
```

### 3. Rebuild native code

```bash
npx expo prebuild --clean
npx expo run:ios
```

## Usage

### Initialize SDK

Initialize the TikTok SDK at app startup (e.g., in `_layout.tsx`):

```typescript
import ExpoTikTokBusiness from 'expo-tiktok-business-sdk';

await ExpoTikTokBusiness.initialize({
  tiktokAppId: process.env.EXPO_PUBLIC_TIKTOK_APP_ID_IOS!,
  debugMode: __DEV__,
  autoTrackAppLifecycle: true
});
```

### Track Events

```typescript
// Track custom event
ExpoTikTokBusiness.trackEvent('ViewContent', {
  content_type: 'product',
  content_id: '123'
});

// Track purchase
ExpoTikTokBusiness.trackPurchase(
  29.99,
  'USD',
  [
    {
      content_id: 'product_123',
      content_name: 'Premium Subscription',
      quantity: 1
    }
  ]
);

// Track search
ExpoTikTokBusiness.trackSearch('meditation exercises');
```

## API Reference

### `initialize(config: TikTokSDKConfig): Promise<void>`

Initialize the TikTok Business SDK.

**Parameters:**
- `tiktokAppId` (string, required) - Your TikTok App ID from TikTok Ads Manager
- `debugMode` (boolean, optional) - Enable debug logging (default: false)
- `autoTrackAppLifecycle` (boolean, optional) - Automatically track Launch events (default: true)

### `trackEvent(eventName: string, properties?: object): void`

Track a custom event.

### `trackPurchase(value: number, currency: string, contents: array, properties?: object): void`

Track a purchase event.

### `trackSearch(query: string, properties?: object): void`

Track a search event.

## Standard Events

TikTok supports these standard events:
- `Launch` - App launch (tracked automatically if enabled)
- `Purchase` - Completed purchase
- `ViewContent` - Content view
- `Search` - Search action
- `AddToCart` - Add to cart
- `CompleteRegistration` - User registration

## Notes

- Events are only tracked on iOS. Android calls will be no-ops until Android implementation is added.
- In debug mode, events are logged but may not appear in TikTok Ads Manager immediately.
- For production tracking, build with `production` environment.
- Attribution data may take 24-48 hours to appear in TikTok Ads Manager.

## TODO

- [ ] Android implementation
- [ ] Additional event types
- [ ] User properties tracking
