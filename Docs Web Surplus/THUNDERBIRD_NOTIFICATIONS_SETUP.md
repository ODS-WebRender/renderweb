# Thunderbird Notifications Setup - Fedora KDE
## Complete Email Alert System for One-Man Operation

---

## 🎯 Overview

Three-layer notification system:
1. **Thunderbird native notifications** (desktop popups)
2. **KDE notification system** (integrated notifications)
3. **Sound/audio alerts** (never miss an email)

---

## Part 1: Enable Thunderbird Native Notifications

### Step 1: Open Preferences
1. Click **Menu** (≡) in Thunderbird top-right
2. Select **Settings** (or press `Ctrl+,`)
3. Go to **General** → **Notifications**

### Step 2: Configure Alert Sound
In the **Notifications** tab:

- **☑ Play a sound** - Check this box
- Click **Choose...** button to select sound
- Pick a clear alert sound (search for "notification" sounds)
- **Click Play button** to test

Recommended sounds:
- `/usr/share/sounds/freedesktop/stereo/complete.oga`
- `/usr/share/sounds/freedesktop/stereo/message.oga`

### Step 3: Enable Desktop Alerts
- **☑ Show an alert** - Check this
- You'll get notification popups when emails arrive
- Set duration: **5 seconds** (or longer)

### Step 4: Configure for Each Account
Repeat settings for **each email account**:
1. Right-click account in left sidebar
2. Select **Settings**
3. Go to **Notifications**
4. Ensure notifications are enabled

---

## Part 2: KDE Desktop Integration

### Step 1: Enable KDE Notifications in Thunderbird
1. **Settings → General → Notifications**
2. Check **☑ Show notification when new messages arrive**

### Step 2: Configure KDE Notification Appearance
**On your desktop:**
1. Open **System Settings** (KDE System Settings)
2. Go to **Notifications** (or search for it)
3. Search for "Thunderbird" in the app list
4. **Thunderbird → Configure...**

**Options to set:**
- ✓ **Show in Notification Center** - Enable
- ✓ **Show Popup** - Enable  
- ✓ **Show as Banner** - Enable (non-intrusive popup)
- ✓ **Persistent Notification** - Optional (stays visible)
- **Sound effect** - Choose "Email" or "Message Received"
- **Duration** - 5-10 seconds

### Step 3: Test the Configuration
1. Send yourself a test email (from phone, Gmail, etc.)
2. Check if you see:
   - Sound plays ✓
   - Desktop popup appears ✓
   - Notification stays visible ✓

---

## Part 3: Advanced Setup - Don't Miss Critical Emails

### A. Sound Alert for Important Emails

**Step 1: Create a Mail Filter**
1. **Tools → Message Filters** (or `Ctrl+Shift+D`)
2. Click **New**
3. Set up filter example:

**For "sales" emails:**
- **If** from: `sales@*` or subject contains "order"
- **Then** do these actions:
  - **Play a sound** ✓
  - Choose loud/distinct sound
  - **Mark as read** (optional)

**Apply this filter for:**
- Customer inquiries (sales@, contact@, info@)
- Payment notifications
- System alerts

### Step 2: Use Different Sounds for Different Priorities
Create multiple filters:
- **High priority** (sales, payments) → Distinctive beep
- **Normal priority** (general emails) → Soft chime
- **Low priority** (newsletters) → No sound

---

## Part 4: Additional Tools for Maximum Reliability

### Option A: System Notification Daemon (Already Built-in)
KDE comes with notification daemon - just needs configuration.

### Option B: Desktop Entry Audio Notification
**Create a custom alert:**

1. Create file: `~/.local/share/sounds/email-alert.wav`
   (Download or convert your preferred sound)

2. In Thunderbird Filters, reference this sound

### Option C: Use Growl-like Notifications
**Install notification tooltip app:**
```bash
sudo dnf install notification-daemon
```

This provides enhanced notification bubbles that can:
- Stay longer on screen
- Show custom colors
- Include sender name
- Not disappear on mouse hover

---

## Part 5: Mobile/Remote Setup (For When Away from Desk)

### Option 1: Email to Telegram
If you need alerts when away from your computer:

1. **Set up IFTTT or similar service**
2. Forward critical emails to IFTTT trigger
3. Get instant Telegram/SMS notification

### Option 2: Thunderbird on Phone
- Install **Thunderbird for Android**
- Configure same accounts
- Get push notifications
- Keep working emails synced

### Option 3: Email Forwarding Rule
Create filter:
- **From:** Important contacts (sales, partners)
- **Forward to:** Your phone email address
- Phone notifies you instantly

---

## Part 6: Configuration Checklist

### ✓ Thunderbird Setup
- [ ] Enable sound alerts in Preferences
- [ ] Enable desktop popup alerts
- [ ] Test with sample email
- [ ] Configure for each email account
- [ ] Create message filters for important emails

### ✓ KDE System Settings
- [ ] Thunderbird notifications enabled
- [ ] Sound effects enabled
- [ ] Notification popup shown
- [ ] Banner style selected
- [ ] Duration set appropriately

### ✓ Quick Test
- [ ] Send test email
- [ ] Verify sound plays
- [ ] Verify popup appears
- [ ] Check it's visible from other windows
- [ ] Test from outside workspace

---

## Part 7: Fine-Tuning Your Alert System

### Volume Control
1. Go to **KDE System Settings → Audio Volume**
2. Set notification volume separately
3. Ensure it's higher than main volume

### Do Not Disturb Times
**Thunderbird → Preferences → Notifications**
- Set "Quiet Hours" if needed (optional)
- Example: 9 PM - 8 AM no sounds

### Critical Email Fast-Track
Create high-priority filter:
- From: `sales@old-dog-systems.co.za`
- Action: **Play sound** + **Mark important** + **Move to special folder**

---

## Part 8: Troubleshooting

### Problem: No Sound Playing
**Solution:**
1. Check volume: `pamixer --get-volume`
2. Test: `paplay /usr/share/sounds/freedesktop/stereo/complete.oga`
3. If no sound, reinstall: `sudo dnf install pulseaudio-utils`

### Problem: Notifications Don't Appear
**Solution:**
1. Check notification daemon running: `ps aux | grep notification`
2. Restart it: `killall notification-daemon && notification-daemon &`
3. Check Thunderbird notification settings enabled

### Problem: Missing Emails in Flood
**Solution:**
1. Use **Priority Inbox** feature
2. Star important senders
3. Create "VIP" folder for critical emails
4. Filter VIP emails to separate folder

### Problem: Sound Too Quiet
**Solution:**
1. **KDE Settings → Audio Volume → Alerts**
2. Increase notification sound separately
3. Or use louder sound file
4. Test: `paplay --volume=65536 /path/to/sound.oga`

---

## Part 9: Command-Line Monitoring (Bonus)

### Check Email from Terminal
If you want to monitor from terminal separately:

```bash
# Show new emails
thunderbird-cli check-mail

# Or use mail-notification daemon
sudo dnf install mail-notification
mail-notification --pop3 &
```

### System Tray Integration
1. Right-click Thunderbird window
2. **Minimize → System Tray**
3. Thunderbird runs in background
4. Notifications still appear

---

## Final Recommendations for Your Setup

Since you're a one-man operation:

### Priority 1 (Set Up First)
✅ Thunderbird sound alerts + KDE notifications  
✅ Message filters for sales/payments  
✅ Test thoroughly

### Priority 2 (Set Up Second)
✅ Different sounds for different email types  
✅ Important sender folder with filter  
✅ Mobile phone sync if you leave desk

### Priority 3 (Optional Enhancement)
⚪ Telegram/SMS forwarding  
⚪ Email-to-mobile gateway  
⚪ Calendar integration alerts

---

## Quick Start (5 Minutes)

```bash
# 1. Verify notification daemon is running
sudo systemctl status notification-daemon

# 2. Check Thunderbird settings are saved
# Menu → Preferences → General → Notifications ✓

# 3. Test with a sample email
# Send yourself an email

# 4. Verify:
# - Sound plays? ✓
# - Popup appears? ✓
# - Click notification to open? ✓
```

---

## Support & Testing

**To verify everything works:**
1. Open Thunderbird normally
2. Start working
3. Have someone (or use web email) send you an email
4. You should hear sound + see popup **immediately**

**To test system tray:**
```bash
# Minimize all windows
# Email should still alert you
# Click notification → opens Thunderbird
```

---

**You're now set up for sound alerts + visual notifications!**  
**You won't miss critical business emails.** ✓

Last Updated: March 15, 2026
