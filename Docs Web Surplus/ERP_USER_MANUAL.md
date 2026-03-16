# Old Dog ERP — User Manual

**Version:** 0.3.0  
**Release:** February 2026  
**Platform:** Linux, macOS, Windows

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [First Launch & Setup](#first-launch--setup)
4. [Core Modules Overview](#core-modules-overview)
5. [Working with Data](#working-with-data)
6. [Plugin Marketplace](#plugin-marketplace)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [FAQ](#faq)

---

## Getting Started

### What is Old Dog ERP?

Old Dog ERP is a professional, modular enterprise resource planning system designed for small to medium-sized businesses. It provides comprehensive tools for managing:

- **Financial operations** (accounting, invoicing, tax management)
- **Inventory control** (stock tracking, asset management)
- **Sales management** (orders, quotes, customer relationships)
- **Purchasing** (vendor management, purchase orders, AP)
- **Human resources** (payroll, employee records)
- **Customer relationships** (contacts, leads, opportunities)
- **Business analytics** (custom reports, dashboards, KPIs)

### System Requirements

#### Linux
- **OS:** Ubuntu 18.04+, Fedora 30+, Debian 10+ (or equivalent)
- **Architecture:** x86_64
- **RAM:** 2 GB minimum, 4 GB recommended
- **Disk:** 500 MB minimum

#### macOS
- **OS:** macOS 10.13+
- **Architecture:** Intel or Apple Silicon
- **RAM:** 2 GB minimum, 4 GB recommended
- **Disk:** 600 MB minimum

#### Windows
- **OS:** Windows 10 or later
- **Architecture:** x86_64
- **RAM:** 2 GB minimum, 4 GB recommended
- **Disk:** 700 MB minimum

---

## Installation

### Linux

1. **Download** the AppImage from https://olddogsystems.com/erp-download
2. **Make executable:**
   ```bash
   chmod +x OldDogERP-0.3.0-x86_64.AppImage
   ```
3. **Run the application:**
   ```bash
   ./OldDogERP-0.3.0-x86_64.AppImage
   ```

**Optional:** Create a desktop shortcut:
```bash
# The first launch will prompt to create a desktop entry
# Or manually:
ln -s $(pwd)/OldDogERP-0.3.0-x86_64.AppImage ~/Desktop/OldDogERP
```

### macOS

1. **Download** the DMG from https://olddogsystems.com/erp-download
2. **Mount the DMG:**
   Double-click `OldDogERP-0.3.0.dmg`
3. **Install:**
   Drag `Old Dog ERP` to the `Applications` folder
4. **Launch:**
   Open `Applications` and double-click `Old Dog ERP`

> **Note:** On first launch, you may see a security warning. Click "Open" to confirm.

### Windows

1. **Download** the MSI installer from https://olddogsystems.com/erp-download
2. **Run the installer:**
   Double-click `OldDogERP-0.3.0-Setup.msi`
3. **Follow the wizard:**
   - Accept license terms
   - Choose installation location
   - Complete installation
4. **Launch:**
   The installer will offer to launch the app immediately, or find `Old Dog ERP` in Start Menu

---

## First Launch & Setup

### Initial Database Setup

On first launch, Old Dog ERP will:

1. **Create a local database** at:
   - Linux: `~/.local/share/Old Dog ERP/erp.db`
   - macOS: `~/Library/Application Support/Old Dog ERP/erp.db`
   - Windows: `C:\Users\<username>\AppData\Local\Old Dog ERP\erp.db`

2. **Initialize core tables** for all modules

3. **Load default data** (sample chart of accounts, reference data)

### Welcome Screen

When you first open Old Dog ERP, you'll see:

- **Logo** — Old Dog ERP branding
- **Modules Panel** (left sidebar) — 7 core modules
- **Main Content Area** — Dashboard and data entry
- **Tabs** — Data Manager, Dashboard, Marketplace

### First Steps Checklist

✅ **1. Initialize the Database**
- Click "Initialize DB" button (in Data Manager tab)
- This creates core tables and sample data
- You'll see success message: "✓ Database initialized"

✅ **2. Explore Modules**
- Click each module button in the sidebar
- Notice the context-sensitive buttons that appear
- Each module has specialized tools

✅ **3. Check the Dashboard**
- Click "📈 Dashboard" tab
- See visualized data from your modules
- Charts auto-update as you add data

✅ **4. Visit the Marketplace**
- Click "🛒 Marketplace" tab
- Discover available plugins
- Read plugin descriptions and reviews

---

## Core Modules Overview

### 💰 Finance Module

**Purpose:** Manage all accounting, general ledger, invoicing, and financial reporting.

**Key Features:**
- Chart of accounts management
- General ledger entries
- Invoice creation and tracking
- Bank reconciliation tools
- Tax management (sales tax, income tax)
- Financial reports generator

**Common Tasks:**
1. **Create Chart of Accounts:**
   - Switch to Finance → Click "Chart of Accounts"
   - Add account categories (Assets, Liabilities, Equity, etc.)
   - Add specific accounts under each category

2. **Record Journal Entry:**
   - Finance → "Invoice" button
   - Enter transaction details
   - Save to ledger

3. **Reconcile Bank Account:**
   - Finance → "Bank Reconciliation"
   - Match cleared items with bank statement
   - Resolve exceptions

4. **Generate Tax Report:**
   - Finance → "Tax Management"
   - Select tax period
   - View calculated tax liability

### 📦 Inventory Module

**Purpose:** Track stock levels, manage inventory assets, and monitor inventory transactions.

**Key Features:**
- Real-time stock tracking
- Inventory valuation methods (FIFO, weighted average)
- Asset management
- Transaction history and audit trails
- Low stock warnings
- Inventory reports

**Common Tasks:**
1. **Add Inventory Item:**
   - Inventory module → Click "➕ Add"
   - Enter item name, SKU, quantity
   - Set unit cost and reorder level
   - Save

2. **Record Stock Receipt:**
   - Record incoming shipment from supplier
   - Update quantities automatically
   - Track landed cost

3. **Perform Stock Count:**
   - Physical count actual inventory
   - Compare to system records
   - Record variances

4. **Set Low Stock Alert:**
   - Edit inventory item
   - Set "Reorder Level"
   - Receive alerts when stock drops below threshold

### 📊 Sales Module

**Purpose:** Manage sales orders, quotes, customer relationships, and order fulfillment.

**Key Features:**
- Sales order entry and tracking
- Quote management with versioning
- Customer master data
- Order history and status tracking
- Sales analytics and reporting
- Invoice integration with Finance

**Common Tasks:**
1. **Create Sales Order:**
   - Sales module → "📦 Sales Orders"
   - Select customer (create if new)
   - Add line items with quantities and prices
   - Confirm order

2. **Generate Quote for Customer:**
   - Sales → "💬 Quotes"
   - Add products and pricing
   - Send to customer for approval
   - Convert to order when confirmed

3. **Convert Order to Invoice:**
   - View sales order
   - Click "Create Invoice"
   - Review and confirm
   - Automatically updates Finance module

4. **Track Customer History:**
   - Click customer name
   - View all related orders, quotes, invoices
   - Analyze customer lifetime value

### 🛒 Purchasing Module

**Purpose:** Manage vendor relationships, purchase orders, and accounts payable.

**Key Features:**
- Vendor master database
- Purchase order creation and tracking
- Goods receipt entry
- Accounts payable management
- Vendor performance analysis
- Purchase order history

**Common Tasks:**
1. **Add Vendor:**
   - Purchasing → "🏢 Vendors"
   - Enter vendor details
   - Set payment terms (Net 30, etc.)
   - Define default GL account

2. **Create Purchase Order:**
   - Purchasing → "🛒 Purchase Orders"
   - Select vendor
   - Add items and quantities
   - Review pricing and confirm

3. **Receive Goods:**
   - Open purchase order
   - Click "Receive Goods"
   - Compare to receipt documentation
   - Create accounts payable entry

4. **Approve Invoice Payment:**
   - View vendor invoice
   - Match to purchase order and receipt
   - Approve for payment
   - Record in accounts payable

### 👥 CRM Module

**Purpose:** Manage customer relationships, contacts, leads, and sales pipeline.

**Key Features:**
- Contact master database
- Lead management and tracking
- Opportunity management
- Activity logging (calls, meetings, emails)
- Customer segmentation
- Sales pipeline visibility

**Common Tasks:**
1. **Add New Contact:**
   - CRM module → Select "Add Contact"
   - Enter name, organization, contact info
   - Assign to sales team member
   - Save

2. **Create Lead:**
   - CRM → "New Lead"
   - Record source (website, referral, etc.)
   - Set priority and expected value
   - Assign to sales rep

3. **Track Opportunity:**
   - Convert qualified lead to "Opportunity"
   - Set estimated close date and value
   - Update status through sales stages
   - Log activities and notes

4. **Generate Customer List:**
   - CRM → Reports
   - Filter by segment, activity, value
   - Export to spreadsheet
   - Use for targeted campaigns

### 👔 HR Module

**Purpose:** Manage employee records, payroll, benefits, and HR analytics.

**Key Features:**
- Employee master database
- Payroll processing and tax calculation
- Attendance tracking
- Benefits management
- Pay period configuration
- HR reports and analytics

**Common Tasks:**
1. **Add New Employee:**
   - HR module → "👔 HR & Payroll"
   - Enter employee details
   - Set salary/hourly rate
   - Configure tax withholding
   - Assign to department

2. **Record Payroll:**
   - HR → Payroll Processing
   - Select pay period
   - Review hours worked / salary
   - Calculate deductions and taxes
   - Approve and process

3. **Process Paycheck:**
   - Payroll → "Generate Paychecks"
   - Review salary details
   - Print/export paystubs
   - Create accounting entry for payroll expense

4. **Review HR Reports:**
   - HR → Analytics
   - View headcount by department
   - Analyze turnover rates
   - Generate compliance reports

### 📈 Reporting Module

**Purpose:** Create custom reports, dashboards, and analytics across all modules.

**Key Features:**
- Customizable report builder
- Dashboard design tools
- KPI tracking and visualization
- Multi-module data aggregation
- Report scheduling
- Export to PDF/Excel

**Common Tasks:**
1. **Create Custom Report:**
   - Reporting → "New Report"
   - Select data source (module)
   - Choose fields and filters
   - Set visualizations (table, chart, etc.)
   - Save and publish

2. **Build Executive Dashboard:**
   - Reporting → Dashboard
   - Add KPI cards (revenue, profit, headcount)
   - Add charts (sales trend, inventory levels)
   - Set auto-refresh interval
   - Share with team

3. **Schedule Report Distribution:**
   - Select saved report
   - Set schedule (daily, weekly, monthly)
   - Add recipients
   - Configure email format

4. **Export Report Data:**
   - Run report
   - Click "Export"
   - Choose format (PDF, Excel, CSV)
   - Save to disk

---

## Working with Data

### Adding Records

All modules follow similar patterns for adding data:

1. **Click "➕ Add" button** in the module
2. **Fill in required fields** (marked with asterisk *)
3. **Enter optional fields** as needed
4. **Click "Save"** to create record
5. **Success message** confirms creation

### Editing Records

1. **Select a record** from the table (single-click)
2. **Click "✏️ Edit" button**
3. **Modify fields** as needed
4. **Click "Save"** to persist changes
5. **Table automatically refreshes**

### Deleting Records

⚠️ **Warning:** Deletion is permanent and may affect related records

1. **Select the record** to delete
2. **Click "🗑️ Delete" button**
3. **Confirm action** in popup dialog
4. **Record is removed** from database

### Searching & Filtering

1. **Use table column headers** to sort (click header)
2. **Use "🔄 Refresh" button** to reload and clear filters
3. **Future versions** will include advanced filtering

### Bulk Operations

**Planned for future release:**
- Import CSV data
- Batch edit multiple records
- Export filtered results

---

## Plugin Marketplace

### Discovering Plugins

1. **Click "🛒 Marketplace" tab**
2. **Browse available plugins** in the quick list:
   - Name, Category, Rating, Price displayed
3. **Click "Open Marketplace (Full)"** for full catalog

### Installing Plugins

1. **Find desired plugin** in Marketplace
2. **Click "Install"** button
3. **Review plugin details:**
   - Description
   - Requirements
   - Reviews and ratings
4. **Confirm installation**
5. **Plugin is downloaded and registered**
6. **Restart app** to activate

### Managing Installed Plugins

1. **Marketplace → Installed Plugins tab**
2. **View all active plugins:**
   - Name, version, installation path
3. **Plugin actions:**
   - **Enable/Disable** — Toggle plugin on/off
   - **Uninstall** — Remove plugin
   - **Settings** — Configure plugin options
   - **Documentation** — View plugin help

### Available Plugins (v0.3.0)

| Plugin | Purpose | Category |
|--------|---------|----------|
| **Payment Processing** | Accept online payments (credit card, PayPal, etc.) | Finance |
| **Advanced Inventory** | Extended inventory features (barcodes, RFID) | Inventory |
| **Shipping & Fulfillment** | Integration with shipping carriers (FedEx, UPS) | Sales |
| **Analytics Dashboards** | Advanced business intelligence and visualizations | Reporting |
| **Accounting & Tax** | Multi-currency and tax compliance features | Finance |
| **Marketing Promotions** | Create and manage promotional campaigns | Sales |
| **E-Commerce Integration** | Connect to online storefronts (Shopify, WooCommerce) | Sales |
| **Multi-Channel Sync** | Sync inventory across multiple sales channels | Inventory |
| **Customer Loyalty** | Manage loyalty programs and rewards | CRM |
| **Example Python Plugin** | Sample plugin for SDK learning | Development |

### Plugin Ratings & Reviews

- **Stars:** 1-5 rating system
- **Reviews:** Community feedback and notes
- **Downloads:** Track popular plugins
- **Version Info:** Update status displayed

---

## Advanced Features

### Database Location

Old Dog ERP stores your data in a SQLite database:

- **Linux:** `~/.local/share/Old Dog ERP/erp.db`
- **macOS:** `~/Library/Application Support/Old Dog ERP/erp.db`
- **Windows:** `C:\Users\<username>\AppData\Local\Old Dog ERP\erp.db`

**Manual backup:**
```bash
# Linux/macOS
cp ~/.local/share/"Old Dog ERP"/erp.db ./backup-erp.db

# Windows (PowerShell)
Copy-Item "$env:LOCALAPPDATA\Old Dog ERP\erp.db" -Destination "backup-erp.db"
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+O` | Switch to Sales module → Orders |
| `Ctrl+Alt+Q` | Switch to Sales module → Quotes |
| `Ctrl+Alt+P` | Switch to Purchasing → Orders |
| `Ctrl+Alt+V` | Switch to Purchasing → Vendors |
| `Ctrl+Alt+H` | Switch to HR & Payroll |
| `Ctrl+Alt+M` | Open Plugin Marketplace |
| `Ctrl+A` | Select all data in focused table |

### Creating Backups

**Automatic:**
- Database is saved immediately after every change
- No manual backup required for normal usage

**Manual backup (recommended monthly):**
1. Close Old Dog ERP
2. Copy the database file to external storage
3. Reopen Old Dog ERP

### Data Export

From any table:
1. **Select records** (optional - without selection, exports all)
2. **Right-click** on selected rows
3. **Choose "Export to CSV"**
4. **Save file** to desired location
5. **Open in Excel** or spreadsheet application

---

## Troubleshooting

### App Won't Start

**Linux (AppImage):**
```bash
./OldDogERP-0.3.0-x86_64.AppImage --debug
# Look for error messages in terminal output
```

**macOS:**
```bash
~/Applications/Old\ Dog\ ERP.app/Contents/MacOS/OldDogERP
# Look for error messages in terminal
```

**Windows:**
1. Open Event Viewer (Win+R, type `eventvwr.msc`)
2. Look for errors in Windows Logs → Application
3. Check application error message

**Common Causes:**
- Missing Qt libraries (AppImage issue)
- Database file corruption
- Insufficient disk space
- Incompatible OS version

### Database Errors

**Error: "Cannot open database"**
- Ensure database file exists in correct location
- Check file permissions (should be readable/writable)
- Try deleting database and reinitializing (⚠️ loses all data)

**Error: "Database locked"**
- Close all other instances of Old Dog ERP
- Wait a few seconds and try again
- Restart the application

**Reset Database (WARNING: DELETES ALL DATA):**
```bash
# Linux
rm ~/.local/share/"Old Dog ERP"/erp.db

# macOS
rm ~/Library/"Application Support"/"Old Dog ERP"/erp.db

# Windows (PowerShell)
Remove-Item "$env:LOCALAPPDATA\Old Dog ERP\erp.db"
```

Then restart the app to reinitialize.

### Plugins Not Loading

**Plugin directory:**
- Ensure `plugins/` folder exists in application directory
- Create manually if missing

**Plugin manifest errors:**
- Check `plugins/*/plugin.json` is valid JSON
- Use online JSON validator if unsure
- Look for missing required fields

**Plugin not appearing in Marketplace:**
- Restart the application to reload plugin registry
- Check application logs (see Debug Mode below)

### Performance Issues

**Slow loading:**
- Check available RAM (should have 2GB free minimum)
- Reduce number of rows displayed (use filters)
- Archive old data to separate database

**Database optimize:**
1. File → Tools → "Optimize Database"
2. Wait for process to complete
3. Restart application

### Debug Mode

Enable detailed logging:

**Linux/macOS:**
```bash
./OldDogERP-0.3.0-x86_64.AppImage --debug 2>&1 | tee app-debug.log
```

**Windows:**
```powershell
& "C:\Program Files\Old Dog ERP\bin\OldDogERP.exe" --debug | Out-File app-debug.log
```

Share logs with support when seeking help.

---

## Keyboard Shortcuts

### Navigation
- `Tab` — Move to next field
- `Shift+Tab` — Move to previous field
- `Ctrl+Home` — Go to first row
- `Ctrl+End` — Go to last row

### Data Entry
- `Ctrl+S` — Save record (when supported)
- `Ctrl+N` — New record
- `Delete` — Delete selected record (with confirmation)
- `Escape` — Cancel edit/close dialog

### Module Navigation
- `Ctrl+Alt+O` — Sales Orders
- `Ctrl+Alt+Q` — Sales Quotes
- `Ctrl+Alt+P` — Purchase Orders
- `Ctrl+Alt+V` — Vendors
- `Ctrl+Alt+H` — HR & Payroll
- `Ctrl+Alt+M` — Marketplace

---

## FAQ

### Q: Can I use Old Dog ERP offline?
**A:** Yes! Old Dog ERP uses a local SQLite database and works fully offline. Changes sync when you have internet connection for cloud features (future).

### Q: How do I migrate data from another ERP system?
**A:** Use CSV import/export:
1. Export data from your current system as CSV
2. Use Old Dog ERP's import tool (coming in v0.4)
3. Map columns to Old Dog ERP fields
4. Review and confirm import

### Q: Can multiple users access the same database?
**A:** Currently, the app is single-user. Multi-user via network is planned for v0.5.

### Q: How do I report a bug?
**A:** Submit issue on GitHub: https://github.com/olddogsystems/erp  
Or email: support@olddogsystems.com

### Q: Is there a mobile version?
**A:** Not yet, but it's on the roadmap for future releases.

### Q: Can I create custom reports?
**A:** Basic custom reports are available in the Reporting module. Advanced BI is in development.

### Q: What payment methods are supported?
**A:** The core app doesn't process payments, but plugins like "Payment Processing" add this capability.

### Q: How do I customize the app for my business?
**A:** Use the Plugin SDK to create custom plugins:
- C++ for performance-critical features
- Python for integrations and business logic
- See plugin-sdk/ folder for examples

### Q: Is my data secure?
**A:** Your data is stored locally on your computer in an encrypted SQLite database. Network security is planned for future cloud features.

### Q: Can I export all my data?
**A:** Yes! Each module supports CSV export. You can also back up the database file directly.

### Q: How do I get support?
**A:** 
- **Documentation:** https://olddogsystems.com/docs
- **Community:** https://community.olddogsystems.com
- **Email:** support@olddogsystems.com
- **GitHub Issues:** https://github.com/olddogsystems/erp/issues

---

## Getting Help

### Documentation
- **Official Docs:** https://olddogsystems.com/docs/erp
- **Installation Guide:** See INSTALLATION.md
- **API Reference:** https://github.com/olddogsystems/erp-plugin-sdk

### Community Support
- **Forum:** https://community.olddogsystems.com
- **Discussion Boards:** Ask questions and share tips
- **User Groups:** Find local users in your area

### Professional Support
- **Email:** support@olddogsystems.com
- **Response time:** 24-48 hours
- **Paid support plans** available for enterprises

### Social Media
- **Twitter/X:** @OldDogSystems
- **LinkedIn:** /company/olddogsystems
- **YouTube:** [Tutorials and webinars]

---

## Version History

### v0.3.0 (February 2026)
- Initial public release
- 7 core modules
- Plugin Marketplace with 10+ plugins
- Cross-platform support
- Professional Qt6 UI
- SQLite database

### v0.2.0 (Unreleased)
- Internal testing version
- Feature development

### v0.1.0 (Unreleased)
- Alpha development build

---

## License & Legal

Old Dog ERP is distributed under the Old Dog Systems Software License.

**Key Terms:**
- Personal and business use permitted
- Non-exclusive license
- Perpetual license after purchase
- See LICENSE file for full terms

**Copyright © 2026 Old Dog Systems**

---

## Appendix: Common Workflows

### Workflow 1: Create an Invoice

1. **Sales module** → "📦 Sales Orders"
2. **New Order:**
   - Select customer (create if new)
   - Add products with quantities
   - Confirm order
3. **Create Invoice:**
   - Click "Create Invoice" on order
   - Review pricing and terms
   - Confirm
4. **Record Payment:**
   - Finance → Invoices
   - Mark as paid
   - Record bank deposit in Finance

### Workflow 2: Process a Purchase Order

1. **Purchasing module** → "🛒 Purchase Orders"
2. **Create PO:**
   - Select vendor
   - Add needed items
   - Set delivery date
   - Confirm PO
3. **Receive Goods:**
   - Upon delivery, select PO
   - Click "Receive Goods"
   - Inspect and verify receipt
4. **Approve Invoice:**
   - Vendor sends invoice
   - Purchasing → Match to PO
   - Approve for payment
   - Record in Accounts Payable

### Workflow 3: Run Monthly Payroll

1. **HR module** → "👔 HR & Payroll"
2. **Select Pay Period**
3. **Enter Hours** for hourly employees
4. **Review and Approve** salary amounts
5. **Process Paychecks:**
   - Calculate deductions and taxes
   - Generate paystubs
   - Export for bank deposit
6. **Record Expense:**
   - Accounting entry created automatically
   - Updates Finance module

---

**Need Help?** Visit https://olddogsystems.com or contact support@olddogsystems.com

**Version 0.3.0 — Professional ERP Made Simple**
