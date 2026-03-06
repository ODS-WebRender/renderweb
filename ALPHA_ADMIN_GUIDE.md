# Alpha Program Administration Guide

**For:** Old Dog Systems Admin Team  
**Purpose:** Managing alpha inquiries, approvals, and participant lifecycle  

---

## Admin Dashboard Access

**URL:** `https://old-dog-systems1.onrender.com/admin-dashboard.html`  
**Password:** Set in `.env` as `ADMIN_PASSWORD`

---

## Managing Alpha Inquiries

### Incoming Inquiries

All alpha access form submissions are:
1. ✅ Stored in the database (`data/alpha_inquiries.json`)
2. ✅ Confirmation email sent to applicant
3. ✅ Notification email sent to admin
4. ✅ Accessible via API

### API Endpoints

#### Get All Inquiries
```bash
curl -X GET "https://old-dog-systems1.onrender.com/api/alpha/inquiries" \
  -H "X-Admin-Password: YOUR_ADMIN_PASSWORD"
```

#### Get Inquiry by Status
```bash
curl -X GET "https://old-dog-systems1.onrender.com/api/alpha/inquiries?status=pending" \
  -H "X-Admin-Password: YOUR_ADMIN_PASSWORD"
```

#### Update Inquiry Status
```bash
curl -X PUT "https://old-dog-systems1.onrender.com/api/alpha/inquiry/INQUIRY_ID" \
  -H "X-Admin-Password: YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "notes": "Approved for alpha access"
  }'
```

### Inquiry Statuses

| Status | Meaning | Next Action |
|--------|---------|------------|
| **pending** | New application, awaiting review | Review and approve/reject |
| **approved** | Ready for alpha access | Send download link |
| **contacted** | Initial contact made | Awaiting response |
| **onboarded** | Full access granted | Track activity |
| **rejected** | Not a fit for current alpha | Keep record for future |
| **inactive** | Stopped using alpha | Follow up if needed |

---

## Approval Workflow

### 1. Review Application
- Check for completeness
- Verify email address
- Assess fit with current alpha cohort
- Note any concerns

**Decision Points:**
- ✅ **Approve** → Forward thinking, aligned with mission
- 🔄 **Follow-up** → Unclear, needs clarification
- ❌ **Reject** → Not a fit for current phase

### 2. Send Approval Email

**Template:**
```
Subject: Your Rough Diamond Studio Alpha Access

Hi [NAME],

Great news! Your application to join the Rough Diamond Studio alpha has been approved.

Here's what's next:

1. Download your platform (link below)
   [DOWNLOAD LINK]

2. Complete the setup (takes ~5 minutes)
   [SETUP INSTRUCTIONS]

3. Join our community
   Email: [ALPHA_EMAIL]
   Discord: [INVITE_LINK] (coming soon)

Questions? Reply directly to this email.

We're excited to have you on the team!

— Steve @ Old Dog Systems
```

### 3. Track Access

Once approved:
- Add to `alpha_participants.json`
- Record download links sent
- Add to email list for updates
- Schedule onboarding call (optional)

### 4. Provide Download Link

**Current Alpha Builds:**

| Platform | Link | Size |
|----------|------|------|
| Linux (AppImage) | [Download] | 180MB |
| macOS (DMG) | [Download] | 195MB |
| Windows (Installer) | [Download] | 210MB |
| Source Code | [GitHub] | - |

---

## Participant Tracking

### Alpha Cohort Sheet

Maintain a spreadsheet with:
- Name, email, company
- Application date
- Approval date
- Platform(s) used
- Last activity date
- Notes/feedback

### Activity Monitoring

Track:
- Download completion
- First launch
- Regular usage (weekly)
- Bug reports submitted
- Feature requests
- Community engagement

---

## Communication

### Weekly Updates

Send every Tuesday morning:
- New features/fixes deployed
- Known issues and workarounds
- Community highlights
- Next week's focus
- Links to help/documentation

### Monthly Community Call

- **When:** First Wednesday of month, 10am PT
- **Duration:** 45 minutes
- **Topics:** Roadmap, feedback, Q&A
- **Recording:** Shared with those who can't attend

### Bug Bounty / Feedback Rewards

Consider rewards for:
- Critical bug discovery
- Great feature suggestions
- Community help (expert users helping others)
- Early market feedback

---

## Handling Issues

### Bug Reports

When a participant reports a bug:
1. ✅ Confirm reproducibility
2. ✅ Document steps and environment
3. ✅ Add to bug tracking system
4. ✅ Provide workaround if available
5. ✅ Update participant with fix timeline

### Feature Requests

Evaluate based on:
- Alignment with roadmap
- Frequency of requests
- Ease of implementation
- User impact potential

### Support Issues

Common questions:
- Installation issues (platform-specific)
- Audio device setup
- Workflow help
- Feature usage
- Data backup/recovery

---

## Phase Transitions

### Alpha → Beta Criteria

- 50+ stable users
- Critical bugs resolved
- Core workflows validated
- Documentation complete
- Performance optimized

### Beta Participant Upgrade

Send upgrade email:
```
Your alpha access automatically upgrades to beta!

New in beta:
- [FEATURE 1]
- [FEATURE 2]
- [NEW PLATFORM]

Your feedback shaped these improvements. Thank you!
```

### Lifetime Access Benefit

All alpha participants receive:
- Lifetime free access
- $99 discount code for future products
- "Founder" badge in community
- Priority support tier

---

## Database Management

### Alpha Inquiries Location
```
data/alpha_inquiries.json
```

### Backup Inquiries
```bash
cp data/alpha_inquiries.json backups/alpha_inquiries_$(date +%Y%m%d).json
```

### Export to CSV
```bash
# For spreadsheet analysis
node scripts/export-alpha-inquiries.js > alpha_inquiries.csv
```

---

## Security Notes

- Never share admin passwords publicly
- Store inquiries securely
- Email addresses are sensitive
- Only share download links directly with approved participants
- Log all approvals and rejections
- Maintain audit trail

---

## Success Metrics

Track:
- **Inquiry Rate:** Applications per week
- **Approval Rate:** % approved vs total
- **Activation Rate:** % who download and launch
- **Retention:** % active after 30/60/90 days
- **Feedback Quality:** Bug reports, feature requests per user
- **NPS Score:** Net Promoter Score (optional survey)

---

## Escalation Path

For issues requiring higher-level decision:

1. **Technical Issues** → Dev team lead
2. **Participant Concerns** → Program lead
3. **Business Decisions** → Founder/CEO
4. **Legal/Privacy** → Legal review

---

## Template Library

### Inquiry Confirmation Email
[In email.js: `sendAlphaInquiryConfirmation()`]

### Admin Notification Email
[In email.js: `sendAlphaInquiryNotification()`]

### Approval Email
[Template above]

### Download Link Email
[Create in system]

### Roadmap Update Email
[Create in system]

---

## Quick Commands

### View pending inquiries (CLI)
```bash
node -e "
const db = require('./db.js');
const pending = db.getAlphaInquiriesByStatus('pending');
console.log(JSON.stringify(pending, null, 2));
"
```

### Approve inquiry programmatically
```bash
node -e "
const db = require('./db.js');
const updated = db.updateAlphaInquiry('inquiry_ID', {
  status: 'approved',
  notes: 'Approved by admin'
});
console.log('Updated:', updated.id);
"
```

---

## Checklist for New Alpha Release

- [ ] Verify all inquiries responded to
- [ ] Send release notes to active participants
- [ ] Include download link for new version
- [ ] Track downloads and activations
- [ ] Monitor for bug reports
- [ ] Schedule feedback collection
- [ ] Update roadmap if needed
- [ ] Celebrate milestones with community

---

**Program Lead:** Steve @ Old Dog Systems  
**Last Updated:** February 1, 2026
