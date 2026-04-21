import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';

/**
 * Generate a signed JWT token for a given user ID
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    // Only allow admin creation if a secret key is provided
    const userRole =
      role === 'admin' && req.body.adminKey === process.env.ADMIN_SECRET_KEY
        ? 'admin'
        : 'user';

    const user = await User.create({ name, email, password, role: userRole });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user & return token
 * @access  Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Select password explicitly (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id).populate('wishlist');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/wishlist/:paintingId
 * @desc    Toggle a painting in the user's wishlist
 * @access  Private
 */
export const toggleWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const paintingId = req.params.paintingId;
    const index = user.wishlist.findIndex((id) => id.toString() === paintingId);

    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(paintingId as any);
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * TEMPORARY EMERGENCY ROUTE
 * Promotes Mehul.nagar@yopmail.com to admin via browser visit
 */
export const emergencyPromote = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOneAndUpdate(
      { email: 'Mehul.nagar@yopmail.com' },
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      res.status(404).send('<h1>User not found. Please register first.</h1>');
      return;
    }
    res.status(200).send('<h1>✅ Success! Mehul.nagar@yopmail.com is now an ADMIN.</h1><p>You can now close this tab and go to the Admin Dashboard.</p>');
  } catch (error) {
    next(error);
  }
};
