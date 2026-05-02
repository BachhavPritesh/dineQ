import * as ratingService from '../services/rating.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const submitRating = asyncHandler(async (req, res) => {
  const { restaurantId, score } = req.body;
  const result = await ratingService.submitRating(
    req.user._id,
    restaurantId,
    score
  );
  ApiResponse.success(res, 'Rating submitted successfully', result);
});

export default { submitRating };
