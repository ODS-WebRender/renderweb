// Email service for Old Dog Systems
// Uses SendGrid for reliable email delivery

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@olddogsystems.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@olddogsystems.com';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// ===== ORDER CONFIRMATION EMAIL =====

export async function sendOrderConfirmation(order, downloadLinks = {}) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured - skipping email:', order.customerEmail);
    return { success: false, message: 'SendGrid not configured' };
  }

  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.displayPrice}
        </td>
      </tr>
    `
    )
    .join('');

  const licenseKeysHtml =
    Object.entries(order.licenseKeys || {})
      .map(
        ([productId, licenseKey]) => `
      <div style="margin: 15px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #38bdf8;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Your License Key</p>
        <p style="margin: 0; font-family: monospace; font-size: 14px; word-break: break-all; color: #666;">
          ${licenseKey}
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
          Valid for lifetime access
        </p>
      </div>
    `
      )
      .join('') || '';

  const downloadLinksHtml =
    Object.entries(downloadLinks || {})
      .map(
        ([productId, link]) => `
      <p style="margin: 10px 0;">
        <a href="${link}" style="background: #38bdf8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Download Product
        </a>
      </p>
    `
      )
      .join('') || '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #020617; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f5f5f5; padding: 10px; text-align: left; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
          .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmed</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase!</p>
          </div>

          <div class="content">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>

            <h3 style="margin-top: 30px;">Items Purchased</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">
              Total: $${(order.totalAmount / 100).toFixed(2)}
            </div>
          </div>

          ${licenseKeysHtml ? `<div class="content"><h3>Your License Keys</h3>${licenseKeysHtml}</div>` : ''}

          ${downloadLinksHtml ? `<div class="content"><h3>Downloads</h3>${downloadLinksHtml}</div>` : ''}

          <div class="content">
            <h3>What's Next?</h3>
            <ul>
              <li>Check your dashboard: <a href="https://olddogsystems.com/dashboard.html">View Your Orders</a></li>
              <li>Join our community forum for support and updates</li>
              <li>For questions, reply to this email</li>
            </ul>
          </div>

          <div class="footer">
            <p>&copy; 2026 Old Dog Systems. All rights reserved.</p>
            <p>You received this email because you made a purchase. <a href="#">Manage preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: order.customerEmail,
      from: SENDER_EMAIL,
      subject: `Order Confirmed: ${order.id}`,
      html: htmlContent,
      replyTo: ADMIN_EMAIL,
    });

    return { success: true, message: 'Order confirmation sent' };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

// ===== PRODUCT DOWNLOAD EMAIL =====

export async function sendProductDownloadLink(customerEmail, productName, downloadUrl) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured - skipping email');
    return { success: false, message: 'SendGrid not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background: #38bdf8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your Product is Ready</h2>
          <p>Hi,</p>
          <p>Your purchase of <strong>${productName}</strong> is ready for download.</p>
          <p><a href="${downloadUrl}" class="button">Download Now</a></p>
          <p>This link will be available for 30 days. If you have any issues, reply to this email.</p>
          <p>Thanks for your purchase!</p>
          <p>— Old Dog Systems</p>
        </div>
      </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: customerEmail,
      from: SENDER_EMAIL,
      subject: `Your Download: ${productName}`,
      html: htmlContent,
      replyTo: ADMIN_EMAIL,
    });

    return { success: true, message: 'Download link sent' };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

// ===== ADMIN NOTIFICATION =====

export async function sendAdminNotification(subject, content) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured - skipping admin email');
    return { success: false, message: 'SendGrid not configured' };
  }

  try {
    await sgMail.send({
      to: ADMIN_EMAIL,
      from: SENDER_EMAIL,
      subject: `[Admin] ${subject}`,
      html: `<p>${content}</p>`,
    });

    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

// ===== LICENSE KEY NOTIFICATION =====

export async function sendLicenseKey(customerEmail, licenseKey, productName) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured - skipping email');
    return { success: false, message: 'SendGrid not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .key-box { background: #f5f5f5; padding: 20px; border-left: 4px solid #38bdf8; margin: 20px 0; }
          .key-box code { font-family: monospace; font-size: 16px; word-break: break-all; display: block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your License Key for ${productName}</h2>
          <p>Hi,</p>
          <p>Welcome to ${productName}! Your license key is below:</p>
          <div class="key-box">
            <strong>License Key:</strong>
            <code>${licenseKey}</code>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">This key is valid for lifetime access.</p>
          </div>
          <h3>Getting Started</h3>
          <ul>
            <li>Log into your dashboard at <a href="https://olddogsystems.com/dashboard.html">olddogsystems.com/dashboard</a></li>
            <li>Visit the Studio page to activate your key</li>
            <li>Get support in our community forum</li>
          </ul>
          <p>If you have any questions, reply to this email.</p>
          <p>— Old Dog Systems Team</p>
        </div>
      </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: customerEmail,
      from: SENDER_EMAIL,
      subject: `Your ${productName} License Key`,
      html: htmlContent,
      replyTo: ADMIN_EMAIL,
    });

    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

// ===== REFUND NOTIFICATION =====

export async function sendRefundNotification(order, reason = '') {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured - skipping email');
    return { success: false, message: 'SendGrid not configured' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .notice { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Refund Processed</h2>
          <p>Hi,</p>
          <p>Your refund has been processed.</p>
          <div class="notice">
            <strong>Refund Amount:</strong> $${(order.totalAmount / 100).toFixed(2)}<br>
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Reason:</strong> ${reason || 'Customer requested'}
          </div>
          <p>The refund may take 3-5 business days to appear in your account.</p>
          <p>If you have any questions, please reply to this email.</p>
          <p>We appreciate your business!</p>
          <p>— Old Dog Systems Team</p>
        </div>
      </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: order.customerEmail,
      from: SENDER_EMAIL,
      subject: 'Refund Processed',
      html: htmlContent,
      replyTo: ADMIN_EMAIL,
    });

    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}
