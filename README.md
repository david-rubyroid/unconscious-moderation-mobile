# Unconscious Moderation

Mobile app (Expo) and backend API.

## Tech stack

**Backend** (separate repo, hosted on AWS App Runner):

- REST API, JWT (access + refresh)
- Environments: dev / prod via `EXPO_PUBLIC_API_URL`

**Mobile app** (this repo):

- **Expo** (SDK 54), **React Native**, **TypeScript**
- **expo-router** — routing, **TanStack React Query** — API requests, **ky** — HTTP client
- **react-hook-form** + **Zod** — forms and validation
- **OneSignal** — push notifications, **RevenueCat** — subscriptions, **Mixpanel** — analytics, **TikTok App Events SDK** — ad conversion tracking
- Build and OTA: **EAS**

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure environment variables

   Copy `.env.example` to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

   **Important:** For TikTok integration, you need to register your app in TikTok Ads Manager:
   - Go to **TikTok Ads Manager → Tools → Business Center → Assets → Apps**
   - Click **Add App** → Select platform (iOS/Android)
   - Enter your App Store listing URL (iOS) or Google Play URL (Android)
   - Complete the **SDK Setup Guide** and copy credentials from **Step 03: Initialize app**
   - Add to `.env`:
     ```
     EXPO_PUBLIC_TIKTOK_APP_ID_IOS=759780986137565944
     EXPO_PUBLIC_TIKTOK_APP_SECRET_IOS=TTIORalelwy43mfvlkAdzVKd9Lk2UeFt
     ```
   - **Note:** Android support is not yet implemented (TODO)

3. For iOS: Rebuild native code after adding credentials

   ```bash
   npx expo prebuild --platform ios --clean
   cd ios && pod install && cd ..
   npx expo run:ios
   ```

4. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
