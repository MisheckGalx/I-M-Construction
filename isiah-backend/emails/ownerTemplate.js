/* ============================================================
   emails/ownerTemplate.js
   Email sent TO Isiah when someone submits the contact form
============================================================ */
const { COMPANY } = require('../config/constants');

const ownerTemplate = (enquiry) => ({
  from:    `"${COMPANY.trading} Website" <${process.env.EMAIL_USER}>`,
  to:      process.env.OWNER_EMAIL,
  subject: `🔔 New Quote Request — ${enquiry.service} | ${COMPANY.trading}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#0A1628;padding:28px 36px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;
                         letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">
                I&amp;M CONSTRUCTION
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,.5);font-size:12px;
                        letter-spacing:3px;text-transform:uppercase;">
                New Quote Request
              </p>
            </td>
          </tr>

          <!-- ALERT BANNER -->
          <tr>
            <td style="background:#1E40AF;padding:14px 36px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;
                        text-transform:uppercase;letter-spacing:1px;">
                🔔 &nbsp; You have a new enquiry — reply within 24 hours
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px;">

              <!-- CLIENT DETAILS -->
              <h2 style="margin:0 0 20px;font-size:13px;font-weight:700;color:#1E40AF;
                         text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #DBEAFE;
                         padding-bottom:8px;">
                Client Details
              </h2>
              ${_row('Full Name',  `${enquiry.firstName} ${enquiry.lastName}`)}
              ${_row('Email',      `<a href="mailto:${enquiry.email}" style="color:#1E40AF;">${enquiry.email}</a>`)}
              ${_row('Phone',      `<a href="tel:${enquiry.phone}" style="color:#1E40AF;">${enquiry.phone}</a>`)}

              <div style="height:24px;"></div>

              <!-- PROJECT DETAILS -->
              <h2 style="margin:0 0 20px;font-size:13px;font-weight:700;color:#1E40AF;
                         text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #DBEAFE;
                         padding-bottom:8px;">
                Project Details
              </h2>
              ${_row('Service Required', enquiry.service)}
              ${_rowFull('Project Description', enquiry.message)}

              <div style="height:28px;"></div>

              <!-- ACTION BUTTONS -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="mailto:${enquiry.email}?subject=Re: Your ${enquiry.service} Enquiry"
                       style="display:block;background:#1E40AF;color:#ffffff;text-align:center;
                              padding:14px;font-weight:700;font-size:13px;letter-spacing:1px;
                              text-transform:uppercase;text-decoration:none;">
                      ✉️ &nbsp; Reply via Email
                    </a>
                  </td>
                  <td style="padding-left:8px;">
                    <a href="https://wa.me/${COMPANY.wa.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${enquiry.firstName}, thanks for your enquiry about ${enquiry.service}. I'd love to help — when can we discuss?`)}"
                       style="display:block;background:#25D366;color:#ffffff;text-align:center;
                              padding:14px;font-weight:700;font-size:13px;letter-spacing:1px;
                              text-transform:uppercase;text-decoration:none;">
                      💬 &nbsp; Reply via WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <div style="height:24px;"></div>
              <p style="font-size:11px;color:#94A3B8;margin:0;text-align:center;">
                Submitted ${new Date(enquiry.createdAt || Date.now()).toLocaleString('en-ZA', {
                  dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Johannesburg'
                })} &nbsp;|&nbsp; IP: ${enquiry.ipAddress || 'unknown'}
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0A1628;padding:20px 36px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,.3);font-size:11px;">
                ${COMPANY.name} &nbsp;·&nbsp; ${COMPANY.phone} &nbsp;·&nbsp; ${COMPANY.address}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `,
  text: `
NEW ENQUIRY — ${COMPANY.trading}

Client: ${enquiry.firstName} ${enquiry.lastName}
Email:  ${enquiry.email}
Phone:  ${enquiry.phone}

Service: ${enquiry.service}
Details: ${enquiry.message}

Received: ${new Date().toLocaleString('en-ZA')}
  `.trim(),
});

/* ── Helpers ── */
function _row(label, value) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td width="150" style="font-size:12px;font-weight:700;color:#475569;
            text-transform:uppercase;letter-spacing:1px;padding:10px 0;vertical-align:top;">
          ${label}
        </td>
        <td style="font-size:14px;color:#0F172A;padding:10px 0 10px 12px;vertical-align:top;
            border-left:2px solid #DBEAFE;">
          ${value}
        </td>
      </tr>
    </table>`;
}

function _rowFull(label, value) {
  return `
    <p style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;
       letter-spacing:1px;margin:0 0 8px;">${label}</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:3px solid #1E40AF;
       padding:14px 16px;font-size:14px;color:#0F172A;line-height:1.7;
       white-space:pre-wrap;margin-bottom:10px;">${value}</div>`;
}

module.exports = ownerTemplate;
