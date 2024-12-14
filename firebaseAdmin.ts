import admin from "firebase-admin";
import * as functions from 'firebase-functions';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();

const firestore = admin.firestore();


export const updateStoreTotal = functions.firestore.onDocumentWritten(
  'stores/{storeId}/orders/{orderId}',
  async (event) => {
    const storeId = event.params.storeId;
    
    try {
      // Reference to the store document
      const storeRef = firestore.collection('stores').doc(storeId);

      // Get all orders for this store
      const ordersSnapshot = await firestore
        .collection('stores')
        .doc(storeId)
        .collection('orders')
        .get();

      // Calculate total from all orders
      let totalAmount = 0;
      ordersSnapshot.forEach(doc => {
        const orderData = doc.data();
        totalAmount += orderData?.total || 0;
      });

      // Update store total
      await storeRef.update({
        totalOrderValue: totalAmount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Updated total for store ${storeId}: $${totalAmount}`);

      return;
    } catch (error) {
      console.error('Error updating store total:', error);
      throw new functions.https.HttpsError('internal', 'Could not update store total');
    }
  }
);

// Optional: Function to handle initial store creation with default total
export const initializeStoreTotal = functions.firestore.onDocumentCreated(
  'stores/{storeId}', 
  async (event) => {
    const storeId = event.params.storeId;

    try {
      const storeRef = event.data?.ref;
      
      if (storeRef) {
        await storeRef.update({
          totalOrderValue: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Initialized total for new store ${storeId}`);
      }

      return;
    } catch (error) {
      console.error('Error initializing store total:', error);
      throw new functions.https.HttpsError('internal', 'Could not initialize store total');
    }
  }
);