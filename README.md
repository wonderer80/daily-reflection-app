# Daily Reflection App

A simple self-reflection app using ORS (Outcome Rating Scale) with journaling support.

## Features
- Record ORS scores (Self, Interpersonal, Social, Overall)
- Write a brief daily journal
- Select and save the date
- Save data to Firebase Firestore

## Stack
- React
- TypeScript
- TailwindCSS
- Firebase (Firestore)

## Setup Instructions

1. **Install Node.js and npm**
   - https://nodejs.org (LTS version recommended)

2. **Install dependencies**
```bash
npm install
```

> This will install all runtime and development dependencies including:
> - React
> - TypeScript
> - Firebase
> - TailwindCSS
> - Type declarations (`@types/react`, `@types/react-dom`)

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory
   - Add the following environment variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
   - Replace the values with your Firebase project configuration

4. **Start the app**
```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

## Deployment
You can deploy this using Firebase Hosting, Vercel, or Netlify.
