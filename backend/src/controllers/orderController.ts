import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * @route   POST /api/orders
 * @desc    Place a new order from the user's cart
 * @access  Private
 */
export const placeOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user!.id as any }).populate('items.painting');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty' });
      return;
    }

    const orderItems = cart.items.map((item) => ({
      painting: item.painting,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: req.user!.id as any,
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress,
    });

    // Clear the cart after placing the order
    await Cart.findOneAndDelete({ user: req.user!.id as any });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/my
 * @desc    Get order history for the logged-in user
 * @access  Private
 */
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!.id as any })
      .populate('items.painting', 'title image price')
      .sort('-createdAt');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders (Admin)
 * @desc    Get all orders
 * @access  Admin
 */
export const getAllOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.painting', 'title price')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/orders/:id/status (Admin)
 * @desc    Update order status
 * @access  Admin
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/orders/razorpay/create
 * @desc    Create a razorpay order
 * @access  Private
 */
export const createRazorpayOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id as any });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty' });
      return;
    }

    const amount = cart.totalPrice * 100; // Razorpay expects amount in smallest currency unit

    const options = {
      amount,
      currency: 'USD',
      receipt: `receipt_${req.user!.id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/orders/razorpay/verify
 * @desc    Verify payment and place actual order
 * @access  Private
 */
export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
      return;
    }

    // Payment is successful, create the order in DB
    const cart = await Cart.findOne({ user: req.user!.id as any }).populate('items.painting');
    if (!cart) {
      res.status(400).json({ success: false, message: 'Cart not found' });
      return;
    }

    const orderItems = cart.items.map((item: any) => ({
      painting: item.painting,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: req.user!.id as any,
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentStatus: 'paid',
      status: 'processing',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await Cart.findOneAndDelete({ user: req.user!.id as any });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
