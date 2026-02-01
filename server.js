// Enterprise-grade server for Old Dog Systems with Stripe integration
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';
import Stripe from 'stripe';
import * as db from './db.js';
import * as auth from './auth.js';
import * as email from './email.js';
import * as invoice from './invoice.js';

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

// Helper to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON response
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

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

  try {
    // ===== ACCOUNT API =====

    // POST /api/accounts/create - Create new account
    if (pathname === '/api/accounts/create' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const account = await auth.createAccount(body.email, body.password, body.name);
        sendJSON(res, { 
          success: true, 
          account,
          message: 'Account created successfully'
        }, 201);
      } catch (error) {
        sendJSON(res, { 
          success: false, 
          error: error.message 
        }, 400);
      }
      return;
    }

    // POST /api/accounts/login - Login to account
    if (pathname === '/api/accounts/login' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const result = await auth.loginAccount(body.email, body.password);
        sendJSON(res, { 
          success: true, 
          ...result
        }, 200);
      } catch (error) {
        sendJSON(res, { 
          success: false, 
          error: error.message 
        }, 401);
      }
      return;
    }

    // ===== ORDER API =====

    // GET /api/orders/:orderId - Get order details (requires auth or order ID)
    if (pathname.match(/^\/api\/orders\/[^/]+$/) && req.method === 'GET') {
      const orderId = pathname.split('/').pop();
      const order = db.getOrder(orderId);
      
      if (!order) {
        sendJSON(res, { error: 'Order not found' }, 404);
        return;
      }
      
      sendJSON(res, order, 200);
      return;
    }

    // GET /api/dashboard - Get customer dashboard (requires auth)
    if (pathname === '/api/dashboard' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const user = auth.validateAuthHeader(authHeader);
      
      if (!user) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      const orders = db.getOrdersByCustomer(user.email);
      sendJSON(res, { 
        user,
        orders,
        stats: {
          totalPurchases: orders.length,
          totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        }
      }, 200);
      return;
    }

    // ===== ADMIN API =====

    // POST /api/admin/dashboard - Get admin analytics (requires admin password)
    if (pathname === '/api/admin/dashboard' && (req.method === 'POST' || req.method === 'GET')) {
      let adminPassword = req.headers['x-admin-password'];
      
      // Support POST with password in body (from HTML form)
      if (req.method === 'POST') {
        const body = await parseBody(req);
        adminPassword = body.password;
      }
      
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      const stats = db.getOrderStats();
      const allOrders = db.getAllOrders();
      
      // Build chart data
      const dailyRevenue = {};
      const topProducts = {};
      const customerSegments = { firstTime: 0, repeat: 0, vip: 0 };
      
      allOrders.forEach(order => {
        // Daily revenue
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalAmount;
        
        // Top products
        order.items.forEach(item => {
          topProducts[item.name] = (topProducts[item.name] || 0) + 1;
        });
        
        // Customer segments (simplified)
        if (order.customerEmail) {
          const customerOrders = allOrders.filter(o => o.customerEmail === order.customerEmail);
          if (customerOrders.length === 1) customerSegments.firstTime++;
          else if (customerOrders.length <= 3) customerSegments.repeat++;
          else customerSegments.vip++;
        }
      });
      
      const recentOrders = allOrders.slice(-10).reverse();
      
      sendJSON(res, {
        stats,
        recentOrders,
        chartData: {
          dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })),
          topProducts: Object.entries(topProducts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
          customerSegments
        }
      }, 200);
      return;
    }

    // GET /api/admin/orders - Get all orders (requires admin password)
    if (pathname === '/api/admin/orders' && req.method === 'GET') {
      const adminPassword = req.headers['x-admin-password'];
      
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      const orders = db.getAllOrders();
      sendJSON(res, orders, 200);
      return;
    }

    // ===== PRODUCT API =====

    // GET /api/products - List all products
    if (pathname === '/api/products' && req.method === 'GET') {
      try {
        const productsJson = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(productsJson);
      } catch (e) {
        sendJSON(res, { error: 'Products not found' }, 500);
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
          sendJSON(res, { error: 'Product not found' }, 404);
          return;
        }
        
        sendJSON(res, product, 200);
      } catch (e) {
        sendJSON(res, { error: 'Server error' }, 500);
      }
      return;
    }

    // ===== CHECKOUT & PAYMENT =====

    // POST /api/checkout - Create Stripe checkout session
    if (pathname === '/api/checkout' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const { items, customerEmail } = body;
        
        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
          sendJSON(res, { error: 'No items in cart' }, 400);
          return;
        }

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
            company: 'Old Dog Systems',
            items: JSON.stringify(items)
          }
        });

        // Create order in database (pending status)
        const order = db.createOrder({
          stripeSessionId: session.id,
          customerEmail: customerEmail,
          customerName: customerEmail.split('@')[0],
          items: items,
          totalAmount: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
          currency: 'USD'
        });

        sendJSON(res, { 
          success: true,
          sessionId: session.id, 
          orderId: order.id
        }, 200);
      } catch (error) {
        console.error('Checkout error:', error);
        sendJSON(res, { error: error.message }, 400);
      }
      return;
    }

    // POST /api/webhook - Stripe webhooks
    if (pathname === '/api/webhook' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
          JSON.stringify(body),
          sig,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );

        console.log(`Webhook event: ${event.type}`);

        // Handle different event types
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object;
            
            // Find order by session ID
            const orders = db.getAllOrders();
            const order = orders.find(o => o.stripeSessionId === session.id);
            
            if (order) {
              // Update order status to completed
              db.updateOrder(order.id, {
                status: 'completed',
                stripePaymentIntentId: session.payment_intent
              });

              // Generate license keys if applicable
              order.items.forEach(item => {
                if (item.id === 'rough-diamond-studio-alpha') {
                  const license = db.createLicense(item.id, order.id, session.customer_email);
                  db.updateOrder(order.id, {
                    licenseKeys: {
                      ...order.licenseKeys,
                      [item.id]: license.key
                    }
                  });
                }
              });

              // Get updated order with license keys
              const updatedOrder = db.getOrder(order.id);

              // Generate invoice asynchronously
              try {
                await invoice.generateInvoicePDF(updatedOrder);
              } catch (err) {
                console.error('Invoice generation error:', err);
              }

              // Send order confirmation email
              try {
                await email.sendOrderConfirmation(updatedOrder);
              } catch (err) {
                console.error('Email sending error:', err);
              }

              // Send license key emails if applicable
              if (updatedOrder.licenseKeys && Object.keys(updatedOrder.licenseKeys).length > 0) {
                try {
                  for (const [productId, licenseKey] of Object.entries(updatedOrder.licenseKeys)) {
                    await email.sendLicenseKey(updatedOrder.customerEmail, productId, licenseKey);
                  }
                } catch (err) {
                  console.error('License key email error:', err);
                }
              }

              // Send admin notification
              try {
                await email.sendAdminNotification(updatedOrder);
              } catch (err) {
                console.error('Admin notification error:', err);
              }

              console.log(`Order ${order.id} completed with invoice and email sent`);
            }
            break;
          }

          case 'checkout.session.async_payment_failed': {
            const session = event.data.object;
            console.log(`Payment failed for session ${session.id}`);
            break;
          }

          case 'charge.refunded': {
            const charge = event.data.object;
            console.log(`Charge refunded: ${charge.id}`);
            
            // Find and update order
            const orders = db.getAllOrders();
            const order = orders.find(o => o.stripePaymentIntentId === charge.payment_intent);
            
            if (order) {
              db.updateOrder(order.id, { status: 'refunded' });
              
              try {
                await email.sendRefundNotification(order);
              } catch (err) {
                console.error('Refund email error:', err);
              }
            }
            break;
          }
        }

        sendJSON(res, { received: true }, 200);
      } catch (error) {
        console.error('Webhook error:', error);
        sendJSON(res, { error: error.message }, 400);
      }
      return;
    }

    // ===== ALPHA PROGRAM =====

    // POST /api/alpha/inquiry - Submit alpha access inquiry
    if (pathname === '/api/alpha/inquiry' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const { name, email, company, interest, message } = body;

        // Validate required fields
        if (!name || !email || !interest) {
          sendJSON(res, { 
            success: false, 
            error: 'Name, email, and interest selection are required' 
          }, 400);
          return;
        }

        // Store inquiry in database
        const inquiry = {
          id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          company: company || 'Not specified',
          interest,
          message: message || '',
          createdAt: new Date().toISOString(),
          status: 'pending'
        };

        // Save inquiry
        const inquiries = db.getAlphaInquiries ? db.getAlphaInquiries() : [];
        inquiries.push(inquiry);
        db.saveAlphaInquiries ? db.saveAlphaInquiries(inquiries) : null;

        // Send confirmation email to user
        try {
          await email.sendAlphaInquiryConfirmation(inquiry);
        } catch (err) {
          console.error('Alpha inquiry confirmation email error:', err);
        }

        // Send notification to admin
        try {
          await email.sendAlphaInquiryNotification(inquiry);
        } catch (err) {
          console.error('Alpha inquiry notification email error:', err);
        }

        sendJSON(res, { 
          success: true,
          message: 'Thank you for your interest! We will review your inquiry and get back to you soon.',
          inquiry
        }, 201);
      } catch (error) {
        console.error('Alpha inquiry error:', error);
        sendJSON(res, { 
          success: false, 
          error: error.message 
        }, 500);
      }
      return;
    }

    // GET /api/alpha/status - Get alpha program status
    if (pathname === '/api/alpha/status' && req.method === 'GET') {
      sendJSON(res, {
        status: 'active',
        alpha_product_id: 'rough-diamond-studio-alpha',
        phase: 'private-alpha',
        seats_available: true,
        features: [
          'Professional Audio Pipeline',
          'Editorial Operations Dashboard',
          'Automated Asset Generation',
          'Team Collaboration Tools',
          'Weekly Shipping Support',
          'Alpha Community Access'
        ],
        enrollment_link: 'https://old-dog-systems1.onrender.com/studio.html#alpha-access'
      }, 200);
      return;
    }

    // GET /api/alpha/count - Public alpha participant count
    if (pathname === '/api/alpha/count' && req.method === 'GET') {
      try {
        const inquiries = db.getAlphaInquiries ? db.getAlphaInquiries() : [];
        const approvedCount = inquiries.filter(i => i.status === 'approved').length;
        const totalCount = inquiries.length > 0 ? Math.max(approvedCount, Math.ceil(inquiries.length * 0.3)) : 0;
        sendJSON(res, { count: totalCount || 0 }, 200);
      } catch (error) {
        console.error('Alpha count error:', error);
        sendJSON(res, { count: 0 }, 200);
      }
      return;
    }

    // ===== DOWNLOADS =====

    // GET /api/downloads/invoice/:orderId - Download invoice PDF
    if (pathname.match(/^\/api\/downloads\/invoice\/[^/]+$/) && req.method === 'GET') {
      const orderId = pathname.split('/').pop();
      const order = db.getOrder(orderId);
      
      if (!order) {
        sendJSON(res, { error: 'Order not found' }, 404);
        return;
      }

      try {
        const result = await invoice.generateInvoicePDF(order);
        if (result.success) {
          const fileContent = fs.readFileSync(result.filePath);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
          res.writeHead(200);
          res.end(fileContent);
        } else {
          sendJSON(res, { error: 'Failed to generate invoice' }, 500);
        }
      } catch (error) {
        console.error('Invoice download error:', error);
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // ===== STATIC FILE SERVING =====
    
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
  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, { error: 'Internal server error' }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`🎬 Old Dog Systems running at http://localhost:${PORT}`);
  console.log(`   Payment processing: ${process.env.STRIPE_SECRET_KEY ? '✓ Stripe enabled' : '⚠ Stripe not configured'}`);
  console.log(`   Database: ${path.join(__dirname, 'data')}`);
  console.log(`   Admin password: ${process.env.ADMIN_PASSWORD ? '✓ Set' : '⚠ Not set (set ADMIN_PASSWORD env var)'}`);
});
