import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: String,
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: [1, 'Party size must be at least 1'],
    },
    position: {
      type: Number,
      required: true,
    },
    waitTime: {
      type: Number,
      required: true,
      min: 0,
    },
    preOrders: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        items: [
          {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
          },
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, required: true },
      },
    ],
    seatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['seated', 'no_show', 'left', 'removed'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ restaurant: 1, status: 1 });
historySchema.index({ customer: 1 });
historySchema.index({ seatedAt: -1 });

const History = mongoose.model('History', historySchema);
export default History;
