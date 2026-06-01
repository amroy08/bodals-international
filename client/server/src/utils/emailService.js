const nodemailer = require('nodemailer');

/**
 * Email Service for BODAL'S INTERNATIONAL
 * Uses Nodemailer with SMTP credentials from environment variables.
 */

// Create reusable transporter (lazy-initialized)
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('⚠️  SMTP not configured — email sending is disabled. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  return transporter;
}

/**
 * Low-level send helper. Returns { success, error }.
 */
async function sendEmail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) return { success: false, error: 'SMTP not configured' };

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    await t.sendMail({ from, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send admin notification when a new enquiry arrives.
 */
async function sendAdminEnquiryNotification(enquiry) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('⚠️  ADMIN_EMAIL not set — skipping admin notification');
    return { success: false, error: 'ADMIN_EMAIL not set' };
  }

  const submittedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#0a1628,#1e3a8a);padding:30px 40px;text-align:center;">
        <h1 style="margin:0;color:#d4af37;font-size:22px;letter-spacing:2px;">BODAL'S INTERNATIONAL</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:3px;">WE CARE, WE COMMIT, WE CONNECT</p>
      </td>
    </tr>
    <!-- Title -->
    <tr>
      <td style="padding:30px 40px 10px;">
        <h2 style="margin:0;color:#0a1628;font-size:18px;">📩 New Enquiry Received</h2>
        <p style="margin:8px 0 0;color:#717182;font-size:13px;">A new enquiry has been submitted from the website.</p>
      </td>
    </tr>
    <!-- Details Table -->
    <tr>
      <td style="padding:15px 40px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          ${[
            ['Name', enquiry.name],
            ['Position', enquiry.position],
            ['Company', enquiry.company],
            ['Email', enquiry.email],
            ['Mobile', enquiry.mobile],
            ['City / Country', enquiry.city_country],
          ].filter(([, v]) => v).map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? '#fafaf7' : '#ffffff'};">
            <td style="padding:12px 16px;color:#717182;font-size:13px;width:140px;border-bottom:1px solid #f0f0f0;font-weight:600;">${label}</td>
            <td style="padding:12px 16px;color:#0a1628;font-size:13px;border-bottom:1px solid #f0f0f0;">${value}</td>
          </tr>`).join('')}
          <tr style="background:#fafaf7;">
            <td colspan="2" style="padding:12px 16px;">
              <div style="color:#717182;font-size:13px;font-weight:600;margin-bottom:6px;">Message</div>
              <div style="color:#0a1628;font-size:13px;line-height:1.6;white-space:pre-wrap;">${enquiry.message}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Timestamp -->
    <tr>
      <td style="padding:0 40px 30px;">
        <p style="margin:0;color:#717182;font-size:12px;">📅 Submitted: ${submittedDate}</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#0a1628;padding:20px 40px;text-align:center;">
        <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:1px;">BODAL'S INTERNATIONAL</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:11px;">This is an automated notification from your website.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({
    to: adminEmail,
    subject: "New Enquiry Received - BODAL'S INTERNATIONAL",
    html
  });
}

/**
 * Send auto-reply confirmation to the customer.
 */
async function sendCustomerAutoReply(enquiry) {
  if (!enquiry.email) return { success: false, error: 'No customer email' };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#0a1628,#1e3a8a);padding:30px 40px;text-align:center;">
        <h1 style="margin:0;color:#d4af37;font-size:22px;letter-spacing:2px;">BODAL'S INTERNATIONAL</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:3px;">WE CARE, WE COMMIT, WE CONNECT</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:35px 40px;">
        <h2 style="margin:0 0 15px;color:#0a1628;font-size:18px;">Thank you for contacting us!</h2>
        <p style="margin:0 0 15px;color:#333;font-size:14px;line-height:1.7;">
          Dear <strong>${enquiry.name}</strong>,
        </p>
        <p style="margin:0 0 15px;color:#333;font-size:14px;line-height:1.7;">
          Thank you for your enquiry. We have received your message and our team will review it promptly. 
          You can expect to hear back from us within <strong>one business day</strong>.
        </p>
        <p style="margin:0 0 15px;color:#333;font-size:14px;line-height:1.7;">
          If your matter is urgent, feel free to reach us directly:
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
          <tr>
            <td style="padding:6px 0;color:#717182;font-size:13px;width:70px;">📞 Phone:</td>
            <td style="padding:6px 0;color:#0a1628;font-size:13px;">+91 9082377097</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#717182;font-size:13px;">✉️ Email:</td>
            <td style="padding:6px 0;color:#0a1628;font-size:13px;">
              <a href="mailto:manishbodal@bodalsint.com" style="color:#1e3a8a;text-decoration:none;">manishbodal@bodalsint.com</a> / <a href="mailto:akashbodal@bodalsint.com" style="color:#1e3a8a;text-decoration:none;">akashbodal@bodalsint.com</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#717182;font-size:13px;">💬 WhatsApp:</td>
            <td style="padding:6px 0;color:#0a1628;font-size:13px;"><a href="https://wa.me/919082377097" style="color:#1e3a8a;">Chat with us</a></td>
          </tr>
        </table>
        <p style="margin:0;color:#333;font-size:14px;line-height:1.7;">
          Warm regards,<br/>
          <strong style="color:#0a1628;">BODAL'S INTERNATIONAL</strong><br/>
          <span style="color:#d4af37;font-size:12px;letter-spacing:1px;">WE CARE, WE COMMIT, WE CONNECT</span>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#0a1628;padding:20px 40px;text-align:center;">
        <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:1px;">BODAL'S INTERNATIONAL</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:11px;">This is an automated confirmation. Please do not reply to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({
    to: enquiry.email,
    subject: "Thank you for contacting BODAL'S INTERNATIONAL",
    html
  });
}

module.exports = {
  sendEmail,
  sendAdminEnquiryNotification,
  sendCustomerAutoReply
};
