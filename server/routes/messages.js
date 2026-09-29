const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/messages/send
// Send an email notification
router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Configure the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 1. Email to the Admin (vmohammedhashim@gmail.com)
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    });

    const adminMailOptions = {
      from: `"Aetherion Live Chat" <${process.env.EMAIL_USER}>`,
      to: 'vmohammedhashim@gmail.com',
      subject: `💬 ${subject || 'New Live Chat Message'} — ${name || 'Anonymous'}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #080808; color: #f4f4f5; border: 1px solid #222; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #111 0%, #1a1a1a 100%); padding: 24px 30px; border-bottom: 2px solid #D4AF37;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <h1 style="color: #D4AF37; margin: 0 0 4px 0; font-size: 20px; letter-spacing: 3px; font-weight: 900;">AETHERION MOTORS</h1>
                  <p style="color: #666; margin: 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Real-Time Live Chat Notification</p>
                </td>
                <td style="text-align: right;">
                  <div style="background: #D4AF37; border-radius: 50px; padding: 6px 14px; display: inline-block;">
                    <span style="color: #000; font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">🔴 LIVE</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Sender Info -->
          <div style="padding: 24px 30px 0 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #111; border-radius: 10px; overflow: hidden; border: 1px solid #222;">
              <tr>
                <td style="padding: 18px 20px; border-bottom: 1px solid #1e1e1e;">
                  <span style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">From</span>
                  <p style="color: #fff; margin: 4px 0 0 0; font-size: 15px; font-weight: 700;">${name || 'Anonymous Guest'}</p>
                </td>
                <td style="padding: 18px 20px; border-bottom: 1px solid #1e1e1e;">
                  <span style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                  <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 13px;">${email || 'Not provided'}</p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 18px 20px;">
                  <span style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Received At</span>
                  <p style="color: #aaa; margin: 4px 0 0 0; font-size: 12px;">⏰ ${timestamp}</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- Message Body -->
          <div style="padding: 20px 30px;">
            <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">💬 Message</p>
            <div style="background: linear-gradient(135deg, #111 0%, #141414 100%); padding: 20px 22px; border-radius: 10px; border-left: 4px solid #D4AF37; border: 1px solid #1e1e1e; border-left: 4px solid #D4AF37;">
              <p style="color: #eee; margin: 0; line-height: 1.9; font-size: 14px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #0d0d0d; padding: 16px 30px; text-align: center; color: #444; font-size: 11px; border-top: 1px solid #1a1a1a;">
            &copy; ${new Date().getFullYear()} Aetherion Motors Sovereign Luxury &nbsp;|&nbsp; Real-Time Notification System
          </div>
        </div>
      `
    };

    // 2. Auto-reply to the User (if email is provided)
    const userMailOptions = {
      from: `"Aetherion Concierge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Message Received - Aetherion Motors`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #f4f4f5; border: 1px solid #333; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #111; padding: 20px; border-bottom: 2px solid #D4AF37; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px;">AETHERION MOTORS</h1>
            <p style="color: #999; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Concierge Services</p>
          </div>
          <div style="padding: 30px;">
            <p style="color: #ccc; line-height: 1.6;">Dear ${name || 'Client'},</p>
            <p style="color: #ccc; line-height: 1.6;">Thank you for contacting Aetherion Motors Luxury. We have securely received your message and our Sovereign Relationship Managers will review it shortly.</p>
            
            <div style="background-color: #111; padding: 20px; border-radius: 5px; margin: 30px 0; border-left: 4px solid #D4AF37;">
              <p style="color: #999; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Message:</p>
              <p style="color: #eee; margin: 0; line-height: 1.8; font-style: italic;">"${message}"</p>
            </div>
            
            <p style="color: #ccc; line-height: 1.6;">If your inquiry requires immediate assistance, please schedule a VIP consultation through our platform.</p>
            <p style="color: #D4AF37; margin-top: 30px;">Best Regards,<br><strong>Aetherion AI Concierge</strong></p>
          </div>
          <div style="background-color: #111; padding: 15px; text-align: center; color: #666; font-size: 11px;">
            &copy; ${new Date().getFullYear()} Aetherion Motors Sovereign Luxury. Do not reply directly to this automated email.
          </div>
        </div>
      `
    };

    // Attempt to send emails
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Send to Admin
      await transporter.sendMail(adminMailOptions);
      
      // Send to User if email exists
      if (email) {
        await transporter.sendMail(userMailOptions);
      }
      
      res.status(200).json({ success: true, message: 'Message sent securely.' });
    } else {
      console.error('Nodemailer Error: EMAIL_USER or EMAIL_PASS not configured in .env');
      // If no credentials, simulate success so frontend doesn't crash, but log error
      res.status(200).json({ success: true, warning: 'Email logged but not sent due to missing SMTP credentials.' });
    }

  } catch (err) {
    console.error('Email Send Error:', err);
    res.status(500).json({ error: 'Failed to dispatch email. Please try again later.' });
  }
});


// In-memory OTP store { email: { code, expiresAt } }
const otpStore = {};

// POST /api/messages/forgot-password
// Generates a 6-digit OTP and sends a reset email to the user
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore[email.toLowerCase()] = { code: otp, expiresAt };

    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_16_character_app_password_here') {
      return res.status(500).json({ error: 'Server email not configured. Please add EMAIL_PASS (Google App Password) in the server/.env file.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetMailOptions = {
      from: `"Aetherion Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Password Reset Code — Aetherion Motors`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080808; color: #f4f4f5; border: 1px solid #222; border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #111 0%, #1c1c1c 100%); padding: 28px 32px; border-bottom: 2px solid #D4AF37; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0 0 6px 0; font-size: 22px; letter-spacing: 4px; font-weight: 900;">AETHERION MOTORS</h1>
            <p style="color: #555; margin: 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Account Security System</p>
          </div>

          <!-- Body -->
          <div style="padding: 36px 32px;">
            <p style="color: #aaa; font-size: 13px; line-height: 1.7; margin: 0 0 24px 0;">
              We received a password reset request for the account associated with this email address. Use the verification code below to proceed.
            </p>

            <!-- OTP Code Block -->
            <div style="background: linear-gradient(135deg, #111 0%, #161616 100%); border: 1px solid #2a2a2a; border-left: 4px solid #D4AF37; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px;">
              <p style="color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 14px 0;">Your Verification Code</p>
              <p style="color: #D4AF37; font-size: 42px; font-weight: 900; letter-spacing: 14px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
              <p style="color: #444; font-size: 10px; margin: 14px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">⏳ Expires in 10 minutes</p>
            </div>

            <!-- Info Grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f0f0f; border-radius: 10px; overflow: hidden; border: 1px solid #1e1e1e; margin-bottom: 24px;">
              <tr>
                <td style="padding: 14px 18px; border-right: 1px solid #1e1e1e;">
                  <span style="color: #444; font-size: 9px; text-transform: uppercase; letter-spacing: 1px;">Requested For</span>
                  <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 12px;">${email}</p>
                </td>
                <td style="padding: 14px 18px;">
                  <span style="color: #444; font-size: 9px; text-transform: uppercase; letter-spacing: 1px;">Request Time</span>
                  <p style="color: #888; margin: 4px 0 0 0; font-size: 11px;">${timestamp}</p>
                </td>
              </tr>
            </table>

            <p style="color: #444; font-size: 11px; line-height: 1.7; margin: 0;">
              If you did not request this password reset, please ignore this email. Your account remains secure and no changes have been made.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #0a0a0a; padding: 16px 32px; text-align: center; color: #333; font-size: 10px; border-top: 1px solid #1a1a1a;">
            &copy; ${new Date().getFullYear()} Aetherion Motors Sovereign Luxury &nbsp;|&nbsp; This is an automated security email.
          </div>
        </div>
      `
    };

    await transporter.sendMail(resetMailOptions);
    return res.status(200).json({ success: true, message: 'Reset code sent to your email.' });

  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ error: `Failed to send reset email: ${err.message}` });
  }
});

// POST /api/messages/verify-otp
// Verifies the OTP code entered by the user
router.post('/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required.' });

  const record = otpStore[email.toLowerCase()];
  if (!record) return res.status(400).json({ error: 'No reset request found for this email.' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email.toLowerCase()];
    return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
  }
  if (record.code !== code.trim()) return res.status(400).json({ error: 'Invalid code. Please try again.' });

  // Code is valid — clear it
  delete otpStore[email.toLowerCase()];
  return res.status(200).json({ success: true, message: 'Code verified successfully.' });
});

module.exports = router;
