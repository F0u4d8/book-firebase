import { db } from "@/firebaseClient";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { ClientStoreData, latestOrdersType, StoreType } from "../dashboardTypes";

export async function fetchStoreData(storeId: string) {
    try {
        // Validate input
        if (!storeId) {
            throw new Error("Store ID is required");
        }

        // References
        const ordersCollectionRef = collection(db, "stores", storeId, "orders");
        const clientsCollectionRef = collection(db, "stores", storeId, "clients");
        const storeDocRef = doc(db, "stores", storeId);

        // Fetch orders, clients, and store details concurrently
        const [ordersSnapshot, clientsSnapshot, storeSnapshot] = await Promise.all([
            getDocs(ordersCollectionRef),
            getDocs(clientsCollectionRef),
            getDoc(storeDocRef),
        ]);

        // Check if the store document exists
        if (!storeSnapshot.exists()) {
            throw new Error(`Store with ID ${storeId} does not exist.`);
        }

        // Extract store data
        const storeData = storeSnapshot.data();
        const storeName = storeData?.name || "Unknown Store";
        const storeEmail = storeData?.email || "Unknown Email";
        const storeImage = storeData?.image || "/no-image.png";
        const storeAddress = storeData?.address || "Unknown address";

        // Initialize metrics
        let totalRevenue = 0;
        let totalOrders = 0;
        const monthlyRevenue : Record<string, number > = {};
        const latestOrders : latestOrdersType[] = [];

        // Prepare month keys for the last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthlyRevenue[monthKey] = 0;
        }
      

        // Process orders
        ordersSnapshot.forEach((orderDoc) => {
            const orderData = orderDoc.data();
            const orderTotal = orderData.total || 0;
            const orderDate = orderData.createdAt?.toDate() || new Date();

            // Filter and aggregate revenue by month
            if (orderDate >= twelveMonthsAgo) {
                const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
                if (monthKey in monthlyRevenue) {
                    monthlyRevenue[monthKey] += orderTotal;
                }

                // Add to latest orders
                latestOrders.push({
                    id: orderDoc.id,
                    storeName,
                    formattedCreatedAt: format(orderDate, "MMMM dd, yyyy HH:mm:ss"),
                    storeEmail,
                    ...orderData,
                });
            }

            totalRevenue += orderTotal;
            totalOrders++;
        });

        // Sort and limit latest orders
        const sortedLatestOrders = latestOrders
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

        // Prepare monthly revenue as sorted array
        const monthlyRevenueArray = Object.entries(monthlyRevenue)
            .map(([month, revenue]) => ({ month, revenue }))
            .sort((a, b) => a.month.localeCompare(b.month));

        return {
            totalOrders,
            totalRevenue,
            totalClients: clientsSnapshot.size,
            storeName,storeAddress,
            storeEmail,storeImage,
            latestOrders: sortedLatestOrders,
            monthlyRevenue: monthlyRevenueArray,
        };
    } catch (error) {
        console.error("Error fetching store data:", error);
        throw error;
    }
}






export async function findClientAcrossStores(clientId: string): Promise<ClientStoreData | undefined> {
    try {
      const userDocRef = doc(db, "users", clientId);
      const [userDoc, storeSnapshot] = await Promise.all([
        getDoc(userDocRef),
        getDocs(collection(db, "stores"))
      ]);
  
      // If user document doesn't exist, return undefined
      if (!userDoc.exists()) {
        console.log(`User ${clientId} not found`);
        return undefined;
      }
  
      for (const storeDoc of storeSnapshot.docs) {
        const storeData: StoreType = { id: storeDoc.id, ...storeDoc.data() };
        
        // Get clients subcollection for this store
        const clientsSnapshot = await getDocs(
          collection(db, "stores", storeDoc.id, "clients")
        );
  
        for (const clientDoc of clientsSnapshot.docs) {
          const clientData = clientDoc.data();
          
          // Check if this client matches the target client ID
          if (clientData.id === clientId) {
            const userData = userDoc.data();
  
            return {
              storeId: storeDoc.id,
              storeName: storeData.name || "Unknown Store",
              storeAddress: storeData.address || "Unknown Address",
              storeEmail: storeData.email || "Unknown Email",
              storeImage: storeData.image || "/default-store.png",
              clientId: userData?.id,
              clientName: userData?.name || "Unknown Client",
              clientEmail: userData?.email || "Unknown Email",
              availableCups: userData?.availableCups || 0
            };
          }
        }
      }
  
      // If no matching client found in any store
      console.log(`Client ${clientId} not found in any store`);
      return undefined;
  
    } catch (error) {
      console.error("Error finding client across stores:", error);
      return undefined;
    }
  }
  
 