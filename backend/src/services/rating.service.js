import History from '../models/History.model.js';
import { Restaurant } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

export const submitRating = async (customerId, restaurantId, score) => {
  const history = await History.findOne({
    customer: customerId,
    restaurant: restaurantId,
    status: 'seated',
    rating: { $exists: false },
  }).sort({ seatedAt: -1 });

  if (!history) {
    throw ApiError.badRequest('No unrated seated visit found');
  }

  history.rating = score;
  await history.save();

  const updatedRestaurant = await Restaurant.findOneAndUpdate(
    { _id: restaurantId },
    [
      {
        $set: {
          rating: {
            $cond: [
              { $eq: ['$reviewCount', 0] },
              score,
              {
                $divide: [
                  { $add: [{ $multiply: ['$rating', '$reviewCount'] }, score] },
                  { $add: ['$reviewCount', 1] },
                ],
              },
            ],
          },
        },
      },
      { $inc: { reviewCount: 1 } },
    ],
    { new: true }
  );

  if (!updatedRestaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  return {
    rating: updatedRestaurant.rating,
    reviewCount: updatedRestaurant.reviewCount,
  };
};
