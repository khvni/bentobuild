/**
 * localStorage utilities for persisting builder state
 * Handles serialization/deserialization with error handling
 */

const STORAGE_KEY = 'bentobuild_state';
const STORAGE_VERSION = '1.0';

export interface StorageData<T> {
  version: string;
  timestamp: number;
  data: T;
}

/**
 * Save data to localStorage with versioning
 */
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const storageData: StorageData<T> = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage with version checking
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const storageData: StorageData<T> = JSON.parse(item);

    // Version check - can add migration logic here if needed
    if (storageData.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, clearing old data');
      localStorage.removeItem(key);
      return null;
    }

    return storageData.data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * Clear all BentoBuild data from localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bentobuild_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Default storage key for builder state
export const BUILDER_STATE_KEY = STORAGE_KEY;
