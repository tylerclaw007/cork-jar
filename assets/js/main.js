/* Cork Jar: site behavior + single source of truth for site config.
   ==================================================================
   EDIT YOUR DETAILS HERE. Everything below flows into every page.
   ================================================================== */

window.CJ = {
  name: "Cork Jar", // brand / studio name shown in the logo + footer
  initials: "CJ", // short mark used on the loader + favicon
  photographer: "Tyler Law", // real name (shown in About + footer)
  email: "tylerclaw007@gmail.com", // booking + enquiries are sent here

  // OPTIONAL, leave "" until you have them. The site adapts automatically:
  //  - calendly "" -> booking page shows the inquiry form only
  //  - gumroad  "" -> Prints/LUTs "buy" buttons become an email enquiry
  calendly: "", // e.g. "https://calendly.com/corkjar/30min"
  gumroad: "", // your Gumroad store URL, e.g. "https://corkjar.gumroad.com"

  instagram: "", // e.g. "https://instagram.com/yourhandle" (optional)
  location: "Available worldwide", // shown in footer / contact
};

(function () {
  "use strict";
  var CJ = window.CJ;
  var ease = "cubic-bezier(0.16,1,0.3,1)";

  var NAV = [
    { label: "Work", href: "work.html" },
    { label: "Book", href: "book.html" },
    { label: "Prints", href: "prints.html" },
    { label: "LUTs", href: "luts.html" },
    { label: "Gear", href: "gear.html" },
    { label: "About", href: "about.html" },
  ];

  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  /* ---------------------------------------------------------- header */
  function injectHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    var here = currentPage();
    var links = NAV.map(function (n) {
      var cur = n.href === here ? ' aria-current="page"' : "";
      return (
        '<a class="nav-link" href="' +
        n.href +
        '"' +
        cur +
        ">" +
        n.label +
        "</a>"
      );
    }).join("");
    var menuLinks = NAV.map(function (n) {
      return '<a href="' + n.href + '">' + n.label + "</a>";
    }).join("");

    host.innerHTML =
      '<nav class="fixed top-0 left-0 right-0 z-50 border-b" ' +
      'style="background:rgba(12,13,16,0);border-color:transparent;transform:translateY(-100%);opacity:0;">' +
      '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-[68px] flex items-center justify-between">' +
      '<a href="index.html" class="font-display text-xl tracking-tight" style="font-weight:400;">' +
      CJ.name +
      "</a>" +
      '<div class="hidden md:flex items-center gap-8">' +
      links +
      '<a href="book.html" class="btn btn-solid" style="padding:0.6rem 1.1rem;">Book a shoot</a>' +
      "</div>" +
      '<button id="menu-open" class="md:hidden nav-link" aria-label="Open menu">Menu</button>' +
      "</div>" +
      "</nav>" +
      '<div class="menu-overlay" id="menu-overlay">' +
      '<button id="menu-close" class="absolute top-6 right-6 nav-link" aria-label="Close menu">Close</button>' +
      '<div class="flex flex-col gap-2">' +
      menuLinks +
      '<a href="book.html" class="accent">Book a shoot</a>' +
      "</div>" +
      "</div>";

    var navEl = host.querySelector("nav");
    var overlay = document.getElementById("menu-overlay");
    document.getElementById("menu-open").addEventListener("click", function () {
      overlay.classList.add("open");
    });
    document
      .getElementById("menu-close")
      .addEventListener("click", function () {
        overlay.classList.remove("open");
      });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        overlay.classList.remove("open");
      });
    });

    // scroll-aware nav: hidden at very top, slides in past 80px,
    // hides again near the bottom of the page.
    var lastSolid = false;
    function onScroll() {
      var y = window.scrollY;
      var docH = document.documentElement.scrollHeight;
      var winH = window.innerHeight;
      var nearBottom = y + winH >= docH - 160;
      var visible = y > 80 && !nearBottom;
      navEl.style.transform = visible ? "translateY(0)" : "translateY(-100%)";
      navEl.style.opacity = visible ? "1" : "0";
      var solid = y > 80;
      if (solid !== lastSolid) {
        navEl.style.background = solid
          ? "rgba(12,13,16,0.82)"
          : "rgba(12,13,16,0)";
        navEl.style.backdropFilter = solid ? "blur(12px)" : "none";
        navEl.style.webkitBackdropFilter = solid ? "blur(12px)" : "none";
        navEl.style.borderColor = solid ? "var(--line)" : "transparent";
        lastSolid = solid;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------- footer */
  function injectFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;
    var year = "2026"; // build year; bump when you redeploy
    var ig = CJ.instagram
      ? '<a class="link-underline" href="' +
        CJ.instagram +
        '" target="_blank" rel="noopener">Instagram</a>'
      : "";
    var cols = NAV.map(function (n) {
      return (
        '<a class="block muted link-underline py-1" href="' +
        n.href +
        '">' +
        n.label +
        "</a>"
      );
    }).join("");

    host.innerHTML =
      '<footer class="border-t mt-24" style="border-color:var(--line);">' +
      '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 grid gap-12 md:grid-cols-12">' +
      '<div class="md:col-span-6">' +
      '<a href="index.html" class="font-display" style="font-size:2.25rem;font-weight:300;letter-spacing:-0.02em;">' +
      CJ.name +
      "</a>" +
      '<p class="lede mt-4 max-w-sm">Light, preserved. Editorial, landscape and portrait photography by ' +
      CJ.photographer +
      ".</p>" +
      '<a class="btn btn-ghost mt-8" href="book.html">Start a project <span class="arrow">&rarr;</span></a>' +
      "</div>" +
      '<div class="md:col-span-3">' +
      '<p class="eyebrow mb-4">Explore</p>' +
      cols +
      "</div>" +
      '<div class="md:col-span-3">' +
      '<p class="eyebrow mb-4">Contact</p>' +
      '<a class="block link-underline py-1" href="mailto:' +
      CJ.email +
      '">' +
      CJ.email +
      "</a>" +
      '<p class="muted py-1">' +
      CJ.location +
      "</p>" +
      (ig ? '<div class="py-1">' + ig + "</div>" : "") +
      "</div>" +
      "</div>" +
      '<div class="border-t" style="border-color:var(--line);">' +
      '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs muted">' +
      "<span>&copy; " +
      year +
      " " +
      CJ.name +
      ". All photographs &copy; " +
      CJ.photographer +
      ".</span>" +
      "<span>Built with D1 Vibe Coding</span>" +
      "</div>" +
      "</div>" +
      "</footer>";
  }

  /* ----------------------------------------------------------- loader */
  function initLoader() {
    var loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("done");
      }, 450);
    });
    // safety: never let the loader trap the page
    setTimeout(function () {
      loader.classList.add("done");
    }, 2200);
  }

  /* ---------------------------------------------------------- reveals */
  function initReveals() {
    var io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.classList.add("visible");
                  io.unobserve(e.target);
                }
              });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0 },
          )
        : null;

    function observe(root) {
      var els = Array.prototype.slice.call(
        (root || document).querySelectorAll(
          ".reveal:not(.visible), .curtain:not(.visible)",
        ),
      );
      if (!io) {
        els.forEach(function (el) {
          el.classList.add("visible");
        });
        return;
      }
      els.forEach(function (el) {
        io.observe(el);
      });
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.98 && r.bottom > 0) {
            el.classList.add("visible");
            io.unobserve(el);
          }
        });
      });
    }
    window.CJ_observe = observe;
    observe();
  }

  /* ------------------------------------------------- page transitions */
  function initTransitions() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
      var url;
      try {
        url = new URL(href, location.href);
      } catch (_) {
        return;
      }
      if (url.origin !== location.origin || url.pathname === location.pathname)
        return;
      e.preventDefault();
      document.documentElement.classList.add("leaving");
      setTimeout(function () {
        window.location.href = url.href;
      }, 120);
    });
    window.addEventListener("pageshow", function (ev) {
      if (ev.persisted) document.documentElement.classList.remove("leaving");
    });
  }

  /* ---------------------------------------------------------- gallery */
  function galleryItemHTML(item, extraClass) {
    var meta = item.meta || item.year || "";
    return (
      '<figure class="gallery-item ' +
      (item.span || "col-6") +
      " " +
      (extraClass || "") +
      '" data-full="' +
      item.src +
      '" data-title="' +
      (item.title || "") +
      '" data-meta="' +
      meta +
      '">' +
      '<div class="' +
      (item.ratio || "row-wide") +
      '" style="height:100%;">' +
      '<img loading="lazy" src="' +
      item.src +
      '" alt="' +
      (item.title || "Photograph by " + CJ.photographer) +
      '">' +
      "</div>" +
      '<figcaption class="cap"><span class="cap-title">' +
      (item.title || "") +
      '</span><span class="cap-meta">' +
      meta +
      "</span></figcaption>" +
      "</figure>"
    );
  }

  function renderInto(id, items, extraClass) {
    var el = document.getElementById(id);
    if (!el || !items) return;
    el.innerHTML = items
      .map(function (it) {
        return galleryItemHTML(it, extraClass);
      })
      .join("");
  }

  function initGalleries() {
    // homepage featured
    renderInto("featured-grid", window.CJ_FEATURED, "reveal");

    // work page: render all categories, support filtering
    var workHost = document.getElementById("work-grid");
    if (workHost && window.CJ_GALLERY) {
      var all = [];
      Object.keys(window.CJ_GALLERY).forEach(function (cat) {
        window.CJ_GALLERY[cat].forEach(function (it) {
          var copy = Object.assign({}, it);
          copy.cat = cat;
          all.push(copy);
        });
      });
      window.CJ_WORK_ALL = all;
      drawWork("all");
      var pills = document.querySelectorAll(".filter-pill");
      pills.forEach(function (p) {
        p.addEventListener("click", function () {
          pills.forEach(function (x) {
            x.classList.remove("active");
          });
          p.classList.add("active");
          drawWork(p.getAttribute("data-cat"));
        });
      });
    }
    refreshLightbox();
    if (window.CJ_observe) window.CJ_observe();
  }

  function drawWork(cat) {
    var host = document.getElementById("work-grid");
    var items =
      cat === "all"
        ? window.CJ_WORK_ALL
        : window.CJ_WORK_ALL.filter(function (i) {
            return i.cat === cat;
          });
    window.CJ_WORK_CURRENT = items; // shared state: camera reel reads this
    host.innerHTML = items
      .map(function (it) {
        return galleryItemHTML(it, "reveal");
      })
      .join("");
    refreshLightbox();
    if (window.CJ_observe) window.CJ_observe();
  }

  /* --------------------------------------------------------- lightbox */
  var lb,
    lbImg,
    lbCap,
    lbItems = [],
    lbIndex = 0;
  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">' +
      iconClose() +
      "</button>" +
      '<button class="lb-nav lb-prev" aria-label="Previous">' +
      iconArrow("left") +
      "</button>" +
      '<img alt="">' +
      '<button class="lb-nav lb-next" aria-label="Next">' +
      iconArrow("right") +
      "</button>" +
      '<div class="lb-caption"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector("img");
    lbCap = lb.querySelector(".lb-caption");
    lb.querySelector(".lb-close").addEventListener("click", closeLb);
    lb.querySelector(".lb-prev").addEventListener("click", function () {
      step(-1);
    });
    lb.querySelector(".lb-next").addEventListener("click", function () {
      step(1);
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }
  function refreshLightbox() {
    if (!lb) buildLightbox();
    lbItems = Array.prototype.slice.call(
      document.querySelectorAll(".gallery-item"),
    );
    lbItems.forEach(function (fig, i) {
      fig.onclick = function () {
        openLb(i);
      };
    });
  }
  function openLb(i) {
    lbIndex = i;
    var fig = lbItems[i];
    lbImg.src = fig.getAttribute("data-full");
    lbCap.innerHTML =
      '<span class="cap-title">' +
      fig.getAttribute("data-title") +
      '</span> <span class="cap-meta" style="margin-left:.75rem;">' +
      fig.getAttribute("data-meta") +
      "</span>";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function step(d) {
    openLb((lbIndex + d + lbItems.length) % lbItems.length);
  }

  /* --------------------------------------------------- before/after */
  function initBeforeAfter() {
    document.querySelectorAll(".ba").forEach(function (ba) {
      var after = ba.querySelector(".ba-after");
      var handle = ba.querySelector(".ba-handle");
      function setPos(clientX) {
        var rect = ba.getBoundingClientRect();
        var pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        after.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
      }
      var dragging = false;
      ba.addEventListener("mousedown", function (e) {
        dragging = true;
        setPos(e.clientX);
      });
      window.addEventListener("mousemove", function (e) {
        if (dragging) setPos(e.clientX);
      });
      window.addEventListener("mouseup", function () {
        dragging = false;
      });
      ba.addEventListener(
        "touchstart",
        function (e) {
          setPos(e.touches[0].clientX);
        },
        { passive: true },
      );
      ba.addEventListener(
        "touchmove",
        function (e) {
          setPos(e.touches[0].clientX);
        },
        { passive: true },
      );
    });
  }

  /* ------------------------------------------------------- shop data */
  // buy link helper: real Gumroad if set, otherwise an email enquiry
  window.CJ_buy = function (productName) {
    if (CJ.gumroad) return { href: CJ.gumroad, label: "Buy", external: true };
    var subject = encodeURIComponent("Enquiry: " + productName);
    var body = encodeURIComponent(
      "Hi " +
        CJ.photographer +
        ",\n\nI'd like to buy \"" +
        productName +
        '". Please send details.\n\nThanks,',
    );
    return {
      href: "mailto:" + CJ.email + "?subject=" + subject + "&body=" + body,
      label: "Enquire",
      external: false,
    };
  };

  function renderPrints() {
    var host = document.getElementById("prints-grid");
    if (!host || !window.CJ_PRINTS) return;
    host.innerHTML = window.CJ_PRINTS.map(function (p) {
      var buy = window.CJ_buy(p.title);
      return (
        '<article class="reveal">' +
        '<div class="gallery-item" data-full="' +
        p.src +
        '" data-title="' +
        p.title +
        '" data-meta="' +
        p.edition +
        '">' +
        '<div class="' +
        (p.ratio || "row-portrait") +
        '"><img loading="lazy" src="' +
        p.src +
        '" alt="' +
        p.title +
        ' print"></div>' +
        "</div>" +
        '<div class="flex items-start justify-between mt-4 gap-4">' +
        '<div><h3 class="font-display" style="font-size:1.25rem;font-weight:400;">' +
        p.title +
        "</h3>" +
        '<p class="muted text-sm mt-1">' +
        p.edition +
        " &middot; " +
        p.price +
        "</p></div>" +
        '<a class="btn btn-ghost" style="padding:.6rem 1rem;white-space:nowrap;" href="' +
        buy.href +
        '"' +
        (buy.external ? ' target="_blank" rel="noopener"' : "") +
        ">" +
        buy.label +
        "</a>" +
        "</div>" +
        "</article>"
      );
    }).join("");
    refreshLightbox();
    if (window.CJ_observe) window.CJ_observe();
  }

  function renderLuts() {
    var host = document.getElementById("luts-grid");
    if (!host || !window.CJ_LUTS) return;
    host.innerHTML = window.CJ_LUTS.map(function (l, i) {
      var buy = window.CJ_buy(l.name);
      return (
        '<article class="reveal" style="border-top:1px solid var(--line);padding-top:2.5rem;">' +
        '<div class="grid md:grid-cols-2 gap-8 items-center">' +
        '<div class="ba"><img class="ba-before" src="' +
        l.before +
        '" alt="' +
        l.name +
        ' before grade">' +
        '<img class="ba-after" src="' +
        l.after +
        '" alt="' +
        l.name +
        ' after grade">' +
        '<span class="ba-handle"></span><span class="ba-tag left">Before</span><span class="ba-tag right">After</span></div>' +
        "<div>" +
        '<p class="eyebrow mb-3">Pack ' +
        (i + 1 < 10 ? "0" + (i + 1) : i + 1) +
        "</p>" +
        '<h3 class="display-md" style="font-size:clamp(1.6rem,3vw,2.4rem);">' +
        l.name +
        "</h3>" +
        '<p class="lede mt-4">' +
        l.desc +
        "</p>" +
        '<p class="muted text-sm mt-4">' +
        l.frames +
        " LUTs &middot; .cube + Lightroom presets &middot; " +
        l.price +
        "</p>" +
        '<a class="btn btn-solid mt-6" href="' +
        buy.href +
        '"' +
        (buy.external ? ' target="_blank" rel="noopener"' : "") +
        ">" +
        buy.label +
        " " +
        l.price +
        ' <span class="arrow">&rarr;</span></a>' +
        "</div></div></article>"
      );
    }).join("");
    initBeforeAfter();
    if (window.CJ_observe) window.CJ_observe();
  }

  /* --------------------------------------------------------- calendly */
  function initCalendly() {
    var slot = document.getElementById("calendly-slot");
    if (!slot) return;
    if (CJ.calendly) {
      slot.innerHTML =
        '<div class="calendly-inline-widget" data-url="' +
        CJ.calendly +
        '" style="min-width:320px;height:680px;"></div>';
      var s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    } else {
      slot.innerHTML =
        '<div class="card p-8 text-center">' +
        '<p class="eyebrow mb-3">Live booking</p>' +
        '<p class="lede">Instant calendar booking is coming soon. For now, send the form and ' +
        CJ.photographer.split(" ")[0] +
        " replies within 24 hours to lock a date.</p></div>";
    }
  }

  /* ------------------------------------------------------------- form */
  function initForm() {
    var form = document.getElementById("booking-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]').value) return; // bot
      var payload = {};
      new FormData(form).forEach(function (v, k) {
        payload[k] = v;
      });
      payload._subject = "New shoot enquiry | Cork Jar";
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = "Sending...";
      status.textContent = "";
      fetch("https://formsubmit.co/ajax/" + CJ.email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status");
          return r.json();
        })
        .then(function (d) {
          if (!(d && (d.success === true || d.success === "true")))
            throw new Error("not sent");
          form.style.display = "none";
          status.innerHTML =
            '<div class="card p-8"><p class="font-display" style="font-size:1.5rem;font-weight:400;">Thank you.</p>' +
            '<p class="lede mt-2">Your enquiry is in. Expect a reply within 24 hours.</p></div>';
        })
        .catch(function () {
          status.innerHTML =
            '<p class="accent text-sm">Something went wrong. Email me directly at ' +
            '<a class="link-underline" href="mailto:' +
            CJ.email +
            '">' +
            CJ.email +
            "</a>.</p>";
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  }

  /* ---------------------------------------------------------- counters */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var start = null;
          function tick(t) {
            if (!start) start = t;
            var p = Math.min((t - start) / 1400, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* -------------------------------------------------------- icon SVGs */
  function iconClose() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  }
  function iconArrow(dir) {
    var d = dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
    return (
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="' +
      d +
      '"/></svg>'
    );
  }

  /* ------------------------------------------------------------- init */
  document.addEventListener("DOMContentLoaded", function () {
    injectHeader();
    injectFooter();
    initLoader();
    initReveals();
    initTransitions();
    initGalleries();
    renderPrints();
    renderLuts();
    initBeforeAfter();
    initCalendly();
    initForm();
    initCounters();
  });
})();

/* =====================================================================
   Camera reel: Sony Alpha style playback browser.
   Self-contained add-on. Reuses window.CJ_WORK_CURRENT / CJ_WORK_ALL
   (same photos + filter state as the grid) and the existing lightbox.
   Does not modify any existing behavior.
   ===================================================================== */
(function () {
  "use strict";

  // believable EXIF, deterministic per index (no randomness)
  var ISO = [100, 200, 400, 800, 1600, 640, 320, 125];
  var FOCAL = [24, 35, 50, 85, 16, 135, 28, 70];
  var SHUTTER = [
    "1/125",
    "1/250",
    "1/500",
    "1/1000",
    "1/60",
    "1/2000",
    "1/320",
    "1/800",
  ];
  var APER = [
    "f/1.8",
    "f/2.8",
    "f/4",
    "f/5.6",
    "f/2.0",
    "f/8",
    "f/3.5",
    "f/2.2",
  ];
  function exifFor(item, i) {
    if (item && item.exif) return item.exif;
    var a = i % ISO.length;
    var b = (i * 3 + 1) % FOCAL.length;
    var c = (i * 2) % SHUTTER.length;
    var d = (i * 5 + 2) % APER.length;
    return (
      "ISO " +
      ISO[a] +
      "  |  " +
      FOCAL[b] +
      "mm  |  " +
      SHUTTER[c] +
      "  |  " +
      APER[d]
    );
  }

  var reel,
    track,
    metaCount,
    metaExif,
    titleEl,
    items = [],
    index = 0,
    locked = false,
    built = false;

  function build() {
    if (built) return;
    reel = document.createElement("div");
    reel.className = "camera-reel";
    reel.setAttribute("role", "dialog");
    reel.setAttribute("aria-label", "Camera playback");
    reel.innerHTML =
      '<div class="cr-dial" aria-hidden="true"></div>' +
      '<div class="cr-meta"><div class="cr-count"></div><div class="cr-exif"></div></div>' +
      '<div class="cr-rec"><span class="dot-live"></span> Playback</div>' +
      '<div class="cr-stage"><div class="cr-track"></div></div>' +
      '<div class="cr-title"><span class="t"></span></div>' +
      '<div class="cr-hint">Scroll or swipe to browse  &middot;  click photo to enlarge  &middot;  Esc to exit</div>' +
      '<button class="cr-exit" aria-label="Close camera mode">Exit</button>';
    document.body.appendChild(reel);
    track = reel.querySelector(".cr-track");
    metaCount = reel.querySelector(".cr-count");
    metaExif = reel.querySelector(".cr-exif");
    titleEl = reel.querySelector(".cr-title .t");

    reel.querySelector(".cr-exit").addEventListener("click", close);
    reel.addEventListener("wheel", onWheel, { passive: false });
    reel.addEventListener("touchstart", onTouchStart, { passive: true });
    reel.addEventListener("touchmove", onTouchMove, { passive: false });
    reel.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", function () {
      if (reel.classList.contains("open")) render(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!reel.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
    built = true;
  }

  function slidesData() {
    return (
      window.CJ_WORK_CURRENT || window.CJ_WORK_ALL || window.CJ_FEATURED || []
    );
  }

  function renderSlides() {
    track.innerHTML = items
      .map(function (it, i) {
        return (
          '<figure class="cr-slide" data-i="' +
          i +
          '">' +
          '<img src="' +
          it.src +
          '" alt="' +
          (it.title || "Photograph") +
          '" loading="lazy">' +
          "</figure>"
        );
      })
      .join("");
    Array.prototype.forEach.call(
      track.querySelectorAll(".cr-slide"),
      function (fig) {
        fig.addEventListener("click", function () {
          var i = parseInt(fig.getAttribute("data-i"), 10);
          if (i === index) openInLightbox(i);
          else {
            index = i;
            render(true);
          }
        });
      },
    );
  }

  function render(animate) {
    var slides = track.querySelectorAll(".cr-slide");
    if (!slides.length) return;
    track.style.transition = animate === false ? "none" : "";
    slides.forEach(function (s, i) {
      s.classList.toggle("active", i === index);
    });
    var slideW = slides[0].getBoundingClientRect().width;
    var gap = window.innerWidth * 0.025; // matches 2.5vw gap in CSS
    var x = window.innerWidth / 2 - (index * (slideW + gap) + slideW / 2);
    track.style.transform = "translateX(" + x + "px)";
    metaCount.innerHTML =
      "Photo <b>" + pad(index + 1) + "</b> / " + pad(items.length);
    metaExif.textContent = exifFor(items[index], index);
    titleEl.textContent = items[index].title || "";
    preload(index + 1);
    preload(index - 1);
  }

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }
  function preload(i) {
    if (i < 0 || i >= items.length) return;
    var img = new Image();
    img.src = items[i].src;
  }

  function step(dir) {
    var next = index + dir;
    if (next < 0 || next >= items.length) {
      // gentle edge bounce
      track.style.transform += " ";
      return;
    }
    index = next;
    render(true);
  }

  // wheel: exactly one photo per gesture, with a cooldown for tactile resistance
  function onWheel(e) {
    e.preventDefault();
    if (locked) return;
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 4) return;
    step(d > 0 ? 1 : -1);
    locked = true;
    setTimeout(function () {
      locked = false;
    }, 560);
  }

  var touchX = 0,
    touchActive = false;
  function onTouchStart(e) {
    touchX = e.touches[0].clientX;
    touchActive = true;
  }
  function onTouchMove(e) {
    if (touchActive) e.preventDefault();
  }
  function onTouchEnd(e) {
    if (!touchActive) return;
    touchActive = false;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }

  function openInLightbox(i) {
    // reuse the existing grid lightbox: close reel, click the matching figure
    var figs = document.querySelectorAll("#work-grid .gallery-item");
    close();
    if (figs[i])
      setTimeout(function () {
        figs[i].click();
      }, 260);
  }

  function open(startAt) {
    build();
    items = slidesData();
    if (!items.length) return;
    index = Math.max(0, Math.min(items.length - 1, startAt || 0));
    renderSlides();
    document.body.style.overflow = "hidden";
    reel.classList.add("open");
    requestAnimationFrame(function () {
      render(false);
      requestAnimationFrame(function () {
        render(true);
      });
    });
  }
  function close() {
    if (!reel) return;
    reel.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var trigger = document.getElementById("camera-open");
    if (trigger)
      trigger.addEventListener("click", function () {
        open(0);
      });
  });
})();
