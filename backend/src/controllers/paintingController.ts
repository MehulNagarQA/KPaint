import { Request, Response, NextFunction } from 'express';
import Painting from '../models/Painting';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload';

/**
 * @route   GET /api/paintings
 * @desc    Get all paintings with search, filter, sort, and pagination
 * @access  Public
 */
export const getPaintings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query: Record<string, any> = {};

    // Full-text search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [paintings, total] = await Promise.all([
      Painting.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      Painting.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: paintings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      paintings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/paintings/:id
 * @desc    Get a single painting by ID
 * @access  Public
 */
export const getPaintingById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      res.status(404).json({ success: false, message: 'Painting not found' });
      return;
    }
    res.status(200).json({ success: true, painting });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/paintings
 * @desc    Create a new painting (with image upload)
 * @access  Admin
 */
export const createPainting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.url;
      imagePublicId = result.public_id;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    } else {
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }

    const painting = await Painting.create({
      ...req.body,
      image: imageUrl,
      imagePublicId,
      price: Number(req.body.price),
      stock: Number(req.body.stock) || 1,
      featured: req.body.featured === 'true' || req.body.featured === true,
    });

    res.status(201).json({ success: true, painting });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/paintings/:id
 * @desc    Update a painting
 * @access  Admin
 */
export const updatePainting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      res.status(404).json({ success: false, message: 'Painting not found' });
      return;
    }

    // If a new image file is uploaded, replace the old Cloudinary image
    if (req.file) {
      if (painting.imagePublicId) {
        await deleteFromCloudinary(painting.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.image = result.url;
      req.body.imagePublicId = result.public_id;
    }

    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.stock) req.body.stock = Number(req.body.stock);
    if (req.body.featured !== undefined) {
      req.body.featured = req.body.featured === 'true' || req.body.featured === true;
    }

    const updated = await Painting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, painting: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/paintings/:id
 * @desc    Delete a painting
 * @access  Admin
 */
export const deletePainting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      res.status(404).json({ success: false, message: 'Painting not found' });
      return;
    }

    // Remove image from Cloudinary
    if (painting.imagePublicId) {
      await deleteFromCloudinary(painting.imagePublicId);
    }

    await painting.deleteOne();
    res.status(200).json({ success: true, message: 'Painting deleted successfully' });
  } catch (error) {
    next(error);
  }
};
