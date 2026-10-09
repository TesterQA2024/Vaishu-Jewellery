/**
 * VAISHU JEWELLERY - Optional Firebase Cloud Functions
 * Used for server-side Custom Claims assignment & payment webhooks.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function to assign Admin Role custom claim
 * Callable by existing admins or CLI script
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Ensure the caller is authenticated and already an admin (or bootstrapped)
  if (context.auth?.token?.email !== 'admin@vaishujewellery.com' && !context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only existing administrators can assign admin privileges.'
    );
  }

  const { email } = data;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Target email address is required.');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // Also update Firestore users document
    await admin.firestore().collection('users').doc(user.uid).set({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, message: `Successfully granted admin privileges to ${email}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
