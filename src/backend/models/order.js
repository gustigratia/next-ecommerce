import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  stock: {
    type: Number,
  },
  seller: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const shippingInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['COD', 'Card'],
    required: true,
  },
  cardLast4: {
    type: String,
  },
  cardName: {
    type: String,
  },
  expiryDate: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
    },
    shippingInfo: {
      type: shippingInfoSchema,
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: true,
    },
    amountWithoutTax: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: 'Processing',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
