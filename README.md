# Unconscious Moderation

Mobile app for mindful drinking and moderation (Expo / React Native). The backend is a separate repo and is hosted on AWS App Runner.

**Note:** Currently only **iOS** is in production; Android is not yet released to production.

---

## Tech stack

| Area | Stack |
|------|--------|
| **Framework** | Expo SDK 54, React Native, TypeScript |
| **Routing** | expo-router (file-based) |
| **API** | TanStack React Query, ky (HTTP client) |
| **Forms** | react-hook-form, Zod |
| **i18n** | i18next, react-i18next |
| **Push** | OneSignal |
| **Payments** | RevenueCat |
| **Analytics** | Mixpanel |
| **Ads** | TikTok App Events SDK |
| **Build / OTA** | EAS (Expo Application Services) |

---

## Prerequisites

- **Node.js** (LTS, e.g. 20+)
- **npm** (comes with Node)
- **Expo CLI** (optional; `npx expo` is enough)
- **iOS**: Xcode, CocoaPods (for native builds)
- **Android**: Android Studio, SDK (for native builds)
- **EAS CLI** for builds: `npm i -g eas-cli`

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd unconscious-moderation-mobile
npm install
```

### 2. Environment variables

Copy the example env and fill in values:

```bash
cp .env.example .env
```

Edit `.env`. Required for a working app:

- **`EXPO_PUBLIC_API_URL`** — backend API base URL (dev/staging/prod).
- **`EXPO_PUBLIC_ONESIGNAL_APP_ID`** — OneSignal app ID (push).
- **`EXPO_PUBLIC_MIXPANEL_TOKEN`** — Mixpanel project token.
- **`EXPO_PUBLIC_REVENUECAT_*`** — RevenueCat API keys (iOS/Android) for subscriptions.
- **`EXPO_PUBLIC_GOOGLE_OAUTH_*`** — Google OAuth client IDs if using Google sign-in.
- **`EXPO_PUBLIC_TIKTOK_APP_ID_IOS`** / **`EXPO_PUBLIC_TIKTOK_APP_SECRET_IOS`** — TikTok App Events (iOS). Android: TODO.

Only `EXPO_PUBLIC_*` vars are embedded in the bundle. Do not put secrets in `.env`.

### 3. Run the app

```bash
npm start
# or
npx expo start
```

Then:

- **Development build (recommended):** open in iOS Simulator or Android emulator (or device) after building once — see [Development builds](https://docs.expo.dev/develop/development-builds/introduction/).
- **Expo Go:** scan QR code with Expo Go app (some native features may not work).

**Run on a specific platform:**

```bash
npm run ios      # requires Xcode + dev build
npm run android  # requires Android Studio + dev build
```

---

## Project structure

```
unconscious-moderation-mobile/
├── app.json                 # Expo app config (name, scheme, plugins, EAS)
├── eas.json                 # EAS build profiles (development, preview, production)
├── .env.example             # Env template — copy to .env
├── src/
│   ├── app/                 # expo-router screens (file-based routing)
│   │   ├── _layout.tsx      # Root layout: QueryClient, AuthProvider, Stack
│   │   ├── (auth)/          # Login, sign-up, forgot password
│   │   ├── (public)/        # Public/onboarding screens
│   │   └── (private)/       # Authenticated area
│   │       ├── _layout.tsx # Protected layout, onboarding guards
│   │       ├── (tabs)/     # Tab navigator: Home, Toolkit, Profile
│   │       ├── drink-tracker/
│   │       ├── journaling/
│   │       └── ...         # Other feature routes
│   ├── api/
│   │   ├── client.ts        # ky instance (base URL, auth header, 401 refresh)
│   │   ├── query-client.ts  # TanStack Query client
│   │   ├── constants.ts     # Timeouts, stale times
│   │   ├── helpers.ts       # createQueryFn, createMutationFn
│   │   └── queries/        # Per-domain hooks (auth, drink-session, user, …)
│   ├── components/         # Reusable UI (Button, Header, forms, calendars, …)
│   ├── constants/          # Theme (Colors), currency, video links, etc.
│   ├── context/            # Auth (AuthProvider, useAuth)
│   ├── hooks/              # App and feature hooks
│   ├── i18n/                # i18next config and resource loading
│   ├── locales/            # en/, es/ JSON translation files
│   ├── services/           # Mixpanel, OneSignal, RevenueCat, TikTok init
│   ├── utils/              # date, responsive (scale/verticalScale), toasts, etc.
│   └── validations/        # Zod schemas (e.g. auth)
├── assets/                 # Images, fonts, static files
├── modules/
│   └── expo-tiktok-business-sdk/  # Local Expo module for TikTok
└── scripts/                # optimize-images, reset-project
```

**Path aliases (tsconfig):** `@/*` → `./src/*`, `@/assets/*` → `./assets/*`. Use them for imports instead of relative paths where it makes sense.

---

## Key concepts

### Routing (expo-router)

- **File-based:** `src/app/` folder structure defines routes. `_layout.tsx` files wrap children; `(folder)` is a group (no segment in URL).
- **Auth:** Root `_layout.tsx` uses `Stack.Protected` with `guard={isAuthenticated}` to show `(private)` or `(public)` / `(auth)`.
- **Onboarding:** `(private)/_layout.tsx` uses guards (e.g. basic info, gifts, fears, your anchor) to redirect to the right onboarding screen or to `(tabs)`.
- **Navigation:** `useRouter()` from `expo-router` — `push`, `replace`, `back`. Prefer `replace` in wizards so the stack stays shallow; use `back()` to return to the previous screen (e.g. after creating a future drink session).

### API layer

- **HTTP:** `src/api/client.ts` — single `ky` instance with `EXPO_PUBLIC_API_URL`, JSON, timeout. It attaches the access token and handles 401 by refreshing the token and retrying.
- **Queries / mutations:** In `src/api/queries/<domain>/`:
  - **Queries:** `createQueryFn(url, queryParams?)` + `useQuery` with a stable `queryKey`. Invalidate related keys in mutations.
  - **Mutations:** `createMutationFn(method, url, options?)` + `useMutation`; optional `skipBody: true` for DELETE.
- **DTOs:** Types and request/response shapes live in `dto.ts` next to the hooks. Keep them in sync with the backend.

### Auth

- **Context:** `context/auth/` — `AuthProvider` reads token from secure storage, sets `hasToken`, then `useGetCurrentUser` runs. `isAuthenticated` = user loaded; `isInitialized` = auth state ready.
- **Tokens:** Stored in Expo SecureStore; 401 triggers refresh and retry in `api/client.ts`.

### Internationalization (i18n)

- **Config:** `src/i18n/config.ts` — i18next with device language and fallback.
- **Resources:** `src/locales/en/`, `src/locales/es/` — one JSON per namespace (e.g. `drink-tracker.json`).
- **Usage:** `useTranslation('namespace')` then `t('key')`. Namespace is the filename without `.json`.

### Styling

- **Theme:** `src/constants/theme.ts` — `Colors.light` (primary, backgrounds, etc.). No dark theme yet.
- **Responsive:** `src/utils/responsive.ts` — `scale()`, `verticalScale()` for spacing and sizes.
- **Components:** Prefer existing components from `src/components/` (e.g. `ScreenContainer`, `Header`, `Button`, `ThemedText`) and theme colors so the app stays consistent.

### Forms

- **Pattern:** `react-hook-form` + `@hookform/resolvers/zod` + Zod schema. Use `ControlledTextInput`, `ControlledSelectInput`, etc. from `@/components` with `control` and `name`.

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS (native build) |
| `npm run android` | Run on Android (native build) |
| `npm run web` | Start for web |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run optimize-images` | Optimize images (script in `scripts/`) |
| `npm run reset-project` | Move starter app to `app-example`, create blank `app` (use with care) |

Pre-commit (Husky + lint-staged) runs ESLint on staged `.js/.jsx/.ts/.tsx` files.

---

## Builds and deployment (EAS)

- **Profiles** in `eas.json`: `development` (dev client), `preview` (internal/test), `production` (store). Production builds are currently **iOS only**; Android is not in production yet.
- **Build:**  
  `eas build --profile development` (or `preview` / `production`)  
  Choose platform when prompted or use `--platform ios` / `--platform android`.
- **OTA updates:** After shipping a new JS bundle, use EAS Update so users get the update without a new store build (see [EAS Update](https://docs.expo.dev/eas-update/introduction/)).

---

## Third-party integrations

- **OneSignal:** Push notifications; init in `_layout.tsx`, config in app plugins. Set `EXPO_PUBLIC_ONESIGNAL_APP_ID`.
- **RevenueCat:** Subscriptions; init at startup; identify user after login. Use iOS/Android keys in `.env`.
- **Mixpanel:** Analytics; init at startup; screen tracking in root layout; identify user when logged in.
- **TikTok App Events SDK:** Local module in `modules/expo-tiktok-business-sdk`; iOS credentials in `.env`; Android TODO. Used for conversion tracking.

---

## Quick reference for new developers

1. **Add a new screen:** Add a file under `src/app/(private)/...` or the right group; use `_layout.tsx` in that folder if you need a nested layout.
2. **Call the API:** Add or reuse hooks in `src/api/queries/<domain>/` using `createQueryFn` / `createMutationFn` and DTOs; use the hooks in screens or components.
3. **Add translations:** Add keys to the right JSON in `src/locales/en/` (and `es/` if needed); use `useTranslation('namespace')` and `t('key')`.
4. **Shared UI:** Prefer `src/components/` and theme from `src/constants/theme.ts`.
5. **Env:** Never commit `.env`. Copy from `.env.example` and ask the team for real values (API URL, OneSignal, RevenueCat, etc.).

---

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [expo-router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [EAS Build](https://docs.expo.dev/build/introduction/), [EAS Update](https://docs.expo.dev/eas-update/introduction/)
