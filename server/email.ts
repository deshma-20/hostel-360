import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend only if API key is provided
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Gmail SMTP transporter (alternative to Resend)
const gmailTransporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

// Log email service configuration on startup
if (gmailTransporter) {
  console.log('✅ Gmail SMTP configured:', process.env.GMAIL_USER);
} else if (resend) {
  console.log('✅ Resend API configured');
} else {
  console.warn('⚠️ No email service configured! Password reset will not work.');
  console.warn('⚠️ Set GMAIL_USER/GMAIL_APP_PASSWORD or RESEND_API_KEY in .env');
}

export interface SendPasswordResetEmailParams {
  to: string;
  resetToken: string;
  username: string;
}

export async function sendPasswordResetEmail({
  to,
  resetToken,
  username,
}: SendPasswordResetEmailParams) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">🏠 Hostel Management</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>We received a request to reset your password for your Hostel Management account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="background: white; padding: 12px; border-radius: 5px; word-break: break-all; font-size: 13px; border: 1px solid #ddd;">
            ${resetUrl}
          </p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Security Notice:</strong><br>
              This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Hostel Management Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
  `;

  try {
    // Try Gmail first if configured
    if (gmailTransporter) {
      console.log('📧 Sending password reset email via Gmail...');
      console.log('📧 From:', process.env.GMAIL_USER);
      console.log('📧 To:', to);
      
      await gmailTransporter.sendMail({
        from: `"Hostel Management" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Reset Your Password - Hostel Management System',
        html: emailHtml,
      });
      console.log('✅ Password reset email sent via Gmail successfully');
      return { success: true, provider: 'gmail' };
    }

    // Fallback to Resend
    if (process.env.RESEND_API_KEY && resend) {
      console.log('📧 Sending password reset email via Resend...');
      const { data, error } = await resend.emails.send({
        from: 'Hostel Management <onboarding@resend.dev>',
        to: [to],
        subject: 'Reset Your Password - Hostel Management System',
        html: emailHtml,
      });

      if (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('✅ Password reset email sent via Resend successfully:', data?.id);
      return { success: true, messageId: data?.id, provider: 'resend' };
    }

    throw new Error('No email service configured. Please set either GMAIL_USER/GMAIL_APP_PASSWORD or RESEND_API_KEY in .env');
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function sendPasswordChangedConfirmation(to: string, username: string) {
  const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">🏠 Hostel Management</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-top: 0;">✅ Password Changed Successfully</h2>
          
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>Your password has been changed successfully. You can now log in with your new password.</p>
          
          <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0c5460;">
              <strong>ℹ️ Important:</strong><br>
              If you didn't make this change, please contact support immediately to secure your account.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Hostel Management Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
  `;

  try {
    // Try Gmail first if configured
    if (gmailTransporter) {
      await gmailTransporter.sendMail({
        from: `"Hostel Management" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Password Changed Successfully - Hostel Management System',
        html: confirmationHtml,
      });
      console.log('✅ Password changed confirmation email sent via Gmail');
      return { success: true, provider: 'gmail' };
    }

    // Fallback to Resend
    if (process.env.RESEND_API_KEY && resend) {
      const { data, error } = await resend.emails.send({
        from: 'Hostel Management <onboarding@resend.dev>',
        to: [to],
        subject: 'Password Changed Successfully - Hostel Management System',
        html: confirmationHtml,
      });

      if (error) {
        console.error('❌ Failed to send confirmation email:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Password changed confirmation email sent via Resend:', data?.id);
      return { success: true, messageId: data?.id, provider: 'resend' };
    }

    return { success: false, error: 'No email service configured' };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return { success: false, error };
  }
}
