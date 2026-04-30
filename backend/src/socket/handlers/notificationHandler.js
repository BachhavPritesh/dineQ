import { Queue } from '../../models/index.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socketEvents.js';
import { getIO } from '../index.js';

const CLAIM_WINDOW_SECONDS = 300;

export const notifyTableReady = async (
  customerId,
  restaurantId,
  restaurantName
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.CUSTOMER(customerId)).emit(SOCKET_EVENTS.TABLE_READY, {
    message: `Your table at ${restaurantName} is ready!`,
    claimWindowSeconds: CLAIM_WINDOW_SECONDS,
    restaurantId,
  });
};

export const handleCustomerReadyRequest = async (socket, data) => {
  try {
    const { customerId, queueEntryId } = data;

    const queueEntry = await Queue.findById(queueEntryId)
      .populate('customer', 'name')
      .populate('restaurant', 'name');

    if (!queueEntry) {
      throw new Error('Queue entry not found');
    }

    const restaurantId = queueEntry.restaurant._id
      ? queueEntry.restaurant._id.toString()
      : queueEntry.restaurant.toString();

    console.log(
      `[ready_request] Forwarding to restaurant room: ${restaurantId}`
    );

    const io = getIO();
    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.CUSTOMER_READY_REQUEST,
      {
        customerId: customerId.toString(),
        queueEntryId,
        customerName: queueEntry.customer?.name || 'Guest',
        restaurantName: queueEntry.restaurant?.name || '',
        message: `${queueEntry.customer?.name || 'Guest'} is requesting notification`,
      }
    );
  } catch (error) {
    console.error('handleCustomerReadyRequest error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export const handleNotifyCustomer = async (socket, data) => {
  try {
    const { queueEntryId } = data;

    const queueEntry = await Queue.findById(queueEntryId).populate(
      'customer',
      '_id'
    );
    if (!queueEntry) {
      throw new Error('Queue entry not found');
    }

    const preOrders = queueEntry?.preOrders || [];
    const customerId = queueEntry.customer?._id;
    if (!customerId) {
      throw new Error('Customer not found for this queue entry');
    }

    const io = getIO();
    io.to(SOCKET_ROOMS.CUSTOMER(customerId.toString())).emit(
      SOCKET_EVENTS.TABLE_READY,
      {
        message:
          '🎉 Your seating is ready! We have your table ready — please come now. Your pre-ordered food will be served promptly.',
        preOrders,
        isReminder: true,
      }
    );

    console.log(`Table ready notification sent to customer ${customerId}`);
  } catch (error) {
    console.error('handleNotifyCustomer error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export const notifyQueueUpdate = async (restaurantId, queue, avgWaitTime) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.QUEUE_UPDATED,
    {
      queue,
      avgWaitTime,
    }
  );
};

export const notifyWaitTimeUpdate = async (restaurantId, newWaitTime) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.WAIT_TIME_UPDATE,
    {
      restaurantId,
      newWaitTime,
    }
  );
};

export const notifyCustomerJoined = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_JOINED,
    {
      customerName,
      position,
    }
  );
};

export const notifyCustomerSeated = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_SEATED,
    {
      customerName,
      position,
    }
  );
};

export const notifyCustomerLeft = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_LEFT,
    {
      customerName,
      position,
    }
  );
};

export default {
  notifyTableReady,
  handleNotifyCustomer,
  notifyQueueUpdate,
  notifyWaitTimeUpdate,
  notifyCustomerJoined,
  notifyCustomerSeated,
  notifyCustomerLeft,
};
