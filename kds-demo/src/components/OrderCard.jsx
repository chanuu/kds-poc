import React from "react";
import { useKDS } from "../contexts/KDSContext";
import "./OrderCard.css";

const OrderCard = ({ order }) => {
  const { updateOrderStatus, markOrderAsComplete } = useKDS(); // Changed to updateOrderStatus

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  const handleCompleteOrder = async () => {
    if (window.confirm("Mark this order as completed?")) {
      try {
        await markOrderAsComplete(order.id);
      } catch (error) {
        alert("Failed to complete order. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#e74c3c";
      case "cooking":
        return "#f39c12";
      case "ready":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getElapsedTime = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "cooking";
      case "cooking":
        return "ready";
      case "ready":
        return "completed";
      default:
        return currentStatus;
    }
  };

  const getStatusButtonText = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "Start Cooking";
      case "cooking":
        return "Mark as Ready";
      case "ready":
        return "Complete Order";
      default:
        return "Update Status";
    }
  };

  return (
    <div className={`order-card ${order.overallStatus}`}>
      <div className="order-header">
        <div className="order-meta">
          <h3>Table {order.tableNumber}</h3>
          <span className="customer-name">{order.customerName}</span>
        </div>
        <div className="order-timing">
          <span className="order-time">{formatTime(order.createdAt)}</span>
          <span className="elapsed-time">
            {getElapsedTime(order.createdAt)}
          </span>
        </div>
      </div>

      <div className="order-items">
        {order.items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x{item.quantity}</span>
              {item.notes && (
                <span className="item-notes">Note: {item.notes}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="order-status-info">
          <span 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(order.overallStatus) }}
          >
            Current Status: {order.overallStatus}
          </span>
        </div>

        <div className="order-actions">
          {order.overallStatus !== "completed" && (
            <button
              className={`btn btn-status-${order.overallStatus}`}
              onClick={() => handleStatusUpdate(getNextStatus(order.overallStatus))}
            >
              {getStatusButtonText(order.overallStatus)}
            </button>
          )}
          
          {order.overallStatus === "ready" && (
            <button
              className="btn btn-complete-order"
              onClick={handleCompleteOrder}
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;