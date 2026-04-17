import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth';

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
