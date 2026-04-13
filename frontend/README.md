# BookStore - React Native Frontend

A mobile app built with **React Native + Expo** for sharing and discovering book recommendations.

## Tech Stack

| Tool                | Purpose                      |
| ------------------- | ---------------------------- |
| Expo (SDK 53)       | React Native framework       |
| TypeScript          | Type safety                  |
| React Navigation    | Screen navigation (stack + tabs) |
| Axios               | HTTP client for API calls    |
| AsyncStorage        | Local token/user persistence |
| Expo Image Picker   | Selecting images from gallery |
| Cloudinary (via API)| Image hosting (handled by backend) |

## Folder Structure

```
frontend/
├── App.tsx                        # App entry point (wraps providers)
├── index.ts                       # Expo entry
├── app.json                       # Expo config
├── tsconfig.json                  # TypeScript config
├── package.json
│
└── src/
    ├── api/                       # All API calls (one file per resource)
    │   ├── client.ts              # Axios instance with base URL + auth interceptor
    │   ├── auth.ts                # login, signup
    │   ├── books.ts               # getBooks, getUserBooks, addBook, updateBook, deleteBook
    │   └── user.ts                # getProfile, updateProfile, updateProfileImage, deleteAccount
    │
    ├── context/                   # React Context providers
    │   └── AuthContext.tsx         # Auth state (user, token, login/logout)
    │
    ├── navigation/                # React Navigation setup
    │   ├── RootNavigator.tsx      # Switches between Auth and App based on login state
    │   ├── AuthNavigator.tsx      # Stack: Login -> Signup
    │   └── AppNavigator.tsx       # Bottom tabs: Home | Add Book | Profile
    │
    ├── screens/                   # All screens grouped by feature
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   └── SignupScreen.tsx
    │   ├── book/
    │   │   ├── HomeScreen.tsx     # Feed of all books (paginated, pull-to-refresh)
    │   │   └── AddBookScreen.tsx  # Form to add a new book with image
    │   └── profile/
    │       └── ProfileScreen.tsx  # User info, their books, image upload, logout
    │
    ├── styles/                    # Shared style constants
    │   └── colors.ts              # App color palette
    │
    └── utils/                     # Shared types and helpers
        └── types.ts               # User, Book interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app on your phone (for testing on a real device)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)

### Setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Update the API base URL in `src/api/client.ts`:

   - **Android Emulator:** `http://10.0.2.2:3000/api` (default)
   - **iOS Simulator:** `http://localhost:3000/api`
   - **Physical Device:** `http://<your-machine-ip>:3000/api`

   To find your machine IP:
   ```bash
   # Windows
   ipconfig
   # Mac/Linux
   ifconfig | grep "inet "
   ```

3. Make sure the backend server is running:

   ```bash
   cd ../backend
   npm run dev
   ```

4. Start the Expo dev server:

   ```bash
   npm start
   ```

5. Scan the QR code with Expo Go (phone) or press `a` for Android emulator / `i` for iOS simulator.

## App Screens

| Screen       | What it does                                           |
| ------------ | ------------------------------------------------------ |
| **Login**    | Email + password login, navigates to Signup             |
| **Signup**   | Username + email + password registration                |
| **Home**     | Scrollable feed of all books with pull-to-refresh       |
| **Add Book** | Form with image picker, title, caption, star rating     |
| **Profile**  | Shows user info, their books, change photo, logout      |

## How Auth Works

1. On login/signup, the backend returns a **JWT token** and the **user object**.
2. Both are saved to `AsyncStorage` (persists across app restarts).
3. An Axios interceptor automatically attaches the token as a `Bearer` header on every API request.
4. `RootNavigator` checks if a user exists in context -- if yes, show the app; if no, show auth screens.
5. On logout, token and user are cleared from `AsyncStorage` and context.
