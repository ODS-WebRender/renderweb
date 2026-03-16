# DNS & Domain Configuration Guide

## Current Status
Your website is **LIVE** at: `http://old-dog-systems.co.za`

## DNS Configuration Setup

### Step 1: Identify Your Domain Registrar
Where did you purchase `old-dog-systems.co.za`?
- GoDaddy
- Namecheap
- Other registrar: [specify]

### Step 2: Get Host Africa Nameservers
Contact Host Africa support or check your hosting control panel for:
- **Primary Nameserver:** ns1.hostnafrica.co.za (or similar)
- **Secondary Nameserver:** ns2.hostnafrica.co.za (or similar)
- OR get the **Server IP Address** if you prefer A record configuration

### Step 3: Update DNS at Your Registrar

#### Option A: Update Nameservers (Recommended)
1. Log into your domain registrar
2. Find "Nameservers" or "DNS Management"
3. Replace existing nameservers with Host Africa's nameservers:
   - ns1.hostnafrica.co.za
   - ns2.hostnafrica.co.za
4. Save changes

**Expected Timeline:** 24-48 hours for full propagation

#### Option B: Create A Records (If Nameserver Update Fails)
1. Log into your domain registrar
2. Find "DNS Records" or "A Records"
3. Create A record:
   - **Name:** @ (or blank)
   - **Type:** A
   - **Value:** [Host Africa Server IP - contact support]
   - **TTL:** 3600

### Step 4: Verify DNS Propagation
Use these commands to check DNS status:

```bash
# Check if nameservers are updated
nslookup old-dog-systems.co.za

# Check A record
dig old-dog-systems.co.za +short

# Check full DNS info
dig old-dog-systems.co.za

# Online DNS checker: https://mxtoolbox.com/
# Enter: old-dog-systems.co.za
```

Expected output should show Host Africa's server IP.

## SSL/TLS Certificate

Once DNS is configured:
1. Host Africa usually provides **free Let's Encrypt SSL**
2. Your site will automatically have HTTPS support
3. No additional configuration needed

## Current Accessibility

✓ **HTTP:** http://old-dog-systems.co.za (working)
✓ **HTTPS:** https://old-dog-systems.co.za (may show warning during DNS propagation)

## Troubleshooting DNS

### Site still shows old page after DNS change
- Clear browser cache: **Ctrl+Shift+Del**
- Wait up to 48 hours for DNS propagation
- Check with online tools: dnschecker.org

### DNS not propagating
- Verify you used correct Host Africa nameservers
- Check your registrar updated the records
- Wait the full TTL time (usually 24-48 hours)

### Render.com site still showing
- Update DNS to point away from Render
- Keep Render as backup for up to 48 hours
- Can revert DNS if critical issues

## After DNS is Fully Configured

Once DNS is live (24-48 hours):

1. **Test certificate:**
   ```bash
   curl -I https://old-dog-systems.co.za
   ```
   Should show valid SSL certificate

2. **Verify email functionality:**
   - Check contact forms deliver emails
   - Test SMTP if using backend

3. **Monitor for issues:**
   - Check server logs
   - Test all payment integrations
   - Verify databases are accessible

## Keeping Render.com as Backup

For first 48 hours, you can:
1. Keep Render deployment active
2. GitHub repo still linked to Render
3. If critical issues found, revert DNS to Render
4. This gives you safety during transition

## Email Accounts Ready

Email accounts are already set up and can be used:
- **info@old-dog-systems.co.za** - info@old-dog-systems.co.za / log26M1KB9v2
- **sales@old-dog-systems.co.za** - sales@old-dog-systems.co.za / AF8HgZj17RAr

IMAP/SMTP servers: mail.old-dog-systems.co.za (ports 993/465)

## Summary Checklist

- [ ] Identified domain registrar
- [ ] Got Host Africa nameservers/IP
- [ ] Updated nameservers at registrar
- [ ] Verified DNS propagation (24-48h)
- [ ] Tested HTTPS access
- [ ] Confirmed images display correctly
- [ ] Tested contact forms
- [ ] Monitored for first 48h
- [ ] Decommissioned Render if stable

## Support Resources

- **Host Africa Support:** support@hostnafrica.co.za
- **DNS Propagation Checker:** dnschecker.org
- **SSL Certificate Checker:** ssllabs.com
- **Whois Lookup:** whois.com

---
**Last Updated:** March 14, 2026
**Status:** Website Live - Awaiting DNS Configuration
