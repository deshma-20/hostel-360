# Gmail Setup for Password Reset (EASIEST OPTION) 📧

Since Resend.com is having issues, use Gmail instead! It works immediately and is 100% free.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** in the left menu
3. Find **2-Step Verification** (under "Signing in to Google")
4. Click **Get Started** and follow the steps
5. Complete the 2-step verification setup

### Step 2: Generate App Password

1. **After** enabling 2-step verification, go to: https://myaccount.google.com/apppasswords
2. You'll see "App passwords" page
3. Click **Select app** → Choose **Other (Custom name)**
4. Type: **Hostel Management**
5. Click **Generate**
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
7. Click **Done**

### Step 3: Update .env File

Open `.env` file and update these lines:

```env
# Email Configuration - Gmail SMTP
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Example:**
```env
GMAIL_USER=deshma2005@gmail.com
GMAIL_APP_PASSWORD=qwer tyui asdf ghjk
```

**Note:** Remove spaces from the app password when pasting!

### Step 4: Restart Server

```bash
npm run dev
```

---

## ✅ Test It Now!

1. Go to login page: http://localhost:5174/login
2. Click **"Forgot password?"**
3. Enter your registered email (e.g., `deshma2005@gmail.com`)
4. Click **"Send Reset Link"**
5. Check your Gmail inbox!

---

## 🎯 What Emails Will Be Sent?

### From Address
- **Your Gmail**: `deshma2005@gmail.com` (or whatever you set)
- **Display Name**: "Hostel Management"

### To Address
- The user's registered email address

### Email Types
1. **Password Reset Email** - Beautiful HTML email with reset link
2. **Password Changed Confirmation** - Sent after successful reset

---

## 🔧 Troubleshooting

### "Invalid credentials" error?
- ✅ Make sure 2-Step Verification is enabled
- ✅ Use App Password, NOT your Gmail password
- ✅ Remove spaces from the 16-character app password
- ✅ App password format: `abcdefghijklmnop` (no spaces)

### Email not received?
- ✅ Check spam/junk folder
- ✅ Verify email address is correct in database
- ✅ Check server logs for errors
- ✅ Make sure server restarted after .env changes

### "App passwords" option not showing?
- ✅ You MUST enable 2-Step Verification first
- ✅ Wait a few minutes after enabling 2-step
- ✅ Try this direct link: https://myaccount.google.com/apppasswords

### Still not working?
1. Check `.env` file has no typos
2. Restart the server: `Ctrl+C` then `npm run dev`
3. Check terminal for error messages
4. Test with a different email address

---

## 🔒 Security Notes

✅ **App Password is safe**: It's NOT your Gmail password
✅ **Limited access**: Only works for sending emails
✅ **Can be revoked**: Delete it anytime from Google Account settings
✅ **No risk**: If compromised, just delete it and create a new one

---

## 💡 Why Gmail Instead of Resend?

| Feature | Gmail SMTP | Resend |
|---------|-----------|--------|
| Setup Time | 5 minutes | 5 minutes |
| Signup Required | No (you already have Gmail) | Yes (new account) |
| Free Emails/Day | ~500 emails/day | 100 emails/day |
| Works Now | ✅ YES | ❌ Site error |
| Custom Domain | No | Yes (requires DNS) |
| Cost | FREE forever | FREE tier available |

**For a hostel management system**, Gmail is perfect because:
- You won't send many password reset emails per day
- Students already trust emails from Gmail
- No additional signup or configuration needed
- Works immediately!

---

## 📝 Complete .env Example

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_9GNpxBCQHF8q@ep-patient-surf-ahrcvf9i-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Port Configuration
PORT=5001

# Email Configuration - Gmail SMTP
GMAIL_USER=deshma2005@gmail.com
GMAIL_APP_PASSWORD=qwertyuiasdfghjk

# Application URL
APP_URL=http://localhost:5174
```

---

## 🎉 You're Done!

After updating `.env` and restarting the server, your password reset feature will work perfectly with Gmail!

**Test users from LOGIN_CREDENTIALS.md:**
- student1@hostel.com (password: password123)
- deshma2005@gmail.com (your registered email)

Try resetting password for any of these accounts! 🚀
