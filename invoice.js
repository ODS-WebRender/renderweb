// Invoice generation for Old Dog Systems
// Creates PDF invoices for orders

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Company details (customize as needed)
const COMPANY = {
  name: 'Old Dog Systems',
  address: 'South Africa',
  email: 'support@olddogsystems.com',
  website: 'https://olddogsystems.com',
};

export function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      // Create invoices directory if it doesn't exist
      const invoiceDir = path.join(__dirname, 'data', 'invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const fileName = `invoice_${order.id}.pdf`;
      const filePath = path.join(invoiceDir, fileName);

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      // Create file stream
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text(COMPANY.name, { align: 'left' });
      doc.fontSize(10)
        .font('Helvetica')
        .text(COMPANY.address, { align: 'left' })
        .text(COMPANY.email)
        .text(COMPANY.website);

      // Invoice title
      doc.fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', { align: 'right' })
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #: ${order.id}`, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' })
        .text(`Status: ${order.status}`, { align: 'right' });

      doc.moveDown();

      // Bill to
      doc.fontSize(12).font('Helvetica-Bold').text('BILL TO');
      doc.fontSize(10)
        .font('Helvetica')
        .text(order.customerName || 'Customer')
        .text(order.customerEmail);

      doc.moveDown();

      // Items table
      doc.fontSize(12).font('Helvetica-Bold').text('Items');

      // Table header
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 350;
      const col3 = 450;

      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Description', col1, tableTop)
        .text('Qty', col2, tableTop)
        .text('Price', col3, tableTop);

      // Horizontal line
      doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

      let itemTop = tableTop + 30;

      // Items
      order.items.forEach((item) => {
        doc.fontSize(10)
          .font('Helvetica')
          .text(item.name.substring(0, 50), col1, itemTop)
          .text(item.quantity || 1, col2, itemTop)
          .text(`$${(item.price / 100).toFixed(2)}`, col3, itemTop);

        itemTop += 30;
      });

      // Horizontal line before totals
      doc.moveTo(50, itemTop).lineTo(550, itemTop).stroke();

      itemTop += 10;

      // Totals
      const subtotal = order.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      const tax = 0; // No tax for digital products (can customize)
      const total = subtotal + tax;

      doc.fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', col2, itemTop)
        .text(`$${(subtotal / 100).toFixed(2)}`, col3, itemTop);

      itemTop += 20;

      if (tax > 0) {
        doc.text('Tax:', col2, itemTop).text(`$${(tax / 100).toFixed(2)}`, col3, itemTop);
        itemTop += 20;
      }

      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('Total:', col2, itemTop)
        .text(`$${(total / 100).toFixed(2)}`, col3, itemTop);

      doc.moveDown();
      doc.moveDown();

      // License keys if applicable
      if (Object.keys(order.licenseKeys || {}).length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('LICENSE KEYS');

        let keyTop = doc.y + 10;
        Object.entries(order.licenseKeys).forEach(([productId, licenseKey]) => {
          doc.fontSize(9)
            .font('Helvetica')
            .text(`${productId}: ${licenseKey}`, 50, keyTop);

          keyTop += 20;
        });

        doc.moveDown();
      }

      // Footer
      doc.fontSize(9)
        .font('Helvetica')
        .text(
          'Thank you for your business! For support, visit ' + COMPANY.website,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );

      // Finalize PDF
      doc.end();

      // Resolve when file is written
      stream.on('finish', () => {
        resolve({ success: true, filePath, fileName });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getInvoiceDownloadUrl(orderId) {
  return `/api/downloads/invoice/${orderId}`;
}

export function deleteInvoice(orderId) {
  try {
    const filePath = path.join(__dirname, 'data', 'invoices', `invoice_${orderId}.pdf`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
}
