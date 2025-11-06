import React from "react";
import { useKDS } from "../contexts/KDSContext";
import "./OrderCard.css";

const OrderCard = ({ order }) => {
  const { updateOrderStatus, markOrderAsComplete } = useKDS();

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
    if (diffMins < 60) return `${diffMins}m`;
    return `${Math.floor(diffMins / 60)}h`;
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
        return "Start";
      case "cooking":
        return "Ready";
      case "ready":
        return "Complete";
      default:
        return "Update";
    }
  };

  return (
    <div className={`order-card compact ${order.overallStatus}`}>
      <div className="order-header-compact">
        <div className="order-basic-info">
          <span className="table-number">T{order.tableNumber}</span>
          <span className="customer-name">{order.customerName}</span>
        </div>
        <div className="order-timing-compact">
          <span className="order-time">{formatTime(order.createdAt)}</span>
          <span className="elapsed-time">{getElapsedTime(order.createdAt)}</span>
        </div>
      </div>

      <div className="order-items-compact">
        {order.items.map((item, index) => (
          <div key={item.id} className="order-item-compact">
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">x{item.quantity}</span>
            {item.notes && <span className="item-notes-icon" title={item.notes}>📝</span>}
          </div>
        ))}
      </div>

      <div className="order-footer-compact">
        <div className="status-section">
          <span 
            className="status-indicator-compact"
            style={{ backgroundColor: getStatusColor(order.overallStatus) }}
          >
            {order.overallStatus}
          </span>
        </div>
        
        <div className="actions-section">
          {order.overallStatus !== "completed" && order.overallStatus !== "ready" && (
            <button
              className={`btn-compact btn-status-${order.overallStatus}`}
              onClick={() => handleStatusUpdate(getNextStatus(order.overallStatus))}
            >
              {getStatusButtonText(order.overallStatus)}
            </button>
          )}
          
          {order.overallStatus === "ready" && (
            <button
              className="btn-compact btn-complete"
              onClick={handleCompleteOrder}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;