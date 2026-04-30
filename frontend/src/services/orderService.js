const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const orderService = {
  create: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getByQueue: async (queueId) => {
    const res = await fetch(`${API_URL}/orders/queue/${queueId}`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getByRestaurant: async (restaurantId) => {
    const res = await fetch(`${API_URL}/orders/restaurant/${restaurantId}`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateStatus: async (orderId, status) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
