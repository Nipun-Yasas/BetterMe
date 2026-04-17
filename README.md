# BetterMe

BetterMe is a React Native fitness app built with Expo and Expo Router.
It includes authentication screens, an exercise discovery home screen powered by API Ninjas, favorites management, and light/dark theme support.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router (file-based navigation)
- Redux Toolkit + React Redux
- Formik + Yup (forms and validation)
- AsyncStorage (auth/theme persistence)
- react-native-reanimated (animations)

## Features

- Auth flow with route guarding
   - Login and registration screens with Yup validation
   - Auth status persisted in AsyncStorage
   - Navigation guard redirects users between auth and app tabs
- Exercise discovery
   - Search by exercise name
   - Filter by muscle group and difficulty
   - Data fetched from the API Ninjas Exercises API
- Favorites
   - Save/remove exercises from favorites
   - Dedicated favorites tab with details modal
- Profile
   - User summary card and basic stats
   - Theme switch (light/dark)
   - Logout button

## Project Structure

```text
app/
   _layout.tsx            # Root providers, splash handling, auth guard
   (auth)/                # Login/Register stack
   (tabs)/                # Home/Favorites/Profile tabs
components/
   ui/                    # Reusable UI components (cards, modals, buttons, switch)
config/
   api.ts                 # API base URL and API key mapping
context/
   ThemeContext.tsx       # Theme state + persistence
services/
   api.ts                 # Exercise API service
store/
   index.ts               # Redux store
   slices/
      authSlice.ts         # Auth state + async auth helpers (currently mocked)
      favoritesSlice.ts    # Favorites state
utils/
   validationSchemas.ts   # Yup schemas for auth forms
```

## Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI tools via npx (no global install required)

## Environment Variables

Create a .env file in the project root:

```bash
API_KEY=your_api_ninjas_key_here
```

The value is read in app.config.js and exposed to the app as expo.extra.apiNinjasKey.

Get your key from: https://api-ninjas.com/api/exercises

## Installation

```bash
npm install
```

## Running the App

Start Metro:

```bash
npm run start
```

Platform-specific shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

- npm run start: start Expo development server
- npm run android: open Android target
- npm run ios: open iOS target
- npm run web: open web target
- npm run lint: run Expo ESLint checks
- npm run reset-project: reset boilerplate scaffold

## Authentication Notes

Current auth in store/slices/authSlice.ts is mocked for development:

- loginUser and registerUser create local mock users/tokens
- Token and user are saved in AsyncStorage
- checkAuthStatus restores sessions on app launch

To connect a real backend:

1. Replace mocked login/register implementations with API calls
2. Keep dispatching setCredentials on success
3. Keep AsyncStorage persistence (or migrate to secure storage)
4. Update error handling based on backend response format

## API Notes

- Exercises are fetched from:
   - https://api.api-ninjas.com/v1/exercises
- Optional query params used:
   - name
   - muscle
   - difficulty
- API key is sent as X-Api-Key header

If API_KEY is missing or invalid, the Home screen will show an error state with retry.

## Navigation Overview

- Root stack in app/_layout.tsx
   - (auth): unauthenticated routes
   - (tabs): authenticated app routes
- Tabs in app/(tabs)/_layout.tsx
   - Home
   - Favorites
   - Profile

## Theming

- ThemeContext manages theme mode and persistence (user-theme key)
- App honors light/dark styles through constants/theme.ts and navigation theme provider

## Linting

```bash
npm run lint
```

## Roadmap Ideas

- Replace mock auth with production API integration
- Persist favorites to backend
- Add workout plan builder and progress history
- Add notifications and reminders
- Improve profile settings actions (currently mostly UI placeholders)

## Troubleshooting

- App shows no exercises
   - Verify .env exists and API_KEY is valid
   - Restart Expo after changing .env
- Stuck on splash/loading
   - Check Metro logs for runtime errors
   - Ensure dependencies are installed correctly
- Theme/auth state looks stale
   - Clear app storage and relaunch

## License

Add your preferred license here.
