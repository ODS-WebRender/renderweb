# Thunderbird Notifications on Fedora 43 KDE - Complete Setup

## ✅ Good News: You're Already Set Up!

Your system has:
- ✓ **KDE Plasma Notifications** (built-in, auto-managed)
- ✓ **PipeWire/PulseAudio** (audio working)
- ✓ **notify-send** (tested and working)

**You don't need to install anything!**

---

## 🎯 What To Do Now: Configure Thunderbird (10 Minutes)

### Step 1: Open Thunderbird Settings
1. Click the **Menu button** (three horizontal lines ≡) in top-right
2. Select **Settings**
3. Click **General** tab on left sidebar

### Step 2: Go to Notifications Section
1. In General settings, scroll down to **Notifications**
2. You'll see options for email alerts

### Step 3: Enable Sound Alert
Look for: **"When new messages arrive"**

✓ Check box: **Play a sound**
- Click **Choose...** to pick a sound file
- Good options:
  - `/usr/share/sounds/freedesktop/stereo/complete.oga` (LOUD - for important)
  - `/usr/share/sounds/freedesktop/stereo/message.oga` (soft - for regular)
- Click the **Play button** to test

✓ Check box: **Show an alert**
- This creates a desktop notification popup
- KDE will automatically display it in your notification area

### Step 4: Verify Settings
You should see checkmarks next to:
- ☑ Play a sound
- ☑ Show an alert

### Step 5: Repeat for Each Email Account
Important! Do this for BOTH accounts:
- **info@old-dog-systems.co.za**
- **sales@old-dog-systems.co.za**

Steps:
1. In Thunderbird left sidebar, right-click the account name
2. Select **Settings**
3. Go to **Notifications** in left menu
4. Repeat steps 3-4 above

### Step 6: Test It!
1. Keep Thunderbird open
2. Send yourself an email from your phone or webmail
3. You should:
   - ✓ See email appear in inbox
   - ✓ Hear a sound play
   - ✓ See KDE notification popup
   - ✓ Notification shows sender name & subject

---

## 🔔 The Three-Level Alert System

When you've configured everything properly, you get three notification signals:

**Level 1: Sound** 🔊
- Plays immediately when email arrives
- Even if Thunderbird is minimized
- Clear, distinctive tone

**Level 2: Visual Popup** 👁️
- KDE notification appears on screen
- Shows sender & email subject
- Stays visible for ~5 seconds
- Can click to open email

**Level 3: Inbox** 📬
- Email appears in your inbox
- Can star/flag important ones
- Use for follow-up action

With all three, you're **guaranteed to notice important emails** ✓

---

## 🎬 Optional: Advanced Setup

### Create Filters for Different Email Types

Want different sounds for sales emails vs. regular emails?

**Step 1: Create Filter**
1. In Thunderbird menu: **Tools → Message Filters**
   - (Or press `Ctrl+Shift+D`)
2. Click **New**

**Step 2: Set Conditions**
```
IF  From contains "sales@old-dog-systems"
    OR From contains "customer"
    OR Subject contains "order"
```

**Step 3: Set Actions**
```
THEN  Play Sound: /usr/share/sounds/freedesktop/stereo/complete.oga
      AND Move to Folder: Important
```

**Result:** Important sales emails get a LOUD sound + moved to a special folder

### Create Separate Filter for Regular Emails
Repeat with:
```
IF  All Messages (no condition - catch everything else)
THEN  Play Sound: /usr/share/sounds/freedesktop/stereo/message.oga
```

**Result:** You learn to recognize different sounds = better response time

---

## 🖥️ KDE System Settings Configuration

This is **optional** (Thunderbird will work without it), but you can customize the appearance:

1. Open **System Settings** (press Super/Windows key, type "settings")
2. Search for **"Notifications"**
3. Click **Notifications** → **Configure**
4. Look for **Thunderbird** in the app list
5. Configure:
   - ☑ Show notification
   - ☑ Show banner (non-intrusive popup)
   - Duration: 5-10 seconds
   - Position: Top-right or bottom-right

That's it! Now your notifications will appear in YOUR preferred location.

---

## 🆘 Troubleshooting

### Issue: No Sound Playing

**Solution:**
```bash
# Test Thunderbird notification sound manually
paplay /usr/share/sounds/freedesktop/stereo/complete.oga
```

If you hear it: Sound system is OK, check Thunderbird settings again

If you don't hear it: Adjust volume:
```bash
# Check current volume
pamixer --get-volume

# Increase volume if needed
pamixer --increase 20
```

### Issue: No Desktop Popup Appearing

**Solution:**
1. Open **System Settings → Notifications**
2. Search for **Thunderbird**
3. Make sure **Show notification** is checked ☑
4. Make sure **Show banner** is checked ☑
5. Click **Apply**

### Issue: Getting Too Many Notifications

**Solution:** Create a filter to only alert on important emails:

```
IF  From: sales@old-dog-systems.co.za
    OR From: partner@*
    OR From: customer@*
THEN  Play a sound + Move to Important
```

All other emails will be silent but still arrive in inbox (you can check later).

### Issue: Email Arrives But No Sound/Popup

**Typical Cause:** Thunderbird notifications NOT configured for that account

**Solution:**
1. In Thunderbird, right-click the email account
2. Select **Settings**
3. Go to **Notifications**
4. Enable "Play a sound" and "Show an alert"
5. Test again

---

## 🚀 Quick Verification Checklist

Before declaring victory, verify:

- [ ] Opened Thunderbird Settings
- [ ] Found Notifications section
- [ ] Checked "Play a sound"
- [ ] Checked "Show an alert"
- [ ] Selected a sound file
- [ ] Clicked Play button (heard sound? ✓)
- [ ] Configured BOTH email accounts
- [ ] Sent yourself a test email
- [ ] Heard sound when email arrived ✓
- [ ] Saw desktop popup notification ✓
- [ ] Clicked notification to open email ✓

If all checked: **You're done!** 🎉

---

## 📱 Bonus: Mobile Alerts (Optional)

Want to be alerted even when away from your computer?

### Option A: Forward to Phone
Create a filter:
```
IF  From: sales@old-dog-systems.co.za
THEN  Forward to: yourphone@gmail.com
```

Your phone gets the email + its own native notification 📱

### Option B: Thunderbird for Android
1. Install **Thunderbird** on your Android phone (Google Play)
2. Add same email accounts
3. Get push notifications
4. Full email sync

---

## 🎓 Pro Tips

**1. Keep Thunderbird Minimized to Tray**
- Right-click Thunderbird window
- Select "Minimize to Tray"
- Thunderbird runs in background
- Notifications still appear on top

**2. Use System Tray Icon**
- Click Thunderbird tray icon to open
- Close window to minimize (not quit)
- Much faster than reopening

**3. Test Weekly**
- Send yourself a test email each week
- Verify notifications still working
- Catch any issues early

**4. Check Spam Folder**
- Some customer emails go to spam
- Review spam folder daily initially
- Add important senders to contacts to prevent spam

**5. Use Flags/Stars**
- Star important emails for follow-up
- Use "important" label/folder
- Thunderbird can search starred emails quickly

---

## ✨ Final Result

After these simple steps, you'll have:

✅ **Audio alerts** - You'll HEAR when important emails arrive  
✅ **Visual popups** - You'll SEE the notification on your screen  
✅ **Smart filtering** - Different sounds for different types  
✅ **Never miss** - As a one-man operation, critical emails won't slip by  

**Total setup time: 10 minutes**  
**Value: Never losing a sale/customer inquiry again** 💰

---

## Questions?

Reference: `Docs Web Surplus/THUNDERBIRD_QUICK_SETUP.md` (short version)

Your system is ready. Just configure Thunderbird and you're golden! ✓
