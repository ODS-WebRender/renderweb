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
    verified: customerData.verified || false,
    verificationToken: customerData.verificationToken || null,
    verificationExpires: customerData.verificationExpires || null,
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

// Product code mapping for license keys
const PRODUCT_CODES = {
  'rough-diamond-studio-alpha': 'RDS',
  'rough-diamond-studio': 'RDS',
  'bop-journal-founders': 'BOP',
  'bop-playbook-systems': 'BOP',
  'rds-standard-templates': 'RDST',
  'podcast-editing-masterclass': 'PCAST',
  'cpm-ai-suite-beta': 'CPM',
  'propaI-pro-beta': 'PROP',
  'small-ai-toolkit': 'SAI',
  'buildenv-academy': 'BUILDENV',
  'revenue-engine': 'REVENG'
};

export function generateLicenseKey(productId = 'RDS') {
  // Get product code or use default
  const code = PRODUCT_CODES[productId] || 'ODS';
  
  // Generate components
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Random alphanumeric suffix
  const randomSuffix = Math.random().toString(36).substr(2, 8).toUpperCase();
  
  return `${code}-${year}-${month}-${day}-${randomSuffix}`;
}

export function createLicense(productId, orderId, customerEmail) {
  ensureDirectories();
  
  const licenseKey = generateLicenseKey(productId);
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

// ===== ALPHA PROGRAM INQUIRIES =====

const ALPHA_INQUIRIES_FILE = path.join(DATA_DIR, 'alpha_inquiries.json');

export function getAlphaInquiries() {
  ensureDirectories();
  
  try {
    if (fs.existsSync(ALPHA_INQUIRIES_FILE)) {
      const data = fs.readFileSync(ALPHA_INQUIRIES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading alpha inquiries:', error);
  }
  
  return [];
}

export function saveAlphaInquiries(inquiries) {
  ensureDirectories();
  
  try {
    fs.writeFileSync(ALPHA_INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving alpha inquiries:', error);
    return false;
  }
}

export function addAlphaInquiry(inquiryData) {
  const inquiry = {
    id: `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: inquiryData.name,
    email: inquiryData.email,
    company: inquiryData.company || 'Not specified',
    interest: inquiryData.interest,
    message: inquiryData.message || '',
    createdAt: new Date().toISOString(),
    status: 'pending',
    notes: []
  };

  const inquiries = getAlphaInquiries();
  inquiries.push(inquiry);
  saveAlphaInquiries(inquiries);
  
  return inquiry;
}

export function updateAlphaInquiry(inquiryId, updates) {
  const inquiries = getAlphaInquiries();
  const index = inquiries.findIndex(i => i.id === inquiryId);
  
  if (index === -1) {
    throw new Error('Inquiry not found');
  }
  
  inquiries[index] = { ...inquiries[index], ...updates };
  saveAlphaInquiries(inquiries);
  
  return inquiries[index];
}

export function getAlphaInquiry(inquiryId) {
  const inquiries = getAlphaInquiries();
  return inquiries.find(i => i.id === inquiryId);
}

export function getAllAlphaInquiries() {
  return getAlphaInquiries();
}

export function getAlphaInquiriesByStatus(status) {
  const inquiries = getAlphaInquiries();
  return inquiries.filter(i => i.status === status);
}

// ===== SUBSCRIPTIONS (Phase 4b) =====

const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');

function getSubscriptions() {
  ensureDirectories();
  try {
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading subscriptions:', error);
  }
  return [];
}

function saveSubscriptions(subscriptions) {
  ensureDirectories();
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
}

export function createSubscription(subscriptionData) {
  const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const subscription = {
    id: subscriptionId,
    customerEmail: subscriptionData.customerEmail,
    productId: subscriptionData.productId,
    productName: subscriptionData.productName,
    billingCycle: subscriptionData.billingCycle || 'monthly', // monthly, quarterly, annual
    amount: subscriptionData.amount,
    currency: subscriptionData.currency || 'ZAR',
    status: 'active', // active, paused, cancelled
    payfastToken: subscriptionData.payfastToken || null, // For recurring PayFast
    createdAt: new Date().toISOString(),
    nextBillingDate: subscriptionData.nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelledAt: null,
    renewalCount: 0,
    failedAttempts: 0,
    notes: []
  };

  const subscriptions = getSubscriptions();
  subscriptions.push(subscription);
  saveSubscriptions(subscriptions);
  
  return subscription;
}

export function getSubscription(subscriptionId) {
  const subscriptions = getSubscriptions();
  return subscriptions.find(s => s.id === subscriptionId);
}

export function getSubscriptionsByCustomer(customerEmail) {
  const subscriptions = getSubscriptions();
  return subscriptions.filter(s => s.customerEmail === customerEmail);
}

export function updateSubscription(subscriptionId, updates) {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(s => s.id === subscriptionId);
  
  if (index === -1) {
    throw new Error('Subscription not found');
  }
  
  subscriptions[index] = { ...subscriptions[index], ...updates, updatedAt: new Date().toISOString() };
  saveSubscriptions(subscriptions);
  
  return subscriptions[index];
}

export function cancelSubscription(subscriptionId) {
  return updateSubscription(subscriptionId, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  });
}

export function getAllSubscriptions() {
  return getSubscriptions();
}

export function getActiveSubscriptions() {
  const subscriptions = getSubscriptions();
  return subscriptions.filter(s => s.status === 'active');
}

export function getSubscriptionStats() {
  const subscriptions = getSubscriptions();
  return {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    pausedSubscriptions: subscriptions.filter(s => s.status === 'paused').length,
    cancelledSubscriptions: subscriptions.filter(s => s.status === 'cancelled').length,
    monthlyRecurringRevenue: subscriptions
      .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0),
    totalRecurringRevenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0)
  };
}

// ===== AFFILIATES (Phase 4c) =====

const AFFILIATES_FILE = path.join(DATA_DIR, 'affiliates.json');

function getAffiliates() {
  ensureDirectories();
  try {
    if (fs.existsSync(AFFILIATES_FILE)) {
      return JSON.parse(fs.readFileSync(AFFILIATES_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading affiliates:', error);
  }
  return [];
}

function saveAffiliates(affiliates) {
  ensureDirectories();
  fs.writeFileSync(AFFILIATES_FILE, JSON.stringify(affiliates, null, 2));
}

export function createAffiliate(affiliateData) {
  const affiliateCode = `AFF${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const affiliate = {
    id: `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    affiliateCode: affiliateCode,
    email: affiliateData.email,
    name: affiliateData.name || affiliateData.email.split('@')[0],
    website: affiliateData.website || null,
    status: 'pending', // pending, approved, suspended
    commissionRate: affiliateData.commissionRate || 15, // Percentage
    bankDetails: affiliateData.bankDetails || {},
    referralLink: `https://old-dog-web.onrender.com/shop?ref=${affiliateCode}`,
    totalReferrals: 0,
    totalCommission: 0,
    totalPaidOut: 0,
    pendingCommission: 0,
    createdAt: new Date().toISOString(),
    approvedAt: null,
    notes: []
  };

  const affiliates = getAffiliates();
  affiliates.push(affiliate);
  saveAffiliates(affiliates);
  
  return affiliate;
}

export function getAffiliate(affiliateId) {
  const affiliates = getAffiliates();
  return affiliates.find(a => a.id === affiliateId);
}

export function getAffiliateByCode(code) {
  const affiliates = getAffiliates();
  return affiliates.find(a => a.affiliateCode === code);
}

export function getAffiliateByEmail(email) {
  const affiliates = getAffiliates();
  return affiliates.find(a => a.email === email);
}

export function updateAffiliate(affiliateId, updates) {
  const affiliates = getAffiliates();
  const index = affiliates.findIndex(a => a.id === affiliateId);
  
  if (index === -1) {
    throw new Error('Affiliate not found');
  }
  
  affiliates[index] = { ...affiliates[index], ...updates, updatedAt: new Date().toISOString() };
  saveAffiliates(affiliates);
  
  return affiliates[index];
}

export function getAllAffiliates() {
  return getAffiliates();
}

export function getApprovedAffiliates() {
  const affiliates = getAffiliates();
  return affiliates.filter(a => a.status === 'approved');
}

// ===== REFERRALS (Phase 4c) =====

const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json');

function getReferrals() {
  ensureDirectories();
  try {
    if (fs.existsSync(REFERRALS_FILE)) {
      return JSON.parse(fs.readFileSync(REFERRALS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading referrals:', error);
  }
  return [];
}

function saveReferrals(referrals) {
  ensureDirectories();
  fs.writeFileSync(REFERRALS_FILE, JSON.stringify(referrals, null, 2));
}

export function createReferral(referralData) {
  const referral = {
    id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    affiliateCode: referralData.affiliateCode,
    affiliateId: referralData.affiliateId,
    customerEmail: referralData.customerEmail,
    orderId: referralData.orderId || null,
    productId: referralData.productId,
    amount: referralData.amount,
    commission: referralData.commission || 0,
    status: 'pending', // pending, completed, paid
    createdAt: new Date().toISOString(),
    completedAt: null,
    paidAt: null
  };

  const referrals = getReferrals();
  referrals.push(referral);
  saveReferrals(referrals);
  
  return referral;
}

export function getReferralsByAffiliate(affiliateCode) {
  const referrals = getReferrals();
  return referrals.filter(r => r.affiliateCode === affiliateCode);
}

export function updateReferral(referralId, updates) {
  const referrals = getReferrals();
  const index = referrals.findIndex(r => r.id === referralId);
  
  if (index === -1) {
    throw new Error('Referral not found');
  }
  
  referrals[index] = { ...referrals[index], ...updates };
  saveReferrals(referrals);
  
  // Update affiliate stats if needed
  if (updates.status === 'completed' && referrals[index].affiliateCode) {
    const affiliate = getAffiliateByCode(referrals[index].affiliateCode);
    if (affiliate) {
      updateAffiliate(affiliate.id, {
        totalReferrals: affiliate.totalReferrals + 1,
        totalCommission: affiliate.totalCommission + (referrals[index].commission || 0),
        pendingCommission: affiliate.pendingCommission + (referrals[index].commission || 0)
      });
    }
  }
  
  return referrals[index];
}

export function getAffiliateStats(affiliateCode) {
  const referrals = getReferrals().filter(r => r.affiliateCode === affiliateCode);
  const affiliate = getAffiliateByCode(affiliateCode);
  
  if (!affiliate) {
    return null;
  }
  
  return {
    affiliate,
    referrals: referrals.length,
    completedReferrals: referrals.filter(r => r.status === 'completed').length,
    pendingReferrals: referrals.filter(r => r.status === 'pending').length,
    totalCommission: referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.commission, 0),
    pendingCommission: affiliate.pendingCommission,
    totalEarnings: affiliate.totalCommission
  };
}

// Ensure directories on module load
ensureDirectories();
