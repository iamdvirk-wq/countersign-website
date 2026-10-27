/* Countersigns — small, dependency-free page script.
   Fills in details from config.js, runs the contact form and
   the mobile booking bar. Nothing here sets cookies. */
(function () {
  "use strict";

  var C = window.COUNTERSIGN || {};
  var doc = document;

  function get(path) {
    if (path === "year") return String(new Date().getFullYear());
    if (path === "mobileTel") return String(C.mobile || "").replace(/[^\d+]/g, "");
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, C);
  }
  function fill(template) {
    return template.replace(/\{([\w.]+)\}/g, function (_, p) {
      var v = get(p);
      return v == null ? "" : String(v);
    });
  }
  function isPlaceholder(v) {
    return typeof v === "string" && /^\[.*\]$/.test(v.trim());
  }

  /* ---- 1. Text from config ------------------------------------------ */
  doc.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = get(el.getAttribute("data-cfg"));
    if (v == null) return;
    v = String(v);
    if (v === "" && el.hasAttribute("data-cfg-optional")) {
      el.hidden = true;
      return;
    }
    el.textContent = v;
  });

  /* ---- 2. Links from config ----------------------------------------- */
  doc.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    el.setAttribute("href", fill(el.getAttribute("data-cfg-href")));
  });

  /* ---- 3. Logo file (optional) -------------------------------------- */
  if (C.useLogoFile) {
    doc.querySelectorAll(".wordmark").forEach(function (el) {
      var img = doc.createElement("img");
      img.src = "assets/logo.svg";
      img.alt = "Countersigns";
      img.className = "logo-img";
      img.width = 184;
      img.height = 32;
      el.textContent = "";
      el.appendChild(img);
    });
  }

  /* ---- 4. Structured data for search engines (home page only) ------- */
  if (doc.body.getAttribute("data-page") === "home") {
    var num = function (s) { return String(s || "").replace(/[^\d.]/g, ""); };
    var url = isPlaceholder(C.siteUrl) ? undefined : C.siteUrl;
    var data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Countersigns",
      "slogan": "We prepare it. Your pharmacist signs it.",
      "description": "Remote QSPP accreditation admin support for independent community pharmacies: evidence registers, records and assessment-day preparation.",
      "url": url,
      "logo": url ? url + "/assets/favicon.svg" : undefined,
      "image": url ? url + "/assets/og-image.png" : undefined,
      "telephone": isPlaceholder(C.mobile) ? undefined : C.mobile,
      "email": isPlaceholder(C.email) ? undefined : C.email,
      "founder": isPlaceholder(C.founderName) ? undefined : { "@type": "Person", "name": C.founderName },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mango Hill",
        "addressRegion": "QLD",
        "addressCountry": "AU"
      },
      "areaServed": [
        { "@type": "State", "name": "Queensland" },
        { "@type": "Country", "name": "Australia" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "QSPP accreditation support",
        "itemListElement": [
          { "@type": "Offer", "name": "QSPP Gap Check", "price": num(get("prices.gapCheck")), "priceCurrency": "AUD" },
          { "@type": "Offer", "name": "Readiness Sprint", "price": num(get("prices.sprint")), "priceCurrency": "AUD" },
          { "@type": "Offer", "name": "Care plan (monthly)", "price": num(get("prices.carePlan")), "priceCurrency": "AUD" }
        ]
      }
    };
    var s = doc.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    doc.head.appendChild(s);
  }

  /* ---- 5. Cookie-free analytics, only if switched on ---------------- */
  if (C.cloudflareAnalyticsToken) {
    var a = doc.createElement("script");
    a.defer = true;
    a.src = "https://static.cloudflareinsights.com/beacon.min.js";
    a.setAttribute("data-cf-beacon", JSON.stringify({ token: C.cloudflareAnalyticsToken }));
    doc.body.appendChild(a);
  }

  /* ---- 6. Mobile booking bar ---------------------------------------- */
  var bar = doc.querySelector(".mobile-cta");
  var hero = doc.querySelector(".hero");
  var contact = doc.querySelector("#contact");
  if (bar && hero && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var update = function () {
      var show = !heroVisible && !contactVisible;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      bar.querySelectorAll("a").forEach(function (l) { l.tabIndex = show ? 0 : -1; });
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    if (contact) new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; update(); }).observe(contact);
    update();
  }

  /* ---- 7. Booking page: embedded calendars -------------------------- */
  // Turns a Cal.com or Calendly link into an embeddable calendar.
  function embedUrl(link) {
    try {
      var u = new URL(link);
      var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (/(^|\.)calendly\.com$/.test(u.hostname)) {
        u.searchParams.set("embed_domain", location.hostname || "localhost");
        u.searchParams.set("embed_type", "Inline");
        u.searchParams.set("hide_gdpr_banner", "1");
        u.searchParams.set("primary_color", "e8a33d");
        if (dark) {
          u.searchParams.set("background_color", "152035");
          u.searchParams.set("text_color", "f2eee6");
        }
      } else if (/(^|\.)cal\.com$/.test(u.hostname)) {
        u.searchParams.set("embed", "true");
        u.searchParams.set("theme", dark ? "dark" : "light");
      }
      return u.toString();
    } catch (e) { return null; }
  }

  // Cal.com's official embed script: the calendar grows to fit its content,
  // so there is no box-inside-a-box scrolling on phones.
  function loadCal() {
    if (window.Cal) return window.Cal;
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    return window.Cal;
  }

  function mountScheduler(box, n) {
    var link = get(box.getAttribute("data-scheduler"));
    if (!link || isPlaceholder(link)) return; // keeps the "nearly ready" message
    var u;
    try { u = new URL(link); } catch (e) { return; }

    box.textContent = "";
    if (/(^|\.)cal\.com$/.test(u.hostname)) {
      var ns = "cs" + n;
      var el = doc.createElement("div");
      el.id = "cal-" + ns;
      el.className = "scheduler-cal";
      box.appendChild(el);
      var Cal = loadCal();
      Cal("init", ns, { origin: "https://app.cal.com" });
      Cal.ns[ns]("inline", {
        elementOrSelector: "#" + el.id,
        calLink: u.pathname.replace(/^\//, ""),
        config: { layout: "month_view", theme: "auto" }
      });
      Cal.ns[ns]("ui", {
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: { light: { "cal-brand": "#1B2A41" }, dark: { "cal-brand": "#E8A33D" } }
      });
    } else {
      var frame = doc.createElement("iframe");
      frame.src = embedUrl(link);
      frame.title = box.getAttribute("data-title") || "Booking calendar";
      frame.className = "scheduler-frame";
      box.appendChild(frame);
    }
    var alt = box.parentNode.querySelector(".scheduler-alt");
    if (alt) {
      alt.hidden = false;
      alt.querySelector("a").href = link;
    }
  }

  // After paying, Stripe sends people to book.html?paid=1 to choose a time.
  var paid = /[?&]paid=1\b/.test(location.search);
  doc.querySelectorAll("[data-when-paid]").forEach(function (el) {
    el.hidden = el.getAttribute("data-when-paid") === "yes" ? !paid : paid;
  });
  // Only load calendars that are actually showing.
  doc.querySelectorAll("[data-scheduler]").forEach(function (box, n) {
    if (!box.closest("[hidden]")) mountScheduler(box, n);
  });
  if (paid && doc.getElementById("gap-check")) {
    doc.getElementById("gap-check").scrollIntoView();
  }

  /* ---- 8. Contact form ---------------------------------------------- */
  var form = doc.querySelector("#contact-form");
  if (form) {
    form.setAttribute("action", C.formEndpoint || "");
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");

    var say = function (msg, kind) {
      status.textContent = msg;
      status.className = "form-status " + (kind || "");
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      // Spam trap: real people never fill this hidden field.
      if (form.querySelector("[name=_gotcha]").value) {
        form.reset();
        say("Thanks — your message has been sent.", "ok");
        return;
      }
      if (!C.formEndpoint || isPlaceholder(C.formEndpoint)) {
        say("The form isn't connected yet. Please email or call instead.", "err");
        return;
      }

      button.disabled = true;
      say("Sending…");
      fetch(C.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say("Thanks — your message has been sent. I'll be in touch soon.", "ok");
      }).catch(function () {
        say("Sorry, that didn't send. Please email " + (C.email || "me") + " instead.", "err");
      }).then(function () {
        button.disabled = false;
      });
    });
  }
})();
