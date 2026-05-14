# Formspree Setup Guide
## Isiah Construction — Contact Form Backend

This guide gets your contact form sending real emails to **Isaiahmudhluli@gmail.com**
in under 5 minutes. It's completely free.

---

## STEP 1 — Sign Up for Formspree (Free)

1. Go to **https://formspree.io**
2. Click **"Get Started"** → sign up with your Gmail (Isaiahmudhluli@gmail.com)
3. Verify your email address

---

## STEP 2 — Create a New Form

1. In your Formspree dashboard, click **"+ New Form"**
2. Give it a name: `Isiah Construction Contact`
3. Set the email to: `Isaiahmudhluli@gmail.com`
4. Click **"Create Form"**

You'll now see a form endpoint URL like:
```
https://formspree.io/f/xpzgkwqr
```
The part after `/f/` is your **Form ID** (e.g. `xpzgkwqr`)

---

## STEP 3 — Add Your Form ID to the Website

Open the file:
```
js/form.js
```

Find line 10:
```javascript
const FORMSPREE_ID = 'YOUR_FORM_ID';
```

Replace `YOUR_FORM_ID` with your actual ID, for example:
```javascript
const FORMSPREE_ID = 'xpzgkwqr';
```

Save the file.

---

## STEP 4 — Test the Form

1. Open `index.html` in your browser
2. Scroll to the Contact section
3. Fill in the form and click **"Send Message →"**
4. Check your Gmail inbox — the email should arrive within 1 minute

The email subject will look like:
```
New Quote — Paving Services | Isiah Construction
```

---

## STEP 5 — Confirm Your Email (First Submission)

The very first submission will send a **confirmation email** to your Gmail.
- Open Gmail → find the Formspree email → click **"Confirm"**
- After that, all future submissions arrive instantly

---

## What the Email Looks Like

When someone submits the form, you'll receive:

```
From:    client@email.com
To:      Isaiahmudhluli@gmail.com
Subject: New Quote — Building & Renovation | Isiah Construction

First Name:       John
Last Name:        Doe
Email:            john@example.com
Phone:            061 555 1234
Service Required: Building & Renovation
Project Details:  I need a full home renovation in Midrand.
                  Budget around R150,000. Timeline: 3 months.
```

You can reply directly to the email — it replies to the client's email automatically.

---

## WhatsApp Follow-Up

After a successful form submission, the client sees a button:
**"Continue on WhatsApp"**

Clicking it opens WhatsApp with a pre-filled message to **061 445 7181**:

```
Hi Isiah! I just submitted an enquiry on your website.

*Name:* John Doe
*Phone:* 061 555 1234
*Email:* john@example.com
*Service needed:* Building & Renovation
*Project details:* Full home renovation in Midrand...
```

This means you can follow up instantly on both email AND WhatsApp.

---

## Free Plan Limits

| Feature           | Free Plan  |
|-------------------|------------|
| Submissions/month | 50         |
| Email delivery    | ✓ Included |
| Spam filter       | ✓ Included |
| File uploads      | ✗          |

50 submissions/month is plenty for a growing business.
If you need more, the paid plan is $8/month (unlimited submissions).

---

## Spam Protection

The form already includes two layers of spam protection:

1. **Honeypot field** — a hidden field that bots fill in but humans don't.
   Any submission with this field filled is silently ignored.

2. **Formspree's built-in spam filter** — automatically blocks known spam bots.

---

## Troubleshooting

**Emails not arriving?**
- Check your Gmail Spam folder
- Make sure you confirmed the first submission email from Formspree
- Double-check the FORMSPREE_ID in `js/form.js`

**"Submission failed" error?**
- Check that the Form ID is correct (no spaces, no quotes)
- Make sure your Formspree account is verified

**Form shows error on every submit?**
- Open the browser console (F12 → Console) and check for error messages
- Make sure you have an internet connection

---

## Next Steps After Setup

1. ✅ Form sending emails → **Done**
2. 🌐 Deploy the website live → See `DEPLOY_GUIDE.md`
3. 📍 Set up Google Business Profile → Free, shows on Google Maps
4. 📸 Replace placeholder photos with your real project photos

---

*I&M Construction Company | Isiah Construction | Isaiahmudhluli@gmail.com*
