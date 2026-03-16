#!/bin/bash
# Thunderbird Notification Setup for Fedora KDE
# Run this to quickly verify your notification system

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║        Thunderbird Email Notifications - Quick Setup Verification          ║"
echo "║                        Fedora 43 KDE Desktop                              ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check 1: Desktop Notification
echo "1️⃣  Testing Desktop Notification System..."
notify-send "Thunderbird Alert Test" "If you see this popup, notifications are working!" --urgency=normal --icon=mail --app-name="Thunderbird Test"
echo "   ✓ Test notification sent (watch for popup)"
echo ""

# Check 2: Sound System
echo "2️⃣  Checking Audio System..."
if pactl list short sinks > /dev/null 2>&1; then
    echo "   ✓ PulseAudio/PipeWire is running"
    echo "   ✓ You should be able to play notification sounds"
else
    echo "   ✗ Audio system not responding"
    exit 1
fi
echo ""

# Check 3: Notification Sound Files
echo "3️⃣  Available Notification Sounds..."
echo "   Suggested sound files for Thunderbird alerts:"
if [ -d "/usr/share/sounds/freedesktop/stereo" ]; then
    echo ""
    echo "   High Priority (Sales/Payments):"
    ls -1 /usr/share/sounds/freedesktop/stereo/*complete* /usr/share/sounds/freedesktop/stereo/*alert* 2>/dev/null | head -2 | sed 's/^/     /'
    echo ""
    echo "   Normal Priority (Regular Emails):"
    ls -1 /usr/share/sounds/freedesktop/stereo/*message* /usr/share/sounds/freedesktop/stereo/*notification* 2>/dev/null | head -2 | sed 's/^/     /'
else
    echo "   No freedesktop sounds found (but Thunderbird has built-in sounds)"
fi
echo ""

# Check 4: KDE Notification Settings
echo "4️⃣  KDE Notification Configuration..."
echo "   Next steps:"
echo "     • Open System Settings → Notifications"
echo "     • Search for 'Thunderbird'"
echo "     • Enable: Show Popup, Show in Notification Center"
echo "     • Enable: Sound Effect"
echo ""

# Check 5: Thunderbird Configuration
echo "5️⃣  Thunderbird Email Configuration..."
echo "   In Thunderbird:"
echo "     • Click Menu (≡) → Settings"
echo "     • General → Notifications"
echo "     • ☑ Play a sound"
echo "     • ☑ Show an alert (notification popup)"
echo "     • Choose sound file (or use built-in)"
echo "     • Click: Test Sound"
echo ""

# Check 6: Test Email
echo "6️⃣  Final Verification..."
echo "   To test everything together:"
echo "     1. Keep Thunderbird open"
echo "     2. Send yourself a test email (from phone, web browser, etc.)"
echo "     3. You should see:"
echo "        ✓ Email in inbox"
echo "        ✓ Desktop popup notification"
echo "        ✓ Sound plays (if configured)"
echo ""

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                      ✓ Notifications Ready!                               ║"
echo "║                                                                            ║"
echo "║  For detailed setup, see:                                                  ║"
echo "║  → Docs Web Surplus/THUNDERBIRD_NOTIFICATIONS_SETUP.md                    ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
