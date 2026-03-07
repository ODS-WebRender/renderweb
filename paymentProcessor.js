/**
 * Payment Processor Abstraction Layer
 * Allows easy switching between payment providers (Stripe, PayFast, Yoco, etc.)
 */

import crypto from 'crypto';
import Stripe from 'stripe';

/**
 * Base Payment Processor Interface
 */
export class PaymentProcessor {
  async createCheckoutSession(items, customerEmail, domainUrl) {
    throw new Error('Must implement createCheckoutSession');
  }

  async handleWebhook(body, headers) {
    throw new Error('Must implement handleWebhook');
  }
}

/**
 * PayFast Payment Processor
 * South Africa's leading payment provider
 */
export class PayFastProcessor extends PaymentProcessor {
  constructor(merchantId, merchantKey) {
    super();
    this.merchantId = merchantId;
    this.merchantKey = merchantKey;
    this.testMode = !merchantId || merchantId === 'PAYFAST_MERCHANT_ID';
  }

  /**
   * Create PayFast checkout session
   * Returns redirect URL and form data
   */
  async createCheckoutSession(items, customerEmail, domainUrl) {
    if (!items || items.length === 0) {
      throw new Error('No items in cart');
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);

    // PayFast form data
    const data = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: `${domainUrl}/checkout-success.html`,
      cancel_url: `${domainUrl}/shop.html`,
      notify_url: `${domainUrl}/api/webhook-payfast`,
      email_address: customerEmail,
      amount: totalAmount.toFixed(2),
      item_name: items.length === 1 ? items[0].name : `Order - ${items.length} items`,
      item_description: items.map(i => i.name).join(', '),
      custom_int1: Math.floor(Date.now() / 1000), // Order timestamp
      custom_str1: customerEmail, // Customer email as reference
    };

    // Calculate signature
    const signature = this.calculateSignature(data);
    data.signature = signature;

    // Build PayFast redirect URL
    const payfastUrl = this.testMode
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';

    // Build query string
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return {
      success: true,
      checkoutUrl: `${payfastUrl}?${queryString}`,
      checkoutId: data.custom_int1.toString(),
      orderId: null, // Will be set after order creation in server.js
      provider: 'payfast',
      formData: data, // Also return form data in case client needs it
    };
  }

  /**
   * Handle PayFast IPN (Instant Payment Notification) webhook
   */
  async handleWebhook(body, headers) {
    try {
      // Verify the IPN signature
      const isValid = this.verifyIPNSignature(body);
      if (!isValid) {
        console.log('Invalid PayFast IPN signature');
        return { success: false, error: 'Invalid signature' };
      }

      // Check payment status
      const paymentStatus = body.payment_status;
      
      if (paymentStatus === 'COMPLETE') {
        // Payment successful
        return {
          success: true,
          type: 'payment_complete',
          customerEmail: body.custom_str1,
          amount: parseFloat(body.amount_gross),
          transactionId: body.pf_payment_id,
          reference: body.custom_int1,
        };
      } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
        return {
          success: false,
          type: 'payment_failed',
          customerEmail: body.custom_str1,
          reason: paymentStatus,
        };
      }

      return { success: false, type: 'unknown_status', status: paymentStatus };
    } catch (error) {
      console.error('PayFast webhook error:', error);
      throw error;
    }
  }

  /**
   * Calculate PayFast signature (MD5)
   */
  calculateSignature(data) {
    const dataToSign = Object.entries(data)
      .filter(([key]) => key !== 'signature')
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const stringToHash = `${dataToSign}&passphrase=${this.merchantKey}`;
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  }

  /**
   * Verify PayFast IPN signature
   */
  verifyIPNSignature(data) {
    const signature = data.signature;
    delete data.signature;

    const dataToSign = Object.entries(data)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const stringToHash = `${dataToSign}&passphrase=${this.merchantKey}`;
    const calculatedSignature = crypto.createHash('md5').update(stringToHash).digest('hex');

    return signature === calculatedSignature;
  }
}

/**
 * Stripe Payment Processor
 * International payment provider (for non-SA customers)
 */
export class StripeProcessor extends PaymentProcessor {
  constructor(secretKey) {
    super();
    this.stripe = new Stripe(secretKey);
  }

  async createCheckoutSession(items, customerEmail, domainUrl) {
    if (!items || items.length === 0) {
      throw new Error('No items in cart');
    }

    // Convert items to Stripe format
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${domainUrl}/checkout-success.html`,
      cancel_url: `${domainUrl}/shop.html`,
      metadata: {
        customerEmail: customerEmail,
      },
    });

    return {
      success: true,
      checkoutUrl: session.url,
      checkoutId: session.id,
      orderId: null, // Will be set after order creation
      provider: 'stripe',
    };
  }

  async handleWebhook(body, headers) {
    try {
      const sig = headers['stripe-signature'];
      const event = this.stripe.webhooks.constructEvent(
        JSON.stringify(body),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        return {
          success: true,
          type: 'payment_complete',
          checkoutId: session.id,
          customerEmail: session.customer_email,
          amount: session.amount_total / 100,
        };
      }

      return { success: false, type: 'unknown_event', eventType: event.type };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }
}

/**
 * Factory function to get payment processor based on environment
 */
export function getPaymentProcessor() {
  const processor = process.env.PAYMENT_PROCESSOR || 'payfast';

  if (processor === 'payfast') {
    return new PayFastProcessor(
      process.env.PAYFAST_MERCHANT_ID,
      process.env.PAYFAST_MERCHANT_KEY
    );
  } else if (processor === 'stripe') {
    return new StripeProcessor(process.env.STRIPE_SECRET_KEY);
  } else {
    throw new Error(`Unknown payment processor: ${processor}`);
  }
}
