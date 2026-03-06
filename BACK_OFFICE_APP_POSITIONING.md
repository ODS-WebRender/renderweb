# Old Dog Back Office — Product Positioning Document

**Version:** 1.0  
**Date:** February 10, 2026  
**Status:** Strategic Planning  

---

## Executive Summary

**Old Dog Back Office** is a focused, affordable financial and HR management solution for startup founders, freelancers, and service-based businesses who need invoicing, expense tracking, and basic payroll—but not a full ERP yet.

Positioned as the **gateway product** to the Old Dog ERP ecosystem, Back Office serves as a user acquisition engine and natural stepping stone for businesses outgrowing spreadsheets but not yet ready for enterprise-grade features.

---

## Market Opportunity

### Total Addressable Market (TAM)

**Primary Segment: U.S. Startups & Solo Entrepreneurs**
- ~33M small businesses in the U.S. (SBA)
- ~5.6M new business formations annually
- ~80% are solo/1-5 person operations
- **Serviceable TAM:** 10M solo founders + microbusinesses

**Annual spend on accounting/finance tools:**
- Current state: Fragmented (QuickBooks $25/mo, Stripe, Wave, spreadsheets, accountant)
- Average spend: $50-150/month across 3-5 tools
- Willingness to consolidate: High

### Market Gaps

| Product | Cost | Features | Pain Points |
|---------|------|----------|-------------|
| **Wave** | Free | Basic invoicing, accounting | No payroll; limited reporting |
| **QuickBooks Online** | $25-150/mo | Accounting-focused | Complex UX; expensive; overkill for startups |
| **Guidepoint/Zoho** | $20-60/mo | Modular | UI bloated; vendor lock-in |
| **Spreadsheets** | Free | Customizable | Manual, error-prone, no compliance |
| **Old Dog Back Office** | $0-9/mo | Integrated financial + HR | Simple, startup-friendly, upgrade path |

**Key insight:** Startups are abandoning Wave for more capable solutions but avoiding QuickBooks due to complexity and cost. **This is our gap.**

---

## Product Vision

### Core Thesis

**"Professional back office management without the enterprise complexity or cost"**

Old Dog Back Office is:
- ✓ Simple enough for a founder to run solo on day 1
- ✓ Powerful enough to run through $500K revenue without outgrowing it
- ✓ Designed to make future ERP migration seamless

### Target User Profile

**Primary: The Bootstrapped Founder**
- Age: 25-45
- Education: College+, self-taught tech
- Business stage: Pre-revenue to $250K ARR
- Pain point: "I'm spending 5+ hours a week on financial admin, but I can't afford a full-time bookkeeper yet"
- Tech comfort: Medium (uses Slack, Stripe, etc.)
- Budget: $0-50/month

**Secondary: The Freelancer/Consultant**
- Solo service provider or small agency (<5 people)
- Multiple clients, irregular income
- Needs: Client invoicing, expense tracking, tax-ready reporting
- Currently: Using Wave, QuickBooks trial, or accountant's system

**Tertiary: The Small Service Business**
- HVAC, plumbing, cleaning, landscaping, consulting
- 2-10 employees, $100K-$500K revenue
- Needs: Payroll, invoicing, basic job costing
- Pain: Accountant says "get accounting software," but they want simple

---

## Positioning Strategy

### Positioning Statement

**For** solo founders and service-based microbusinesses  
**Who** struggle with financial admin across disconnected tools,  
**Old Dog Back Office is** a unified financial + HR app for startups  
**That** integrates invoicing, expenses, bills, and basic payroll  
**Unlike** Wave (incomplete) or QuickBooks (too complex and expensive),  
**Our product** is designed for founders, upgradeable as you grow.

### Brand Pillars

1. **Founder-First:** Built for people who run businesses, not accountants
2. **Simple by Default:** Onboard in 15 minutes, not 15 days
3. **Growth-Ready:** Scale from $0 to $500K without switching tools
4. **Upgrade Path:** Seamlessly migrate to Old Dog ERP when ready

### Key Differentiators

| Feature | Back Office | Wave | QB Online | Old Dog ERP |
|---------|-------------|------|-----------|------------|
| Invoicing | ✓ | ✓ | ✓ | ✓ |
| Expense Tracking | ✓ | ✓ | ✓ | ✓ |
| Basic Payroll | ✓ | ❌ | ✓ | ✓ |
| Bank Connection | ✓ | ✓ | ✓ | ✓ |
| Tax Forms (1099/W2) | ✓ | ❌ | ✓ | ✓ |
| Multi-currency | ✓ | Limited | ✓ | ✓ |
| **Startup UX** | **✓✓** | ✓ | ❌❌ | ❌ |
| **Affordable** | **✓✓** | ✓✓ | ❌ | ✓ |
| **Inventory Mgmt** | ❌ | ❌ | ✓ | ✓ |
| **Full ERP** | ❌ | ❌ | Limited | ✓✓ |

---

## Deployment Model Decision: Desktop vs. SaaS vs. Hybrid

### Option A: Cloud-Only SaaS

**Deployment:** AWS/Azure hosted, web app + mobile

**Pros:**
- No installation friction
- Built-in backup & security
- Live support easier (see their data)
- Automatic updates
- Scales to serve millions of users

**Cons:**
- Need infrastructure management
- Ongoing hosting costs ($500-2K/month for initial scale)
- GDPR/data privacy handling
- User hesitation (data on cloud)
- Higher Customer Acquisition Cost (need to market to non-technical users)

**Cost:** $15-30K to launch, $1-2K/month ops, 18-24 month payback

---

### Option B: Desktop App (Windows/Mac)

**Deployment:** Electron-based desktop app, local SQLite database

**Pros:**
- Works offline (key for reliability-paranoid customers)
- Simpler to build (reuse web UI)
- No server infrastructure needed
- Users keep data locally (privacy/trust)
- Lower support burden
- Easier to reach "old school" soloprenuers

**Cons:**
- Manual updates (users must remember)
- Can't see user data (harder to support)
- Multi-device sync requires extra work
- Harder to enforce licensing
- Limited mobile experience (web responsive at best)

**Cost:** $8-12K to launch, ~$0/month ops, quick payback but limited scale

---

### Option C: Hybrid (Recommended)

**Deployment:** Desktop app as primary, optional cloud sync

**Model:**
- **Free Tier:** Desktop app, local storage, manual export (invoices, tax forms)
- **Pro Tier ($9/mo):** Desktop + optional cloud backup, mobile web access, automatic sync

**Pros:**
- Captures price-sensitive founders (free desktop)
- Addresses offline concern (local-first)
- Allows upgrade path (add cloud for $9/mo)
- Lower infrastructure cost (optional cloud)
- Trust-building (data stays local, optional sync)
- Easy migration to ERP (export/import known format)

**Cons:**
- More complex to build (dual codebase sync)
- Support for multiple failure modes
- Version management trickier

**Cost:** $12-18K to launch, $200-500/month ops (cloud optional only)

---

## Recommended Strategy: **Hybrid Model (Desktop-First)**

### Rationale

1. **Startup psychographics:** Founders often distrust "cloud-first" vendors; they want control
2. **Cash flow:** Free desktop tier ($0) reaches max market, Pro tier ($9/mo) monetizes
3. **Infrastructure:** 80% of users give feedback *without* paying; only 15-20% upgrade to cloud
4. **ERP migration:** Desktop data exports cleanly to ERP; cloud complicates this
5. **MVP speed:** Desktop + sync simpler than AWS architecture for v1.0

### Launch Timeline (Hybrid)

**Phase 1: Desktop MVP (Q2 2026 — 12 weeks)**
- Core: Invoicing, Expenses, Basic Payroll, Tax Forms
- Stack: Electron + React, SQLite
- Target: 100 beta users from startup community
- Cost: $12-15K dev

**Phase 2: Cloud Sync & Pro Tier (Q4 2026 — 8 weeks)**
- Add optional cloud backend
- Mobile web access
- Pro subscription ($9/mo)
- Cost: $8-10K dev, $200/mo ops

**Phase 3: Analytics & Reports (Q1 2027)**
- Dashboard, tax reporting, integrations
- Auto-upgrade prompts to ERP
- Cost: $6-8K dev

---

## Pricing Model

### Free Tier (Desktop)

- Invoicing: Up to 100/month
- Expense tracking: Unlimited
- Basic payroll: 1-3 employees
- Tax forms: Generate & download
- Mobile access: ❌
- Cloud backup: ❌
- Support: Community forum

**Conversion target:** 15-20% of free users to Pro after 3 months

### Pro Tier ($9/month or $79/year)

- All Free features, unlimited
- Cloud sync (auto-backup)
- Mobile web access
- Priority email support
- Advanced reporting
- API for integrations (future)

**Target:** $12K MRR by end of Year 2 (1,333 Pro users)

### Upgrade to ERP ($299 one-time + PRO support)

- Triggered at $250K ARR or 5+ employees
- Data migration assisted
- 1-month overlap (run both systems)
- Lifetime free updates to v0.x

---

## Go-to-Market Strategy

### Phase 1: Community & Viral (Months 1-3)

**Channels:**
- Product Hunt launch (free tier = viral potential)
- Indie Hackers & Hacker News
- Bootstrap subreddits (r/startups, r/entrepreneur)
- Email to Old Dog ERP users: "Use this free for financial admin"
- Startup accelerators (Y Combinator, Techstars alumni lists)

**Messaging:** "Free, offline accountant for your startup"

**Target:** 1,000 free downloads in Q2 2026

---

### Phase 2: Content & SEO (Months 4-9)

**Content:**
- Blog: "Accounting for startups," "Freelancer tax guide," "Bookkeeping checklist"
- Video: "20-minute bookkeeping setup" for freelancers
- Comparison guides: "Back Office vs. QuickBooks" (win comparisons)
- Podcast guesting on startup shows

**SEO targets:**
- "Free invoicing software for startups"
- "Simple bookkeeping for freelancers"
- "Payroll for small business"

**Target:** 5,000 free downloads by Year 1

---

### Phase 3: Startup Partnerships (Months 6+)

**Strategic partners:**
- Stripe (embedded in Stripe dashboard)
- Shopify app marketplace
- Slack bot for expense logging
- Quickbooks migration tool (low-barrier import)

**Co-marketing:**
- "Stripe + Old Dog Back Office = complete business toolkit"
- Bundle landing pages

**Target:** 200 Pro users by Year 1 end

---

### Phase 4: Sales & Ad (Year 2)

**Paid acquisition (only if profitable):**
- Google Ads (CPL: $2-5)
- Facebook/Instagram targeting entrepreneurs
- Accountant referral program ("recommend to clients, earn commission")

**Sales:**
- Accountant/bookkeeper partnerships (they recommend, get commission)
- "Bring your current clients to Back Office" program

**Target:** 1,000 Pro users ($108K ARR) by Year 2 end

---

## Financial Projections (3-Year)

### Year 1 (2026)

| Metric | Target |
|--------|--------|
| Free downloads | 5,000 |
| Pro subscribers | 50 |
| MRR | $450 |
| Revenue | $5,400 |
| Development cost | $25,000 |
| Operating cost | $2,400 |
| **Gross margin** | **-$22,000** (investment phase) |

### Year 2 (2027)

| Metric | Target |
|--------|--------|
| Free downloads | 20,000 |
| Pro subscribers | 400 |
| ERP upgrades | 15 |
| MRR | $3,600 |
| Revenue | $52,200 (subs) + $4,500 (ERP) = $56,700 |
| Operating cost | $6,000 |
| **Gross margin** | **+$50,700** |

### Year 3 (2028)

| Metric | Target |
|--------|--------|
| Free downloads | 50,000 |
| Pro subscribers | 1,200 |
| ERP upgrades | 80 |
| MRR | $10,800 |
| Revenue | $145,200 (subs) + $23,920 (ERP) = $169,120 |
| Operating cost | $12,000 |
| **Gross margin** | **+$157,120** |

---

## Success Metrics (KPIs)

### Acquisition & Growth

- Free download growth rate: Target 30% MoM growth, Year 1
- Free-to-Pro conversion rate: Target 20% at 90-day mark
- Cost per install: $0-2 (organic)
- Cost per Pro subscriber: $5-15

### Retention & Engagement

- Pro churn rate: Target <3% monthly
- Free user re-engagement: 40% return 30 days later
- Average sessions per week: 2+ (indicates stickiness)

### Revenue & Business Impact

- CAC (Customer Acquisition Cost): <$20 per Pro user
- LTV (Lifetime Value): $150-300 per Pro user
- LTV:CAC ratio: >10:1 (indicates healthy unit economics)
- ERP upgrade rate: 5-10% of Pro users → $299 revenue

---

## Competitive Analysis

### Direct Competitors

**Wave (Waveapps.com)**
- Free invoicing + accounting
- No payroll
- Weak UX for startups
- We beat on: Payroll, UX, upgrade path

**QuickBooks Self-Employed ($15/mo)**
- Invoicing + basic accounting
- No payroll; learning curve
- We beat on: Price, simplicity, payroll

### Indirect Competitors

- Spreadsheets (cost, functionality)
- Accountant-managed systems (personalization, cost)
- Zoho Books bundle ($20+, complexity)

### Competitive Advantages

1. **Simplicity:** 15-minute setup vs. QB's 2-3 hours
2. **Integrated payroll:** Wave lacks it, QB requires upsell
3. **Upgrade path:** Built-in bridge to Old Dog ERP ecosystem
4. **Founder-friendly:** Designed by someone who ran a startup, not accountants
5. **Affordability:** $0 free tier + $9/mo << QB standard pricing

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Users prefer SaaS (cloud) | Medium | High | Offer Pro cloud sync after desktop baseline |
| Difficulty reaching founders | Medium | High | Product Hunt launch, startup communities, influencers |
| Integration bloat demands | Low | Medium | Say "no" to v1.0; collect feedback for v2 |
| Pricing too low | Low | Medium | Bundle upsells later (API, advanced reports) |
| Churn to QB when they grow | High | Low | Inevitable; make ERP upsell clear and smooth |

---

## Implementation Roadmap

### Q2 2026: Desktop MVP Launch
- [ ] Electron app shell + React frontend
- [ ] Invoicing module (create, send, mark paid)
- [ ] Expense tracking (receipt upload, categorization)
- [ ] Payroll stub generator (W2/1099 export)
- [ ] SQLite local data
- [ ] Documentation + onboarding wizard
- [ ] Beta: 100 startup users

### Q3 2026: Refinement & Community
- [ ] Integrate with Stripe for payments
- [ ] Bank feed import (Plaid API)
- [ ] Product Hunt launch
- [ ] Community feedback loop
- [ ] Tax form export (IRS-ready)

### Q4 2026: Cloud Sync & Pro Tier
- [ ] Cloud backend (AWS RDS)
- [ ] Mobile web access
- [ ] Pro subscription launch ($9/mo)
- [ ] Advanced reporting dashboard
- [ ] 50 Pro users target

### Q1 2027: Integrations & Growth
- [ ] Quickbooks migration tool
- [ ] Slack integration (expense logging)
- [ ] Stripe Dashboard embed
- [ ] ERP upsell automation
- [ ] 200+ Pro users target

---

## Conclusion

Old Dog Back Office fills a genuine market gap: founders and freelancers who need more than Wave but can't afford or tolerate QuickBooks complexity. By positioning it as a **free, offline-first desktop app with optional cloud**, we can:

1. **Acquire customers at low/zero cost** (organic viral loop)
2. **Convert 15-20% to Pro** ($9/mo) after 3 months of usage
3. **Create a natural upgrade path to Old Dog ERP** ($299, when they scale)
4. **Build a cohesive product ecosystem** where success at one level unlocks the next

**Expected outcome by Year 2:** 400 Pro subscribers + 15+ ERP upgrades = $56K+ revenue from a product that required one quarter of dev effort.

---

**Next steps:**
1. Validate demand with 10-15 founder interviews
2. Build Electron MVP (Phase 1: 12 weeks)
3. Soft launch to startup communities
4. Iterate based on free user feedback before monetizing Pro tier
