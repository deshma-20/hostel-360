# Password Reset Setup Guide 🔐

## Overview
The forgot password feature uses **Resend** email service to send password reset links via Gmail. When a user forgets their password, they can receive a secure reset link via email.

---

## 📧 Step 1: Get Resend API Key

### Option A: Using Resend (Recommended - Free)

1. **Sign up for Resend**
   - Go to [https://resend.com](https://resend.com)
   - Click "Sign Up" and create a free account
   - Free tier includes: **100 emails/day** and **3,000 emails/month**

2. **Get your API Key**
   - After signing up, go to [https://resend.com/api-keys](https://resend.com/api-keys)
   - Click "Create API Key"
   - Give it a name like "Hostel Management"
   - Copy the API key (starts with `re_...`)

3. **Add to .env file**
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### Option B: Custom Domain (Optional - For Production)

If you want to send from your own domain instead of `onboarding@resend.dev`:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually 5-10 minutes)
6. Update `server/email.ts` line 17:
   ```typescript
   from: 'Hostel Management <noreply@yourdomain.com>',
   ```

---

## 🔧 Step 2: Configure Environment Variables

Make sure your `.env` file has these settings:

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_9GNpxBCQHF8q@ep-patient-surf-ahrcvf9i-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Port Configuration
PORT=5001

# Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# Application URL (change in production)
APP_URL=http://localhost:5174
```

**For production**, update `APP_URL` to your actual domain:
```env
APP_URL=https://yourdomain.com
```

---

## 🗄️ Step 3: Update Database Schema

The database schema already includes the required fields:
- `resetToken` - stores the secure reset token
- `resetTokenExpiry` - token expires after 1 hour

To apply the schema changes to your Neon database:

```bash
npm run db:push
```

---

## 🚀 Step 4: Test the Feature

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Forgot Password Flow

1. **Go to Login Page**
   - Navigate to `http://localhost:5174/login`

2. **Click "Forgot Password?"**
   - Link appears above the password field

3. **Enter Your Email**
   - Enter the email address you used during registration
   - Click "Send Reset Link"

4. **Check Your Email**
   - Check your inbox (and spam folder)
   - You should receive an email with the subject: "Reset Your Password - Hostel Management System"

5. **Click Reset Link**
   - Click the "Reset Password" button in the email
   - Or copy/paste the link into your browser

6. **Set New Password**
   - Enter your new password (minimum 6 characters)
   - Confirm the password
   - Click "Reset Password"

7. **Login with New Password**
   - You'll be redirected to the login page
   - Use your new password to log in

---

## 📝 How It Works

### User Flow
```
1. User clicks "Forgot Password?" on login page
2. User enters their email address
3. System generates secure random token (32 bytes)
4. Token is stored in database with 1-hour expiry
5. Email sent with reset link containing token
6. User clicks link → opens reset password page
7. User enters new password
8. System validates token and expiry
9. Password is hashed with bcrypt and updated
10. Token is cleared from database
11. Confirmation email sent (optional)
12. User redirected to login
```

### Security Features
- **Secure tokens**: 32-byte random tokens (256-bit entropy)
- **Time-limited**: Tokens expire after 1 hour
- **One-time use**: Tokens are cleared after password reset
- **Email enumeration prevention**: Same response whether email exists or not
- **Bcrypt hashing**: Passwords hashed with 10 salt rounds
- **HTTPS ready**: Works with SSL in production

---

## 🎨 Email Template

The password reset email includes:
- Professional gradient design matching your app
- Clear "Reset Password" button
- Copy-pasteable backup link
- Security notice about 1-hour expiration
- Warning if user didn't request reset

**Confirmation email** is sent after successful password change to alert users of account changes.

---

## 🔍 Troubleshooting

### Email not received?
1. **Check spam/junk folder**
2. **Verify RESEND_API_KEY is set correctly** in `.env`
3. **Check server logs** for email sending errors
4. **Verify email address** is correct and registered
5. **Check Resend dashboard**: [https://resend.com/emails](https://resend.com/emails)

### "Invalid or expired token" error?
1. **Token expired**: Links are valid for 1 hour only
2. **Token already used**: Each token can only be used once
3. **Request new reset link** from forgot password page

### Server errors?
1. **Check .env file** - ensure all variables are set
2. **Restart server** - run `npm run dev` again
3. **Check database** - verify schema is up to date with `npm run db:push`
4. **Check Drizzle Studio** - open `npm run db:studio` to view database

---

## 📊 Database Fields

The `users` table includes:

```typescript
{
  resetToken: string | null;          // Secure random token
  resetTokenExpiry: Date | null;      // Expiry timestamp (1 hour)
}
```

These fields are automatically managed:
- Set when user requests password reset
- Cleared after successful password change
- Expired tokens are rejected

---

## 🌐 Production Deployment

When deploying to production:

1. **Update APP_URL** in `.env`:
   ```env
   APP_URL=https://yourdomain.com
   ```

2. **Use custom domain** with Resend:
   - Verify your domain in Resend dashboard
   - Update email "from" address in `server/email.ts`

3. **Enable HTTPS**:
   - Password reset links will use HTTPS automatically
   - Ensure your hosting supports SSL

4. **Monitor email sending**:
   - Check Resend dashboard for delivery status
   - Set up webhooks for bounce/complaint handling

5. **Consider rate limiting**:
   - Add rate limiting to prevent abuse
   - Limit password reset requests per IP/email

---

## 🎯 API Endpoints

### POST /api/auth/forgot-password
Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### POST /api/auth/reset-password
Request body:
```json
{
  "token": "abc123...",
  "newPassword": "newSecurePassword123"
}
```

Response:
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

---

## ✅ Testing Checklist

- [ ] Resend API key added to `.env`
- [ ] Database schema updated (`npm run db:push`)
- [ ] Server restarted with `npm run dev`
- [ ] Login page shows "Forgot password?" link
- [ ] Forgot password page loads at `/forgot-password`
- [ ] Email sent when valid email entered
- [ ] Email received in inbox (check spam too)
- [ ] Reset link opens reset password page
- [ ] New password can be set (min 6 chars)
- [ ] Password mismatch shows error
- [ ] Expired token shows error (wait 1+ hour)
- [ ] Used token shows error (use same link twice)
- [ ] Login works with new password
- [ ] Confirmation email received (optional)

---

## 🆘 Support

If you need help:
1. Check server terminal for error messages
2. Check browser console (F12) for errors
3. Verify `.env` file has correct API key
4. Check Resend dashboard for email logs
5. Test with different email addresses

**Free tier limits**: 100 emails/day, 3,000/month - more than enough for hostel use!
