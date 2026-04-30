import cron from 'node-cron';
import { Queue, Restaurant } from '../models/index.js';
import { getIO } from '../socket/index.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socket/socketEvents.js';
import calculateWaitTime from '../utils/calculateWaitTime.js';

export const startWaitTimeRecalculatorJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const restaurants = await Restaurant.find({ isOpen: true });

      for (const restaurant of restaurants) {
        const waitQueue = await Queue.find({
          restaurant: restaurant._id,
          status: 'waiting',
        })
          .sort({ position: 1 })
          .populate('customer', '_id');

        const now = new Date();
        let hasUpdates = false;

        for (const entry of waitQueue) {
          const joinedAt = entry.joinedAt || new Date();
          const elapsedMinutes = Math.round((now - joinedAt) / 60000);
          const originalEstimate = calculateWaitTime(
            entry.position,
            restaurant.avgSeatingTimeMinutes
          );
          const remainingWait = Math.max(0, originalEstimate - elapsedMinutes);

          if (entry.estimatedWaitMinutes !== remainingWait) {
            entry.estimatedWaitMinutes = remainingWait;
            await entry.save();
            hasUpdates = true;

            const customerId = entry.customer?._id?.toString();
            if (customerId) {
              const io = getIO();
              io.to(SOCKET_ROOMS.CUSTOMER(customerId)).emit(
                SOCKET_EVENTS.WAIT_TIME_UPDATE,
                {
                  queueId: entry._id,
                  estimatedWaitMinutes: remainingWait,
                  position: entry.position,
                }
              );
            }
          }
        }

        if (hasUpdates || waitQueue.length > 0) {
          const restaurantId = restaurant._id.toString();
          const io = getIO();
          if (io) {
            io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
              SOCKET_EVENTS.WAIT_TIME_UPDATE,
              {
                restaurantId,
                queue: waitQueue.map((q) => ({
                  id: q._id,
                  estimatedWaitMinutes: q.estimatedWaitMinutes,
                  position: q.position,
                })),
                queueLength: waitQueue.length,
              }
            );
          }
        }
      }

      console.log('Wait time countdown recalculation completed');
    } catch (error) {
      console.error('Wait time recalculation error:', error);
    }
  });

  console.log('Wait time countdown job started (every 1 minute)');
};

export default { startWaitTimeRecalculatorJob };
