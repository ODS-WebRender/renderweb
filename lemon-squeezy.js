// Lemon Squeezy payment integration module
// Handles checkout session creation and order confirmation

import https from 'https';

// Initialize with credentials (set via environment variables)
const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID || '';
const API_KEY = process.env.LEMON_SQUEEZY_API_KEY || '';

// Product mappings: your product IDs → Lemon Squeezy variant IDs
// Update these with your actual Lemon Squeezy variant IDs
const PRODUCT_VARIANTS = {
  'rough-diamond-studio-alpha': process.env.LSQUEEZY_VAR_RDS || '1',
  'bop-journal-founders': process.env.LSQUEEZY_VAR_BOP_JOURNAL || '2',
  'rds-standard-templates': process.env.LSQUEEZY_VAR_TEMPLATES || '3',
  'podcast-editing-masterclass': process.env.LSQUEEZY_VAR_MASTERCLASS || '4',
};

/**
 * Create a Lemon Squeezy checkout link
 * @param {Array} items - Cart items with id, name, price, quantity
 * @param {String} customerEmail - Customer email
 * @param {String} successUrl - Redirect after purchase
 * @param {String} errorUrl - Redirect on cancel
 * @returns {Promise<Object>} - { checkoutUrl, checkoutId }
 */
export async function createCheckout(items, customerEmail, successUrl, errorUrl) {
  try {
    if (!STORE_ID || !API_KEY) {
      throw new Error('Lemon Squeezy credentials not configured. Set LEMON_SQUEEZY_STORE_ID and LEMON_SQUEEZY_API_KEY environment variables.');
    }

    // Convert items to Lemon Squeezy format
    const variants = items.map(item => {
      const variantId = PRODUCT_VARIANTS[item.id];
      if (!variantId) {
        console.warn(`No Lemon Squeezy variant ID found for product: ${item.id}`);
        return null;
      }
      return {
        id: variantId,
        quantity: item.quantity || 1,
      };
    }).filter(Boolean);

    if (variants.length === 0) {
      throw new Error('No valid products in cart');
    }

    // Build Lemon Squeezy checkout payload
    const payload = {
      data: {
        attributes: {
          checkout_data: {
            custom: {
              order_id: `order-${Date.now()}`,
            },
            billing_address: null,
            tax_number: null,
          },
          product_options: {
            redirect_url: successUrl,
            enabled_variants: variants.map(v => parseInt(v.id)),
          },
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: STORE_ID,
            },
          },
          variant: {
            data: variants.map(v => ({
              type: 'variants',
              id: v.id,
            })),
          },
        },
      },
    };

    // For single variant (simple case)
    if (variants.length === 1) {
      payload.data.relationships.variant.data = {
        type: 'variants',
        id: variants[0].id,
      };
    }

    const response = await makeRequest('POST', '/v1/checkouts', payload);

    return {
      checkoutUrl: response.data.attributes.url,
      checkoutId: response.data.id,
      productIds: items.map(i => i.id),
      totalAmount: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
    };
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error);
    throw new Error(`Checkout failed: ${error.message}`);
  }
}

/**
 * Get checkout status
 * @param {String} checkoutId - Lemon Squeezy checkout ID
 * @returns {Promise<Object>} - Checkout data
 */
export async function getCheckoutStatus(checkoutId) {
  try {
    return await makeRequest('GET', `/v1/checkouts/${checkoutId}`);
  } catch (error) {
    console.error('Failed to fetch checkout status:', error);
    throw error;
  }
}

/**
 * Verify webhook signature (implement when you get API key)
 * @param {Object} event - Webhook event data
 * @param {String} signature - X-Signature header
 * @returns {Boolean}
 */
export function verifyWebhookSignature(event, signature) {
  // Implementation depends on Lemon Squeezy webhook secret
  // For now, accept all (will update when you configure webhooks)
  return true;
}

/**
 * Make HTTP request to Lemon Squeezy API
 * @private
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.lemonsqueezy.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'Old-Dog-Systems/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          if (res.statusCode >= 400) {
            reject(new Error(`Lemon Squeezy API error: ${parsed.errors?.[0]?.detail || parsed.message || 'Unknown error'}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Request failed: ${e.message}`));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

export default {
  createCheckout,
  getCheckoutStatus,
  verifyWebhookSignature,
};
