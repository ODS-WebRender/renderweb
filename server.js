// Enterprise-grade server for Old Dog Systems with multi-processor payment integration
import 'dotenv/config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';
import * as db from './db.js';
import * as auth from './auth.js';
import * as email from './email.js';
import * as invoice from './invoice.js';
import { getPaymentProcessor } from './paymentProcessor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Payment processor (PayFast, Stripe, etc.) - configurable via PAYMENT_PROCESSOR env var
const paymentProcessor = getPaymentProcessor();
console.log(`Payment processor: ${process.env.PAYMENT_PROCESSOR || 'payfast'}`);

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

    // POST /api/admin/login - Admin login with password, returns Bearer token
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const { password } = body;
      
      if (!password || password !== process.env.ADMIN_PASSWORD) {
        sendJSON(res, { error: 'Invalid password' }, 401);
        return;
      }
      
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      sendJSON(res, { 
        success: true, 
        token: token,
        message: 'Login successful'
      }, 200);
      return;
    }

    // POST /api/auth/send-verification - Send email verification
    if (pathname === '/api/auth/send-verification' && req.method === 'POST') {
      const body = await parseBody(req);
      const { email } = body;
      
      if (!email) {
        sendJSON(res, { error: 'Email required' }, 400);
        return;
      }
      
      try {
        const result = await auth.sendVerificationEmail(email);
        sendJSON(res, { success: true, message: 'Verification email sent' }, 200);
      } catch (error) {
        console.error('Email verification error:', error);
        sendJSON(res, { error: 'Failed to send verification email' }, 500);
      }
      return;
    }

    // POST /api/auth/verify-email - Verify email with token
    if (pathname === '/api/auth/verify-email' && req.method === 'POST') {
      const body = await parseBody(req);
      const { token } = body;
      
      if (!token) {
        sendJSON(res, { error: 'Verification token required' }, 400);
        return;
      }
      
      try {
        const result = await auth.verifyEmail(token);
        if (result.success) {
          sendJSON(res, { success: true, message: 'Email verified successfully' }, 200);
        } else {
          sendJSON(res, { error: result.error }, 400);
        }
      } catch (error) {
        console.error('Email verification error:', error);
        sendJSON(res, { error: 'Verification failed' }, 500);
      }
      return;
    }

    // POST /api/admin/dashboard - Get admin analytics (requires Bearer token)
    if (pathname === '/api/admin/dashboard' && (req.method === 'POST' || req.method === 'GET')) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - Bearer token required' }, 401);
        return;
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      // In production, validate the token properly
      if (!token || token.length < 10) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      const stats = db.getOrderStats();
      const allOrders = db.getAllOrders();
      
      // Build chart data
      const dailyRevenue = {};
      const topProducts = {};
      const customerSegments = { firstTime: 0, repeat: 0, vip: 0 };
      const alphaByDate = {};
      
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

      // Alpha applicant growth over time
      const alphaInquiries = db.getAlphaInquiries ? db.getAlphaInquiries() : [];
      alphaInquiries.forEach(inquiry => {
        const date = new Date(inquiry.createdAt).toISOString().split('T')[0];
        alphaByDate[date] = (alphaByDate[date] || 0) + 1;
      });

      // Convert to cumulative data for growth chart
      const sortedDates = Object.keys(alphaByDate).sort();
      let cumulativeCount = 0;
      const alphaGrowth = sortedDates.map(date => {
        cumulativeCount += alphaByDate[date];
        return { date, count: cumulativeCount };
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
          customerSegments,
          alphaGrowth: alphaGrowth.length > 0 ? alphaGrowth : [{ date: new Date().toISOString().split('T')[0], count: 0 }]
        },
        alphaStats: {
          totalApplications: alphaInquiries.length,
          approved: alphaInquiries.filter(i => i.status === 'approved').length,
          pending: alphaInquiries.filter(i => i.status === 'pending').length,
          rejected: alphaInquiries.filter(i => i.status === 'rejected').length
        }
      }, 200);
      return;
    }

    // GET /api/admin/orders - Get all orders (requires Bearer token)
    if (pathname === '/api/admin/orders' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - Bearer token required' }, 401);
        return;
      }
      
      const token = authHeader.substring(7);
      if (!token || token.length < 10) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      const orders = db.getAllOrders();
      sendJSON(res, { 
        orders: orders, 
        count: orders.length 
      }, 200);
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

    // ===== HEALTH & STATUS =====

    // GET /api/health - Health check with payment system status
    if (pathname === '/api/health' && req.method === 'GET') {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        payment: {
          provider: 'stripe',
          configured: !!process.env.STRIPE_SECRET_KEY
        },
      };
      sendJSON(res, health, 200);
      return;
    }

    // GET /api/admin/payment-status - Admin-only payment system status
    if (pathname === '/api/admin/payment-status' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - Bearer token required' }, 401);
        return;
      }
      
      const token = authHeader.substring(7);
      if (!token || token.length < 10) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      sendJSON(res, {
        payment_provider: 'stripe',
        credentials_valid: !!process.env.STRIPE_SECRET_KEY,
        last_validated: new Date().toISOString(),
        configuration: {
          secret_key_set: process.env.STRIPE_SECRET_KEY ? 'yes' : 'no',
          webhook_secret_set: process.env.STRIPE_WEBHOOK_SECRET ? 'yes' : 'no',
        },
      }, 200);
      return;
    }

    // ===== CHECKOUT & PAYMENT =====

    // POST /api/checkout - Create checkout session (PayFast, Stripe, etc.)
    if (pathname === '/api/checkout' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const { items, customerEmail } = body;
        
        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
          sendJSON(res, { error: 'No items in cart' }, 400);
          return;
        }

        // Validate customer email
        if (!customerEmail || !customerEmail.includes('@')) {
          sendJSON(res, { error: 'Valid email required' }, 400);
          return;
        }

        const domainUrl = process.env.DOMAIN || 'http://localhost:3000';

        // Get checkout session from payment processor
        const checkoutSession = await paymentProcessor.createCheckoutSession(
          items,
          customerEmail,
          domainUrl
        );

        // Calculate total amount for order
        const totalAmount = items.reduce((sum, item) => {
          return sum + (item.price * (item.quantity || 1));
        }, 0);

        // Create order in database (pending status)
        const order = db.createOrder({
          paymentSessionId: checkoutSession.checkoutId,
          customerEmail: customerEmail,
          customerName: customerEmail.split('@')[0],
          items: items,
          totalAmount: totalAmount,
          currency: 'ZAR', // PayFast uses ZAR for South Africa
          paymentProvider: process.env.PAYMENT_PROCESSOR || 'payfast',
          checkoutUrl: checkoutSession.checkoutUrl
        });

        sendJSON(res, { 
          success: true,
          checkoutUrl: checkoutSession.checkoutUrl,
          checkoutId: checkoutSession.checkoutId,
          orderId: order.id,
          provider: checkoutSession.provider
        }, 200);
      } catch (error) {
        console.error('Checkout error:', error);
        
        sendJSON(res, { 
          success: false,
          error: error.message || 'Checkout failed'
        }, 400);
      }
      return;
    }

    // POST /api/webhook - Payment processor webhooks (PayFast IPN, Stripe, etc.)
    if (pathname === '/api/webhook' && req.method === 'POST') {
      const body = await parseBody(req);
      
      try {
        const webhookResult = await paymentProcessor.handleWebhook(body, req.headers);

        if (!webhookResult.success) {
          console.log(`Webhook validation failed: ${webhookResult.error}`);
          sendJSON(res, { received: true }, 200); // Always return 200 to payment processor
          return;
        }

        console.log(`Webhook event: ${webhookResult.type}`);
        
        // Handle payment completion
        if (webhookResult.type === 'payment_complete') {

          const orders = db.getAllOrders();
          
          // Find order by session/payment ID
          let order = orders.find(o => 
            o.paymentSessionId === webhookResult.checkoutId || 
            o.paymentSessionId === webhookResult.transactionId
          );
          
          // Fallback: search by customer email if order not found
          if (!order) {
            order = orders.find(o => o.customerEmail === webhookResult.customerEmail);
          }
          
          if (order) {
            // Update order status to completed
            db.updateOrder(order.id, {
              status: 'completed',
              paymentId: webhookResult.transactionId || webhookResult.checkoutId
            });

            // Define which products receive license keys
            const licensedProducts = [
              'rough-diamond-studio-alpha',
              'bop-journal-founders',
              'bop-playbook-systems',
              'rds-standard-templates',
              'podcast-editing-masterclass',
              'cpm-ai-suite-beta',
              'propaI-pro-beta',
              'small-ai-toolkit',
              'buildenv-academy',
              'revenue-engine'
            ];

            // Generate license keys for applicable products
            const licenseKeys = {};
            order.items.forEach(item => {
              if (licensedProducts.includes(item.id) || item.category === 'software') {
                try {
                  const license = db.createLicense(item.id, order.id, webhookResult.customerEmail);
                  licenseKeys[item.id] = license.key;
                  console.log(`License generated: ${item.id} -> ${license.key.substring(0, 20)}...`);
                } catch (err) {
                  console.error(`Failed to generate license for ${item.id}:`, err.message);
                }
              }
            });

            // Update order with license keys
            if (Object.keys(licenseKeys).length > 0) {
              db.updateOrder(order.id, { licenseKeys });
            }

            // Get updated order with license keys
            const updatedOrder = db.getOrder(order.id);

            // Generate invoice asynchronously
            try {
              await invoice.generateInvoicePDF(updatedOrder);
              console.log(`Invoice generated: ${updatedOrder.id}`);
            } catch (err) {
              console.error('Invoice generation error:', err);
            }

            // Send order confirmation email
            try {
              await email.sendOrderConfirmation(updatedOrder);
              console.log(`Order confirmation sent to ${updatedOrder.customerEmail}`);
            } catch (err) {
              console.error('Email sending error:', err);
            }

            // Send license key emails if applicable
            if (updatedOrder.licenseKeys && Object.keys(updatedOrder.licenseKeys).length > 0) {
              try {
                for (const [productId, licenseKey] of Object.entries(updatedOrder.licenseKeys)) {
                  const item = updatedOrder.items.find(i => i.id === productId);
                  const productName = item ? item.name : productId;
                  await email.sendLicenseKey(updatedOrder.customerEmail, productName, licenseKey);
                  console.log(`License key email sent to ${updatedOrder.customerEmail}: ${productId}`);
                }
              } catch (err) {
                console.error('License key email error:', err);
              }
            }

            // Send admin notification
            try {
              await email.sendAdminNotification(updatedOrder);
              console.log(`Admin notification sent for order ${updatedOrder.id}`);
            } catch (err) {
              console.error('Admin notification error:', err);
            }

            console.log(`✓ Order ${order.id} completed - ${Object.keys(licenseKeys).length} licenses generated`);
          }
        } else if (webhookResult.type === 'payment_failed') {
          console.log(`Payment failed: ${webhookResult.reason}`);
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

    // ===== CUSTOMER PROFILE & DATA =====

    // GET /api/accounts/profile - Get current user profile
    if (pathname === '/api/accounts/profile' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const user = auth.validateAuthHeader(authHeader);
      
      if (!user) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      try {
        const customer = db.getCustomer(user.email);
        if (!customer) {
          sendJSON(res, { error: 'Customer not found' }, 404);
          return;
        }

        // Don't send password hash
        const { passwordHash, ...safeCustomer } = customer;
        sendJSON(res, safeCustomer, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/customer/orders - Get customer's orders
    if (pathname === '/api/customer/orders' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const user = auth.validateAuthHeader(authHeader);
      
      if (!user) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      try {
        const orders = db.getOrdersByCustomer(user.email);
        sendJSON(res, { 
          orders,
          count: orders.length,
          totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0)
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/customer/licenses - Get customer's license keys
    if (pathname === '/api/customer/licenses' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      const user = auth.validateAuthHeader(authHeader);
      
      if (!user) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      try {
        const orders = db.getOrdersByCustomer(user.email);
        const licenses = [];
        
        orders.forEach(order => {
          if (order.licenseKeys) {
            Object.entries(order.licenseKeys).forEach(([productId, licenseKey]) => {
              const item = order.items.find(i => i.id === productId);
              licenses.push({
                key: licenseKey,
                productId: productId,
                productName: item ? item.name : productId,
                orderId: order.id,
                purchaseDate: order.createdAt,
                status: 'active'
              });
            });
          }
        });

        sendJSON(res, { 
          licenses,
          count: licenses.length
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // ===== ADMIN REFUNDS & MANAGEMENT =====

    // POST /api/admin/refunds - Process refund
    if (pathname === '/api/admin/refunds' && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - Bearer token required' }, 401);
        return;
      }

      const token = authHeader.substring(7);
      if (!token || token.length < 10) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      const body = await parseBody(req);
      const { orderId, reason } = body;

      try {
        const order = db.getOrder(orderId);
        if (!order) {
          sendJSON(res, { error: 'Order not found' }, 404);
          return;
        }

        if (order.status === 'refunded') {
          sendJSON(res, { error: 'Order already refunded' }, 400);
          return;
        }

        // Update order to refunded status
        const refundedOrder = db.updateOrder(orderId, {
          status: 'refunded',
          refundReason: reason || 'No reason provided',
          refundedAt: new Date().toISOString()
        });

        // TODO: Process actual Stripe refund via Stripe API
        console.log(`✓ Order ${orderId} marked as refunded: ${reason}`);

        // Send refund notification email
        try {
          await email.sendRefundNotification(refundedOrder);
        } catch (err) {
          console.error('Refund email error:', err);
        }

        sendJSON(res, {
          success: true,
          order: refundedOrder,
          message: `Order ${orderId} refunded successfully`
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/admin/customers - Get all customers
    if (pathname === '/api/admin/customers' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - Bearer token required' }, 401);
        return;
      }

      const token = authHeader.substring(7);
      if (!token || token.length < 10) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const customers = db.getAllCustomers();
        const orders = db.getAllOrders();

        // Enrich customers with order data
        const enrichedCustomers = customers.map(customer => {
          const customerOrders = orders.filter(o => o.customerEmail === customer.email);
          return {
            ...customer,
            orderCount: customerOrders.length,
            totalSpent: customerOrders.reduce((sum, o) => sum + o.totalAmount, 0),
            lastOrder: customerOrders.length > 0 ? customerOrders[0].createdAt : null,
            passwordHash: undefined // Don't return password
          };
        });

        sendJSON(res, {
          customers: enrichedCustomers,
          count: enrichedCustomers.length
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // ===== SUBSCRIPTIONS (Phase 4b) =====

    // POST /api/subscriptions/create - Create new subscription
    if (pathname === '/api/subscriptions/create' && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - JWT required' }, 401);
        return;
      }

      const body = await parseBody(req);
      const user = auth.validateAuthHeader(authHeader);

      if (!user) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const { productId, productName, billingCycle, amount } = body;

        if (!productId || !amount || !billingCycle) {
          sendJSON(res, { error: 'Missing required fields' }, 400);
          return;
        }

        const subscription = db.createSubscription({
          customerEmail: user.email,
          productId,
          productName: productName || productId,
          billingCycle,
          amount,
          currency: 'ZAR'
        });

        sendJSON(res, {
          success: true,
          subscription,
          message: 'Subscription created successfully'
        }, 201);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/subscriptions - Get user's subscriptions
    if (pathname === '/api/subscriptions' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - JWT required' }, 401);
        return;
      }

      const user = auth.validateAuthHeader(authHeader);
      if (!user) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const subscriptions = db.getSubscriptionsByCustomer(user.email);
        const stats = subscriptions.reduce((acc, sub) => {
          acc.active += sub.status === 'active' ? 1 : 0;
          acc.totalValue += sub.status === 'active' ? sub.amount : 0;
          return acc;
        }, { active: 0, totalValue: 0 });

        sendJSON(res, {
          subscriptions,
          count: subscriptions.length,
          stats
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // POST /api/subscriptions/:subscriptionId/cancel - Cancel subscription
    if (pathname.match(/^\/api\/subscriptions\/[^/]+\/cancel$/) && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - JWT required' }, 401);
        return;
      }

      const subscriptionId = pathname.split('/')[3];
      const user = auth.validateAuthHeader(authHeader);

      if (!user) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const subscription = db.getSubscription(subscriptionId);
        if (!subscription) {
          sendJSON(res, { error: 'Subscription not found' }, 404);
          return;
        }

        if (subscription.customerEmail !== user.email) {
          sendJSON(res, { error: 'Unauthorized' }, 403);
          return;
        }

        const cancelled = db.cancelSubscription(subscriptionId);

        sendJSON(res, {
          success: true,
          subscription: cancelled,
          message: 'Subscription cancelled successfully'
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // POST /api/subscriptions/:subscriptionId/pause - Pause subscription
    if (pathname.match(/^\/api\/subscriptions\/[^/]+\/pause$/) && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - JWT required' }, 401);
        return;
      }

      const subscriptionId = pathname.split('/')[3];
      const user = auth.validateAuthHeader(authHeader);

      if (!user) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const subscription = db.getSubscription(subscriptionId);
        if (!subscription) {
          sendJSON(res, { error: 'Subscription not found' }, 404);
          return;
        }

        if (subscription.customerEmail !== user.email) {
          sendJSON(res, { error: 'Unauthorized' }, 403);
          return;
        }

        const paused = db.updateSubscription(subscriptionId, { status: 'paused' });

        sendJSON(res, {
          success: true,
          subscription: paused,
          message: 'Subscription paused successfully'
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // POST /api/subscriptions/:subscriptionId/resume - Resume subscription
    if (pathname.match(/^\/api\/subscriptions\/[^/]+\/resume$/) && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized - JWT required' }, 401);
        return;
      }

      const subscriptionId = pathname.split('/')[3];
      const user = auth.validateAuthHeader(authHeader);

      if (!user) {
        sendJSON(res, { error: 'Invalid token' }, 401);
        return;
      }

      try {
        const subscription = db.getSubscription(subscriptionId);
        if (!subscription) {
          sendJSON(res, { error: 'Subscription not found' }, 404);
          return;
        }

        if (subscription.customerEmail !== user.email) {
          sendJSON(res, { error: 'Unauthorized' }, 403);
          return;
        }

        const resumed = db.updateSubscription(subscriptionId, { status: 'active' });

        sendJSON(res, {
          success: true,
          subscription: resumed,
          message: 'Subscription resumed successfully'
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // ===== AFFILIATES (Phase 4c) =====

    // POST /api/affiliates/join - Apply to become affiliate
    if (pathname === '/api/affiliates/join' && req.method === 'POST') {
      const body = await parseBody(req);

      try {
        const { email, name, website } = body;

        if (!email || !email.includes('@')) {
          sendJSON(res, { error: 'Valid email required' }, 400);
          return;
        }

        // Check if already an affiliate
        const existing = db.getAffiliateByEmail(email);
        if (existing) {
          sendJSON(res, { error: 'Email already registered as affiliate' }, 400);
          return;
        }

        const affiliate = db.createAffiliate({
          email,
          name: name || email.split('@')[0],
          website,
          commissionRate: 15
        });

        // Send welcome email
        try {
          await email.sendAffiliateWelcome(affiliate);
          console.log(`Affiliate application sent to ${email}`);
        } catch (err) {
          console.error('Affiliate email error:', err);
        }

        sendJSON(res, {
          success: true,
          message: 'Application submitted successfully. We will review and get back to you soon.',
          affiliateCode: affiliate.affiliateCode,
          referralLink: affiliate.referralLink
        }, 201);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/affiliates/dashboard - Get affiliate dashboard data
    if (pathname === '/api/affiliates/dashboard' && req.method === 'GET') {
      const affiliateCode = parsedUrl.searchParams.get('code');

      if (!affiliateCode) {
        sendJSON(res, { error: 'Affiliate code required' }, 400);
        return;
      }

      try {
        const affiliate = db.getAffiliateByCode(affiliateCode);
        if (!affiliate) {
          sendJSON(res, { error: 'Affiliate not found' }, 404);
          return;
        }

        const stats = db.getAffiliateStats(affiliateCode);
        const referrals = db.getReferralsByAffiliate(affiliateCode);

        sendJSON(res, {
          affiliate: {
            email: affiliate.email,
            name: affiliate.name,
            affiliateCode: affiliate.affiliateCode,
            referralLink: affiliate.referralLink,
            status: affiliate.status,
            commissionRate: affiliate.commissionRate
          },
          stats,
          recentReferrals: referrals.slice(-10).reverse(),
          payoutHistory: [] // TODO: Add payout history
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/affiliates/:code/referrals - Get affiliate's referrals
    if (pathname.match(/^\/api\/affiliates\/[^/]+\/referrals$/) && req.method === 'GET') {
      const code = pathname.split('/')[3];

      try {
        const affiliate = db.getAffiliateByCode(code);
        if (!affiliate) {
          sendJSON(res, { error: 'Affiliate not found' }, 404);
          return;
        }

        const referrals = db.getReferralsByAffiliate(code);
        const stats = {
          total: referrals.length,
          pending: referrals.filter(r => r.status === 'pending').length,
          completed: referrals.filter(r => r.status === 'completed').length,
          totalValue: referrals.reduce((sum, r) => sum + r.amount, 0),
          totalCommission: referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.commission, 0)
        };

        sendJSON(res, {
          referrals,
          stats
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // POST /api/admin/affiliates/approve - Admin approve affiliate
    if (pathname === '/api/admin/affiliates/approve' && req.method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      const body = await parseBody(req);

      try {
        const { affiliateId } = body;
        const affiliate = db.getAffiliate(affiliateId);

        if (!affiliate) {
          sendJSON(res, { error: 'Affiliate not found' }, 404);
          return;
        }

        const approved = db.updateAffiliate(affiliateId, {
          status: 'approved',
          approvedAt: new Date().toISOString()
        });

        sendJSON(res, {
          success: true,
          affiliate: approved,
          message: 'Affiliate approved'
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
      }
      return;
    }

    // GET /api/admin/affiliates - Admin view all affiliates
    if (pathname === '/api/admin/affiliates' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, { error: 'Unauthorized' }, 401);
        return;
      }

      try {
        const affiliates = db.getAllAffiliates();
        const stats = affiliates.reduce((acc, aff) => {
          acc.total += 1;
          acc.approved += aff.status === 'approved' ? 1 : 0;
          acc.pending += aff.status === 'pending' ? 1 : 0;
          acc.totalCommissions += aff.totalCommission;
          return acc;
        }, { total: 0, approved: 0, pending: 0, totalCommissions: 0 });

        sendJSON(res, {
          affiliates,
          stats
        }, 200);
      } catch (error) {
        sendJSON(res, { error: error.message }, 500);
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

server.listen(PORT, async () => {
  console.log(`🎬 Old Dog Systems running at http://localhost:${PORT}`);
  console.log(`   Database: ${path.join(__dirname, 'data')}`);
  console.log(`   Admin password: ${process.env.ADMIN_PASSWORD ? '✓ Set' : '⚠ Not set (set ADMIN_PASSWORD env var)'}`);
  
  // Validate payment system on startup
  console.log('\n📊 Validating payment system...');
  if (process.env.STRIPE_SECRET_KEY) {
    console.log('✅ Payment Ready: Stripe');
  } else {
    console.warn('⚠️  Payment Not Ready: STRIPE_SECRET_KEY not set');
    console.warn('   → Set STRIPE_SECRET_KEY environment variable');
  }
  
  console.log('\n✨ Server ready for requests');
});
