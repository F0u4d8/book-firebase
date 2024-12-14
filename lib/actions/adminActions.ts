import { db } from "@/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { latestOrdersType, MonthlyRevenueType, StoreType } from "../dashboardTypes";

export async function fetchDashboardData() {
    try {
        // Fetch users and stores concurrently
        const [usersSnapshot, storeSnapshot] = await Promise.all([
            getDocs(collection(db, "users")),
            getDocs(collection(db, "stores")),
        ]);

        const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const stores = [];
        let totalOrders = 0;
        let totalRevenue = 0;
        const monthlyRevenue : Record<string, number > = {};
        const latestOrders : latestOrdersType[] = [];

        // Prepare month keys for last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const monthKeys = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthlyRevenue[monthKey] = 0;
            return monthKey;
        });

        const storeFetchPromises = storeSnapshot.docs.map(async (storeDoc) => {
            const storeData: StoreType = { id: storeDoc.id, ...storeDoc.data() };

            // Fetch orders and clients concurrently for each store
            const [ordersSnapshot, clientsSnapshot] = await Promise.all([
                getDocs(collection(db, "stores", storeDoc.id, "orders")),
                getDocs(collection(db, "stores", storeDoc.id, "clients")),
            ]);

            // Calculate store revenue and aggregate monthly revenue
            let storeRevenue = 0;
            ordersSnapshot.forEach((orderDoc) => {
                const orderData = orderDoc.data();
                const orderTotal = orderData.total || 0;

                const orderDate = orderData.createdAt?.toDate() || new Date();
                if (orderDate >= twelveMonthsAgo) {
                    const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
                    if (monthKey in monthlyRevenue) {
                        monthlyRevenue[monthKey] += orderTotal;
                    }
                    latestOrders.push({
                        id: orderDoc.id,
                        storeName: storeData.name,
                        formattedCreatedAt: format(orderDate, "MMMM dd, yyyy HH:mm:ss"),
                        storeEmail: storeData.email,
                        ...orderData,
                    });
                }
                storeRevenue += orderTotal;
                totalOrders++;
            });

            storeData.totalRevenue = storeRevenue;
            storeData.orderCount = ordersSnapshot.size;
            storeData.clientCount = clientsSnapshot.size;

            totalRevenue += storeRevenue;
            stores.push(storeData);
        });

        // Wait for all store-related fetches to complete
        await Promise.all(storeFetchPromises);

        // Sort and limit latest orders
        const sortedLatestOrders = latestOrders
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

      // Prepare monthly revenue as sorted array
const monthlyRevenueArray: MonthlyRevenueType = Object.entries(monthlyRevenue)
.map(([month, revenue]) => ({ month, revenue: revenue as number })) // Explicit cast
.sort((a, b) => a.month.localeCompare(b.month));

        return {
            storeCount: stores.length,
            userCount: users.length,
            totalOrders,
            totalRevenue,
            latestOrders: sortedLatestOrders,
            monthlyRevenue: monthlyRevenueArray,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
}

export async function fetchStores() {
    try {
        const storeSnapshot = await getDocs(collection(db, "stores"));

        const storeFetchPromises = storeSnapshot.docs.map(async (storeDoc) => {
            const storeData: StoreType = { id: storeDoc.id, ...storeDoc.data() };

            // Fetch orders and clients concurrently for each store
            const [ordersSnapshot, clientsSnapshot] = await Promise.all([
                getDocs(collection(db, "stores", storeDoc.id, "orders")),
                getDocs(collection(db, "stores", storeDoc.id, "clients")),
            ]);

            // Calculate store revenue
            let storeRevenue = 0;
            ordersSnapshot.forEach((orderDoc) => {
                storeRevenue += orderDoc.data().total || 0;
            });

            storeData.totalRevenue = storeRevenue;
            storeData.orderCount = ordersSnapshot.size;
            storeData.clientCount = clientsSnapshot.size;

            return storeData;
        });

        const stores = await Promise.all(storeFetchPromises);

        // Sort stores alphabetically
        stores.sort((a, b) => a.name!.localeCompare(b.name!));

        return { stores };
    } catch (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
}
