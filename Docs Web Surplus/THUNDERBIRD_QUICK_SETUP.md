# Thunderbird Email Alerts - Quick Setup (5 Minutes)

## ⚡ Super Quick Setup

### Step 1: Open Thunderbird Settings
```
Menu (≡) → Settings → General → Notifications
```

### Step 2: Enable Alerts
Check these boxes:
- ☑ **Play a sound** 
- ☑ **Show an alert** (popup notification)

### Step 3: Choose Sound
Click "Choose..." button and pick:
- **For important emails:** `/usr/share/sounds/freedesktop/stereo/complete.oga`
- **For regular emails:** `/usr/share/sounds/freedesktop/stereo/message.oga`

Click **Play** to test the sound.

### Step 4: Configure Each Email Account
Right-click account in left sidebar → Settings → Notifications
- Repeat steps 1-3 for each account

### Step 5: Test It!
Send yourself an email from your phone or another account.

**You should see:**
- ✓ Sound plays
- ✓ Desktop popup appears with sender name & subject
- ✓ Notification appears even if Thunderbird is minimized

---

## 🎯 For One-Man Operation (IMPORTANT)

### Filter for Critical Emails
This ensures you NEVER miss sales/customer inquiries:

**Create Message Filter:**
1. **Tools → Message Filters** (or `Ctrl+Shift+D`)
2. Click **New**
3. Set up like this:

```
IF    (from contains "sales") OR (from contains "contact") OR (subject contains "order")
THEN  Play Sound: /usr/share/sounds/freedesktop/stereo/complete.oga (LOUD)
      Move to Folder: [Important]
```

4. Click **OK**

Now important emails get a **LOUD** distinctive sound + moved to special folder.

---

## 🔧 Advanced: Different Sounds for Different Email Types

### Setup Two Filters:

**Filter 1 - HIGH PRIORITY (Sales/Payments)**
```
Conditions: From contains "sales@old-dog-systems" OR From contains "stripe" OR From contains "lemonSqueezy"
Action: Play Sound: /usr/share/sounds/freedesktop/stereo/complete.oga
        Move to: Important
```
Result: LOUD BEEP ✓

**Filter 2 - NORMAL PRIORITY (Everything else)**
```
Conditions: All messages (no condition)
Action: Play Sound: /usr/share/sounds/freedesktop/stereo/message.oga
```
Result: Soft chime ✓

---

## 📱 When Away from Desk

### Option A: Mobile Sync
Install Thunderbird for Android on your phone:
- Google Play: "Thunderbird"
- Syncs email automatically
- Push notifications on phone

### Option B: Forward Critical Emails
Create a filter:
```
IF From: sales@old-dog-systems.co.za
THEN Forward to: your-phone-email@gmail.com
```

This way your phone gets instant email (with its native notifications).

---

## ✅ Verification Checklist

- [ ] Thunderbird settings → Notifications enabled
- [ ] Sound playing works (tested)
- [ ] Desktop popup appears (tested)
- [ ] Test email received with alert
- [ ] Sound played when email arrived
- [ ] Popup showed sender & subject
- [ ] Created filter for important emails
- [ ] Different sounds configured (if wanted)

---

## 🆘 Troubleshooting

### No Sound Playing?
```bash
# Test sound manually:
paplay /usr/share/sounds/freedesktop/stereo/complete.oga

# Check volume:
pamixer --get-volume
```

If volume is 0, increase it:
```bash
pamixer --increase 20
```

### No Popup Notification?
1. Check Thunderbird Preferences (step 2 above)
2. Open System Settings → Notifications → Thunderbird
3. Enable "Show Popup"

### Still Nothing?
Run this test:
```bash
/mnt/Master_Storage/Project\ Folders/Old_Dog_Web/setup-thunderbird-alerts.sh
```

This will diagnose your system.

---

## 📞 Your Email Accounts

**Your work accounts set up in Thunderbird:**
- info@old-dog-systems.co.za
- sales@old-dog-systems.co.za

**Make sure both have notifications enabled!**

---

## 🎓 Pro Tips

1. **Keep Thunderbird in System Tray**
   - Right-click Thunderbird window
   - Select "Minimize to Tray"
   - Notifications still work in background

2. **Test Regularly**
   - Send yourself test email weekly
   - Verify notification system still works

3. **Use Star/Flag for Follow-ups**
   - When critical email arrives, flag it
   - Keep a starred folder for action items

4. **Check Spam/Junk Folder**
   - Important customer emails sometimes go to spam
   - Review daily (or set filter to not spam important senders)

---

## 🚀 You're All Set!

With this setup, you'll **never miss an important email** as a one-man operation.

- Sound + visual notification = 💯 guaranteed to notice
- Different sounds for different priorities = easier to respond appropriately
- Message filters = automated organization

**Happy emailing!** ✓

---

If issues, reference: `Docs Web Surplus/THUNDERBIRD_NOTIFICATIONS_SETUP.md`
