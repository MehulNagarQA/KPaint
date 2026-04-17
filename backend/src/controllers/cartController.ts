import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Painting from '../models/Painting';
import { AuthRequest } from '../middleware/auth';

/**
 * @route   GET /api/cart
 * @desc    Get logged-in user's cart
 * @access  Private
 */
export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id as any }).populate(
      'items.painting',
      'title image price artist stock'
    );

    if (!cart) {
      res.status(200).json({ success: true, cart: { items: [], totalPrice: 0 } });
      return;
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart (or increase quantity)
 * @access  Private
 */
export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paintingId, quantity = 1 } = req.body;

    const painting = await Painting.findById(paintingId);
    if (!painting) {
      res.status(404).json({ success: false, message: 'Painting not found' });
      return;
    }

    if (painting.stock < 1) {
      res.status(400).json({ success: false, message: 'This painting is out of stock' });
      return;
    }

    let cart = await Cart.findOne({ user: req.user!.id as any });

    if (!cart) {
      // Create a new cart for the user
      cart = new Cart({
        user: req.user!.id as any,
        items: [{ painting: paintingId, quantity, price: painting.price }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.painting.toString() === paintingId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ painting: paintingId, quantity, price: painting.price });
      }
    }

    await cart.save();

    const populated = await cart.populate('items.painting', 'title image price artist stock');

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/cart/:paintingId
 * @desc    Update quantity of a cart item
 * @access  Private
 */
export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { paintingId } = req.params;

    if (!quantity || quantity < 1) {
      res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
      return;
    }

    const cart = await Cart.findOne({ user: req.user!.id as any });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    const item = cart.items.find((i) => i.painting.toString() === paintingId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not in cart' });
      return;
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populated = await cart.populate('items.painting', 'title image price artist stock');
    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart/:paintingId
 * @desc    Remove a specific item from the cart
 * @access  Private
 */
export const removeCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id as any });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.painting.toString() !== req.params.paintingId
    );

    await cart.save();

    const populated = await cart.populate('items.painting', 'title image price artist stock');
    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart
 * @desc    Clear the entire cart
 * @access  Private
 */
export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Cart.findOneAndDelete({ user: req.user!.id as any });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
