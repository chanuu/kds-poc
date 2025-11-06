import React from 'react';
import { useKDS } from '../contexts/KDSContext';
import OrderCard from './OrderCard';
import './KDSDashboard.css';

const KDSDashboard = ({ stationName = "Kitchen Station" }) => {
  const { orders, loading, error } = useKDS();

  // Use camelCase property names to match OrderCard
  const pendingOrders = orders.filter(order => order.overallStatus === 'pending');
  const cookingOrders = orders.filter(order => order.overallStatus === 'cooking');
  const readyOrders = orders.filter(order => order.overallStatus === 'ready');

  // Calculate totals for badges
  const pendingCount = pendingOrders.length;
  const cookingCount = cookingOrders.length;
  const readyCount = readyOrders.length;
  const totalOrders = orders.length;

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
        <div className="header-main">
          <h1>Kitchen Display System</h1>
          <div className="station-info">
            <span className="station-name">{stationName}</span>
          </div>
        </div>
        
        <div className="orders-breakdown">
          <div className="breakdown-badge pending-badge">
            <span className="badge-count">{pendingCount}</span>
            <span className="badge-label">Pending</span>
          </div>
          <div className="breakdown-badge cooking-badge">
            <span className="badge-count">{cookingCount}</span>
            <span className="badge-label">Cooking</span>
          </div>
          <div className="breakdown-badge ready-badge">
            <span className="badge-count">{readyCount}</span>
            <span className="badge-label">Ready</span>
          </div>
          <div className="breakdown-badge total-badge">
            <span className="badge-count">{totalOrders}</span>
            <span className="badge-label">Total</span>
          </div>
        </div>
      </div>

      <div className="orders-grid">
        <div className="orders-column pending-column">
          <h2>Pending ({pendingCount})</h2>
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
          <h2>Cooking ({cookingCount})</h2>
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
          <h2>Ready to Serve ({readyCount})</h2>
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

export default KDSDashboard;
