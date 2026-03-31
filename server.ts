import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { errorHandler } from './src/server/middleware/error.middleware';

// Routes
import authRoutes from './src/server/routes/auth.routes';
import productRoutes from './src/server/routes/product.routes';
import orderRoutes from './src/server/routes/order.routes';
import webhookRoutes from './src/server/routes/webhook.routes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // CORS
  app.use(cors());

  // Webhook route needs raw body, so it comes before express.json()
  app.use('/api/webhooks/stripe', webhookRoutes);

  // Body parser
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV });
  });

  // Global Error Handler
  app.use(errorHandler);

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
