// Enterprise-grade server for Old Dog Systems with Stripe integration
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const PORT = process.env.PORT || 3000;

// In-memory cart storage (would be session/database in production)
const carts = new Map();

const server = http.createServer(async (req, res) => {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ===== API Routes =====
  
  // GET /api/products - List all products
  if (pathname === '/api/products' && req.method === 'GET') {
    try {
      const productsJson = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(productsJson);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Products not found' }));
    }
    return;
  }

  // GET /api/products/:id - Get single product
  if (pathname.match(/^\/api\/products\/[^/]+$/) && req.method === 'GET') {
    try {
      const id = pathname.split('/').pop();
      const productsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
      const product = productsJson.products.find(p => p.id === id);
      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error' }));
    }
    return;
  }

  // POST /api/checkout - Create Stripe checkout session
  if (pathname === '/api/checkout' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { items, customerEmail } = JSON.parse(body);
        
        // Transform items for Stripe
        const lineItems = items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price,
          },
          quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.DOMAIN || 'http://localhost:3000'}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.DOMAIN || 'http://localhost:3000'}/shop.html`,
          customer_email: customerEmail,
          metadata: {
            company: 'Old Dog Systems'
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sessionId: session.id, clientSecret: session.payment_intent }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // POST /api/webhook - Stripe webhooks
  if (pathname === '/api/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );

        // Handle different event types
        switch (event.type) {
          case 'checkout.session.completed':
            console.log('Payment completed:', event.data.object.id);
            // TODO: Process order fulfillment (send product links, email, etc)
            break;
          case 'checkout.session.async_payment_failed':
            console.log('Payment failed:', event.data.object.id);
            break;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // ===== Static File Serving =====
  
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try .html extension or fallback to index.html for SPA routing
      const htmlPath = filePath.endsWith('.html') ? filePath : filePath + '.html';
      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (htmlErr || !htmlStats.isFile()) {
          fs.readFile(path.join(__dirname, 'index.html'), (readErr, data) => {
            if (readErr) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
              return;
            }
            res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
            res.end(data);
          });
          return;
        }

        serveFile(htmlPath, '.html');
      });
      return;
    }

    serveFile(filePath, path.extname(filePath));
  });

  function serveFile(filePath, ext) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      // Aggressive caching for static assets
      if (ext !== '.html') {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`🎬 Old Dog Systems running at http://localhost:${PORT}`);
  console.log(`   Payment processing: ${process.env.STRIPE_SECRET_KEY ? '✓ Stripe enabled' : '⚠ Stripe not configured'}`);
});
