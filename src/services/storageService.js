/**
 * VAISHU JEWELLERY - Firebase Storage Service
 * Handles secure upload of product high-resolution images & promotional banners.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { storage, isLiveFirebaseConfigured } from '../config/firebase';

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - Browser File object
 * @param {string} folder - 'products' | 'banners' | 'users'
 * @param {Function} onProgress - Progress callback (percent: number) => void
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export async function uploadImage(file, folder = 'products', onProgress = null) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Validate file size (max 5MB) and type
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be under 5MB.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (JPG, PNG, WEBP) are allowed.');
  }

  // If live Firebase is configured, upload to Firebase Storage bucket
  if (storage && isLiveFirebaseConfigured) {
    return new Promise((resolve, reject) => {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: 'Vaishu Jewellery Admin',
          uploadedAt: new Date().toISOString()
        }
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          reject(new Error(`Storage error: ${error.message}`));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  // Fallback demo upload using FileReader (Data URL)
  return new Promise((resolve) => {
    if (onProgress) onProgress(30);
    const reader = new FileReader();
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
