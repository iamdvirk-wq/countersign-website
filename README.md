# Countersigns website

A plain static website: three pages, no build step, nothing to install.

```
index.html      Home page (all sections)
privacy.html    Privacy policy (template, review it)
terms.html      Gap Check terms (template, review it)
book.html       Booking page: 15-minute chat calendar + Gap Check pay-then-book
config.js       ← YOUR DETAILS, LINKS AND PRICES LIVE HERE
robots.txt      Tells search engines they may index the site
sitemap.xml     List of pages for search engines
assets/
  styles.css    Look and feel (colours, fonts, layout)
  site.js       Small script: fills in config, runs the form
  fonts/        Inter font files (self-hosted, free licence in OFL.txt)
  favicon.svg   Browser tab icon
  logo.svg      Placeholder logo (replace with yours)
  og-image.png  Picture shown when the link is shared on social media or in messages
```

---

## 1. Fill in your details

### Step 1a: `config.js` (most things)

Open `config.js` in any text editor (TextEdit, Notepad or VS Code). Replace each placeholder **inside the quote marks**, then save.

| Placeholder | What to put there | Example |
|---|---|---|
| `[YOUR NAME]` | Your name | `"Sam Taylor"` |
| `[ONE LINE ABOUT YOUR EXPERIENCE]` | One sentence about your pharmacy background | `"Eight years in community pharmacy admin and QCPP preparation."` |
| `[MOBILE]` | Your mobile, written how you want it shown | `"0400 123 456"` |
| `[EMAIL]` | Your business email | `"hello@countersigns.com.au"` |
| `[ABN]` | Your ABN | `"12 345 678 901"` |
| `[STRIPE_PAYMENT_LINK]` | Your Stripe Payment Link for the Gap Check | `"https://buy.stripe.com/abc123"` |
| `[BOOKING_LINK]` | Your Cal.com or Calendly link for the free 15-minute chat. It appears as a calendar on the booking page | `"https://cal.com/countersigns/15min"` |
| `[GAP_CHECK_BOOKING_LINK]` | Your Cal.com or Calendly link for the 45-minute Gap Check call. It's shown after someone pays | `"https://cal.com/countersigns/gap-check"` |
| `[FORM_ENDPOINT]` | Your Formspree form address (see step 3) | `"https://formspree.io/f/xyzabcd"` |
| `siteUrl` | Your web address, **no slash at the end**. Already set to the GitHub Pages address | `"https://iamdvirk-wq.github.io/countersign-website"` |
| `prices` | The three prices, exactly as they should appear | `"$249"`, `"$1,200"`, `"$199"` |
| `gstNote` | Leave as `""` until you are GST-registered. Then use e.g. `"inc. GST"` | `""` |
| `useLogoFile` | Change to `true` once your logo is saved as `assets/logo.svg` | `false` |
| `cloudflareAnalyticsToken` | Optional, cookie-free analytics. Leave `""` to keep it off | `""` |

Every page reads from this one file. Change a price here and it changes everywhere: buttons, pricing cards, the hero box and the terms page.

### Step 1b: if you move to your own domain

The address is currently `https://iamdvirk-wq.github.io/countersign-website`. Search engines and social media apps don't run the page script, so if you move to your own domain, use **Find and Replace** to swap that address for the new one in `config.js` and in these files:

- `index.html` (top of the file)
- `privacy.html` (top of the file)
- `terms.html` (top of the file)
- `book.html` (top of the file)
- `sitemap.xml`
- `robots.txt`

In VS Code, **Edit → Replace in Files** does them all at once.

### Step 1c: the privacy policy and terms

Both are **templates**. Read them, make sure they match how you work, and ask a lawyer if you're unsure. Then:

- In `privacy.html`, replace `[Booking tool, e.g. Cal.com or Calendly]` and `[Email and file-sharing provider, e.g. Google Workspace or Microsoft 365]` with the services you actually use.
- In both files, delete the dashed "Template — review before relying on it" box. Each one sits just below a `TEMPLATE NOTICE` comment.
- Update "Last updated" if you change anything.

---

## 2. Set up your Stripe Payment Link

1. In Stripe, go to **Payment Links → New**.
2. Add a product called "QSPP Gap Check" at A$249 (one-time).
3. Under **After payment**, choose **Don't show confirmation page** and redirect customers to
   `https://iamdvirk-wq.github.io/countersign-website/book?paid=1`
   (or your own domain + `/book?paid=1`). The booking page then shows the Gap Check calendar so they pick a time straight away.
4. Copy the link (it starts with `https://buy.stripe.com/`) into `config.js`.

## 3. Set up the contact form (Formspree, free plan)

1. Sign up at formspree.io and create a new form.
2. Copy the form's endpoint (it looks like `https://formspree.io/f/xxxxxxx`) into `config.js` as `formEndpoint`.
3. In the form's settings, add your website address as an allowed domain. This stops other sites from using your form.
4. Spam protection is already built in. The hidden `_gotcha` field is Formspree's standard honeypot.

Until you add the endpoint, the form says it isn't connected yet and asks people to email or call instead.

---

## 4. Put the site online (free)

You need a free **GitHub** account to hold the files, plus **Cloudflare Pages** or **Netlify** to publish them.

### A. Put the files on GitHub

1. Sign in at github.com and click **New repository**. Call it `countersign-website`. You can make it Private.
2. On the new repository page, click **uploading an existing file**.
3. Drag in **everything inside this folder**: all files plus the `assets` folder. Click **Commit changes**.

### B1. Publish with Cloudflare Pages (recommended)

1. Sign in at dash.cloudflare.com and go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Connect your GitHub account and choose `countersign-website`.
3. For build settings, choose **Framework preset: None**. Leave the **build command empty**. Set the **build output directory** to `/`.
4. Click **Save and Deploy**. Your site appears at `something.pages.dev` within a minute or so.
5. To use your own domain, open the project, go to **Custom domains → Set up a custom domain**, and follow the steps.

### B2. Or publish with Netlify

1. Sign in at app.netlify.com and click **Add new site → Import an existing project → GitHub**.
2. Choose `countersign-website`.
3. Leave the **build command empty** and set the **publish directory** to `.` (a single full stop).
4. Click **Deploy**. To use your own domain, go to **Domain management → Add a domain**.

### Making changes later

Edit a file on GitHub (open it and click the pencil icon), then click **Commit changes**. Cloudflare or Netlify republishes the site automatically within a minute or two.

---

## 5. After it's live: quick checks

- Open the site on your phone. Tap both booking buttons and send yourself a test message through the form.
- Run your address through **pagespeed.web.dev**, which runs Google Lighthouse. Check the Accessibility and SEO scores.
- Optional: submit `https://your-address/sitemap.xml` in Google Search Console.

---

## 6. Optional extras

- **Your logo:** save it as `assets/logo.svg` (keep that exact name), then set `useLogoFile: true` in `config.js`. Until then, the site shows the "Countersigns" wordmark with an amber tick.
- **Your photo:** save a square photo as `assets/founder.jpg` (about 400 × 400 px). In `index.html`, find the comment that starts `Optional photo` and follow its instructions.
- **Testimonials:** in `index.html`, find `TESTIMONIALS — switched off`. Add **real** quotes only, with the person's written permission, then remove the comment marks around that block.
- **Analytics:** Cloudflare Web Analytics is cookie-free. In Cloudflare, go to **Analytics & Logs → Web Analytics**, add your site and copy the token into `cloudflareAnalyticsToken`. On Cloudflare Pages, you can also switch it on in the project settings without touching any code.
- **Headline:** two other headline options are saved in a comment above the headline in `index.html`.

## Notes

- No cookies, no tracking and no outside scripts. Fonts are stored with the site.
- If someone has JavaScript switched off, they see the placeholder text that is typed into the HTML. That's rare. If you'd like to cover it, use Find and Replace to put your real details into the `.html` files as well.
- Pages work at `/privacy` and `/terms` on both Cloudflare Pages and Netlify.
