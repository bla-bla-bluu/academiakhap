# Academia Khap Android App

This is a runnable Expo React Native Android app for Academia Khap. Besides the public
Home/Research/About/Work/Contact pages, it has a members system: an **Account** tab with
role-based login, and a **Community** tab (visible once logged in).

- **Admin console**: records donations and org expenses, sees the auto-computed org balance,
  allots funds/scholarships to members, and creates new logins with a role (admin/trustee/
  member/scholar).
- **Member console**: sees their own allotted amount, what they've spent, and their remaining
  balance, logs new expenses against it, and (for every role except scholar) sees the org-wide
  total donations received and total expenses made.
- **Community**: a text-only discussion feed — any signed-in role can post (up to 500
  characters, no images/GIFs) and comment on others' posts.

There is no custom backend server — auth, the database, and the community feed all run on
[Firebase](https://firebase.google.com) (Firestore + Auth), entirely on the free **Spark** plan
(no credit card required). Security is enforced by `firestore.rules`, so the app can talk to
Firestore directly and safely without a server in between.

Two things worth knowing about how this avoids any paid Firebase feature:
- Normally, letting an admin create a new login for someone else needs a privileged
  server-side call, which on Firebase usually means Cloud Functions (Blaze-plan only). Instead,
  `src/lib/firebase.ts`'s `createMemberAuthAccount` spins up a temporary second Firebase app
  instance to create the new login, so the admin's own session is never disturbed and no Cloud
  Function is involved.
- The org-wide and per-member balances aren't computed live by querying every donation/expense
  row (Firestore can't hide row-level detail from an aggregate query the way Postgres can) —
  they're kept in two small summary documents (`orgSummary/totals`, `memberSummaries/{uid}`)
  updated with atomic `increment()` writes in the same batch as every donation/expense/allotment.

## One-time backend setup (do this before the login/console/community features will work)

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)
   (Spark/free plan, no card needed). Add an Android app inside it if prompted — the package name
   is `com.academiakhap.app` (matches `app.json`).
2. **Enable Authentication**: Build -> Authentication -> Get started -> enable the
   **Email/Password** sign-in provider.
3. **Enable Firestore**: Build -> Firestore Database -> Create database -> start in production mode.
4. **Publish the security rules**: Firestore Database -> Rules tab -> paste in the entire contents
   of [`firestore.rules`](firestore.rules) -> Publish.
5. **Create the first admin** (every other account after this is created from inside the app, but
   the very first admin has no admin yet to create them):
   - Authentication -> Users -> Add user. Set an email + password, copy the generated UID.
   - Firestore Database -> Data -> Start collection `profiles` -> document ID = that UID -> fields:
     `fullName` (string), `email` (string), `role` (string, value `admin`).
6. **Get your app config**: Project settings (gear icon) -> scroll to "Your apps" -> add/select a
   Web app (yes, even though this is an Android app — the Firebase JS SDK uses the web config
   object) -> copy the `apiKey`, `authDomain`, `projectId`, `storageBucket`,
   `messagingSenderId`, `appId` values.
7. **Configure the app**: `cp .env.example .env` and fill in those six values.

After that, log in with the admin account you created in step 5 to add donations, allot funds to
members, and create member logins from the Members tab of the admin console.

## Run On Android Phone With Expo Go

1. Install Expo Go from the Play Store.
2. From this folder, run:

```bash
npm install
npm start
```

3. Scan the QR code with Expo Go.

## Build APK

**Option A — EAS cloud build** (no local Android SDK needed):

```bash
npm install
npx eas login
npm run build:apk
```

The APK build profile is configured in `eas.json` (`preview` profile builds a real installable
`.apk`; `production` builds a Play-Store-ready `.aab`). The first run will prompt you to either
create or link an Expo project for this app — that's expected.

**Option B — build locally with Android Studio's SDK** (now that it's installed on this machine,
`ANDROID_HOME` is set in `~/.zshrc`):

```bash
npm install
npx expo run:android --variant release
```

This generates the native `android/` project (via `expo prebuild`) and builds a real `.apk` with
your local Gradle/SDK, installing it straight onto a connected device or running emulator — no
Expo account needed. The output `.apk` lands under `android/app/build/outputs/apk/release/`.

## Assets Included

- `assets/logo.png`
- `assets/logo_clean.png`
- `assets/header.png`

## Main Files

- `App.tsx`: navigation shell (tab state) and the public marketing screens
- `src/contexts/AuthContext.tsx`: session/profile/role state, login, logout
- `src/screens/LoginScreen.tsx`: email/password login
- `src/screens/AdminConsoleScreen.tsx`: donations, org expenses, members, fund allotment
- `src/screens/MemberConsoleScreen.tsx`: a member's balance and expense logging
- `src/screens/CommunityScreen.tsx`: text-only community feed (posts + comments, 500 char limit)
- `src/lib/firebase.ts`: Firebase app/auth/Firestore setup, reads config from `.env`, and the
  `createMemberAuthAccount` helper used by the admin's "Add Member" form
- `firestore.rules`: all security rules (the Firestore equivalent of Postgres RLS)
- `src/data/articles.ts`: bundled article content
- `app.json`: Expo Android app configuration
- `eas.json`: APK build configuration

