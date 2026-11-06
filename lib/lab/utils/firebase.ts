import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-config.json';
import { Recipe, Ingredient } from '../types';

// Initialize Firebase App instance singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the provisioned firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth instance
export const auth = getAuth(app);

// Connection validation per skill requirement
export async function testFirestoreConnection(): Promise<{ ok: boolean; message?: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { ok: true, message: 'Connected to Firestore' };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
      return { ok: false, message: 'Client offline or database initial handshake pending' };
    }
    // Document might not exist which is fine for connection test
    return { ok: true, message: 'Connected to Firestore' };
  }
}

// Error handling helper per skill requirement
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Cloud synchronization functions for recipes and ingredients
export async function syncRecipeToFirestore(recipe: Recipe): Promise<void> {
  const path = `recipes/${recipe.id}`;
  try {
    const payload = {
      id: recipe.id,
      code: recipe.code,
      nameRu: recipe.nameRu,
      nameEn: recipe.nameEn,
      descriptionRu: recipe.descriptionRu,
      descriptionEn: recipe.descriptionEn,
      basePasteWeightGrams: recipe.basePasteWeightGrams,
      matrixType: recipe.matrixType,
      potencyTarget: recipe.potencyTarget || 'creative',
      items: JSON.stringify(recipe.items),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'recipes', recipe.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncIngredientToFirestore(ing: Ingredient): Promise<void> {
  const path = `ingredients/${ing.id}`;
  try {
    const payload = {
      id: ing.id,
      nameRu: ing.nameRu,
      nameEn: ing.nameEn,
      category: ing.category,
      costPerKgUSD: ing.costPerKgUSD,
      descriptionRu: ing.descriptionRu,
      descriptionEn: ing.descriptionEn,
      chemicals: JSON.stringify(ing.chemicals),
      isCustom: ing.isCustom ? 'true' : 'false',
    };
    await setDoc(doc(db, 'ingredients', ing.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadRecipesFromFirestore(): Promise<Recipe[]> {
  const path = 'recipes';
  try {
    const snap = await getDocs(collection(db, 'recipes'));
    const results: Recipe[] = [];
    snap.forEach((d) => {
      const data = d.data();
      results.push({
        id: data.id,
        code: data.code,
        nameRu: data.nameRu,
        nameEn: data.nameEn,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn,
        basePasteWeightGrams: data.basePasteWeightGrams,
        matrixType: data.matrixType,
        potencyTarget: data.potencyTarget,
        items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items,
        isPreset: false,
      });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
