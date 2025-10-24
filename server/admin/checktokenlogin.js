const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

async function verifyFirebaseIdToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken; 
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}