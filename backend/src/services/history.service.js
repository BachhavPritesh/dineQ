import History from '../models/History.model.js';
import { Queue, Order } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

export const getRestaurantHistory = async (restaurantId) => {
  const history = await History.find({ restaurant: restaurantId })
    .sort({ seatedAt: -1 })
    .populate('customer', 'name');

  return history.map((h) => ({
    id: h._id,
    customerName: h.customer?.name || h.name || 'Guest',
    partySize: h.partySize,
    position: h.position,
    waitTime: h.waitTime,
    preOrders: h.preOrders || [],
    orders: h.orders || [],
    seatedAt: h.seatedAt,
    joinedAt: h.joinedAt,
    notes: h.notes,
    status: h.status,
  }));
};

export const getCustomerHistory = async (customerId) => {
  const history = await History.find({ customer: customerId })
    .sort({ seatedAt: -1 })
    .populate('restaurant', 'name');

  return history.map((h) => ({
    id: h._id,
    restaurantName: h.restaurant?.name || 'Unknown',
    partySize: h.partySize,
    waitTime: h.waitTime,
    preOrders: h.preOrders || [],
    orders: h.orders || [],
    seatedAt: h.seatedAt,
    joinedAt: h.joinedAt,
    status: h.status,
    totalSpent: (h.orders || []).reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    ),
  }));
};

export const createHistoryFromQueue = async (queueEntryId, statusOverride) => {
  const queueEntry = await Queue.findById(queueEntryId).populate(
    'customer',
    'name'
  );
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  const joinedAt = queueEntry.joinedAt || new Date();
  const seatedAt = new Date();
  const waitTime = Math.round((seatedAt - joinedAt) / 60000);

  const orders = await Order.find({ queue: queueEntryId });
  const orderData = orders.map((o) => ({
    orderId: o._id,
    items: o.items,
    totalAmount: o.totalAmount,
    status: o.status,
  }));

  const preOrderItems = (queueEntry.preOrders || []).map((item) => ({
    name: item.name,
    qty: item.quantity || item.qty || 1,
    price: item.price,
  }));

  const history = await History.create({
    customer: queueEntry.customer._id || queueEntry.customer,
    restaurant: queueEntry.restaurant._id || queueEntry.restaurant,
    name: queueEntry.customer?.name || 'Guest',
    partySize: queueEntry.partySize,
    position: queueEntry.position,
    waitTime: waitTime > 0 ? waitTime : 0,
    preOrders: preOrderItems,
    orders: orderData,
    seatedAt,
    joinedAt,
    notes: queueEntry.notes || '',
    status: statusOverride || queueEntry.status,
  });

  return history;
};

export default {
  getRestaurantHistory,
  getCustomerHistory,
  createHistoryFromQueue,
};
