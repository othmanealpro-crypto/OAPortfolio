// Portfolio · Othmane Al Amrani
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
  var EASE_IN = "cubic-bezier(0.55, 0, 1, 0.45)";
  var canAnimate = typeof Element.prototype.animate === "function";
  var BASE_TITLE = "Othmane Al Amrani · Ingénieur logiciel";

  function motionOK() {
    return canAnimate && !reduceMotion.matches;
  }

  /* =========================================================
     Thème clair / sombre
     ========================================================= */
  var themeBtn = document.getElementById("theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return darkQuery.matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeBtn) return;
    themeBtn.setAttribute(
      "aria-label",
      currentTheme() === "dark" ? "Passer au thème clair" : "Passer au thème sombre"
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      updateThemeLabel();
    });
    updateThemeLabel();
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", updateThemeLabel);
  }

  /* =========================================================
     Onglets
     ========================================================= */
  var tablist = document.querySelector("[role='tablist']");
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[role='tab']"));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  var ids = panels.map(function (p) { return p.id; });
  var indicator = document.querySelector(".tab-indicator");
  var current = -1;
  var seq = 0;

  if (!tablist || !tabs.length) {
    root.setAttribute("data-ready", "");
    return;
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function indexFromHash() {
    var i = ids.indexOf(location.hash.slice(1));
    return i > -1 ? i : 0;
  }

  // Déplace la pastille sous l'onglet actif.
  function moveIndicator(i, instant) {
    if (!indicator || i < 0) return;
    var t = tabs[i];
    if (instant) indicator.classList.add("no-anim");
    indicator.style.width = t.offsetWidth + "px";
    indicator.style.transform = "translateX(" + t.offsetLeft + "px)";
    if (instant) {
      void indicator.offsetWidth; // applique la position avant de réactiver la transition
      indicator.classList.remove("no-anim");
    }
  }

  // Sur mobile, fait défiler la barre d'onglets pour centrer l'onglet actif.
  function centerTab(i) {
    var scroller = tablist.parentElement;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    var t = tabs[i];
    var left = t.offsetLeft + tablist.offsetLeft - (scroller.clientWidth - t.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior: motionOK() ? "smooth" : "auto" });
  }

  function setSelected(i) {
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    document.title = i === 0 ? BASE_TITLE : tabs[i].textContent.trim() + " · Othmane Al Amrani";
  }

  function stopAnimations(el) {
    if (!el || !el.getAnimations) return;
    el.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
  }

  // Apparition en cascade du contenu d'un panneau.
  function reveal(panel) {
    if (!motionOK()) return;

    var items = panel.querySelectorAll("[data-reveal]");
    Array.prototype.forEach.call(items, function (el, k) {
      el.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "none" }
        ],
        { duration: 560, delay: 60 + Math.min(k, 10) * 55, easing: EASE_OUT, fill: "backwards" }
      );
    });

    // Motif zellige de l'accueil
    var pattern = panel.querySelector(".hero-pattern");
    if (pattern) {
      var target = getComputedStyle(pattern).opacity;
      pattern.animate(
        [
          { opacity: 0, transform: "scale(1.06) rotate(-1deg)" },
          { opacity: target, transform: "none" }
        ],
        { duration: 1400, easing: EASE_OUT }
      );
    }

    // Frise qui se dessine de haut en bas
    Array.prototype.forEach.call(panel.querySelectorAll(".tl-rail"), function (rail) {
      rail.animate(
        [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }],
        { duration: 900, delay: 150, easing: EASE_OUT, fill: "backwards" }
      );
    });

    // Compteurs qui défilent jusqu'à leur valeur (ex. nombre de certificats)
    Array.prototype.forEach.call(panel.querySelectorAll("[data-count]"), function (el) {
      var target = Number(el.getAttribute("data-count")) || 0;
      var start = performance.now();
      var duration = 900;
      el.textContent = "0";
      (function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    });

    // Les maquettes se rejouent à l'ouverture : on note l'heure pour ne pas les relancer au survol tout de suite
    Array.prototype.forEach.call(panel.querySelectorAll(".preview"), function (el) {
      el.setAttribute("data-played", String(Date.now()));
    });

    // Étapes des chaînes de traitement, l'une après l'autre
    Array.prototype.forEach.call(panel.querySelectorAll(".flow"), function (flow, f) {
      Array.prototype.forEach.call(flow.children, function (li, k) {
        li.animate(
          [{ opacity: 0, transform: "translateX(-8px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, delay: 420 + f * 90 + k * 80, easing: EASE_OUT, fill: "backwards" }
        );
      });
    });
  }

  function scrollTop() {
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }

  function show(panel) {
    panel.classList.add("is-active");
  }

  function hide(panel) {
    panel.classList.remove("is-active");
  }

  // Active l'onglet i. opts : { initial, focusPanel }
  function activate(i, opts) {
    opts = opts || {};
    if (i === current && !opts.initial) return;

    var prev = current;
    current = i;
    var token = ++seq;
    var incoming = panels[i];

    setSelected(i);
    moveIndicator(i, opts.initial);
    centerTab(i);

    // Le panneau réellement affiché (il peut être en cours d'animation)
    var outgoing = null;
    panels.forEach(function (p) {
      if (p !== incoming && p.classList.contains("is-active")) {
        if (!outgoing) outgoing = p;
        else { stopAnimations(p); hide(p); }
      }
    });

    function enter() {
      if (token !== seq) return;
      if (outgoing) { stopAnimations(outgoing); hide(outgoing); }
      stopAnimations(incoming);
      show(incoming);
      if (!opts.initial) scrollTop();

      if (motionOK()) {
        var dir = prev < 0 ? 0 : (i > prev ? 1 : -1);
        if (dir !== 0) {
          incoming.animate(
            [
              { opacity: 0, transform: "translateX(" + dir * 48 + "px)" },
              { opacity: 1, transform: "none" }
            ],
            { duration: 480, easing: EASE_OUT }
          );
        }
        reveal(incoming);
      }

      if (opts.focusPanel) incoming.focus({ preventScroll: true });
    }

    if (outgoing && motionOK()) {
      var dirOut = i > prev ? -1 : 1;
      stopAnimations(outgoing);
      var out = outgoing.animate(
        [
          { opacity: 1, transform: "none", filter: "blur(0)" },
          { opacity: 0, transform: "translateX(" + dirOut * 36 + "px)", filter: "blur(2px)" }
        ],
        { duration: 190, easing: EASE_IN, fill: "forwards" }
      );
      out.onfinish = enter;
    } else {
      enter();
    }
  }

  function go(i, opts) {
    if (i < 0 || i >= tabs.length) return;
    if (i !== current) {
      var hash = "#" + ids[i];
      if (location.hash !== hash) history.pushState(null, "", hash);
    }
    activate(i, opts);
  }

  // Clics sur les onglets et sur tous les liens internes vers un panneau
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest("a[href^='#']");
    if (!a) return;
    var i = ids.indexOf(a.getAttribute("href").slice(1));
    if (i < 0) return;
    e.preventDefault();
    var fromTab = a.getAttribute("role") === "tab";
    go(i, { focusPanel: !fromTab });
  });

  // Flèches gauche/droite, Début et Fin dans la barre d'onglets
  tablist.addEventListener("keydown", function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    tabs[next].focus();
    go(next);
  });

  // Boutons précédent / suivant du navigateur
  window.addEventListener("popstate", function () {
    activate(indexFromHash());
  });

  // Balayage horizontal sur mobile pour changer d'onglet
  var main = document.getElementById("contenu");
  var touch = null;
  if (main) {
    main.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { touch = null; return; }
      touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    }, { passive: true });

    main.addEventListener("touchend", function (e) {
      if (!touch) return;
      var dx = e.changedTouches[0].clientX - touch.x;
      var dy = e.changedTouches[0].clientY - touch.y;
      var dt = Date.now() - touch.t;
      touch = null;
      if (dt > 700 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      if (window.getSelection && String(window.getSelection())) return;
      go(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  // Repositionne la pastille quand la mise en page change
  var resizeFrame = 0;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(function () { moveIndicator(current, true); });
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { moveIndicator(current, true); });
  }

  // Démarrage
  activate(indexFromHash(), { initial: true });
  root.setAttribute("data-ready", "");
  root.removeAttribute("data-start");

  // Le navigateur fait défiler jusqu'à l'ancre (#projets…) : on reste en haut de page.
  scrollTop();
  window.addEventListener("load", scrollTop, { once: true });

  /* =========================================================
     Filtre des certificats Coursera
     Les cartes restantes glissent vers leur nouvelle place (technique FLIP),
     celles qui apparaissent s'agrandissent en fondu.
     ========================================================= */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".cert-filters .chip"));
  var certs = Array.prototype.slice.call(document.querySelectorAll(".cert"));

  function filterCerts(filter) {
    var before = new Map();
    certs.forEach(function (el) {
      if (!el.hidden) before.set(el, el.getBoundingClientRect());
    });

    certs.forEach(function (el) {
      el.hidden = !(filter === "all" || el.getAttribute("data-cat") === filter);
    });

    if (!motionOK()) return;

    var entering = 0;
    certs.forEach(function (el) {
      if (el.hidden) return;
      stopAnimations(el);
      var after = el.getBoundingClientRect();
      var prev = before.get(el);
      if (prev) {
        var dx = prev.left - after.left;
        var dy = prev.top - after.top;
        if (dx || dy) {
          el.animate(
            [{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }],
            { duration: 520, easing: EASE_OUT }
          );
        }
      } else {
        el.animate(
          [
            { opacity: 0, transform: "scale(0.9) translateY(8px)" },
            { opacity: 1, transform: "none" }
          ],
          { duration: 420, delay: 80 + Math.min(entering++, 10) * 35, easing: EASE_OUT, fill: "backwards" }
        );
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      if (chip.getAttribute("aria-pressed") === "true") return;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      filterCerts(chip.getAttribute("data-filter"));
    });
  });

  /* =========================================================
     Maquettes animées des projets
     Les animations CSS se rejouent seules à chaque ouverture de l'onglet
     (le panneau repasse de masqué à visible) ; on les relance aussi au survol.
     ========================================================= */
  var previews = Array.prototype.slice.call(document.querySelectorAll(".preview"));

  function playPreview(el) {
    el.classList.remove("play");
    void el.offsetWidth;
    el.classList.add("play");
    el.setAttribute("data-played", String(Date.now()));
  }

  if (motionOK()) {
    previews.forEach(function (el) {
      el.classList.add("play");
      el.setAttribute("data-played", String(Date.now()));
      var card = el.closest(".project");
      if (!card) return;
      card.addEventListener("mouseenter", function () {
        if (!motionOK()) return;
        var last = Number(el.getAttribute("data-played")) || 0;
        if (Date.now() - last > 4000) playPreview(el);
      });
    });
  }

  /* =========================================================
     Copier l'adresse e-mail
     ========================================================= */
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  var emailLink = document.getElementById("email");

  function showStatus(text) {
    if (!copyStatus) return;
    copyStatus.textContent = text;
    clearTimeout(showStatus.timer);
    showStatus.timer = setTimeout(function () { copyStatus.textContent = ""; }, 2500);
  }

  function selectEmail() {
    if (!emailLink) return;
    var range = document.createRange();
    range.selectNodeContents(emailLink);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { showStatus("Adresse copiée"); },
          function () { selectEmail(); showStatus("Sélectionnée, faites Ctrl+C"); }
        );
      } else {
        selectEmail();
        showStatus("Sélectionnée, faites Ctrl+C");
      }
    });
  }

  /* =========================================================
     Année du pied de page
     ========================================================= */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
