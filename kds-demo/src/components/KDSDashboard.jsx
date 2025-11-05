import React from 'react';
import { useKDS } from '../contexts/KDSContext';
import OrderCard from './OrderCard';
import './KDSDashboard.css';

export const KDSDashboard = ({ stationName = "Kitchen Station" }) => {
  const { orders, loading, error } = useKDS();

  const pendingOrders = orders.filter(order => order.overallStatus === 'pending');
  const cookingOrders = orders.filter(order => order.overallStatus === 'cooking');
  const readyOrders = orders.filter(order => order.overallStatus === 'ready');

  if (loading) {
    return (
      <div className="kds-loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kds-error">
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="kds-dashboard">
      <div className="kds-header">
        <h1>Kitchen Display System</h1>
        <div className="station-info">
          <span className="station-name">{stationName}</span>
          <span className="orders-count">Total Orders: {orders.length}</span>
        </div>
      </div>

      <div className="orders-grid">
        <div className="orders-column pending-column">
          <h2>Pending ({pendingOrders.length})</h2>
          <div className="orders-list">
            {pendingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {pendingOrders.length === 0 && (
              <div className="empty-state">No pending orders</div>
            )}
          </div>
        </div>

        <div className="orders-column cooking-column">
          <h2>Cooking ({cookingOrders.length})</h2>
          <div className="orders-list">
            {cookingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {cookingOrders.length === 0 && (
              <div className="empty-state">No orders cooking</div>
            )}
          </div>
        </div>

        <div className="orders-column ready-column">
          <h2>Ready to Serve ({readyOrders.length})</h2>
          <div className="orders-list">
            {readyOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {readyOrders.length === 0 && (
              <div className="empty-state">No orders ready</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

