/* ============================================================
   emails/clientTemplate.js
   Auto-reply sent TO THE CLIENT after they submit the form
============================================================ */
const { COMPANY } = require('../config/constants');

const clientTemplate = (enquiry) => ({
  from:    `"${COMPANY.trading}" <${process.env.EMAIL_USER}>`,
  to:      enquiry.email,
  subject: `We received your enquiry — ${COMPANY.trading}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#0A1628;padding:32px 36px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;
                         letter-spacing:2px;text-transform:uppercase;">
                I&amp;M CONSTRUCTION
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,.45);font-size:11px;
                        letter-spacing:3px;text-transform:uppercase;">
                Building Your Dreams, One Project at a Time
              </p>
            </td>
          </tr>

          <!-- GREEN CONFIRM BANNER -->
          <tr>
            <td style="background:#1E40AF;padding:16px 36px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">
                ✅ &nbsp; Your enquiry has been received!
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px;">
              <p style="font-size:16px;color:#0F172A;margin:0 0 16px;font-weight:700;">
                Hi ${enquiry.firstName},
              </p>
              <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 20px;">
                Thank you for contacting <strong>${COMPANY.trading}</strong>.
                We've received your enquiry and will get back to you within
                <strong style="color:#1E40AF;">24 hours</strong>.
              </p>

              <!-- SUMMARY BOX -->
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;
                          border-left:4px solid #1E40AF;padding:20px 24px;margin-bottom:24px;">
                <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#1E40AF;
                           text-transform:uppercase;letter-spacing:2px;">Your Enquiry Summary</p>
                <p style="margin:0 0 6px;font-size:13px;color:#475569;">
                  <strong>Service:</strong> ${enquiry.service}
                </p>
                <p style="margin:0;font-size:13px;color:#475569;">
                  <strong>Details:</strong> ${enquiry.message.substring(0, 150)}${enquiry.message.length > 150 ? '…' : ''}
                </p>
              </div>

              <!-- WHAT HAPPENS NEXT -->
              <h2 style="font-size:13px;font-weight:700;color:#1E40AF;text-transform:uppercase;
                         letter-spacing:2px;margin:0 0 16px;border-bottom:1px solid #E2E8F0;
                         padding-bottom:8px;">
                What Happens Next
              </h2>

              ${_step('1', 'Review', 'Isiah personally reviews every enquiry.')}
              ${_step('2', 'Contact', 'We\'ll call or email you within 24 hours.')}
              ${_step('3', 'Site Visit', 'We schedule a free on-site assessment.')}
              ${_step('4', 'Quote', 'You receive a detailed written quote — no obligation.')}

              <div style="height:28px;"></div>

              <!-- WA BUTTON -->
              <a href="https://wa.me/${COMPANY.wa.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi Isiah, I just submitted an enquiry for ${enquiry.service}. My name is ${enquiry.firstName} ${enquiry.lastName}.`)}"
                 style="display:block;background:#25D366;color:#ffffff;text-align:center;
                        padding:16px;font-weight:700;font-size:14px;letter-spacing:1px;
                        text-transform:uppercase;text-decoration:none;margin-bottom:12px;">
                💬 &nbsp; Chat with Us on WhatsApp
              </a>

              <p style="font-size:12px;color:#94A3B8;text-align:center;margin:0;">
                Need urgent assistance? Call us directly on
                <a href="tel:${COMPANY.phone}" style="color:#1E40AF;font-weight:700;">${COMPANY.phone}</a>
              </p>
            </td>
          </tr>

          <!-- SERVICES ROW -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 36px;border-top:1px solid #E2E8F0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#94A3B8;
                        text-transform:uppercase;letter-spacing:2px;text-align:center;">
                Our Services
              </p>
              <p style="margin:0;font-size:12px;color:#475569;text-align:center;line-height:1.8;">
                Building &amp; Renovation &nbsp;·&nbsp; Plumbing &nbsp;·&nbsp; Tree Felling<br>
                Paving Services &nbsp;·&nbsp; Paving Brick Sales &nbsp;·&nbsp; Paving Installation
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0A1628;padding:22px 36px;text-align:center;">
              <p style="margin:0 0 6px;color:rgba(255,255,255,.4);font-size:11px;">
                ${COMPANY.name}
              </p>
              <p style="margin:0;color:rgba(255,255,255,.25);font-size:11px;">
                ${COMPANY.phone} &nbsp;·&nbsp; ${COMPANY.email} &nbsp;·&nbsp; ${COMPANY.address}
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
Hi ${enquiry.firstName},

Thank you for contacting ${COMPANY.trading}!

We've received your enquiry for: ${enquiry.service}

We will get back to you within 24 hours.

WhatsApp: ${COMPANY.wa}
Phone:    ${COMPANY.phone}
Email:    ${COMPANY.email}

— ${COMPANY.trading} Team
  `.trim(),
});

function _step(num, title, desc) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td width="36" valign="top">
          <div style="width:28px;height:28px;background:#1E40AF;border-radius:50%;
               text-align:center;line-height:28px;color:#fff;font-weight:900;font-size:13px;">
            ${num}
          </div>
        </td>
        <td style="padding-left:12px;vertical-align:top;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#0F172A;">${title}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#475569;">${desc}</p>
        </td>
      </tr>
    </table>`;
}

module.exports = clientTemplate;
