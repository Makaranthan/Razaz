import { Request, Response } from 'express';
import { db } from '../utils/db';
import { catchAsync, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { 
    category, 
    strapMaterial, 
    movementType, 
    minPrice, 
    maxPrice, 
    sort, 
    search 
  } = req.query;

  // Build the Prisma where clause dynamically based on query params
  const where: any = {
    isActive: true,
  };

  if (category && category !== 'All') where.category = String(category);
  if (strapMaterial) where.strapMaterial = String(strapMaterial);
  if (movementType) where.movementType = String(movementType);
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(String(minPrice));
    if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
  }

  if (search) {
    where.OR = [
      { name: { contains: String(search) } }, // Note: SQLite doesn't support mode: 'insensitive'
      { brand: { contains: String(search) } },
    ];
  }

  // Determine sorting
  let orderBy: any = { createdAt: 'desc' }; // Default: newest
  if (sort === 'price-low') orderBy = { price: 'asc' };
  if (sort === 'price-high') orderBy = { price: 'desc' };
  if (sort === 'bestseller') orderBy = { isBestseller: 'desc' };

  const products = await db.product.findMany({
    where,
    orderBy,
  });

  // Parse JSON strings for images
  const formattedProducts = products.map(p => ({
    ...p,
    images: JSON.parse(p.images)
  }));

  res.status(200).json({
    success: true,
    count: formattedProducts.length,
    data: {
      products: formattedProducts,
    },
  });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await db.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product) {
    const err = new Error('Product not found') as AppError;
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    data: {
      product: {
        ...product,
        images: JSON.parse(product.images)
      },
    },
  });
});

// ADMIN ROUTES

export const createProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const { images, ...productData } = req.body;
  
  const product = await db.product.create({
    data: {
      ...productData,
      images: JSON.stringify(images || []),
      sku: productData.sku || `SKU-${Date.now()}`
    }
  });

  res.status(201).json({
    success: true,
    data: {
      product: {
        ...product,
        images: JSON.parse(product.images)
      }
    }
  });
});

export const updateProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const { images, ...productData } = req.body;
  
  const updateData: any = { ...productData };
  if (images) {
    updateData.images = JSON.stringify(images);
  }

  const product = await db.product.update({
    where: { id: req.params.id },
    data: updateData
  });

  res.status(200).json({
    success: true,
    data: {
      product: {
        ...product,
        images: JSON.parse(product.images)
      }
    }
  });
});

export const deleteProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  await db.product.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
