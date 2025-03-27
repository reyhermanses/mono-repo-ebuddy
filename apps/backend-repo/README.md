## Getting Started

First, run the development server:

```bash
npm run dev
# and
npm run build && firebase emulators:start --only functions
# or 
npm start
# and
npm run build && firebase emulators:start --only functions
```

## Create file .env contains:

```bash
PORT=8001

FIREBASE_API_KEY="AIzaSyC_6ahOkitEfoexoOKivAJgkU9jslCKHq8"
FIREBASE_AUTH_DOMAIN="technical-test-ebbudy.firebaseapp.com"
FIREBASE_PROJECT_ID="technical-test-ebbudy"
FIREBASE_STORAGE_BUCKET="technical-test-ebbudy.firebasestorage.app"
FIREBASE_MESSAGING_SENDER_ID="1065582477718"
FIREBASE_APP_ID="1:1065582477718:web:46be8889b06f60e9c91db7"

SECRET_KEY=ebuddy@2025!
```