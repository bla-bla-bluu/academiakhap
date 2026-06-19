# Academia Khap Android App

This is a runnable Expo React Native Android app for Academia Khap.

## Run On Android Phone With Expo Go

1. Install Expo Go from the Play Store.
2. From this folder, run:

```bash
npm install
npm start
```

3. Scan the QR code with Expo Go.

## Build APK

Install/login to EAS, then run:

```bash
npm install
npx eas login
npm run build:apk
```

The APK build profile is configured in `eas.json`.

## Assets Included

- `assets/logo.png`
- `assets/logo_clean.png`
- `assets/header.png`

## Main Files

- `App.tsx`: native app UI and navigation
- `src/data/articles.ts`: bundled article content
- `app.json`: Expo Android app configuration
- `eas.json`: APK build configuration

