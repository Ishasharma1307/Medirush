// MediRush Inter-Portal Real-time Communication Bus
// Syncs customer prescription orders ➔ Pharmacy Partner Portal ➔ Delivery Rider App instantly across tabs

const CHANNEL_NAME = 'medirush_realtime_network';
const STORAGE_EVENT_KEY = 'medirush_live_bus_event';

let channel = null;
try {
  if (typeof window !== 'undefined' && window.BroadcastChannel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn("BroadcastChannel not supported, using storage event fallback", e);
}

/**
 * Broadcast an event to all open tabs (Pharmacy, Rider, Customer)
 */
export const broadcastRealtimeEvent = (type, payload = {}) => {
  const eventData = {
    type,
    payload,
    timestamp: Date.now(),
    id: `ev-${Math.random().toString(36).substring(2, 9)}`
  };

  // 1. BroadcastChannel (same browser instances)
  if (channel) {
    try {
      channel.postMessage(eventData);
    } catch (err) {
      console.warn("BroadcastChannel message error:", err);
    }
  }

  // 2. LocalStorage event (triggers storage event on other open tabs)
  try {
    localStorage.setItem(STORAGE_EVENT_KEY, JSON.stringify(eventData));
  } catch (err) {
    console.warn("Storage sync error:", err);
  }

  return eventData;
};

/**
 * Subscribe to realtime events across all open portal tabs
 */
export const subscribeToRealtimeEvents = (callback) => {
  // Listen on BroadcastChannel
  const handleBcMessage = (event) => {
    if (event?.data && callback) {
      callback(event.data);
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBcMessage);
  }

  // Listen on window storage event
  const handleStorageEvent = (event) => {
    if (event.key === STORAGE_EVENT_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (callback) {
          callback(parsed);
        }
      } catch (err) {
        console.warn("Failed to parse storage bus event", err);
      }
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  // Return unsubscribe cleanup function
  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBcMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};

/**
 * Helper to get all current active orders from localStorage
 */
export const getStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('medirush_orders') || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Helper to update an order's status and notify all portals
 */
export const updateOrderStatus = (orderId, newStatus, extraData = {}) => {
  try {
    const orders = getStoredOrders();
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          ...extraData,
          timeline: [
            ...(ord.timeline || []),
            {
              status: newStatus,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              completed: true
            }
          ]
        };
      }
      return ord;
    });

    localStorage.setItem('medirush_orders', JSON.stringify(updated));

    // Also update order tracking stage if applicable
    let stageNumber = 2;
    if (newStatus === 'Packed' || newStatus === 'Ready for Pickup') stageNumber = 3;
    if (newStatus === 'Out for Delivery' || newStatus === 'Picked Up') stageNumber = 4;
    if (newStatus === 'Delivered') stageNumber = 5;

    localStorage.setItem(`medirush_stage_${orderId}`, String(stageNumber));

    // Broadcast across portals
    broadcastRealtimeEvent('ORDER_STATUS_CHANGED', {
      orderId,
      status: newStatus,
      stageNumber,
      extraData
    });

    return updated.find(o => o.id === orderId);
  } catch (e) {
    console.warn("Could not update order status:", e);
    return null;
  }
};
