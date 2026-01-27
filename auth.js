// Authentication module for Old Dog Systems
// Handles account creation, login, JWT tokens

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createCustomer, getCustomer, updateCustomer, customerExists } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'old-dog-systems-secret-key-change-in-production';
const JWT_EXPIRY = '30d';

// ===== PASSWORD HASHING =====

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ===== ACCOUNT MANAGEMENT =====

export async function createAccount(email, password, name = '') {
  // Validate email format
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }

  // Check if email already exists
  if (customerExists(email)) {
    throw new Error('Account with this email already exists');
  }

  // Validate password
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create customer
  const customer = createCustomer({
    email,
    passwordHash,
    name
  });

  return {
    id: customer.id,
    email: customer.email,
    name: customer.name
  };
}

export async function loginAccount(email, password) {
  // Get customer
  const customer = getCustomer(email);
  
  if (!customer) {
    throw new Error('Account not found');
  }

  // Verify password
  const passwordValid = await comparePassword(password, customer.passwordHash);
  
  if (!passwordValid) {
    throw new Error('Invalid password');
  }

  // Update last login
  updateCustomer(email, {
    lastLogin: new Date().toISOString()
  });

  // Generate JWT token
  const token = jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      name: customer.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  return {
    token,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name
    }
  };
}

// ===== AUTO-CREATE ACCOUNT AFTER PURCHASE =====

export async function autoCreateAccount(email, firstName = 'Customer') {
  // Check if account already exists
  if (customerExists(email)) {
    return { accountCreated: false, email };
  }

  // Generate temporary password (user will set real password on first login)
  const tempPassword = Math.random().toString(36).slice(-12);
  
  try {
    const customer = await createAccount(email, tempPassword, firstName);
    
    return {
      accountCreated: true,
      customer,
      tempPassword, // Return so we can include in confirmation email
      message: `Account created with email ${email}. Password sent to email.`
    };
  } catch (error) {
    return {
      accountCreated: false,
      error: error.message
    };
  }
}

// ===== TOKEN VERIFICATION =====

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function validateAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  return verifyToken(token);
}

// ===== MIDDLEWARE =====

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const user = validateAuthHeader(authHeader);

  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing token' }));
    return;
  }

  req.user = user;
  next();
}

// ===== PASSWORD RESET (Future) =====

export async function requestPasswordReset(email) {
  const customer = getCustomer(email);
  
  if (!customer) {
    // Don't reveal if email exists for security
    return { message: 'If account exists, reset link will be sent to email' };
  }

  // TODO: Generate reset token and send via email
  return { message: 'Password reset link sent to email' };
}
