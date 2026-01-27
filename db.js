// Database utility module for Old Dog Systems
// JSON-based storage for orders and customers
// Easy to query, backup, and migrate to PostgreSQL later

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directories exist
function ensureDirectories() {
  const dirs = [
    path.join(DATA_DIR, 'orders'),
    path.join(DATA_DIR, 'customers'),
    path.join(DATA_DIR, 'licenses'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// ===== ORDERS =====

export function createOrder(orderData) {
  ensureDirectories();
  
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'pending', // pending, completed, refunded
    stripeSessionId: orderData.stripeSessionId,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName || 'Unknown',
    items: orderData.items || [],
    totalAmount: orderData.totalAmount,
    currency: orderData.currency || 'USD',
    licenseKeys: {},
    invoiceGenerated: false,
    emailSent: false,
    notes: []
  };

  const filePath = path.join(DATA_DIR, 'orders', `${orderId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(order, null, 2));
  
  return order;
}

export function getOrder(orderId) {
  ensureDirectories();
  const filePath = path.join(DATA_DIR, 'orders', `${orderId}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function updateOrder(orderId, updates) {
  ensureDirectories();
  const order = getOrder(orderId);
  
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  
  const updated = { ...order, ...updates, updatedAt: new Date().toISOString() };
  const filePath = path.join(DATA_DIR, 'orders', `${orderId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  
  return updated;
}

export function getOrdersByCustomer(email) {
  ensureDirectories();
  const ordersDir = path.join(DATA_DIR, 'orders');
  
  if (!fs.existsSync(ordersDir)) {
    return [];
  }
  
  const files = fs.readdirSync(ordersDir);
  return files
    .map(file => JSON.parse(fs.readFileSync(path.join(ordersDir, file), 'utf8')))
    .filter(order => order.customerEmail === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAllOrders() {
  ensureDirectories();
  const ordersDir = path.join(DATA_DIR, 'orders');
  
  if (!fs.existsSync(ordersDir)) {
    return [];
  }
  
  const files = fs.readdirSync(ordersDir);
  return files
    .map(file => JSON.parse(fs.readFileSync(path.join(ordersDir, file), 'utf8')))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ===== CUSTOMERS =====

export function createCustomer(customerData) {
  ensureDirectories();
  
  const customerId = uuidv4();
  const customer = {
    id: customerId,
    email: customerData.email,
    passwordHash: customerData.passwordHash,
    name: customerData.name || '',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalSpent: 0,
    purchaseCount: 0,
    preferences: {
      emailNotifications: true,
      marketingEmails: false
    }
  };

  const filePath = path.join(DATA_DIR, 'customers', `${customerData.email}.json`);
  fs.writeFileSync(filePath, JSON.stringify(customer, null, 2));
  
  return customer;
}

export function getCustomer(email) {
  ensureDirectories();
  const filePath = path.join(DATA_DIR, 'customers', `${email}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function customerExists(email) {
  return getCustomer(email) !== null;
}

export function updateCustomer(email, updates) {
  ensureDirectories();
  const customer = getCustomer(email);
  
  if (!customer) {
    throw new Error(`Customer ${email} not found`);
  }
  
  const updated = { ...customer, ...updates, updatedAt: new Date().toISOString() };
  const filePath = path.join(DATA_DIR, 'customers', `${email}.json`);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  
  return updated;
}

export function getAllCustomers() {
  ensureDirectories();
  const customersDir = path.join(DATA_DIR, 'customers');
  
  if (!fs.existsSync(customersDir)) {
    return [];
  }
  
  const files = fs.readdirSync(customersDir);
  return files.map(file => JSON.parse(fs.readFileSync(path.join(customersDir, file), 'utf8')));
}

// ===== LICENSE KEYS =====

export function generateLicenseKey() {
  const segments = [
    Math.random().toString(36).substr(2, 5).toUpperCase(),
    Math.random().toString(36).substr(2, 5).toUpperCase(),
    Math.random().toString(36).substr(2, 5).toUpperCase()
  ];
  return `RDS-${segments.join('-')}`;
}

export function createLicense(productId, orderId, customerEmail) {
  ensureDirectories();
  
  const licenseKey = generateLicenseKey();
  const license = {
    key: licenseKey,
    productId: productId,
    orderId: orderId,
    customerEmail: customerEmail,
    createdAt: new Date().toISOString(),
    expiresAt: null, // null = lifetime
    status: 'active',
    activationCount: 0
  };

  const filePath = path.join(DATA_DIR, 'licenses', `${licenseKey}.json`);
  fs.writeFileSync(filePath, JSON.stringify(license, null, 2));
  
  return license;
}

export function getLicense(licenseKey) {
  ensureDirectories();
  const filePath = path.join(DATA_DIR, 'licenses', `${licenseKey}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function validateLicense(licenseKey) {
  const license = getLicense(licenseKey);
  
  if (!license) {
    return { valid: false, reason: 'License not found' };
  }
  
  if (license.status !== 'active') {
    return { valid: false, reason: 'License is not active' };
  }
  
  if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
    return { valid: false, reason: 'License expired' };
  }
  
  return { valid: true, license };
}

// ===== ANALYTICS =====

export function getOrderStats() {
  ensureDirectories();
  const orders = getAllOrders();
  
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    completedOrders: orders.filter(o => o.status === 'completed').length,
    refundedOrders: orders.filter(o => o.status === 'refunded').length,
    uniqueCustomers: new Set(orders.map(o => o.customerEmail)).size,
    averageOrderValue: 0,
    topProducts: {},
    revenueByDate: {}
  };

  // Calculate average
  if (stats.totalOrders > 0) {
    stats.averageOrderValue = Math.round(stats.totalRevenue / stats.totalOrders);
  }

  // Top products
  orders.forEach(order => {
    order.items.forEach(item => {
      stats.topProducts[item.id] = (stats.topProducts[item.id] || 0) + 1;
    });
  });

  // Revenue by date
  orders.forEach(order => {
    const date = order.createdAt.split('T')[0];
    stats.revenueByDate[date] = (stats.revenueByDate[date] || 0) + order.totalAmount;
  });

  return stats;
}

// ===== UTILITIES =====

export function backupData() {
  ensureDirectories();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(DATA_DIR, `backup_${timestamp}`);
  
  // Create backup structure
  fs.mkdirSync(backupDir, { recursive: true });
  fs.mkdirSync(path.join(backupDir, 'orders'), { recursive: true });
  fs.mkdirSync(path.join(backupDir, 'customers'), { recursive: true });
  fs.mkdirSync(path.join(backupDir, 'licenses'), { recursive: true });

  // Copy files
  ['orders', 'customers', 'licenses'].forEach(dir => {
    const sourceDir = path.join(DATA_DIR, dir);
    const destDir = path.join(backupDir, dir);
    
    if (fs.existsSync(sourceDir)) {
      fs.readdirSync(sourceDir).forEach(file => {
        fs.copyFileSync(
          path.join(sourceDir, file),
          path.join(destDir, file)
        );
      });
    }
  });

  return backupDir;
}

// Ensure directories on module load
ensureDirectories();
