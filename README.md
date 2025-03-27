## Getting Started

## First, Config .env for each service

## Create .env backend-repo :

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


## Create .env.local frontend-repo :

```bash

# NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/technical-test-ebbudy/us-central1/api

NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC_6ahOkitEfoexoOKivAJgkU9jslCKHq8"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="technical-test-ebbudy.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="technical-test-ebbudy"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="technical-test-ebbudy.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1065582477718"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1065582477718:web:46be8889b06f60e9c91db7"

```

## Run the development server:

```bash
npm install
npm run dev
```