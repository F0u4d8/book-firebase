import { db } from "@/firebaseClient";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  latestOrdersType,
  MonthlyRevenueType,
  StoreType,
} from "../dashboardTypes";

const ITEMS_PER_PAGE = 10; // Define your items per page constant

export async function fetchDashboardData() {
  try {
    // Fetch users and stores concurrently
    const [usersSnapshot, storeSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "stores")),
    ]);

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const stores = [];
    let totalOrders = 0;
    let totalRevenue = 0;
    const monthlyRevenue: Record<string, number> = {};
    const latestOrders: latestOrdersType[] = [];

    // Initialize monthlyRevenue keys for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyRevenue[monthKey] = 0;
    }

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
          const monthKey = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
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

    // Prepare monthly revenue as a sorted array
    const monthlyRevenueArray: MonthlyRevenueType = Object.entries(
      monthlyRevenue
    )
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

export async function fetchStores(
  searchQuery: string | null,
  page: number = 1
) {
  try {
    const storesRef = collection(db, "stores");
    const pageSize = ITEMS_PER_PAGE;

    // إنشاء الاستعلام الأساسي
    let querySnapshot;
    if (page > 1) {
      // للصفحات التالية
      const prevPageQuery = searchQuery
        ? query(
            storesRef,
            orderBy("name"),
            // استخدام where للبحث
            where("name", ">=", searchQuery.toLowerCase()),
            where("name", "<=", searchQuery.toLowerCase() + "\uf8ff"),
            limit((page - 1) * pageSize)
          )
        : query(storesRef, orderBy("name"), limit((page - 1) * pageSize));

      const prevPageSnapshot = await getDocs(prevPageQuery);
      const lastVisible =
        prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];

      // استعلام الصفحة الحالية
      const currentPageQuery = searchQuery
        ? query(
            storesRef,
            orderBy("name"),
            where("name", ">=", searchQuery.toLowerCase()),
            where("name", "<=", searchQuery.toLowerCase() + "\uf8ff"),
            startAfter(lastVisible),
            limit(pageSize)
          )
        : query(
            storesRef,
            orderBy("name"),
            startAfter(lastVisible),
            limit(pageSize)
          );

      querySnapshot = await getDocs(currentPageQuery);
    } else {
      // الصفحة الأولى
      const firstPageQuery = searchQuery
        ? query(
            storesRef,
            orderBy("name"),
            where("name", ">=", searchQuery.toLowerCase()),
            where("name", "<=", searchQuery.toLowerCase() + "\uf8ff"),
            limit(pageSize)
          )
        : query(storesRef, orderBy("name"), limit(pageSize));

      querySnapshot = await getDocs(firstPageQuery);
    }

    // تحويل المستندات وجلب البيانات الإضافية
    const stores = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const storeData: StoreType = { id: doc.id, ...doc.data() };

        const [ordersSnapshot, clientsSnapshot] = await Promise.all([
          getDocs(collection(db, "stores", doc.id, "orders")),
          getDocs(collection(db, "stores", doc.id, "clients")),
        ]);

        let storeRevenue = 0;
        ordersSnapshot.forEach((orderDoc) => {
          storeRevenue += orderDoc.data().total || 0;
        });

        storeData.totalRevenue = storeRevenue;
        storeData.orderCount = ordersSnapshot.size;
        storeData.clientCount = clientsSnapshot.size;

        return storeData;
      })
    );

    // جلب إجمالي عدد المتاجر للبحث
    const totalQuery = searchQuery
      ? query(
          storesRef,
          orderBy("name"),
          where("name", ">=", searchQuery.toLowerCase()),
          where("name", "<=", searchQuery.toLowerCase() + "\uf8ff")
        )
      : query(storesRef);

    const totalSnapshot = await getDocs(totalQuery);

    return {
      stores,
      totalStores: totalSnapshot.size,
    };
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
}

export async function fetchStoresPages(query: string | null) {
  try {
    const storesRef = collection(db, "stores");
    const querySnapshot = await getDocs(storesRef);
    let totalCount = 0;

    if (query) {
      // تطبيق البحث على جميع المستندات
      const searchTerms = query.toLowerCase().split(" ");
      const filteredDocs = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return searchTerms.every(
          (term) =>
            data.name?.toLowerCase().includes(term) ||
            data.description?.toLowerCase().includes(term) ||
            data.category?.toLowerCase().includes(term)
        );
      });
      totalCount = filteredDocs.length;
    } else {
      // إذا لم يكن هناك بحث، استخدم العدد الإجمالي للمستندات
      totalCount = querySnapshot.size;
    }

    // حساب عدد الصفحات
    const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of stores.");
  }
}
