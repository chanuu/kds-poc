import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";

const KDSContext = createContext();

export const useKDS = () => {
  const context = useContext(KDSContext);
  if (!context) {
    throw new Error("useKDS must be used within a KDSProvider");
  }
  return context;
};

export const KDSProvider = ({ children, stationId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter orders by stationId
  const filterOrdersByStation = useCallback(
    (allOrders) => {
      if (!allOrders || !stationId) return [];

      return Object.values(allOrders)
        .filter((order) => order.stationId === stationId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    [stationId]
  );

  useEffect(() => {
    if (!stationId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const ordersRef = ref(database, "kds_orders");

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        try {
          const allOrders = snapshot.val();
          const stationOrders = filterOrdersByStation(allOrders);
          setOrders(stationOrders);
          setLoading(false);
        } catch (err) {
          setError("Failed to load orders");
          setLoading(false);
          console.error("Error processing orders:", err);
        }
      },
      (error) => {
        setError("Failed to connect to KDS");
        setLoading(false);
        console.error("Firebase error:", error);
      }
    );

    return () => unsubscribe();
  }, [stationId, filterOrdersByStation]);

  const updateItemStatus = useCallback(async (orderId, itemId, status) => {
    try {
      // Get current order
      const orderRef = ref(database, `kds_orders/${orderId}`);
      const snapshot = await new Promise((resolve, reject) => {
        onValue(orderRef, resolve, reject, { onlyOnce: true });
      });

      const order = snapshot.val();
      if (!order) {
        throw new Error("Order not found");
      }

      // Update the specific item
      const updatedItems = order.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
            }
          : item
      );

      // Calculate new overall status
      const pendingItems = updatedItems.filter(
        (item) => item.status === "pending"
      ).length;
      const cookingItems = updatedItems.filter(
        (item) => item.status === "cooking"
      ).length;
      const readyItems = updatedItems.filter(
        (item) => item.status === "ready"
      ).length;

      let overallStatus = "pending";
      if (readyItems === updatedItems.length) overallStatus = "ready";
      else if (cookingItems > 0 || readyItems > 0) overallStatus = "cooking";

      // Prepare updates
      const updates = {
        items: updatedItems,
        overallStatus,
        updatedAt: new Date().toISOString(),
      };

      // Push updates to Firebase
      await update(orderRef, updates);

      return true;
    } catch (error) {
      console.error("Error updating item status:", error);
      throw error;
    }
  }, []);

  const markOrderAsComplete = useCallback(async (orderId) => {
    try {
      const orderRef = ref(database, `kds_orders/${orderId}`);
      await update(orderRef, {
        overallStatus: "completed",
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error marking order as complete:", error);
      throw error;
    }
  }, []);

  const value = {
    orders,
    loading,
    error,
    updateItemStatus,
    markOrderAsComplete,
  };

  return <KDSContext.Provider value={value}>{children}</KDSContext.Provider>;
};
