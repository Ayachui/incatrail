import { Ingredient, Recipe } from '../types';

export interface FirebaseSchemaExport {
  projectId: string;
  databaseId: string;
  collections: {
    recipes: Recipe[];
    ingredients: Ingredient[];
    exportedAt: string;
  };
  firestoreRules: string;
  vercelEnvExample: string;
}

export const FIRESTORE_RULES_BLUEPRINT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated Inca Trail staff can read/write formulations
    match /recipes/{recipeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email.matches('.*@incatrailfoods[.]com$');
    }
    match /ingredients/{ingredientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email.matches('.*@incatrailfoods[.]com$');
    }
    match /batches/{batchId} {
      allow read, write: if request.auth != null;
    }
    match /economics/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}`;

export const VERCEL_ENV_TEMPLATE = `# Firebase Web SDK credentials for Vercel / Cursor
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="incatrail-lab.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="incatrail-lab"
VITE_FIREBASE_STORAGE_BUCKET="incatrail-lab.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

# Inca Trail Admin Security PIN
VITE_TEAM_ACCESS_PIN="1234"
`;

export function generateFirestoreExport(recipes: Recipe[], ingredients: Ingredient[]): FirebaseSchemaExport {
  return {
    projectId: 'incatrail-lab-cacao-zamora',
    databaseId: '(default)',
    collections: {
      recipes,
      ingredients,
      exportedAt: new Date().toISOString(),
    },
    firestoreRules: FIRESTORE_RULES_BLUEPRINT,
    vercelEnvExample: VERCEL_ENV_TEMPLATE,
  };
}
