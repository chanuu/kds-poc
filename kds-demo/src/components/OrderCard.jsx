import React from "react";
import { useKDS } from "../contexts/KDSContext";
import "./OrderCard.css";

const OrderCard = ({ order }) => {
  const { updateItemStatus, markOrderAsComplete } = useKDS();

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await updateItemStatus(order.id, itemId, newStatus);
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

  const allItemsReady = order.items.every((item) => item.status === "ready");

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

            <div className="item-actions">
              <span
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>

              <div className="action-buttons">
                {item.status === "pending" && (
                  <button
                    className="btn btn-start-cooking"
                    onClick={() => handleStatusUpdate(item.id, "cooking")}
                  >
                    Start
                  </button>
                )}
                {item.status === "cooking" && (
                  <button
                    className="btn btn-mark-ready"
                    onClick={() => handleStatusUpdate(item.id, "ready")}
                  >
                    Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="order-progress">
          <div className="progress-stats">
            <span>
              Pending:{" "}
              {order.items.filter((i) => i.status === "pending").length}
            </span>
            <span>
              Cooking:{" "}
              {order.items.filter((i) => i.status === "cooking").length}
            </span>
            <span>
              Ready: {order.items.filter((i) => i.status === "ready").length}
            </span>
          </div>

          {allItemsReady && (
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
