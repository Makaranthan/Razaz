import { Response } from 'express';
import { db } from '../utils/db';
import { stripe } from '../utils/stripe';
import { catchAsync, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })),
  shippingDetails: z.object({
    addressLine1: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string()
  })
});

export const createCheckoutSession = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    const err = new Error('Invalid checkout data') as AppError;
    err.statusCode = 400;
    throw err;
  }

  const { items, shippingDetails } = parsed.data;
  const userId = req.user.id;

  // 1. Fetch products from DB to ensure prices are accurate and not tampered with
  const productIds = items.map(item => item.productId);
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds } }
  });

  if (dbProducts.length !== items.length) {
    const err = new Error('One or more products not found') as AppError;
    err.statusCode = 404;
    throw err;
  }

  // 2. Calculate total amount securely
  let totalAmount = 0;
  const orderItemsData = items.map(item => {
    const product = dbProducts.find(p => p.id === item.productId)!;
    
    // Check stock
    if (product.stockQuantity < item.quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`) as AppError;
      err.statusCode = 400;
      throw err;
    }

    totalAmount += product.price * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price
    };
  });

  // Add shipping & tax (simplified for example)
  const shippingAmount = 15.00;
  const taxAmount = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + shippingAmount + taxAmount;

  // 3. Create Stripe Payment Intent (Mock if no valid key)
  let paymentIntentId = 'pi_mock_' + Math.random().toString(36).substring(7);
  let clientSecret = 'secret_mock_' + Math.random().toString(36).substring(7);
  
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        userId,
        // We'll store the order ID here after we create it
      }
    });
    paymentIntentId = paymentIntent.id;
    clientSecret = paymentIntent.client_secret || clientSecret;
  }

  // 4. Create Order in Database (PENDING state)
  const order = await db.order.create({
    data: {
      userId,
      status: 'PENDING',
      totalAmount: finalTotal,
      taxAmount,
      shippingAmount,
      stripePaymentId: paymentIntentId,
      shippingDetails: JSON.stringify(shippingDetails),
      items: {
        create: orderItemsData
      }
    }
  });

  // Update payment intent metadata with order ID
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { orderId: order.id }
    });
  }

  res.status(200).json({
    success: true,
    clientSecret: clientSecret,
    orderId: order.id
  });
});

export const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const orders = await db.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true, price: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Parse images for products
  const formattedOrders = orders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        images: JSON.parse(item.product.images)
      }
    }))
  }));

  res.status(200).json({
    success: true,
    count: formattedOrders.length,
    data: {
      orders: formattedOrders
    }
  });
});

// ADMIN ROUTES

export const getAllOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true }
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, sku: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: {
      orders
    }
  });
});

export const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  if (!['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
    const err = new Error('Invalid status') as AppError;
    err.statusCode = 400;
    throw err;
  }

  const order = await db.order.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.status(200).json({
    success: true,
    data: {
      order
    }
  });
});
