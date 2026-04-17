import { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  painting: Schema.Types.ObjectId;
  quantity: number;
  price: number; // Snapshot of price at time of adding
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  painting: {
    type: Schema.Types.ObjectId,
    ref: 'Painting',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalPrice before saving
cartSchema.pre('save', async function () {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

export default model<ICart>('Cart', cartSchema);
