/* =====================================================================
   COUNTERSIGN — SITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONE place to change your details, links and prices.
   Every page reads from here. Replace each [PLACEHOLDER] below,
   keep the quote marks, and save. See README.md for help.
   ===================================================================== */

window.COUNTERSIGN = {

  /* ---- About you ---------------------------------------------------- */
  founderName:       "Div",
  founderExperience: "[ONE LINE ABOUT YOUR EXPERIENCE]",   // e.g. "Eight years working in community pharmacy front-of-house and admin."

  /* ---- Contact details ---------------------------------------------- */
  mobile: "0468 891 985",          // e.g. "0400 000 000"
  email:  "[EMAIL]",           // e.g. "hello@countersigns.com.au"
  abn:    "28 551 886 085",             // e.g. "12 345 678 901"

  /* ---- Links -------------------------------------------------------- */
  stripePaymentLink: "[STRIPE_PAYMENT_LINK]",  // Stripe Payment Link for the $249 Gap Check
  bookingLink:       "https://cal.com/countersigns/15min",         // Cal.com or Calendly link for the free 15-minute chat
  gapCheckBookingLink: "https://cal.com/countersigns/gap-check", // Cal.com or Calendly link for the 45-minute Gap Check call (shown after payment)
  formEndpoint:      "[FORM_ENDPOINT]",        // Formspree endpoint, e.g. "https://formspree.io/f/abcdwxyz"
  siteUrl:           "https://countersigns.com.au",             // your web address, no slash at the end, e.g. "https://countersigns.com.au"

  /* ---- Prices (shown exactly as typed) ------------------------------ */
  prices: {
    gapCheck: "$249",
    sprint:   "$1,200",
    carePlan: "$199"
  },
  // Leave empty while you are not GST-registered.
  // If you register, change to e.g. "inc. GST" or "+ GST" and it will appear next to every price.
  gstNote: "",

  /* ---- Logo --------------------------------------------------------- */
  // Change to true once you have saved your logo as assets/logo.svg
  useLogoFile: false,

  /* ---- Analytics (off by default) ----------------------------------- */
  // Optional, cookie-free Cloudflare Web Analytics. Paste your site token
  // between the quotes to switch it on. Leave empty to keep it off.
  cloudflareAnalyticsToken: ""
};
