import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import { catchAsync, AppError } from '../middleware/error.middleware';
import { z } from 'zod';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as any,
  });
};

const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
});

export const register = catchAsync(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(err => err.message).join(', ');
    const err = new Error(`Validation failed: ${errorMessages}`) as AppError;
    err.statusCode = 400;
    throw err;
  }

  const { email, password, firstName, lastName } = parsed.data;

  // Check if user exists
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    const err = new Error('Email already in use') as AppError;
    err.statusCode = 400;
    throw err;
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
    },
  });

  const token = signToken(user.id);

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  });
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Please provide a password'),
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(err => err.message).join(', ');
    const err = new Error(`Validation failed: ${errorMessages}`) as AppError;
    err.statusCode = 400;
    throw err;
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const err = new Error('Incorrect email or password') as AppError;
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    token,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  });
});

export const getMe = catchAsync(async (req: any, res: Response) => {
  const user = await db.user.findUnique({ where: { id: req.user.id } });
  
  if (!user) {
    const err = new Error('User not found') as AppError;
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  });
});
