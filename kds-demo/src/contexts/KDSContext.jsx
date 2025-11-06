import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { database } from "../firebase";
import { onValue, ref, update } from "firebase/database"; // Make sure update is imported

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

  // Update overall order status
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const orderRef = ref(database, `kds_orders/${orderId}`);
      
      const updates = {
        overallStatus: status,
        updatedAt: new Date().toISOString(),
      };

      await update(orderRef, updates);
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
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
    updateOrderStatus, // Changed from updateItemStatus
    markOrderAsComplete,
  };

  return <KDSContext.Provider value={value}>{children}</KDSContext.Provider>;
};
