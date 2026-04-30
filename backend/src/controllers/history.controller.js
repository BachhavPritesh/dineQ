import * as historyService from '../services/history.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Restaurant } from '../models/index.js';

export const getRestaurantHistory = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    return ApiResponse.success(res, 'No restaurant found', []);
  }
  const result = await historyService.getRestaurantHistory(restaurant._id);
  ApiResponse.success(res, 'Restaurant history fetched successfully', result);
});

export const getCustomerHistory = asyncHandler(async (req, res) => {
  const result = await historyService.getCustomerHistory(req.user._id);
  ApiResponse.success(res, 'Your history fetched successfully', result);
});

export default {
  getRestaurantHistory,
  getCustomerHistory,
};
