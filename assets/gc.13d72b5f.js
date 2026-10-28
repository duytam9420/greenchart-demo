/* Green Chart demo · site-wide motion layer. Ported from Lucian UX/UI Prompt elements
   #081 #216 #286 #314 #321 #339 #343 #351 #354 #373 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/
   plus Apple-style helpers (momentum wheel scroll, tilt cards, magnetic buttons). Registers on window.GCFX;
   app.js (loaded after) calls init/refresh/motion/boot/transition. Every loop stops when motion is off. */
(function () {
  var d = document, root = d.documentElement, FX = window.GCFX || (window.GCFX = { init: [], refresh: [], motion: [], layout: [] });
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  function on() { return window.GC && GC.motionOn(); }
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var maxY = function () { return d.documentElement.scrollHeight - innerHeight; };

  /* ---------- #321 curtain between pages + #256-style preloader (count-up, then the screen splits), < 1.2 s, skippable ----------
     The curtain `.u321-cu` is static in every page. Leaving: it rises, the destination's name appears, then the browser
     navigates. Arriving (sessionStorage flag, html.is-cover set by the inline head script before first paint): it lifts away. */
  var cu = $('.u321-cu') || d.body.appendChild(el('div', 'ux u321-cu', '<span></span>'));
  cu.setAttribute('aria-hidden', 'true');
  var busy = false;
  FX.leave = function (title, href) {
    if (busy) return false;
    busy = true;
    $('span', cu).textContent = title || '';
    root.classList.remove('is-lift', 'pre'); root.classList.add('is-cover');
    try { sessionStorage.setItem('gc-cu', title || ''); } catch (e) {}
    setTimeout(function () { location.href = href; }, 560);
    setTimeout(function () { busy = false; root.classList.remove('is-cover'); }, 4000);  /* navigation blocked or cancelled */
    return true;
  };
  FX.motion.push(function (m) { if (!m) { root.classList.remove('is-cover', 'is-lift', 'pre'); busy = false; } });
  FX.boot = function () {
    var came = null; try { came = sessionStorage.getItem('gc-cu'); sessionStorage.removeItem('gc-cu'); } catch (e) {}
    if (came !== null && on()) {
      $('span', cu).textContent = came;
      root.classList.add('is-cover');
      FX.holdUntil = performance.now() + 520;
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        root.classList.remove('pre', 'is-cover'); root.classList.add('is-lift');
        setTimeout(function () { root.classList.remove('is-lift'); }, 600);
      }); });
      return;
    }
    root.classList.remove('is-cover', 'pre');
    var seen = null; try { seen = sessionStorage.getItem('gc-loaded'); } catch (e) {}
    if (!on() || seen) return;
    try { sessionStorage.setItem('gc-loaded', '1'); } catch (e) {}
    var ld = el('div', 'ux u256-ld', '<div class="u256-hf u256-a"></div><div class="u256-hf u256-b"></div><div class="u256-bn">Green Chart</div><div class="u256-ct"><small>Serious Education for Serious Traders</small><div class="u256-n"><span>0</span><i>%</i></div><div class="u256-br"><i></i></div></div><span class="u256-skip">Bấm để bỏ qua</span>');
    ld.setAttribute('role', 'progressbar'); ld.setAttribute('aria-label', 'Đang tải bản demo'); ld.setAttribute('aria-valuemin', '0'); ld.setAttribute('aria-valuemax', '100');
    d.body.appendChild(ld); d.body.classList.add('is-loading');
    FX.holdUntil = performance.now() + 1050;
    var n = $('.u256-n span', ld), bar = $('.u256-br i', ld), v = 0, t = 0, done = false;
    function set(x) { n.textContent = x; bar.style.width = x + '%'; ld.setAttribute('aria-valuenow', x); }
    function open() {
      if (done) return; done = true; clearTimeout(t); set(100);
      ld.classList.add('is-open'); d.body.classList.remove('is-loading'); FX.holdUntil = 0;
      if (window.GC) GC.refresh();
      setTimeout(function () { ld.remove(); }, 1000);
    }
    (function step() {
      v = Math.min(100, v + (Math.random() < 0.15 ? 0 : 5 + Math.floor(Math.random() * 9)));
      set(v);
      if (v < 100) t = setTimeout(step, Math.random() < 0.12 ? 90 : 28); else t = setTimeout(open, 120);
    })();
    ld.addEventListener('click', open); addEventListener('keydown', function k(e) { open(); removeEventListener('keydown', k); });
    setTimeout(open, 1150);
  };

  /* ---------- #216 staggered hero entrance: eyebrow, headline (#237), lead, buttons, facts rise one after another ---------- */
  function heroOf(v) { return $('.hero, .phero, .course-hero, .art-hero, .lect-hero', v); }
  FX.init.push(function (v) {
    var h = heroOf(v); if (!h) return;
    var seq = $$('.hero-in > *, .hero-in > .lect-copy > *', h).filter(function (x) { return !x.matches('.note, .u226, .fxbg, .u237, .lect-copy'); });
    var dl = 0, after = false;
    seq.forEach(function (x) {
      if (x.hasAttribute('data-s')) return;
      var isH = x.matches('.u237') || $('.u237', x);
      if (isH) { after = true; dl = 520; return; }
      x.setAttribute('data-s', ''); x.style.setProperty('--d', dl); dl += after ? 140 : 90;
    });
    $$('[data-s]:not([style*="--d"])', h).forEach(function (x, i) { x.style.setProperty('--d', 900 + i * 140); });
  });
  FX.refresh.push(function (v) {
    var h = heroOf(v); if (!h) return;
    h.classList.add('is-snap'); h.classList.remove('is-in'); void h.offsetWidth; h.classList.remove('is-snap');
    if (!on()) { h.classList.add('is-in'); return; }
    var wait = Math.max(0, (FX.holdUntil || 0) - performance.now());
    setTimeout(function () { requestAnimationFrame(function () { h.classList.add('is-in'); }); }, wait);
  });

  /* ---------- #314 target-shaped morphing cursor (desktop, fine pointer only) ---------- */
  var cur = el('div', 'ux u314-cur', '<span class="u314-cl"></span>'); cur.setAttribute('aria-hidden', 'true'); d.body.appendChild(cur);
  var cl = $('.u314-cl', cur), pos = { x: -100, y: -100 }, sp = { x: -100, y: -100 }, vel = { x: 0, y: 0 }, mode = '', box = null, last = 0, raf = 0, lastEl = null, down = false;
  var BTN = 'button,.btn,.u002-btn,.arrow,.chip,.u292-f,.u039-tab,.u242-ch,.u044-q,.switch,.pages a,.u354-it,.u354-cats a,.u389-p,.u275-ti,.u286-it,.u252-pl';
  var IMG = '.thumb,.featured .thumb,.u389-p,.lect-photo,.art-cover';
  var TXT = 'p,h1,h2,h3,h4,li,blockquote,dd,dt,figcaption,.u260-p,.u394-row';
  function cursorOn() { return on() && fine.matches && !matchMedia('(pointer: coarse)').matches; }
  function set(m, target) {
    mode = m; cur.className = 'ux u314-cur is-on' + (m ? ' is-' + m : '') + (down ? ' is-down' : '');
    box = null;
    if (m === 'btn') { var b = target.getBoundingClientRect(); box = { x: b.left, y: b.top, w: b.width, h: b.height, rad: getComputedStyle(target).borderRadius }; }
    cl.textContent = m === 'img' ? 'Xem' : m === 'link' ? '→' : '';
  }
  function target() {
    if (mode === 'btn' && box) { var cxp = box.x + box.w / 2, cyp = box.y + box.h / 2; return { x: cxp + (pos.x - cxp) * 0.15, y: cyp + (pos.y - cyp) * 0.15, w: box.w + 8, h: box.h + 8, r: box.rad }; }
    if (mode === 'text') return { x: pos.x, y: pos.y, w: 3, h: 26, r: '2px' };
    if (mode === 'img') return { x: pos.x, y: pos.y, w: 72, h: 72, r: '999px' };
    if (mode === 'link') return { x: pos.x, y: pos.y, w: 30, h: 30, r: '999px' };
    return { x: pos.x, y: pos.y, w: 14, h: 14, r: '999px' };
  }
  function frame(now) {
    raf = 0;
    if (!cursorOn()) return;
    var dt = Math.min(0.033, Math.max(0, (now - last) / 1000)); last = now;
    var t = target();
    vel.x += ((t.x - sp.x) * 420 - vel.x * 30) * dt; vel.y += ((t.y - sp.y) * 420 - vel.y * 30) * dt; sp.x += vel.x * dt; sp.y += vel.y * dt;
    cur.style.width = t.w + 'px'; cur.style.height = t.h + 'px'; cur.style.borderRadius = t.r;
    cur.style.transform = 'translate(' + (sp.x - t.w / 2).toFixed(1) + 'px,' + (sp.y - t.h / 2).toFixed(1) + 'px)';
    if (Math.abs(t.x - sp.x) + Math.abs(t.y - sp.y) > 0.2 || Math.abs(vel.x) + Math.abs(vel.y) > 1) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function classify(t) {
    if (!t || !t.closest) return ['', null];
    var e = t.closest(BTN); if (e) return ['btn', e];
    e = t.closest(IMG); if (e) return ['img', e];
    e = t.closest('a'); if (e) return ['link', e];
    e = t.closest(TXT); if (e && !t.closest('.gform')) return ['text', e];
    return ['', null];
  }
  d.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || !cursorOn()) return;
    pos.x = e.clientX; pos.y = e.clientY;
    var c = classify(e.target), m = c[0], e2 = c[1];
    if (m !== mode || (m === 'btn' && e2 !== lastEl)) { set(m, e2); lastEl = e2; }
    if (!root.classList.contains('gc-cursor')) { root.classList.add('gc-cursor'); sp.x = pos.x; sp.y = pos.y; }
    if (!cur.classList.contains('is-on')) { sp.x = pos.x; sp.y = pos.y; cur.classList.add('is-on'); }
    kick();
  }, { passive: true });
  d.addEventListener('pointerdown', function () { down = true; cur.classList.add('is-down'); });
  d.addEventListener('pointerup', function () { down = false; cur.classList.remove('is-down'); });
  d.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
  d.addEventListener('mouseout', function (e) { if (!e.relatedTarget) cur.classList.remove('is-on'); });
  addEventListener('scroll', function () { if (mode === 'btn') { mode = ''; box = null; cur.className = 'ux u314-cur is-on'; kick(); } }, { passive: true });
  FX.motion.push(function (m) { if (!m) { root.classList.remove('gc-cursor'); cur.classList.remove('is-on'); } });

  /* ---------- momentum wheel scroll (lerp toward the wheel target; native for touch, keyboard, rails, forms) ---------- */
  var sT = 0, sC = 0, sRaf = 0, sOn = false;
  function sFrame() {
    sRaf = 0;
    sC += (sT - sC) * 0.14;
    if (Math.abs(sT - sC) < 0.6) { sC = sT; sOn = false; }
    scrollTo(0, sC);
    if (sOn) sRaf = requestAnimationFrame(sFrame);
  }
  addEventListener('wheel', function (e) {
    if (!on() || !fine.matches || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    if (t.closest && (t.closest('textarea,select,.u241-sc,.u223-sc') || (t.closest('.rail,.u242-cr,.pages,.u039-tabs') && Math.abs(e.deltaX) > Math.abs(e.deltaY)))) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
    if (!dy) return;
    e.preventDefault();
    if (!sOn) { sC = sT = scrollY; }
    sT = clamp(sT + dy, 0, maxY());
    sOn = true; if (!sRaf) sRaf = requestAnimationFrame(sFrame);
  }, { passive: false });
  addEventListener('scroll', function () { if (!sOn) sC = sT = scrollY; }, { passive: true });
  FX.motion.push(function (m) { if (!m) { sOn = false; cancelAnimationFrame(sRaf); sRaf = 0; } });

  /* ---------- #343 rocket back-to-top: ring fills with read progress, press and it blasts off while the page glides up ---------- */
  var up = $('.u343-up'), ring = up && $('.u343-ring', up), rk = up && $('.u343-rk', up), C343 = 2 * Math.PI * 24, flying = false;
  if (up) ring.style.strokeDasharray = C343;
  addEventListener('scroll', function () {
    if (!up) return;
    var p = maxY() > 0 ? scrollY / maxY() : 0;
    ring.style.strokeDashoffset = (C343 * (1 - p)).toFixed(1);
    if (!flying) up.classList.toggle('show', scrollY > innerHeight * 0.9);
  }, { passive: true });
  if (up) up.addEventListener('click', function () {
    if (flying) return;
    if (!on()) { scrollTo(0, 0); return; }
    flying = true; up.classList.add('fly'); sOn = false;
    if (rk.animate) rk.animate([{ transform: 'none' }, { transform: 'translateY(4px)', offset: 0.15 }, { transform: 'translateY(-260px)' }], { duration: 900, easing: 'cubic-bezier(.6,0,.8,.4)' });
    var from = scrollY, t0 = performance.now();
    (function f(now) {
      var k = Math.min(1, (now - t0) / 900), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      scrollTo(0, from * (1 - e));
      if (k < 1) { requestAnimationFrame(f); return; }
      setTimeout(function () { flying = false; up.classList.remove('fly', 'show'); }, 200);
    })(t0);
  });

  /* ---------- #286 step-in mobile submenu (hamburger → X, items rise one by one, submenus slide in from the right) ---------- */
  var bg = $('.u286-bg'), mn = $('.u286-mn'), vw = mn && $('.u286-vw', mn), bk = mn && $('.u286-bk', mn), tt = mn && $('.u286-tt', mn), mOpen = false;
  /* the tree comes from the page (generated per language with real links): <script type="application/json" id="gc-menu"> */
  var TREE = (function () { var s = d.getElementById('gc-menu'); try { return s ? JSON.parse(s.textContent) : null; } catch (e) { return null; } })() || { t: 'Menu', c: [] };
  var stack = [TREE], ARW = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5L9.5 7 5 11.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function render(dir) {
    var node = stack[stack.length - 1], old = $('.u286-ls:not(.is-out)', vw), ul = el('ul', 'u286-ls'), anim = on();
    node.c.forEach(function (ch, i) {
      var li = el('li'), b = el(ch.c ? 'button' : 'a', 'u286-it');
      if (ch.c) { b.type = 'button'; b.setAttribute('aria-label', ch.t + (TREE.sub || ', mở menu con')); } else { b.href = ch.h; if (ch.cur) b.setAttribute('aria-current', 'page'); }
      b.style.transitionDelay = (0.04 * i + 0.05) + 's';
      b.innerHTML = '<span></span>' + (ch.c ? ARW : ''); b.firstChild.textContent = ch.t;
      if (ch.c) b.addEventListener('click', function () { stack.push(ch); render(1); });
      li.appendChild(b); ul.appendChild(li);
    });
    if (dir && anim) ul.style.transform = 'translateX(' + (dir * 100) + '%)';
    vw.appendChild(ul);
    if (old) { old.classList.add('is-out'); if (!anim) old.remove(); else { old.style.transform = 'translateX(' + (-dir * 30) + '%)'; old.style.opacity = 0; setTimeout(function () { old.remove(); }, 400); } }
    requestAnimationFrame(function () { requestAnimationFrame(function () { ul.style.transform = ''; ul.classList.add('is-in'); }); });
    tt.textContent = node.t; bk.hidden = stack.length < 2;
  }
  function menu(o) {
    mOpen = o; root.classList.toggle('menu-open', o); mn.hidden = !o; bg.setAttribute('aria-expanded', String(o)); bg.setAttribute('aria-label', o ? (TREE.close || 'Đóng menu') : (TREE.open || 'Mở menu'));
    if (o) { stack = [TREE]; vw.innerHTML = ''; render(0); }
  }
  if (bg && mn) {
    bg.addEventListener('click', function () { menu(!mOpen); });
    bk.addEventListener('click', function () { if (stack.length > 1) { stack.pop(); render(-1); } });
    mn.addEventListener('click', function (e) { if (e.target.closest('a') && !on()) menu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && mOpen) { menu(false); bg.focus(); } });
    addEventListener('resize', function () { if (mOpen && innerWidth > 900) menu(false); });
  }

  /* ---------- #354 morphing mega menu under "Khoá học" / "Kiến thức" (desktop header) ---------- */
  var hd = $('.u212-hd'), wrap354 = $('.u354-wrap'), pn = $('.u354-pn'), car = $('.u354-car'), pages = pn ? $$('.u354-pg', pn) : [], tabs = $$('.u212-hd ul a[data-mega]'), m354 = -1, closeT = 0;
  function openMega(i) {
    clearTimeout(closeT);
    if (i === m354) return;
    var wasOpen = m354 >= 0, dir = i > m354 ? 1 : -1;
    wrap354.classList.toggle('no-t', !wasOpen);
    pages.forEach(function (pg, k) {
      pg.className = 'u354-pg' + (k === i ? '' : k < i ? ' l' : ' r');
      if (k === m354 && k !== i) pg.className = 'u354-pg ' + (dir > 0 ? 'l' : 'r');
      $$('a', pg).forEach(function (a) { a.tabIndex = k === i ? 0 : -1; });
    });
    var pg = pages[i], w = pg.scrollWidth, h = pg.scrollHeight, t = tabs[i], r = t.getBoundingClientRect(), hr = hd.getBoundingClientRect();
    var cx = r.left + r.width / 2 - hr.left, x = clamp(cx - w / 2, 12, innerWidth - w - 12);
    pn.style.setProperty('--w', w + 'px'); pn.style.setProperty('--h', h + 'px'); pn.style.setProperty('--x', x + 'px');
    car.style.setProperty('--cx', (cx - 7) + 'px');
    tabs.forEach(function (tb, k) { tb.setAttribute('aria-expanded', String(k === i)); });
    m354 = i; wrap354.classList.add('is-open'); wrap354.setAttribute('aria-hidden', 'false');
    if (!wasOpen) requestAnimationFrame(function () { wrap354.classList.remove('no-t'); });
  }
  function closeMega() { closeT = setTimeout(function () { wrap354.classList.remove('is-open'); wrap354.setAttribute('aria-hidden', 'true'); m354 = -1; tabs.forEach(function (tb) { tb.setAttribute('aria-expanded', 'false'); }); pages.forEach(function (pg) { $$('a', pg).forEach(function (a) { a.tabIndex = -1; }); }); }, 220); }
  if (hd && pn && wrap354) {
    tabs.forEach(function (t, i) {
      t.setAttribute('aria-haspopup', 'true'); t.setAttribute('aria-expanded', 'false');
      t.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch' && fine.matches) openMega(i); });
      t.addEventListener('focus', function () { openMega(i); });
    });
    hd.addEventListener('pointerleave', closeMega);
    hd.addEventListener('focusout', function (e) { if (!hd.contains(e.relatedTarget)) closeMega(); });
    $$('.u212-hd ul a:not([data-mega])').forEach(function (a) { a.addEventListener('pointerenter', closeMega); a.addEventListener('focus', closeMega); });
    pn.addEventListener('pointerenter', function () { clearTimeout(closeT); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && m354 >= 0) { var t = tabs[m354]; closeMega(); t.focus(); } });
    d.addEventListener('click', function (e) { if (e.target.closest('.u354-it, .u354-cats a, .u212-hd ul a')) { clearTimeout(closeT); wrap354.classList.remove('is-open'); m354 = -1; } });
  }

  /* ---------- tilt + spotlight cards (Apple-style, 4° max) and magnetic small buttons ---------- */
  d.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || !on() || !fine.matches) return;
    var c = e.target.closest && e.target.closest('.u228-c, .featured, .vcard');
    if (c && !c.closest('.compare, .u223-c, .u292-g')) {
      var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      if (c !== tiltEl) { if (tiltEl) untilt(); tiltEl = c; c.classList.add('is-tilt'); }
      c.style.setProperty('--rx', (-py * 6).toFixed(2) + 'deg'); c.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
      c.style.setProperty('--sx', ((px + 0.5) * 100).toFixed(1) + '%'); c.style.setProperty('--sy', ((py + 0.5) * 100).toFixed(1) + '%');
    } else if (tiltEl) untilt();
    var m = e.target.closest && e.target.closest('.mag, .arrow, .u343-up, .u286-bg');
    if (m !== magEl) { if (magEl) magEl.style.translate = ''; magEl = m; }
    if (m) { var mr = m.getBoundingClientRect(), dx = e.clientX - (mr.left + mr.width / 2), dy = e.clientY - (mr.top + mr.height / 2); m.style.translate = (dx * 0.28).toFixed(1) + 'px ' + (dy * 0.28).toFixed(1) + 'px'; }
  }, { passive: true });
  var tiltEl = null, magEl = null;
  function untilt() { if (!tiltEl) return; tiltEl.classList.remove('is-tilt'); tiltEl.style.removeProperty('--rx'); tiltEl.style.removeProperty('--ry'); tiltEl = null; }
  d.addEventListener('pointerleave', untilt); addEventListener('scroll', untilt, { passive: true });
  FX.motion.push(function (m) { if (!m) { untilt(); if (magEl) { magEl.style.translate = ''; magEl = null; } } });

  /* ---------- #339 drag-and-snap on the video rails (desktop): drag follows the hand, release glides and snaps ---------- */
  FX.init.push(function (v) {
    $$('.rail', v).forEach(function (r) {
      var drag = null, tw = 0, moved = false;
      function step() { var c = r.firstElementChild; return c ? c.getBoundingClientRect().width + 18 : 300; }
      function glide(to) {
        to = clamp(to, 0, r.scrollWidth - r.clientWidth); cancelAnimationFrame(tw);
        if (!on()) { r.scrollLeft = to; r.classList.remove('is-drag'); return; }
        var from = r.scrollLeft, t0 = performance.now(), dur = Math.min(650, 260 + Math.abs(to - from) * 0.9);
        (function f(now) { var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); r.scrollLeft = from + (to - from) * e; if (k < 1) tw = requestAnimationFrame(f); else r.classList.remove('is-drag'); })(t0);
      }
      r.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || !on()) return; cancelAnimationFrame(tw); drag = { sx: e.clientX, x0: r.scrollLeft, h: [[performance.now(), e.clientX]] }; moved = false; r.classList.add('is-drag'); try { r.setPointerCapture(e.pointerId); } catch (er) {} });
      r.addEventListener('pointermove', function (e) { if (!drag) return; var dx = drag.sx - e.clientX; if (Math.abs(dx) > 6) moved = true; r.scrollLeft = drag.x0 + dx; drag.h.push([performance.now(), e.clientX]); if (drag.h.length > 6) drag.h.shift(); });
      function upf() {
        if (!drag) return;
        var h = drag.h, a = h[0], b = h[h.length - 1], dt = (b[0] - a[0]) / 1000, vel = dt > 0.01 ? -(b[1] - a[1]) / dt : 0;
        drag = null; var st = step(); glide(Math.round((r.scrollLeft + clamp(vel, -1800, 1800) * 0.28) / st) * st);
      }
      r.addEventListener('pointerup', upf); r.addEventListener('pointercancel', upf);
      r.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  });

  /* ---------- #351 grids lean with scroll velocity (transform on the container only) ---------- */
  FX.init.push(function (v) {
    $$('.lean', v).forEach(function (ls) {
      var lastY = scrollY, lastT = 0, vel = 0, skew = 0, sv = 0, raf2 = 0;
      function tick() {
        raf2 = 0;
        if (performance.now() - lastT > 60) vel *= 0.6;
        var t = on() ? clamp(-vel * 3.2, -4, 4) : 0;
        sv += (t - skew) * 0.2; sv *= 0.72; skew += sv;
        ls.style.transform = 'skewY(' + skew.toFixed(2) + 'deg) scaleY(' + (1 + Math.min(0.03, Math.abs(skew) * 0.006)).toFixed(3) + ')';
        if (Math.abs(skew) > 0.02 || Math.abs(sv) > 0.02 || Math.abs(vel) > 0.01) raf2 = requestAnimationFrame(tick); else ls.style.transform = '';
      }
      var f = function () { if (!on()) return; var now = performance.now(), dt = Math.max(8, now - (lastT || now - 16)); vel = vel * 0.6 + ((scrollY - lastY) / dt) * 0.4; lastY = scrollY; lastT = now; if (!raf2) raf2 = requestAnimationFrame(tick); };
      f.el = ls; GC.scrollers.push(f);
    });
  });
  FX.motion.push(function (m) { if (!m) $$('.lean').forEach(function (x) { x.style.transform = ''; }); });

  /* ---------- #081 submit button shrinks into a ring, draws a check, then the message appears (demo only) ---------- */
  FX.init.push(function (v) {
    $$('form.gform', v).forEach(function (f) {
      var btn = $('.btn[type="submit"]', f); if (!btn) return;
      var stage = el('div', 'u081-stage'); btn.parentNode.insertBefore(stage, btn); stage.appendChild(btn); btn.classList.add('u081-go');
      btn.innerHTML = '<span>' + btn.textContent + '</span>';
      stage.insertAdjacentHTML('beforeend', '<svg class="u081-ring" viewBox="0 0 80 80" aria-hidden="true"><circle class="t" cx="40" cy="40" r="36"/><circle class="p" cx="40" cy="40" r="36" pathLength="100"/></svg><svg class="u081-ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>');
      var steps = (f.dataset.steps || 'Gửi thông tin|Kiểm tra|Hoàn tất').split('|');
    stage.insertAdjacentHTML('afterend', '<div class="u081-steps" aria-hidden="true"><span>' + steps.join('</span><span>') + '</span></div>');
    });
  });
  FX.submit = function (f, done) {
    var stage = $('.u081-stage', f), ring = $('.u081-ring', stage), steps = $$('.u081-steps span', f), raf3 = 0;
    f.classList.add('is-run'); $('.ok', f).textContent = '';
    var t0 = performance.now(), DUR = 2600, delay = 350;
    (function step(now) {
      var k = clamp((now - t0 - delay) / DUR, 0, 1), e = 1 - Math.pow(1 - k, 2.2);
      ring.style.setProperty('--p', e.toFixed(4));
      steps.forEach(function (s, i) { s.classList.toggle('on', e >= [0.02, 0.45, 0.999][i]); });
      if (k < 1 && on()) { raf3 = requestAnimationFrame(step); return; }
      f.classList.remove('is-run'); f.classList.add('is-ok'); done();
      setTimeout(function () { f.classList.remove('is-ok'); ring.style.setProperty('--p', 0); steps.forEach(function (s) { s.classList.remove('on'); }); }, 3200);
    })(t0);
  };
})();

/* Green Chart demo · hero layer. Canvas backgrounds ported from Lucian UX/UI Prompt elements
   #319 (aurora) #341 (constellation mesh) #352 (flow field) #363 (dot-grid waves) #371 (contour map) #378 (particles that form words)
   plus #096 (scrubbable chart line) #252 (announcement pill) #270 (cursor-parallax floating cards)
   · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/
   and the signature WebGL candle field (Three.js r128) on the home hero. All loops pause off-screen, on hidden
   views and when motion is off (a single static frame is drawn instead). devicePixelRatio is capped at 2. */
(function () {
  var d = document, FX = window.GCFX || (window.GCFX = { init: [], refresh: [], motion: [], layout: [] });
  function on() { return window.GC && GC.motionOn(); }
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var DPR = function () { return Math.min(2, devicePixelRatio || 1); };
  var INTER = 'a,button,input,select,textarea,label,summary,.note';

  /* shared harness: size to the hero, run only while visible, pointer from the hero section */
  function harness(box, opt) {
    var cv = $('canvas', box), cx = cv.getContext('2d'), host = box.parentElement, W = 0, H = 0, vis = false, raf = 0, last = 0, ptr = null, t = 0;
    var S = { cv: cv, cx: cx, host: host, ptr: null, w: 0, h: 0, t: 0 };
    function size() {
      var r = box.getBoundingClientRect(); W = S.w = Math.max(1, Math.round(r.width)); H = S.h = Math.max(1, Math.round(r.height));
      if (opt.fixed) { cv.width = opt.fixed; cv.height = opt.fixed; } else { var k = DPR(); cv.width = W * k; cv.height = H * k; cx.setTransform(k, 0, 0, k, 0, 0); }
      if (opt.resize) opt.resize(S);
    }
    function frame(now) {
      raf = 0;
      if (!vis || !on() || box.offsetParent === null) return;
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; S.t += dt; S.dt = dt; S.now = now;
      opt.step(S);
      raf = requestAnimationFrame(frame);
    }
    function run() { if (!on()) { S.dt = 0.016; opt.still ? opt.still(S) : opt.step(S); return; } if (!raf && vis) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { if (!W) size(); run(); } }).observe(box);
    host.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var r = box.getBoundingClientRect(); S.ptr = { x: e.clientX - r.left, y: e.clientY - r.top, nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height }; if (!on()) run(); });
    host.addEventListener('pointerleave', function () { S.ptr = null; if (!on()) run(); });
    if (opt.press) host.addEventListener('pointerdown', function (e) { if (e.target.closest(INTER) || e.button) return; var r = box.getBoundingClientRect(); opt.press(S, { x: e.clientX - r.left, y: e.clientY - r.top }); if (!on()) run(); });
    FX.layout.push(function () { if (box.offsetParent) { size(); run(); } });
    FX.motion.push(function (m) { if (box.offsetParent) run(); });
    size(); opt.setup && opt.setup(S); run();
    return S;
  }

  /* #319 cursor-following aurora: five pools of brand-green light drift and blend, one trails the cursor */
  function aurora(box) {
    var S0 = 96, col = ['#00E040', '#00A448', '#1C7253', '#B4FFC8', '#2FD27A'].map(rgb), bg = rgb('#10302A'), follow = { x: 0.5, y: 0.5 };
    function rgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    var B = [0, 1, 2, 3, 4].map(function (i) { return { bx: 0.2 + (i * 0.37) % 0.7, by: 0.25 + (i * 0.53) % 0.6, r: 0.38 + (i % 3) * 0.08, ph: i * 1.7, sp: 0.18 + i * 0.03 }; });
    harness(box, { fixed: S0, step: function (S) {
      var cx = S.cx, t = S.t, ptr = S.ptr;
      var aim = ptr ? { x: ptr.nx, y: ptr.ny } : { x: 0.3 + Math.sin(t * 0.21) * 0.15, y: 0.35 + Math.cos(t * 0.17) * 0.12 };
      follow.x += (aim.x - follow.x) * (1 - Math.pow(0.15, S.dt)); follow.y += (aim.y - follow.y) * (1 - Math.pow(0.15, S.dt));
      cx.globalCompositeOperation = 'source-over'; cx.fillStyle = 'rgb(' + bg.join(',') + ')'; cx.fillRect(0, 0, S0, S0);
      cx.globalCompositeOperation = 'lighter';
      B.forEach(function (b, i) {
        var x = b.bx + Math.sin(t * b.sp + b.ph) * 0.18, y = b.by + Math.cos(t * b.sp * 0.8 + b.ph * 1.3) * 0.16;
        if (ptr) { x += (ptr.nx - x) * 0.18; y += (ptr.ny - y) * 0.18; }
        if (i === 0) { x = follow.x; y = follow.y; }
        var c = col[i], g = cx.createRadialGradient(x * S0, y * S0, 0, x * S0, y * S0, b.r * S0);
        g.addColorStop(0, 'rgba(' + c.join(',') + ',.42)'); g.addColorStop(1, 'rgba(' + c.join(',') + ',0)');
        cx.fillStyle = g; cx.fillRect(0, 0, S0, S0);
      });
    } });
  }

  /* #341 cursor-linked constellation mesh in brand greens; press an empty spot to burst new dots */
  function mesh(box) {
    var P = [], LINK = 96, PL = 150, MAX = 190, W = 0, H = 0;
    function add(x, y, vx, vy, b) { P.push({ x: x, y: y, vx: vx, vy: vy, b: b || 0 }); if (P.length > MAX) P.shift(); }
    harness(box, {
      resize: function (S) { W = S.w; H = S.h; var n = clamp(Math.round(W * H / 6500), 40, 150); if (!P.length) for (var i = 0; i < n; i++) add(Math.random() * W, Math.random() * H, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 22); },
      press: function (S, q) { var now = performance.now(); for (var k = 0; k < 9; k++) { var a = k / 9 * Math.PI * 2 + Math.random() * 0.4, s = 60 + Math.random() * 70; add(q.x, q.y, Math.cos(a) * s, Math.sin(a) * s, now); } },
      step: function (S) {
        var cx = S.cx, dt = S.dt, ptr = S.ptr, now = S.now || performance.now();
        P.forEach(function (p) {
          if (ptr) { var dx = ptr.x - p.x, dy = ptr.y - p.y, dd = Math.hypot(dx, dy); if (dd < PL && dd > 12) { p.vx += dx / dd * 28 * dt; p.vy += dy / dd * 28 * dt; } }
          var sp = Math.hypot(p.vx, p.vy); if (sp > 30) { p.vx *= 1 - 1.5 * dt; p.vy *= 1 - 1.5 * dt; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < 0 || p.x > W) { p.vx *= -1; p.x = clamp(p.x, 0, W); }
          if (p.y < 0 || p.y > H) { p.vy *= -1; p.y = clamp(p.y, 0, H); }
        });
        cx.clearRect(0, 0, W, H);
        for (var a = 0; a < P.length; a++) for (var b = a + 1; b < P.length; b++) {
          var dx2 = P[a].x - P[b].x, dy2 = P[a].y - P[b].y; if (Math.abs(dx2) > LINK || Math.abs(dy2) > LINK) continue;
          var dist = Math.hypot(dx2, dy2); if (dist > LINK) continue;
          cx.strokeStyle = 'rgba(0,224,64,' + ((1 - dist / LINK) * 0.35).toFixed(2) + ')'; cx.lineWidth = 1;
          cx.beginPath(); cx.moveTo(P[a].x, P[a].y); cx.lineTo(P[b].x, P[b].y); cx.stroke();
        }
        if (ptr) {
          P.forEach(function (p) { var dd = Math.hypot(p.x - ptr.x, p.y - ptr.y); if (dd > PL) return; cx.strokeStyle = 'rgba(255,255,255,' + ((1 - dd / PL) * 0.7).toFixed(2) + ')'; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(ptr.x, ptr.y); cx.lineTo(p.x, p.y); cx.stroke(); });
          cx.fillStyle = '#00E040'; cx.beginPath(); cx.arc(ptr.x, ptr.y, 3.5, 0, 6.2832); cx.fill();
        }
        P.forEach(function (p) { var age = (now - p.b) / 600, r = p.b && age < 1 ? 1.6 + (1 - age) * 2.4 : 1.6; cx.fillStyle = '#DFF7E8'; cx.beginPath(); cx.arc(p.x, p.y, r, 0, 6.2832); cx.fill(); });
      }
    });
  }

  /* #363 dot grid waves from the cursor; press to send a big wave across the hero */
  function dots(box) {
    var D = [], waves = [], lastAdd = 0, GAP = 22, W = 0, H = 0;
    function add(x, y, a) { waves.push({ x: x, y: y, t: performance.now(), a: a }); if (waves.length > 14) waves.shift(); }
    harness(box, {
      resize: function (S) { W = S.w; H = S.h; GAP = W > 900 ? 24 : 18; D = []; for (var y = GAP; y < H - 4; y += GAP) for (var x = GAP; x < W - 4; x += GAP) D.push([x, y]); },
      press: function (S, q) { add(q.x, q.y, 1.6); },
      step: function (S) {
        var cx = S.cx, now = S.now || performance.now(), ptr = S.ptr;
        if (ptr && now - lastAdd > 110) { lastAdd = now; add(ptr.x, ptr.y, 0.55); }
        cx.clearRect(0, 0, W, H);
        waves = waves.filter(function (w) { return now - w.t < 2600; });
        for (var i = 0; i < D.length; i++) {
          var dd = D[i], h = 0;
          for (var k = 0; k < waves.length; k++) { var w = waves[k], age = (now - w.t) / 1000, dist = Math.hypot(dd[0] - w.x, dd[1] - w.y), front = age * 170, q = dist - front; if (q > 0 || q < -90) continue; h += Math.sin(q / 14) * Math.exp(q / 60) * w.a * Math.exp(-age * 1.3); }
          var m = clamp(h, -1, 1.6), r = 1.5 + Math.max(0, m) * 3.4, calm = Math.abs(m) < 0.04;
          cx.globalAlpha = calm ? 0.28 : 1;
          cx.fillStyle = calm ? '#ffffff' : 'hsl(' + (150 - Math.max(0, m) * 30).toFixed(0) + ' 100% ' + (46 + Math.max(0, m) * 20).toFixed(0) + '%)';
          cx.beginPath(); cx.arc(dd[0], dd[1] - m * 3, r, 0, 6.2832); cx.fill();
        }
        cx.globalAlpha = 1;
      }
    });
  }

  /* #371 rising contour map: breathing terrain as contour lines; a hill rises under the cursor, press to raise a peak */
  function contour(box) {
    var GX = 60, GY = 40, sx = 1, sy = 1, hgt = null, peaks = [], hoverK = 0, acc = 0, LV = 14, W = 0, H = 0;
    function field(S, t) {
      var hv = S.ptr;
      for (var j = 0; j < GY; j++) for (var i = 0; i < GX; i++) {
        var x = i * sx, y = j * sy;
        var v = 0.42 + 0.16 * Math.sin(x * 0.009 + t * 0.25) * Math.cos(y * 0.012 - t * 0.2) + 0.1 * Math.sin((x + y) * 0.006 + t * 0.15) + 0.07 * Math.cos(x * 0.02 - y * 0.015 + t * 0.3);
        if (hv && hoverK > 0.01) { var dh = ((x - hv.x) * (x - hv.x) + (y - hv.y) * (y - hv.y)) / 9000; v += 0.32 * hoverK * Math.exp(-dh); }
        for (var p = 0; p < peaks.length; p++) { var pk = peaks[p], dd = ((x - pk.x) * (x - pk.x) + (y - pk.y) * (y - pk.y)) / (7000 * pk.s); v += 0.42 * pk.k * Math.exp(-dd); }
        hgt[j * GX + i] = v;
      }
    }
    var SEG = { 1: [3, 2], 2: [2, 1], 3: [3, 1], 4: [0, 1], 5: [3, 0, 2, 1], 6: [0, 2], 7: [3, 0], 8: [3, 0], 9: [0, 2], 10: [3, 2, 0, 1], 11: [0, 1], 12: [3, 1], 13: [2, 1], 14: [3, 2] };
    function draw(cx) {
      cx.clearRect(0, 0, W, H);
      for (var l = 1; l < LV; l++) {
        var lev = l / LV * 1.2, bold = l % 5 === 0, warm = l / LV;
        cx.strokeStyle = 'hsla(' + (165 - warm * 45).toFixed(0) + ' 90% ' + (50 + warm * 25).toFixed(0) + '% / ' + (bold ? .55 : .28) + ')';
        cx.lineWidth = bold ? 1.6 : 0.9;
        cx.beginPath();
        for (var j = 0; j < GY - 1; j++) for (var i = 0; i < GX - 1; i++) {
          var a = hgt[j * GX + i], b = hgt[j * GX + i + 1], c = hgt[(j + 1) * GX + i + 1], dd = hgt[(j + 1) * GX + i];
          var code = (a > lev ? 8 : 0) | (b > lev ? 4 : 0) | (c > lev ? 2 : 0) | (dd > lev ? 1 : 0);
          if (code === 0 || code === 15) continue;
          var x = i * sx, y = j * sy;
          var pts = [[x + sx * (lev - a) / (b - a), y], [x + sx, y + sy * (lev - b) / (c - b)], [x + sx * (lev - dd) / (c - dd), y + sy], [x, y + sy * (lev - a) / (dd - a)]];
          var sg = SEG[code];
          for (var s = 0; s < sg.length; s += 2) { cx.moveTo(pts[sg[s]][0], pts[sg[s]][1]); cx.lineTo(pts[sg[s + 1]][0], pts[sg[s + 1]][1]); }
        }
        cx.stroke();
      }
    }
    harness(box, {
      resize: function (S) { W = S.w; H = S.h; GX = clamp(Math.round(W / 12), 30, 130); GY = clamp(Math.round(H / 12), 20, 70); sx = W / (GX - 1); sy = H / (GY - 1); hgt = new Float32Array(GX * GY); acc = 1; },
      press: function (S, q) { if (peaks.length >= 3) peaks.shift(); peaks.push({ x: q.x, y: q.y, k: 0, s: 0.8 + Math.random() * 0.6 }); },
      step: function (S) {
        hoverK += ((S.ptr ? 1 : 0) - hoverK) * Math.min(1, S.dt * 3);
        peaks.forEach(function (p) { p.k += (1 - p.k) * Math.min(1, S.dt * 2.5); });
        acc += S.dt; if (acc > 0.033) { acc = 0; field(S, S.t); draw(S.cx); }
      },
      still: function (S) { hoverK = S.ptr ? 1 : 0; peaks.forEach(function (p) { p.k = 1; }); field(S, 2); draw(S.cx); }
    });
  }

  /* #352 swirling flow field: particles drift along a current leaving silky green trails; the cursor forms a vortex */
  function flow(box) {
    var P = [], W = 0, H = 0;
    function spawn(p) { p.x = Math.random() * W; p.y = Math.random() * H; p.life = 60 + Math.random() * 160; p.h = Math.random(); return p; }
    function angle(x, y, t) { return (Math.sin(x * 0.006 + t * 0.25) + Math.cos(y * 0.008 - t * 0.19) + Math.sin((x + y) * 0.004 + t * 0.12)) * Math.PI * 0.66; }
    function step(S) {
      var cx = S.cx, dt = S.dt, ptr = S.ptr, t = S.t;
      cx.globalCompositeOperation = 'destination-out'; cx.globalAlpha = 0.07; cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H);
      cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
      var groups = [[], [], [], [], [], []];
      P.forEach(function (p) {
        var a = angle(p.x, p.y, t), vx = Math.cos(a) * 46, vy = Math.sin(a) * 46;
        if (ptr) { var dx = p.x - ptr.x, dy = p.y - ptr.y, dd = Math.hypot(dx, dy); if (dd < 130 && dd > 1) { var f = (1 - dd / 130) * 160; vx += -dy / dd * f - dx / dd * f * 0.25; vy += dx / dd * f - dy / dd * f * 0.25; } }
        var nx = p.x + vx * dt, ny = p.y + vy * dt;
        groups[Math.min(5, (p.h * 6) | 0)].push(p.x, p.y, nx, ny);
        p.x = nx; p.y = ny; p.life -= 1;
        if (p.life < 0 || nx < -5 || nx > W + 5 || ny < -5 || ny > H + 5) spawn(p);
      });
      cx.lineWidth = 1.1; cx.lineCap = 'round';
      groups.forEach(function (g, k) {
        cx.strokeStyle = 'hsla(' + (150 - k * 6) + ',90%,' + (52 + k * 6) + '%,.3)';
        cx.beginPath(); for (var j = 0; j < g.length; j += 4) { cx.moveTo(g[j], g[j + 1]); cx.lineTo(g[j + 2], g[j + 3]); } cx.stroke();
      });
    }
    harness(box, {
      resize: function (S) { W = S.w; H = S.h; var n = clamp(Math.round(W * H / 620), 300, 1200); P = []; for (var i = 0; i < n; i++) P.push(spawn({})); S.cx.clearRect(0, 0, W, H); },
      step: step,
      still: function (S) { S.cx.clearRect(0, 0, W, H); for (var k = 0; k < 140; k++) { S.t += 0.016; S.dt = 0.016; step(S); } }
    });
  }

  /* #378 particles that form words: specks spring into "GREEN CHART", then the CMT lines; the cursor pushes them aside */
  function words(box) {
    var WORDS = ['GREEN CHART', 'CMT', 'LEVEL 1 · 2 · 3'], wi = 0, P = [], W = 0, H = 0, N = 900, timer = 0;
    function targets(word) {
      var o = d.createElement('canvas'); o.width = W; o.height = H;
      var c = o.getContext('2d'), size = Math.min(H * 0.55, Math.floor(W * 1.5 / Math.max(2, word.length)));
      c.fillStyle = '#fff'; c.font = '700 ' + size + 'px "Google Sans","Be Vietnam Pro",Arial,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(word, W / 2, H / 2);
      var data = c.getImageData(0, 0, W, H).data, pts = [], st = Math.max(3, Math.round(size / 40));
      for (var y = 0; y < H; y += st) for (var x = 0; x < W; x += st) if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
      for (var k = pts.length - 1; k > 0; k--) { var j = (Math.random() * (k + 1)) | 0, tmp = pts[k]; pts[k] = pts[j]; pts[j] = tmp; }
      return pts;
    }
    function assign() {
      var pts = targets(WORDS[wi]);
      P.forEach(function (p, i) {
        if (i < pts.length) { p.tx = pts[i][0] + (Math.random() - 0.5) * 1.5; p.ty = pts[i][1] + (Math.random() - 0.5) * 1.5; p.on = true; }
        else { var a = Math.random() * 6.28, r = Math.min(W, H) * 0.42 + Math.random() * 60; p.tx = W / 2 + Math.cos(a) * r; p.ty = H / 2 + Math.sin(a) * r; p.on = false; }
      });
    }
    function next() { wi = (wi + 1) % WORDS.length; assign(); P.forEach(function (p) { p.vx += (Math.random() - 0.5) * 260; p.vy += (Math.random() - 0.5) * 260; }); }
    function draw(cx) {
      cx.clearRect(0, 0, W, H); cx.globalCompositeOperation = 'lighter';
      P.forEach(function (p) { var sp = Math.min(1, Math.hypot(p.vx, p.vy) / 300); cx.fillStyle = 'hsla(' + (140 - sp * 30).toFixed(0) + ',95%,' + (62 + sp * 25).toFixed(0) + '%,' + (p.on ? 0.9 : 0.16) + ')'; cx.fillRect(p.x - 1.3, p.y - 1.3, 2.6, 2.6); });
      cx.globalCompositeOperation = 'source-over';
    }
    harness(box, {
      resize: function (S) { W = S.w; H = S.h; N = clamp(Math.round(W * H / 700), 500, 1400); if (!P.length) for (var i = 0; i < N; i++) P.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, tx: W / 2, ty: H / 2, on: true }); assign(); },
      press: function () { clearTimeout(timer); next(); },
      step: function (S) {
        var ptr = S.ptr, dt = Math.min(0.033, S.dt);
        P.forEach(function (p) {
          var ax = (p.tx - p.x) * 38 - p.vx * 7.5, ay = (p.ty - p.y) * 38 - p.vy * 7.5;
          if (ptr) { var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy; if (d2 < 4900) { var f = (1 - d2 / 4900) * 9000 / (Math.sqrt(d2) + 6); ax += dx * f / 40; ay += dy * f / 40; } }
          p.vx += ax * dt; p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        });
        draw(S.cx);
        if (!timer) timer = setTimeout(function () { timer = 0; if (on() && box.offsetParent) next(); }, 4500);
      },
      still: function (S) { P.forEach(function (p) { p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; }); draw(S.cx); }
    });
  }

  /* signature WebGL candle field (Three.js r128): instanced candlesticks rise toward the right like the LEVEL chart,
     breathe with noise, tilt with the cursor and sink back as you scroll. Falls back to the #226 beams without WebGL. */
  function glField(box) {
    var hero = box.parentElement, cv = $('canvas', box), T = window.THREE, R;
    try { R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return false; }
    R.setPixelRatio(DPR()); R.setClearColor(0x000000, 0);
    var scene = new T.Scene(); scene.fog = new T.Fog(0x1b5a46, 9, 30);
    var cam = new T.PerspectiveCamera(42, 1, 0.1, 60); cam.position.set(0, 2.4, 9);
    scene.add(new T.AmbientLight(0xbfe8d2, 0.55));
    var sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(-4, 8, 6); scene.add(sun);
    var rim = new T.DirectionalLight(0x00e040, 0.5); rim.position.set(6, 3, -8); scene.add(rim);
    var small = innerWidth < 700, NX = small ? 36 : 56, NZ = small ? 26 : 34, N = NX * NZ, SP = 0.5;
    var body = new T.InstancedMesh(new T.BoxGeometry(0.2, 1, 0.2), new T.MeshLambertMaterial({ color: 0xffffff }), N);
    var wick = new T.InstancedMesh(new T.BoxGeometry(0.035, 1, 0.035), new T.MeshBasicMaterial({ color: 0x9dffc0, transparent: true, opacity: 0.32 }), N);
    body.frustumCulled = wick.frustumCulled = false;
    scene.add(body); scene.add(wick);
    var dummy = new T.Object3D(), col = new T.Color(), lo = new T.Color(0x123a30), hi = new T.Color(0x00e040), mid = new T.Color(0x1d7a55);
    var seed = []; for (var i = 0; i < 512; i++) seed.push(Math.random());
    function hash(x, y) { var n = (x * 73 + y * 149) & 511; return seed[n < 0 ? n + 512 : n]; }
    function noise(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), dd = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + dd) * u * v;
    }
    var t = 0, ptr = { x: 0, y: 0 }, look = { x: 0, y: 0 }, scrollK = 0, raf = 0, last = 0, vis = false, W = 0, H = 0;
    function size() { var r = box.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); R.setPixelRatio(DPR()); R.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); }
    function draw(dt) {
      t += dt * 0.35;
      for (var z = 0, i = 0; z < NZ; z++) for (var x = 0; x < NX; x++, i++) {
        var px = (x - NX / 2 + 0.5) * SP, pz = -(z * SP) + 3;
        var n = noise(x * 0.11 + t * 0.6, z * 0.13 + t * 0.2), n2 = noise(x * 0.31 + 40 - t * 0.4, z * 0.29 + 9);
        var trend = 0.35 + (x / NX) * 1.1 + (z / NZ) * 0.3;
        var h = Math.max(0.08, trend * (0.35 + n * 1.1) + n2 * 0.5);
        dummy.position.set(px, h / 2, pz); dummy.scale.set(1, h, 1); dummy.updateMatrix(); body.setMatrixAt(i, dummy.matrix);
        var wh = h + 0.35 + n2 * 0.6; dummy.position.set(px, wh / 2, pz); dummy.scale.set(1, wh, 1); dummy.updateMatrix(); wick.setMatrixAt(i, dummy.matrix);
        var k = clamp((h - 0.2) / 2.4, 0, 1);
        if (k < 0.72) col.copy(lo).lerp(mid, k / 0.72); else col.copy(mid).lerp(hi, (k - 0.72) / 0.28);
        body.setColorAt(i, col);
      }
      body.instanceMatrix.needsUpdate = true; wick.instanceMatrix.needsUpdate = true; if (body.instanceColor) body.instanceColor.needsUpdate = true;
      look.x += (ptr.x - look.x) * Math.min(1, dt * 3); look.y += (ptr.y - look.y) * Math.min(1, dt * 3);
      cam.position.set(look.x * 1.8, 2.4 - look.y * 0.7 + scrollK * 1.5, 9 + scrollK * 6);
      cam.lookAt(0.8, 0.5 - scrollK * 0.6, -4);
      R.render(scene, cam);
    }
    var slow = 0, frames = 0;
    function frame(now) {
      raf = 0;
      if (!vis || !on() || box.offsetParent === null) return;
      var real = (now - last) / 1000, dt = Math.min(0.05, Math.max(0, real)); last = now;
      /* frame-time guard: on machines without a usable GPU (> 60 ms/frame for 2 s) hand the hero back to the #226 beams */
      if (frames++ > 10) { slow = real > 0.06 ? slow + 1 : Math.max(0, slow - 1); if (slow > 30) { hero.classList.remove('has-gl'); box.style.display = 'none'; return; } }
      draw(dt); raf = requestAnimationFrame(frame);
    }
    function run() { if (!on()) { draw(0); return; } if (!raf && vis) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { size(); run(); } }).observe(box);
    hero.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var r = hero.getBoundingClientRect(); ptr.x = (e.clientX - r.left) / r.width - 0.5; ptr.y = (e.clientY - r.top) / r.height - 0.5; });
    hero.addEventListener('pointerleave', function () { ptr.x = ptr.y = 0; });
    var sc = function () { scrollK = clamp(scrollY / Math.max(1, hero.offsetHeight), 0, 1); box.style.setProperty('--sk', scrollK.toFixed(3)); };
    sc.el = box; GC.scrollers.push(sc);
    FX.layout.push(function () { if (box.offsetParent) { size(); run(); } });
    FX.motion.push(function () { if (box.offsetParent) run(); });
    hero.classList.add('has-gl'); size(); draw(0); run();
    return true;
  }
  function whenThree(cb) {
    if (window.THREE) return cb();
    var n = 0, iv = setInterval(function () { if (window.THREE) { clearInterval(iv); cb(); } else if (++n > 160) clearInterval(iv); }, 50);
  }

  var MAP = { aurora: aurora, mesh: mesh, dots: dots, contour: contour, flow: flow, words: words };
  FX.init.push(function (v) {
    $$('.fxbg', v).forEach(function (box) {
      var k = box.dataset.fx;
      if (k === 'gl') whenThree(function () { try { glField(box); } catch (e) { if (window.console) console.error(e); } });
      else if (MAP[k]) MAP[k](box);
    });
  });

  /* #270 cursor-parallax floating fact cards around the home chart (each depth shifts by a different amount, bobbing when idle) */
  FX.init.push(function (v) {
    var hero = $('.hero', v); if (!hero) return;
    var L = $$('.u270-l', hero); if (!L.length) return;
    function move(nx, ny) { L.forEach(function (l) { var z = +l.dataset.z; l.style.transform = on() ? 'translate(' + (-nx * 18 * z).toFixed(1) + 'px,' + (-ny * 14 * z).toFixed(1) + 'px)' : ''; }); }
    hero.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var r = hero.getBoundingClientRect(); move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5); });
    hero.addEventListener('pointerleave', function () { move(0, 0); });
    FX.motion.push(function (m) { if (!m) move(0, 0); });
  });

  /* #252 shining expandable announcement pill: a streak sweeps every few seconds and the message rolls to the next real date */
  FX.init.push(function (v) {
    var root = $('.u252', v); if (!root) return;
    var pl = $('.u252-pl', root), rs = $('.u252-rs', root), rows = $$('.u252-rs span', root), n = rows.length - 1, k = 0, open = false, vis = true, t = 0;
    function label() { pl.setAttribute('aria-label', rows[k % n].textContent + ', bấm để xem các mốc'); }
    function tick() {
      clearTimeout(t); t = setTimeout(tick, 4000);
      if (open || !vis || !on() || root.offsetParent === null) return;
      root.classList.remove('is-shine'); void root.offsetWidth; root.classList.add('is-shine');
      var rh = rows[0].offsetHeight || 20;
      k += 1; rs.style.transition = ''; rs.style.transform = 'translateY(' + (-rh * k) + 'px)'; label();
      if (k === n) setTimeout(function () { rs.style.transition = 'none'; k = 0; rs.style.transform = 'translateY(0)'; label(); }, 560);
    }
    pl.addEventListener('click', function () { open = !open; root.classList.toggle('is-open', open); pl.setAttribute('aria-expanded', String(open)); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(root);
    label(); t = setTimeout(tick, 1600);
  });

  /* #096 scrubbable hero chart: sweep across the LEVEL chart and the line splits into colour (left) and grey (right);
     the dot rides the line and a tag names the nearest level. Let go and the dot glides back to the end. */
  FX.init.push(function (v) {
    var ch = $('.chart', v); if (!ch) return;
    var svg = $('svg', ch), pl = $('#pl', svg), clip = $('#chclip rect', svg), dot = $('.u096-dot', svg), ring = $('.u096-ring', svg), cur = $('.u096-cur', svg), tag = $('.u096-tag', ch);
    if (!clip) return;
    var LEN = pl.getTotalLength(), at = 1, scrub = false, back = 0;
    var LV = [[330, 'LEVEL 1 · 27 buổi · 8.000.000 ₫'], [600, 'LEVEL 2 · 24 buổi · 10.000.000 ₫'], [870, 'LEVEL 3 · 24 buổi · 12.000.000 ₫']];
    function ptAtX(x) { var lo = 0, hi = LEN; for (var i = 0; i < 18; i++) { var m = (lo + hi) / 2; if (pl.getPointAtLength(m).x < x) lo = m; else hi = m; } return pl.getPointAtLength(lo); }
    function place() {
      var x = at * 1100, p = ptAtX(x);
      clip.setAttribute('width', x.toFixed(1));
      cur.setAttribute('x1', p.x); cur.setAttribute('x2', p.x);
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); ring.setAttribute('cx', p.x); ring.setAttribute('cy', p.y);
      var near = null; LV.forEach(function (l) { if (Math.abs(l[0] - x) < 70) near = l; });
      tag.textContent = near ? near[1] : 'Lộ trình 3 level · ' + Math.round(at * 100) + '%';
      var vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect(), px = (p.x - vb.x) / vb.width * r.width, tw = tag.offsetWidth;
      tag.style.setProperty('--tx', clamp(px - tw / 2, 8, r.width - tw - 8).toFixed(1) + 'px');
      ch.setAttribute('aria-valuenow', Math.round(at * 100)); ch.setAttribute('aria-valuetext', tag.textContent);
    }
    function idx(e) { var vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect(); return clamp((vb.x + (e.clientX - r.left) / r.width * vb.width) / 1100, 0, 1); }
    function start(e) { cancelAnimationFrame(back); scrub = true; ch.classList.add('scrub'); at = idx(e); place(); }
    function end() {
      if (!scrub) return; scrub = false; ch.classList.remove('scrub');
      var from = at, t0 = performance.now(), dur = on() ? 450 : 1;
      (function f(now) { var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); at = from + (1 - from) * e; place(); if (k < 1) back = requestAnimationFrame(f); })(t0);
    }
    var touching = false;
    ch.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; touching = true; try { ch.setPointerCapture(e.pointerId); } catch (er) {} start(e); });
    ch.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || touching) start(e); });
    ch.addEventListener('pointerup', function () { if (touching) { touching = false; end(); } });
    ch.addEventListener('pointercancel', function () { touching = false; end(); });
    ch.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') end(); });
    ch.addEventListener('keydown', function (e) {
      var s = { ArrowLeft: -0.02, ArrowRight: 0.02 }[e.key]; if (e.key === 'Escape') return end();
      if (e.key === 'Home') s = -2; else if (e.key === 'End') s = 2; if (s === undefined) return;
      e.preventDefault(); cancelAnimationFrame(back); scrub = true; ch.classList.add('scrub'); at = clamp(at + s, 0, 1); place();
    });
    ch.addEventListener('blur', end);
    FX.refresh.push(function (cv) { if (cv === v) { at = 1; place(); } });
    place();
  });
})();

/* Green Chart demo · scroll-driven sections and text motion. Ported from Lucian UX/UI Prompt elements
   #214 #220 #223 #241 #281 #282 #329 #338 #370 #388 #389 #390 #392 #394 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/
   Each piece is driven by the page scroll (GC.scrollers, batched into one frame by app.js) or by visibility.
   Without motion every piece shows its final state and nothing runs. */
(function () {
  var d = document, FX = window.GCFX || (window.GCFX = { init: [], refresh: [], motion: [], layout: [] });
  function on() { return window.GC && GC.motionOn(); }
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function scroller(elm, fn) { fn.el = elm; GC.scrollers.push(fn); FX.layout.push(function () { if (elm.offsetParent) fn(); }); FX.motion.push(function () { if (elm.offsetParent) fn(); }); }
  var HEAD = function () { return (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--hdh')) || 58); };

  /* #223 shrinking sticky card stack + #329 background that blends per card (Khoá học: Level 1 → 2 → 3 → bổ trợ) */
  FX.init.push(function (v) {
    $$('.u223-wl', v).forEach(function (wl) {
      var cards = $$('.u223-c', wl), sec = wl.closest('.band'), BG = JSON.parse(wl.dataset.bg || '[]').map(hex);
      function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
      cards.forEach(function (c, i) { c.style.setProperty('--i', i); });
      scroller(wl, function () {
        var m = on(), top = HEAD() + 14, pos = cards.map(function (c) { return c.getBoundingClientRect().top; }), ch = cards[0].offsetHeight || 420;
        cards.forEach(function (c, i) {
          var depth = 0;
          if (m) for (var j = i + 1; j < cards.length; j++) { var stick = top + j * 12, dd = (pos[j] - stick) / ch; depth += clamp(1 - dd, 0, 1); }
          c.style.transform = m ? 'scale(' + (1 - depth * 0.06).toFixed(3) + ')' : '';
          c.style.setProperty('--sh', (depth * 0.22).toFixed(3));
        });
        if (BG.length > 1 && sec) {
          var r = wl.getBoundingClientRect(), f = m ? clamp((innerHeight * 0.5 - r.top) / Math.max(1, r.height - innerHeight * 0.5), 0, 1) * (BG.length - 1) : 0;
          var i = Math.min(BG.length - 2, Math.floor(f)), t = f - i, c = BG[i].map(function (x, k) { return Math.round(x + (BG[i + 1][k] - x) * t); });
          sec.style.setProperty('--bg', 'rgb(' + c.join(',') + ')');
        }
      });
    });
  });

  /* #241 vertical scroll, horizontal track (Kiến thức: 8 chuyên mục flow sideways while the view stays pinned) */
  FX.init.push(function (v) {
    $$('.u241', v).forEach(function (root) {
      var run = $('.u241-run', root), pin = $('.u241-pin', root), vp = $('.u241-vp', root), tr = $('.u241-tr', root), bar = $('.u241-bar i', root), dots = $('.u241-dots', root), panels = $$('.u241-p', root), dist = 0;
      panels.forEach(function () { dots.appendChild(el('i')); });
      function measure() { if (!on()) { run.style.height = ''; return; } dist = Math.max(0, tr.scrollWidth - vp.clientWidth); run.style.height = (pin.offsetHeight + dist) + 'px'; }
      FX.layout.push(function () { if (root.offsetParent) measure(); });
      FX.motion.push(function () { if (root.offsetParent) { measure(); tr.style.transform = ''; } });
      scroller(root, function () {
        if (!on()) { tr.style.transform = ''; bar.style.transform = 'scaleX(1)'; return; }
        if (!dist) measure();
        var y = clamp(-(run.getBoundingClientRect().top - HEAD()), 0, dist), p = dist ? y / dist : 0;
        tr.style.transform = 'translateX(' + (-y).toFixed(1) + 'px)';
        panels.forEach(function (pl) { var f = (pl.offsetLeft - y) / (pl.offsetWidth + 14); $('.u241-n', pl).style.transform = 'translateX(' + (f * 26).toFixed(1) + 'px)'; });
        bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
        var cur = Math.round(p * (panels.length - 1));
        Array.prototype.forEach.call(dots.children, function (dd, i) { dd.classList.toggle('on', i === cur); });
      });
      measure();
    });
  });

  /* #370 timeline that lights up + #390 rolling chapter number (CMT Level 1: 15 học phần) */
  FX.init.push(function (v) {
    $$('.u370', v).forEach(function (root) {
      var tl = $('.u370-tl', root), ln = $('.u370-ln', root), items = $$('.u370-ev', root), strip = $('.u390-strip', root), tt = $('.u390-tt', root), gv = $('.u390-g .v', root), C = 2 * Math.PI * 16, curI = -1;
      items.forEach(function (it, i) { var n = el('span'); n.textContent = it.dataset.n || String(i + 1).padStart(2, '0'); if (strip) strip.appendChild(n); it.style.setProperty('--i', i); });
      if (gv) gv.style.strokeDasharray = C;
      function title(i) {
        if (!tt) return;
        $$('span.in', tt).forEach(function (x) { x.remove(); });
        var old = $('span:not(.out)', tt), n = el('span', 'in'); n.textContent = items[i].dataset.title || ''; tt.appendChild(n);
        if (old) { old.className = 'out'; setTimeout(function () { old.remove(); }, 450); }
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (n.className === 'in') n.className = ''; }); });
      }
      scroller(root, function () {
        var m = on(), tlr = tl.getBoundingClientRect(), tip = m ? innerHeight * 0.6 - tlr.top : 1e9, h = ln.offsetHeight || 1;
        ln.style.setProperty('--p', clamp(tip / h, 0, 1).toFixed(4));
        var f = 0;
        items.forEach(function (it, i) { var y = it.offsetTop - tl.offsetTop; var onI = y + 18 <= tip; it.classList.toggle('on', onI); if (m && tip >= y) f = i + clamp((tip - y) / Math.max(1, it.offsetHeight + 10), 0, 1); });
        if (!m) f = 0;
        var i = Math.min(items.length - 1, Math.floor(f)), inCh = f - i, roll = clamp(i + Math.max(0, inCh - 0.75) / 0.25, 0, items.length - 1);
        if (strip) strip.style.transform = 'translateY(' + (-(strip.firstChild ? strip.firstChild.offsetHeight : 0) * roll).toFixed(1) + 'px)';
        if (gv) gv.style.strokeDashoffset = (C * (1 - Math.min(1, inCh))).toFixed(1);
        if (i !== curI) { curI = i; title(i); }
      });
    });
  });

  /* #390 rolling chapter numbers for the article sidebar: the big number rolls to the chapter you read, the ring fills within it */
  FX.init.push(function (v) {
    $$('.u390-art', v).forEach(function (side) {
      var art = d.getElementById(side.dataset.for), hs = $$('h2', art), strip = $('.u390-strip', side), tt = $('.u390-tt', side), gv = $('.u390-g .v', side), C = 2 * Math.PI * 16, curI = -1;
      hs.forEach(function (h, i) { var n = el('span'); n.textContent = String(i + 1).padStart(2, '0'); strip.appendChild(n); });
      gv.style.strokeDasharray = C;
      function title(i) {
        $$('span.in', tt).forEach(function (x) { x.remove(); });
        var old = $('span:not(.out)', tt), n = el('span', 'in'); n.textContent = hs[i].textContent; tt.appendChild(n);
        if (old) { old.className = 'out'; setTimeout(function () { old.remove(); }, 450); }
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (n.className === 'in') n.className = ''; }); });
      }
      scroller(side, function () {
        var y = innerHeight * 0.3, f = 0;
        hs.forEach(function (h, i) { var top = h.getBoundingClientRect().top, end = hs[i + 1] ? hs[i + 1].getBoundingClientRect().top : art.getBoundingClientRect().bottom; if (top <= y) f = i + clamp((y - top) / Math.max(1, end - top), 0, 1); });
        var i = Math.min(hs.length - 1, Math.floor(f)), inCh = f - i, roll = on() ? clamp(i + Math.max(0, inCh - 0.75) / 0.25, 0, hs.length - 1) : i;
        strip.style.transform = 'translateY(' + (-(strip.firstChild ? strip.firstChild.offsetHeight : 0) * roll).toFixed(1) + 'px)';
        gv.style.strokeDashoffset = (C * (1 - Math.min(1, inCh))).toFixed(1);
        if (i !== curI) { curI = i; title(i); }
      });
    });
  });

  /* #282 widening photo reveal: a slit in the middle opens to both sides as the photo scrolls in; the caption rises after */
  FX.init.push(function (v) {
    var figs = $$('.u282-fr', v); if (!figs.length) return;
    scroller(v, function () {
      var m = on(), vh = innerHeight;
      figs.forEach(function (f) { var y = f.getBoundingClientRect().top, c = m ? clamp((y - vh * 0.42) / (vh * 0.48), 0, 1) : 0; f.closest('.u282').style.setProperty('--c', c.toFixed(3)); });
    });
  });

  /* #394 scroll-driven marquee rows: three rows of brand lines drift in opposite directions and speed up with your scroll */
  FX.init.push(function (v) {
    $$('.u394', v).forEach(function (root) {
      var rows = $$('.u394-row', root).map(function (r, i) { return { el: r, x: -Math.random() * 200, dir: i % 2 ? 1 : -1, w: 0 }; });
      var lastY = scrollY, boost = 0, sign = 1, last = 0, vis = false, skew = 0, raf = 0;
      scroller(root, function () { var dy = scrollY - lastY; lastY = scrollY; boost = Math.min(40, boost + Math.abs(dy) * 0.25); if (dy) sign = dy > 0 ? 1 : -1; });
      function frame(now) {
        raf = 0;
        if (!vis || !on() || root.offsetParent === null) { rows.forEach(function (r) { r.el.style.transform = ''; }); return; }
        var dt = Math.max(0, Math.min(50, now - (last || now))) / 16.7; last = now;
        boost *= Math.pow(0.92, dt);
        skew += ((boost > 1 ? sign * Math.min(8, boost * 0.35) : 0) - skew) * 0.15 * dt;
        rows.forEach(function (r) {
          if (!r.w) r.w = r.el.firstChild.offsetWidth;
          r.x += r.dir * sign * (0.5 + boost) * dt;
          if (r.x < -r.w) r.x += r.w; if (r.x > 0) r.x -= r.w;
          r.el.style.transform = 'translateX(' + r.x.toFixed(1) + 'px) skewX(' + (-skew * r.dir).toFixed(2) + 'deg)';
        });
        raf = requestAnimationFrame(frame);
      }
      function go() { if (!raf && vis && on()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; go(); }).observe(root);
      FX.motion.push(go); FX.layout.push(function () { rows.forEach(function (r) { r.w = 0; }); go(); });
    });
  });

  /* #338 rolling word cube (Khoá học: the four steps roll on the faces of a 3D box, caption turns over, bar fills) */
  FX.init.push(function (v) {
    $$('.u338', v).forEach(function (root) {
      var cube = $('.u338-cube', root), desc = $('.u338-d', root), dotsEl = $('.u338-dots', root), bar = $('.u338-bar i', root), faces = $$('.u338-f', cube);
      var DESC = JSON.parse(root.dataset.desc), idx = 0, turns = 0, hold = false, timer = 0, anim = null;
      var dots = faces.map(function (f, i) { var b = el('button', 'u338-dot'); b.type = 'button'; b.setAttribute('aria-label', f.textContent); b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', function () { go(i - idx); }); dotsEl.appendChild(b); return b; });
      function go(step) {
        if (!step) return;
        idx = (idx + step + 40) % 4; turns += step;
        cube.style.setProperty('--r', (turns * 90) + 'deg');
        faces.forEach(function (f, k) { f.classList.toggle('on', k === idx); f.setAttribute('aria-hidden', String(k !== idx)); });
        dots.forEach(function (dd, k) { dd.setAttribute('aria-pressed', String(k === idx)); });
        var old = $('span:not(.out)', desc), n = el('span', 'in'); n.textContent = DESC[idx]; desc.appendChild(n);
        if (old) { old.className = 'out'; setTimeout(function () { old.remove(); }, 700); }
        requestAnimationFrame(function () { requestAnimationFrame(function () { n.className = ''; }); });
        restart();
      }
      function restart() {
        clearTimeout(timer); if (anim) anim.cancel();
        if (!on() || !bar.animate || root.offsetParent === null) return;
        anim = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 2600, easing: 'linear', fill: 'forwards' });
        if (hold) anim.pause();
        timer = setTimeout(function tick() { if (!root.offsetParent || !on()) return; if (hold) { timer = setTimeout(tick, 300); return; } go(1); }, 2600);
      }
      $('.u338-up', root).addEventListener('click', function () { go(-1); }); $('.u338-dn', root).addEventListener('click', function () { go(1); });
      cube.addEventListener('pointerenter', function () { hold = true; if (anim) anim.pause(); }); cube.addEventListener('pointerleave', function () { hold = false; if (anim) anim.play(); });
      faces[0].classList.add('on'); dots[0].setAttribute('aria-pressed', 'true'); faces.forEach(function (f, k) { if (k) f.setAttribute('aria-hidden', 'true'); });
      desc.appendChild(el('span', '', '')).textContent = DESC[0];
      FX.refresh.push(function (cv) { if (cv === v) restart(); });
      FX.motion.push(function (m) { if (!m) { clearTimeout(timer); if (anim) anim.cancel(); } else restart(); });
    });
  });

  /* #281 sweeping highlighter: brand-green marker sweeps the key phrases one after another when the paragraph scrolls in */
  FX.init.push(function (v) {
    $$('.u281', v).forEach(function (root) {
      var marks = $$('mark', root), at = 0.25;
      marks.forEach(function (m) { var dd = Math.min(1.4, 0.25 + m.textContent.length * 0.045); m.style.setProperty('--d', dd.toFixed(2) + 's'); m.style.setProperty('--w', at.toFixed(2) + 's'); at += dd + 0.12; });
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && on()) { root.classList.remove('is-off'); void root.offsetWidth; root.classList.add('is-on'); } }, { threshold: 0.4 });
      io.observe(root);
      FX.refresh.push(function (cv) { if (cv !== v) return; if (on()) { root.classList.remove('is-on'); root.classList.add('is-off'); } else root.classList.add('is-on'); });
    });
  });

  /* #392 hand-drawn annotations: sketchy circles and underlines are drawn twice, slightly wobbly, onto the key words */
  FX.init.push(function (v) {
    $$('.u392-bx', v).forEach(function (bx) {
      var NS = 'http://www.w3.org/2000/svg', svg = $('.u392-svg', bx), words = $$('.u392-p b', bx), run = 0;
      function j(n) { return (Math.random() - 0.5) * 2 * n; }
      function shape(r, type, pass) {
        var x = r.x, y = r.y, w = r.w, h = r.h, s = pass ? 1.6 : 1, out, i;
        if (type === 'underline') return 'M' + (x - 2) + ' ' + (y + h - 1 + j(1.5)) + ' Q' + (x + w / 2) + ' ' + (y + h + 3 * s + j(2)) + ' ' + (x + w + 3) + ' ' + (y + h - 2 + j(1.5));
        if (type === 'strike') return 'M' + (x - 3) + ' ' + (y + h * 0.55 + j(2)) + ' Q' + (x + w / 2) + ' ' + (y + h * 0.45 + j(3)) + ' ' + (x + w + 3) + ' ' + (y + h * 0.52 + j(2));
        if (type === 'box') { var pts = [[x - 4 + j(1.5), y - 1 + j(1.5)], [x + w + 4 + j(1.5), y - 2 + j(1.5)], [x + w + 3 + j(1.5), y + h + 2 + j(1.5)], [x - 3 + j(1.5), y + h + 1 + j(1.5)], [x - 4 + j(1), y - 3 + j(1)]]; return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'); }
        var cx = x + w / 2, cy = y + h / 2, rx = w / 2 + 9, ry = h / 2 + 5, a0 = -2.2 + j(0.3); out = [];
        for (i = 0; i <= 26; i++) { var a = a0 + (i / 26) * (Math.PI * 2 + 0.6), k = 1 + j(0.05) + i * 0.004 * s; out.push((cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k).toFixed(1)); }
        return 'M' + out.join(' L');
      }
      function rectOf(b) { var br = bx.getBoundingClientRect(), rs = b.getClientRects()[0] || b.getBoundingClientRect(); return { x: rs.left - br.left, y: rs.top - br.top + 4, w: rs.width, h: rs.height - 8 }; }
      function draw() {
        var me = ++run; svg.textContent = '';
        words.forEach(function (b, wi) {
          var r = rectOf(b), type = b.dataset.mark || (wi % 2 ? 'underline' : 'circle');
          [0, 1].forEach(function (pass) {
            var p = d.createElementNS(NS, 'path'); p.setAttribute('d', shape(r, type, pass)); if (pass) p.setAttribute('class', 'b'); svg.appendChild(p);
            var len = p.getTotalLength(); p.style.strokeDasharray = len + ' ' + len;
            if (!on() || !p.animate) { p.style.strokeDashoffset = 0; return; }
            p.style.strokeDashoffset = len;
            var a = p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 380 + len * 1.4, delay: wi * 420 + pass * 200, easing: 'cubic-bezier(.55,.1,.35,1)', fill: 'both' });
            a.onfinish = function () { if (me === run) p.style.strokeDashoffset = 0; };
          });
        });
      }
      var seen = false, io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !seen) { seen = true; draw(); } }, { threshold: 0.5 });
      io.observe(bx);
      FX.refresh.push(function (cv) { if (cv === v) { seen = false; if (!on()) { seen = true; draw(); } else svg.textContent = ''; } });
      FX.layout.push(function () { if (bx.offsetParent && seen) { var keep = run; draw(); run = keep + 1; } });
    });
  });

  /* #388 word-by-word focus quote (Giảng viên): the words of each real testimonial come into focus one by one */
  FX.init.push(function (v) {
    $$('.u388', v).forEach(function (root) {
      var st = $('.u388-st', root), by = $('.u388-by', root), dotsEl = $('.u388-dots', root), Q = JSON.parse(root.dataset.q), cur = -1, anim = null, hold = false, DUR = 5200;
      var lbl = root.dataset.label || 'Cảm nhận';
      var dots = Q.map(function (q, i) { var b = el('button', 'u388-dot', '<i></i>'); b.type = 'button'; b.setAttribute('aria-label', lbl + ' ' + (i + 1) + ' / ' + Q.length); b.addEventListener('click', function () { show(i); }); dotsEl.appendChild(b); return b; });
      function build(i) {
        var q = el('blockquote', 'u388-q'); q.setAttribute('aria-live', 'polite');
        Q[i][0].split(' ').forEach(function (w, k) { if (k) q.appendChild(d.createTextNode(' ')); var s = el('span', 'u388-w'); s.textContent = w; s.style.setProperty('--i', k); s.style.setProperty('--r', Math.round(Math.random() * 160)); s.style.setProperty('--dx', ((Math.random() - 0.5) * 16).toFixed(1) + 'px'); q.appendChild(s); });
        return q;
      }
      function show(i) {
        if (i === cur) return;
        var m = on(), old = $('.u388-q:not(.out)', st);
        if (old) { old.classList.remove('in'); old.classList.add('out'); old.removeAttribute('aria-live'); setTimeout(function () { old.remove(); }, m ? 700 : 0); }
        cur = i;
        var q = build(i); st.insertBefore(q, by);
        if (m) setTimeout(function () { q.classList.add('in'); }, old ? 260 : 20); else q.classList.add('in');
        by.classList.add('swap');
        by.innerHTML = '<div><img class="u388-av" alt="" width="36" height="36"></div><div><b class="u388-nm"></b><span class="u388-role"></span></div>';
        var av = $('img', by); if (Q[i][3]) av.src = (/^(https?:)?\//.test(Q[i][3]) ? '' : GC.root + 'img/') + Q[i][3]; else av.remove();
        $('.u388-nm', by).textContent = Q[i][1]; $('.u388-role', by).textContent = Q[i][2];
        void by.offsetWidth; setTimeout(function () { by.classList.remove('swap'); }, 360);
        dots.forEach(function (dd, k) { dd.classList.toggle('past', k < i); dd.setAttribute('aria-current', String(k === i)); });
        run();
      }
      function run() {
        if (anim) anim.cancel();
        var bar = $('i', dots[cur]); if (!on() || !bar.animate || root.offsetParent === null) return;
        anim = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: DUR, fill: 'forwards' });
        if (hold) anim.pause();
        anim.onfinish = function () { if (root.offsetParent && on()) show((cur + 1) % Q.length); };
      }
      $('.u388-nx', root).addEventListener('click', function () { show((cur + 1) % Q.length); });
      $('.u388-pv', root).addEventListener('click', function () { show((cur + Q.length - 1) % Q.length); });
      st.addEventListener('pointerenter', function () { hold = true; if (anim) anim.pause(); }); st.addEventListener('pointerleave', function () { hold = false; if (anim) anim.play(); });
      show(0);
      FX.refresh.push(function (cv) { if (cv === v) run(); });
      FX.motion.push(function (m) { if (!m && anim) anim.cancel(); });
    });
  });

  /* #389 side-expanding photo panels (Video: five real thumbnails; hover or focus opens one, click opens YouTube) */
  FX.init.push(function (v) {
    $$('.u389', v).forEach(function (root) {
      var ps = $$('.u389-p', root), cur = 0;
      function open(i) { cur = i; ps.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-expanded', String(k === i)); }); }
      ps.forEach(function (b, i) {
        b.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') open(i); });
        b.addEventListener('focus', function () { open(i); });
        b.addEventListener('click', function (e) { if (!b.classList.contains('on')) { e.preventDefault(); open(i); } });
        b.addEventListener('keydown', function (e) { var dd = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!dd) return; e.preventDefault(); var n = clamp(cur + dd, 0, ps.length - 1); open(n); ps[n].focus(); });
      });
      open(0);
    });
  });

  /* #214 living bento: each tile plays its own little scene on hover or focus */
  FX.init.push(function (v) {
    $$('.u214-t', v).forEach(function (t) {
      function onF() { t.classList.add('is-on'); } function off() { t.classList.remove('is-on'); }
      t.addEventListener('pointerenter', onF); t.addEventListener('pointerleave', off); t.addEventListener('focusin', onF); t.addEventListener('focusout', off);
    });
  });

  /* #220 selection quote tooltip (Bài viết): select a sentence and a small toolbar offers highlight and copy */
  FX.init.push(function (v) {
    var art = $('.prose', v); if (!art) return;
    var S = GC.json('gc-strings') || {};
    var tip = el('div', 'ux u220-tip', '<button type="button" class="u220-hl" aria-label="' + (S.hl || 'Tô sáng đoạn đã chọn') + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5l4 4-6 6H3.5v-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M2 14.5h12" stroke="#00E040" stroke-width="2" stroke-linecap="round"/></svg></button><button type="button" class="u220-cp" aria-label="' + (S.cp || 'Chép trích dẫn') + '"><svg class="u220-cpi" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><svg class="u220-ok" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="#4ADE80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>');
    tip.setAttribute('role', 'toolbar'); tip.setAttribute('aria-label', 'Công cụ trích dẫn');
    var toast = el('div', 'ux u220-toast'); toast.setAttribute('role', 'status');
    v.appendChild(tip); v.appendChild(toast);
    var range = null, tt = 0;
    function hide() { tip.classList.remove('is-on'); range = null; }
    function note(msg) { clearTimeout(tt); toast.textContent = msg; toast.classList.add('is-on'); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1600); }
    art.addEventListener('mouseup', function () {
      setTimeout(function () {
        var sel = getSelection && getSelection();
        if (!sel || sel.isCollapsed || !art.contains(sel.anchorNode) || sel.toString().trim().length < 3) { hide(); return; }
        range = sel.getRangeAt(0).cloneRange();
        var r = range.getClientRects()[0] || range.getBoundingClientRect(), vr = v.getBoundingClientRect();
        tip.style.left = clamp(r.left + r.width / 2 - vr.left, 60, vr.width - 60) + 'px'; tip.style.top = (r.top - vr.top) + 'px';
        tip.classList.add('is-on'); $('.u220-cp', tip).classList.remove('is-ok');
      }, 0);
    });
    $('.u220-hl', tip).addEventListener('click', function () {
      if (!range) return;
      try { var m = el('mark', 'u220-s'); range.surroundContents(m); requestAnimationFrame(function () { m.classList.add('is-hl'); }); note(S.hlDone || 'Đã tô sáng'); } catch (e) { note(S.hlFail || 'Chọn trong một đoạn để tô sáng'); }
      getSelection().removeAllRanges(); hide();
    });
    $('.u220-cp', tip).addEventListener('click', function () {
      var text = range ? range.toString() : '';
      try { if (navigator.clipboard && text) navigator.clipboard.writeText('“' + text.trim() + '” — greenchart.vn').catch(function () {}); } catch (e) {}
      $('.u220-cp', tip).classList.add('is-ok'); note(S.cpDone || 'Đã chép trích dẫn'); setTimeout(hide, 700);
    });
    d.addEventListener('pointerdown', function (e) { if (!e.target.closest('.u220-tip')) hide(); });
  });

  /* parallax depth: the lecturer portrait and badge drift at different speeds with scroll and cursor (Apple-style) */
  FX.init.push(function (v) {
    var layers = $$('.plx', v); if (!layers.length) return;
    var hero = layers[0].closest('.band'), ptr = { x: 0, y: 0 };
    function apply() {
      var m = on(), vh = innerHeight;
      layers.forEach(function (l) {
        if (!m) { l.style.transform = ''; return; }
        var r = l.getBoundingClientRect(), c = (r.top + r.height / 2 - vh / 2) / vh, z = +l.dataset.depth || 0.3;
        l.style.transform = 'translate3d(' + (-ptr.x * 26 * z).toFixed(1) + 'px,' + (-c * 60 * z - ptr.y * 18 * z).toFixed(1) + 'px,0)';
      });
    }
    scroller(hero, apply);
    hero.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var r = hero.getBoundingClientRect(); ptr.x = (e.clientX - r.left) / r.width - 0.5; ptr.y = (e.clientY - r.top) / r.height - 0.5; apply(); });
    hero.addEventListener('pointerleave', function () { ptr.x = ptr.y = 0; apply(); });
  });
})();

/* Green Chart lab runtime (multi-page). Ported behaviour from Lucian UX/UI Prompt elements
   #002 #008 #025 #039 #044 #098 #207 #212 #226 #228 #236 #237 #242 #251 #260 #275 #292
   · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/
   Motion values (durations, curves, delays, thresholds) are kept from the originals.
   Every generated page holds exactly one `.view`; the demo-bar switches are remembered across pages
   (localStorage) and applied before first paint by the inline head script (html.motion / html.hide-notes).
   Effect modules (fx*.js, concatenated before this file) register on window.GCFX:
     GCFX.init(view)      once, when the page boots
     GCFX.refresh(view)   on boot and when motion is toggled
     GCFX.motion(on)      motion switch changed (stop loops, show final state)
     GCFX.boot()          before the view is refreshed (curtain lift / preloader)
     GCFX.leave(title, href)  curtain transition to another page; returns false when it cannot run */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var FX = window.GCFX || (window.GCFX = { init: [], refresh: [], motion: [], layout: [] });
  var rmq = matchMedia('(prefers-reduced-motion: reduce)');
  var ROOT = root.getAttribute('data-root') || '';
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function run(list, a, b) { for (var i = 0; i < list.length; i++) { try { list[i](a, b); } catch (e) { if (window.console) console.error(e); } } }
  function jsonOf(id) { var el = d.getElementById(id); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }

  /* motion on/off (lucianlabs.dev site-level switch) + notes */
  var mt = $('#motion'), nt = $('#notes');
  function motionOn() { return !!(mt && mt.checked) && !rmq.matches; }
  function applyMotion() { var on = motionOn(); root.classList.toggle('motion', on); run(FX.motion, on); }
  if (mt) { if (store('gc-motion') === '0' || rmq.matches) mt.checked = false; }
  if (nt) {
    if (store('gc-notes') === '0') { nt.checked = false; root.classList.add('hide-notes'); }
    nt.addEventListener('change', function () { root.classList.toggle('hide-notes', !nt.checked); store('gc-notes', nt.checked ? '1' : '0'); layoutAll(); });
  }

  /* one view per page */
  var cur = $('.view') || $('main');
  function initView(v) {
    $$('.u226', v).forEach(beams);
    $$('[data-u228]', v).forEach(glow);
    $$('.u207-wl', v).forEach(wall);
    $$('.u044', v).forEach(accordion);
    $$('.u039', v).forEach(tabs);
    $$('.u242-cb', v).forEach(chipbar);
    $$('.u260', v).forEach(sentence);
    $$('.u275-toc', v).forEach(toc);
    $$('.u292', v).forEach(reflow);
    $$('.u008', v).forEach(copy);
    $$('form.gform', v).forEach(form);
    $$('form.search', v).forEach(search);
    $$('.rail', v).forEach(rail);
    $$('.u002', v).forEach(magnetic);
    run(FX.init, v);
  }
  function refreshView() {
    $$('.u237', cur).forEach(headline);
    reveal(cur);
    countUp(cur);
    chartDraw(cur);
    run(FX.refresh, cur);
    layoutAll();
  }
  var layouts = [];
  function layoutAll() { layouts.forEach(function (f) { f(); }); run(FX.layout); footer(); }
  addEventListener('resize', layoutAll);

  /* links: in-page anchors scroll, internal pages leave through the #321 curtain (fx1-core) */
  function samePage(u) { return u.origin === location.origin && u.pathname === location.pathname; }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    var href = a.getAttribute('href'), u;
    try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (href.charAt(0) === '#' || (samePage(u) && u.hash)) {
      var t = d.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'start' }); history.replaceState(null, '', u.hash); }
      return;
    }
    if (u.origin !== location.origin || u.protocol !== location.protocol) return;
    if (!motionOn() || !FX.leave) return;
    var title = a.getAttribute('data-title') || a.getAttribute('aria-label') || (a.querySelector('h3,b,.u354-it b') || a).textContent.trim().replace(/\s+/g, ' ');
    if (FX.leave(title.slice(0, 70), u.href)) e.preventDefault();
  });

  /* #237 line-by-line mask reveal, underline drawn after the last line lands (950ms) */
  function headline(h) {
    clearTimeout(h._t);
    h.classList.remove('is-in', 'is-drawn');
    if (!motionOn()) { h.classList.add('is-in', 'is-drawn'); return; }
    void h.offsetWidth;
    var wait = Math.max(0, (FX.holdUntil || 0) - performance.now());
    setTimeout(function () { requestAnimationFrame(function () { h.classList.add('is-in'); h._t = setTimeout(function () { h.classList.add('is-drawn'); }, 950); }); }, wait);
  }

  /* #251 staggered scroll-in by column; scrolling back up past a card replays it */
  var io251 = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('is-in');
      else if (e.boundingClientRect.top > (e.rootBounds ? e.rootBounds.bottom : innerHeight) - 1) e.target.classList.remove('is-in');
    });
  }, { threshold: 0.18 }) : null;
  function reveal(v) {
    var els = $$('.u251, .rv, .uline', v);
    if (!motionOn() || !io251) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    $$('[data-stagger]', v).forEach(function (g) {
      var cols = Math.max(1, Math.round(g.clientWidth / Math.max(1, (g.firstElementChild || g).offsetWidth)));
      $$(':scope > .u251', g).forEach(function (c, i) { c.style.setProperty('--d', (i % cols) * 0.09 + 's'); });
    });
    els.forEach(function (e) { e.classList.remove('is-in'); io251.observe(e); });
  }

  /* hero chart (home) */
  function chartDraw(v) {
    var pl = $('#pl', v); if (!pl) return;
    pl.style.setProperty('--len', Math.ceil(pl.getTotalLength()));
    var svg = pl.ownerSVGElement, mq = matchMedia('(max-width: 640px)');
    svg.setAttribute('viewBox', mq.matches ? '230 0 740 360' : '0 0 1100 360');
    $$('.lv, #pl', v).forEach(function (n) { n.style.animation = 'none'; void n.getBBox(); n.style.animation = ''; });
  }

  /* Lucian UX/UI Prompt #098 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#098
     Big numbers: each digit is its own rolling column (0-9 strip), rolled in when the number scrolls into view.
     Without motion the plain number stays as text. */
  function countUp(v) {
    $$('[data-count]', v).forEach(function (el) {
      var to = String(el.dataset.count), suf = el.dataset.suffix || '';
      el.textContent = to + suf;
      if (!motionOn() || !io251) return;
      el.setAttribute('aria-label', to + suf);
      var box = d.createElement('i'); box.className = 'u098-num'; box.setAttribute('aria-hidden', 'true');
      to.split('').forEach(function (ch, i) {
        var s = d.createElement('i');
        if (/\d/.test(ch)) { s.className = 'u098-col'; s.style.setProperty('--d', 0); s.style.setProperty('--i', i); s.innerHTML = '<i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i>'; }
        else { s.className = 'u098-sym'; s.textContent = ch; }
        box.appendChild(s);
      });
      if (suf) { var sf = d.createElement('i'); sf.className = 'u098-sym'; sf.textContent = suf; box.appendChild(sf); }
      el.textContent = ''; el.appendChild(box);
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; o.disconnect();
        var j = 0; to.split('').forEach(function (ch) { if (/\d/.test(ch)) box.children[j++].style.setProperty('--d', ch); else j++; });
      }, { threshold: 0.6 });
      o.observe(el);
    });
  }

  /* #212 hide-on-scroll header + reading bar; also drives #236 footer and #260 sentence */
  var hd = $('.u212-hd'), pg = $('.u212-pg'), last = 0, acc = 0, scrollers = [], sraf = 0;
  function runScrollers() { sraf = 0; scrollers.forEach(function (f) { if (f.el && f.el.isConnected) f(); }); }
  addEventListener('scroll', function () {
    var y = scrollY, dy = y - last; last = y;
    acc = (dy > 0) === (acc > 0) ? acc + dy : dy;
    if (hd) {
      hd.classList.toggle('is-solid', y > 20);
      if (y < 60) hd.classList.remove('is-hide');
      else if (acc > 8) hd.classList.add('is-hide');
      else if (acc < -6) hd.classList.remove('is-hide');
      d.body.classList.toggle('nav-hidden', hd.classList.contains('is-hide'));
    }
    if (pg) pg.style.width = (y / Math.max(1, d.documentElement.scrollHeight - innerHeight) * 100).toFixed(1) + '%';
    footerR();
    if (!sraf) sraf = requestAnimationFrame(runScrollers);
  }, { passive: true });

  /* #236 curtain footer */
  var ft = $('.u236-ft');
  function footer() { if (!ft) return; root.style.setProperty('--fh', ft.offsetHeight + 'px'); footerR(); }
  function footerR() {
    var sp = $('.u236-sp'); if (!sp) return;
    var max = d.documentElement.scrollHeight - innerHeight;
    var r = Math.max(0, Math.min(1, 1 - (max - scrollY) / Math.max(1, sp.offsetHeight)));
    root.style.setProperty('--r', r.toFixed(3));
  }

  /* #226 grid beams on dark heroes, brand greens (white-tinted on the CMT red ground) */
  function beams(el) {
    var cv = $('.u226-cv', el), cx = cv.getContext('2d'), C = 48, B = [], acc = 0, W = 0, H = 0;
    var COL = el.closest('.ground-cmt') ? ['255,255,255', '255,213,217', '255,255,255'] : ['0,224,64', '0,164,72', '180,255,200'];
    function size() { var r = el.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function spawn() {
      var v = Math.random() < 0.5, line = (1 + Math.floor(Math.random() * ((v ? W : H) / C - 1))) * C - 1, dir = Math.random() < 0.5 ? 1 : -1;
      B.push({ v: v, l: line, p: dir > 0 ? -60 : (v ? H : W) + 60, d: dir, sp: 110 + Math.random() * 90, len: 50 + Math.random() * 40, c: COL[Math.floor(Math.random() * 3)] });
    }
    function draw() {
      cx.clearRect(0, 0, W, H);
      B.forEach(function (b) {
        var x0 = b.v ? b.l : b.p - b.d * b.len, y0 = b.v ? b.p - b.d * b.len : b.l, x1 = b.v ? b.l : b.p, y1 = b.v ? b.p : b.l;
        var g = cx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(' + b.c + ',0)'); g.addColorStop(1, 'rgba(' + b.c + ',.95)');
        cx.strokeStyle = g; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(x0 + 0.5, y0 + 0.5); cx.lineTo(x1 + 0.5, y1 + 0.5); cx.stroke();
        cx.fillStyle = 'rgba(' + b.c + ',1)'; cx.shadowColor = 'rgba(' + b.c + ',1)'; cx.shadowBlur = 8; cx.beginPath(); cx.arc(x1 + 0.5, y1 + 0.5, 1.8, 0, 6.2832); cx.fill(); cx.shadowBlur = 0;
      });
    }
    var raf = 0, lt = 0, vis = false;
    function frame(now) {
      raf = 0;
      if (!vis || !motionOn() || el.offsetParent === null) return;
      var dt = Math.min(0.05, Math.max(0, (now - lt) / 1000)); lt = now;
      acc += dt; if (acc > 0.42 && B.length < 12) { acc = 0; spawn(); }
      B.forEach(function (b) { b.p += b.d * b.sp * dt; });
      B = B.filter(function (b) { var lim = (b.v ? H : W) + 70; return b.d > 0 ? b.p < lim : b.p > -70; });
      draw(); raf = requestAnimationFrame(frame);
    }
    function go2() { if (!raf && vis && motionOn()) { lt = performance.now(); raf = requestAnimationFrame(frame); } }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { size(); go2(); } }).observe(el);
    var host = el.parentElement;
    host.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px'); el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px'); });
    host.addEventListener('pointerleave', function () { el.style.setProperty('--mx', '-200px'); el.style.setProperty('--my', '-200px'); });
    layouts.push(function () { if (el.offsetParent) { size(); draw(); go2(); } });
    FX.motion.push(function (on) { if (on) go2(); });
    size(); for (var i = 0; i < 4; i++) { spawn(); B[i].p = (B[i].v ? H : W) * (0.2 + i * 0.18); } draw();
  }

  /* #228 one lamp lights every card border in the group */
  function glow(g) {
    var C = $$('.u228-c', g), p = { x: -5000, y: -5000 }, o = 0, oT = 0, raf = 0, lt = 0;
    function apply() {
      C.forEach(function (el) {
        var r = el.getBoundingClientRect(), lx = p.x - r.left, ly = p.y - r.top;
        el.style.setProperty('--cx', lx.toFixed(1) + 'px'); el.style.setProperty('--cy', ly.toFixed(1) + 'px'); el.style.setProperty('--o', o.toFixed(3));
        var inn = el.firstElementChild; if (inn) { inn.style.setProperty('--cx', (lx - 1.5).toFixed(1) + 'px'); inn.style.setProperty('--cy', (ly - 1.5).toFixed(1) + 'px'); }
      });
    }
    function frame(now) {
      raf = 0;
      var dt = Math.min(0.05, Math.max(0, (now - lt) / 1000)); lt = now;
      o += (oT - o) * (motionOn() ? Math.min(1, dt * (oT ? 8 : 2.5)) : 1);
      apply();
      if (Math.abs(oT - o) > 0.005) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) { lt = performance.now(); raf = requestAnimationFrame(frame); } }
    g.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; p = { x: e.clientX, y: e.clientY }; oT = 1; apply(); kick(); });
    g.addEventListener('pointerleave', function () { oT = 0; kick(); });
    addEventListener('scroll', function () { if (o > 0.01) apply(); }, { passive: true });
  }

  /* #002 magnetic CTA; the "go" state plays, then the link is followed */
  function magnetic(root2) {
    var btn = $('.u002-btn', root2), mag = $('.u002-mag', root2), txt = $('.u002-txt', root2), orb = $('.u002-orb', root2), t = 0;
    root2.addEventListener('pointermove', function (e) {
      if (!motionOn() || e.pointerType === 'touch') return;
      var r = btn.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), p = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
      mag.style.translate = (dx * 0.12 * p).toFixed(1) + 'px ' + (dy * 0.22 * p).toFixed(1) + 'px';
      txt.style.translate = (dx * 0.05 * p).toFixed(1) + 'px ' + (dy * 0.08 * p).toFixed(1) + 'px';
      orb.style.translate = (dx * 0.1 * p).toFixed(1) + 'px ' + (dy * 0.14 * p).toFixed(1) + 'px';
    });
    root2.addEventListener('pointerleave', function () { mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px'; });
    btn.addEventListener('click', function (e) {
      var href = btn.getAttribute('href');
      clearTimeout(t); root2.dataset.state = 'idle'; void btn.offsetWidth; root2.dataset.state = 'go';
      t = setTimeout(function () { root2.dataset.state = 'idle'; }, motionOn() ? 1900 : 900);
      if (href && href.charAt(0) === '#' && motionOn()) { e.preventDefault(); e.stopPropagation(); setTimeout(function () { var x = d.getElementById(href.slice(1)); if (x) x.scrollIntoView({ behavior: 'smooth' }); }, 520); }
    });
  }

  /* #207 testimonial wall: real quotes from the page's JSON (#gc-quotes), no star ratings */
  function wall(wl) {
    var Q = jsonOf(wl.dataset.quotes || 'gc-quotes') || [];
    if (Q.length < 2) { wl.hidden = true; return; }
    function card(i, dup) {
      var f = d.createElement('figure'); f.className = 'u207-cd'; if (dup) f.setAttribute('aria-hidden', 'true');
      f.innerHTML = '<p></p><figcaption class="u207-pp"><img alt="" width="40" height="40" loading="lazy"><span><b></b><small></small></span></figcaption>';
      $('p', f).innerHTML = Q[i][3]; var im = $('img', f); if (Q[i][2]) im.src = Q[i][2]; else im.remove();
      $('b', f).textContent = Q[i][0]; $('small', f).textContent = Q[i][1];
      return f;
    }
    var ids = Q.map(function (_, i) { return i; }), colA = ids.filter(function (i) { return i % 2 === 0; }), colB = ids.filter(function (i) { return i % 2 === 1; });
    if (colB.length < colA.length) colB.push(colA[0]);
    while (colA.length < 3) colA = colA.concat(colA);
    while (colB.length < 3) colB = colB.concat(colB);
    [colA, colB].forEach(function (ids2, c) {
      var co = d.createElement('div'); co.className = 'u207-co';
      var tr = d.createElement('div'); tr.className = 'u207-tr';
      tr.style.setProperty('--t', c ? '46s' : '38s'); tr.style.setProperty('--dir', c ? 'reverse' : 'normal');
      [0, 1].forEach(function (rep) { ids2.forEach(function (i) { tr.appendChild(card(i, rep === 1)); }); });
      co.appendChild(tr); wl.appendChild(co);
      co.addEventListener('focusin', function () { co.classList.add('is-hold'); }); co.addEventListener('focusout', function () { co.classList.remove('is-hold'); });
      var hl = null;
      function mark(x) { if (hl === x) return; if (hl) hl.classList.remove('is-hl'); hl = x; if (x) x.classList.add('is-hl'); }
      co.addEventListener('pointermove', function (e) { var y = e.clientY; mark($$('.u207-cd', tr).filter(function (x) { var r = x.getBoundingClientRect(); return y >= r.top && y <= r.bottom; })[0] || null); });
      co.addEventListener('pointerleave', function () { mark(null); });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { wl.classList.toggle('is-off', !es[0].isIntersecting); }).observe(wl);
  }

  /* #044 accordion, one open at a time, arrow keys move between questions */
  function accordion(g) {
    var items = $$('.u044-it', g).filter(function (it) { return it.parentElement.closest('.u044') === g; }), qs = items.map(function (it) { return $('.u044-q', it); });
    var uid = 'u044-' + Math.random().toString(36).slice(2, 7);
    function set(it, open) { it.classList.toggle('open', open); $('.u044-q', it).setAttribute('aria-expanded', String(open)); }
    items.forEach(function (it, i) {
      var q = qs[i], body = $('.u044-body', it);
      q.id = uid + '-q' + i; body.id = uid + '-a' + i; body.setAttribute('role', 'region');
      q.setAttribute('aria-controls', body.id); body.setAttribute('aria-labelledby', q.id);
      set(it, it.classList.contains('open'));
      q.addEventListener('click', function () { var w = !it.classList.contains('open'); items.forEach(function (o) { if (o !== it) set(o, false); }); set(it, w); });
      q.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? qs.length - 1 : -2;
        if (n === -2) return; e.preventDefault(); qs[(n + qs.length) % qs.length].focus();
      });
    });
  }

  /* #039 sliding pill tabs over FAQ groups */
  function tabs(root2) {
    var tb = $$('.u039-tab', root2), pill = $('.u039-pill', root2), panel = $('.u039-panel', root2), lists = $$('.u039-list', panel), cur2 = 0;
    function movePill(anim) { var t = tb[cur2]; if (!t) return; if (!anim) pill.style.transition = 'none'; pill.style.setProperty('--x', t.offsetLeft + 'px'); pill.style.setProperty('--w', t.offsetWidth + 'px'); if (!anim) { void pill.offsetWidth; pill.style.transition = ''; } }
    function select(i, focus) {
      if (i === cur2) return;
      var dir = i > cur2 ? 1 : -1, old = lists[cur2], nx = lists[i]; cur2 = i;
      tb.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      if (focus) tb[i].focus();
      movePill(true);
      old.hidden = true; nx.hidden = false;
      if (!motionOn()) return;
      var rows = $$(':scope > .u044-it', nx);
      rows.forEach(function (r, k) { r.style.transition = 'none'; r.style.transform = 'translateX(' + (dir * 70) + '%)'; r.style.opacity = '0'; r.style.transitionDelay = (k * 45) + 'ms'; });
      void nx.offsetWidth;
      rows.forEach(function (r) { r.style.transition = ''; r.style.transform = ''; r.style.opacity = ''; });
      setTimeout(function () { rows.forEach(function (r) { r.style.transitionDelay = ''; }); }, 900);
    }
    tb.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) { var dd = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (dd) { e.preventDefault(); select((i + dd + tb.length) % tb.length, true); } });
    });
    lists.forEach(function (l, k) { l.hidden = k !== 0; });
    layouts.push(function () { if (root2.offsetParent) movePill(false); });
  }

  /* #242 sticky chip bar with scrollspy over the page */
  function chipbar(cb) {
    var cr = $('.u242-cr', cb), ul = $('.u242-ul', cb), C = $$('.u242-ch', cb), S = C.map(function (b) { return d.getElementById(b.getAttribute('href').slice(1)); }), c2 = -1, lock = 0;
    if (!C.length || S.some(function (s) { return !s; })) return;
    function mark(i) {
      if (i === c2) return; c2 = i;
      C.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      var b = C[i]; ul.style.width = b.offsetWidth + 'px'; ul.style.transform = 'translateX(' + b.offsetLeft + 'px)';
      var x = Math.max(0, Math.min(cr.scrollWidth - cr.clientWidth, b.offsetLeft - (cr.clientWidth - b.offsetWidth) / 2)), x0 = cr.scrollLeft, t0 = performance.now();
      (function f(now) { var k = motionOn() ? Math.min(1, (now - t0) / 320) : 1, e = 1 - Math.pow(1 - k, 3); cr.scrollLeft = x0 + (x - x0) * e; if (k < 1) requestAnimationFrame(f); })(t0);
    }
    function spy() {
      cb.classList.toggle('is-stuck', cb.getBoundingClientRect().top <= parseFloat(getComputedStyle(cb).top) + 0.5);
      if (Date.now() < lock) return;
      var y = cb.getBoundingClientRect().bottom + (innerHeight - cb.getBoundingClientRect().bottom) * 0.3, i = 0;
      S.forEach(function (s, k) { if (s.getBoundingClientRect().top <= y) i = k; });
      if (scrollY >= d.documentElement.scrollHeight - innerHeight - 2 - (parseFloat(getComputedStyle(root).getPropertyValue('--fh')) || 0)) i = S.length - 1;
      mark(i);
    }
    C.forEach(function (b, i) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); mark(i); lock = Date.now() + (motionOn() ? 700 : 0);
        var to = S[i].getBoundingClientRect().top + scrollY - cb.offsetHeight - 52, y0 = scrollY, t0 = performance.now();
        (function f(now) { var k = motionOn() ? Math.min(1, (now - t0) / 600) : 1, ee = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; scrollTo(0, y0 + (to - y0) * ee); if (k < 1) requestAnimationFrame(f); })(t0);
      });
    });
    spy.el = cb; scrollers.push(spy);
    layouts.push(function () { if (cb.offsetParent) { c2 = -1; spy(); } });
  }

  /* #260 scroll-filled sentence */
  function sentence(el) {
    var p = $('.u260-p', el), bar = $('.u260-pg i', el), run2 = $('.u260-run', el), words = [];
    var TEXT = p.dataset.text; p.textContent = '';
    TEXT.split('*').forEach(function (chunk, ci) {
      chunk.split(' ').forEach(function (w) {
        if (!w) return; if (words.length) p.appendChild(d.createTextNode(' '));
        var s = d.createElement('span'); s.className = 'u260-w' + (ci % 2 ? ' em' : ''); s.textContent = w; p.appendChild(s); words.push(s);
      });
    });
    function draw() {
      var r = run2.getBoundingClientRect(), max = r.height - innerHeight * 0.7, t = Math.max(0, Math.min(1, (innerHeight * 0.15 - r.top) / Math.max(1, max))), f = t * 1.15 * words.length;
      words.forEach(function (w, i) { var v = Math.max(0, Math.min(1, f - i)); w.style.setProperty('--f', v.toFixed(2)); w.classList.toggle('on', v >= 1); });
      bar.style.transform = 'scaleY(' + Math.min(1, t * 1.15).toFixed(3) + ')';
    }
    draw.el = el; scrollers.push(draw); layouts.push(function () { if (el.offsetParent) draw(); });
  }

  /* #275 TOC; marker spans every chapter on screen */
  function toc(nav) {
    var art = d.getElementById(nav.dataset.for), ul = $('.u275-ul', nav), mk = $('.u275-mk', nav), hs = $$('h2', art), secs = [], items = [];
    if (!art || hs.length < 2) { nav.hidden = true; return; }
    hs.forEach(function (h, i) {
      h.id = h.id || 'muc-' + (i + 1);
      var li = d.createElement('li'), b = d.createElement('button'); b.type = 'button'; b.className = 'u275-ti'; b.textContent = h.textContent;
      b.addEventListener('click', function () { scrollTo({ top: h.getBoundingClientRect().top + scrollY - 90, behavior: motionOn() ? 'smooth' : 'auto' }); });
      li.appendChild(b); ul.appendChild(li); items.push(b);
      secs.push(function () { var a = h.getBoundingClientRect().top, nxt = hs[i + 1] ? hs[i + 1].getBoundingClientRect().top : art.getBoundingClientRect().bottom; return [a, nxt]; });
    });
    function draw() {
      var top = 80, bot = innerHeight, first = -1, lastI = -1, best = -1, bestV = 0;
      secs.forEach(function (s, i) { var ab = s(), h = Math.max(1, ab[1] - ab[0]), vis = Math.max(0, Math.min(ab[1], bot) - Math.max(ab[0], top)) / h; if (vis > 0.12) { if (first < 0) first = i; lastI = i; } if (vis > bestV) { bestV = vis; best = i; } });
      if (best < 0) best = 0; if (first < 0) first = lastI = best;
      items.forEach(function (b, i) { b.classList.toggle('on', i === best); if (i === best) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      var y0 = items[first].parentNode.offsetTop, y1 = items[lastI].parentNode.offsetTop + items[lastI].parentNode.offsetHeight;
      mk.style.transform = 'translateY(' + y0 + 'px)'; mk.style.height = (y1 - y0) + 'px';
    }
    draw.el = nav; scrollers.push(draw); layouts.push(function () { if (nav.offsetParent) draw(); });
  }

  /* #292 filter and reflow */
  function reflow(root2) {
    var fs = $('.u292-fs', root2), g = $('.u292-g', root2), nEl = $('.u292-n', root2), T = $$('.u292-t', g), cat = 'all', unit = root2.dataset.unit || 'mục';
    var cats = [['all', root2.dataset.all || 'Tất cả']].concat(JSON.parse(root2.dataset.cats || '[]'));
    var chips = cats.map(function (c) {
      var b = d.createElement('button'); b.type = 'button'; b.className = 'u292-f'; b.textContent = c[1]; b.setAttribute('aria-pressed', String(c[0] === 'all'));
      b.addEventListener('click', function () { if (cat !== c[0]) apply(c[0], true); }); fs.appendChild(b); return b;
    });
    var shown2 = T.map(function () { return true; });
    function apply(c, anim) {
      cat = c; chips.forEach(function (b, i) { b.setAttribute('aria-pressed', String(cats[i][0] === c)); });
      var W = g.clientWidth, gap = 20, cols = Math.max(1, Math.floor((W + gap) / (300 + gap))), cw = (W - gap * (cols - 1)) / cols, n = 0, rowH = [], items = [];
      T.forEach(function (t) { t.style.width = cw + 'px'; });
      T.forEach(function (t, i) {
        var keep = c === 'all' || (t.dataset.cat || '').split(' ').indexOf(c) > -1; var was = shown2[i]; shown2[i] = keep;
        if (keep) { var col = n % cols, row = Math.floor(n / cols); rowH[row] = Math.max(rowH[row] || 0, t.offsetHeight); items.push([t, col, row, was, n]); n++; }
        else { var curT = t.style.transform.replace(/ scale\([^)]*\)/, ''); t.style.transitionDelay = '0ms'; t.classList.add('out'); t.style.transform = curT + ' scale(.2)'; t.setAttribute('aria-hidden', 'true'); }
      });
      var ys = [0]; rowH.forEach(function (h, r) { ys[r + 1] = ys[r] + h + gap; });
      items.forEach(function (it) {
        var t = it[0], x = it[1] * (cw + gap), y = ys[it[2]], tr = 'translate(' + x.toFixed(1) + 'px,' + y + 'px)';
        t.style.transitionDelay = anim && motionOn() ? (it[4] * 35) + 'ms' : '0ms';
        if (!it[3] || !anim || !motionOn()) { t.style.transition = 'none'; t.style.transform = tr + (anim && !it[3] && motionOn() ? ' scale(0)' : ''); void t.offsetWidth; t.style.transition = ''; }
        t.classList.remove('out'); t.style.transform = tr; t.removeAttribute('aria-hidden');
      });
      g.style.height = Math.max(0, ys[rowH.length] - gap) + 'px';
      nEl.textContent = n + ' ' + unit;
    }
    layouts.push(function () { if (root2.offsetParent) apply(cat, false); });
  }

  /* #008 copy */
  function copy(root2) {
    var btn = $('.u008-btn', root2), val = $('.u008-code', root2), tip = $('.u008-tip', root2), t = 0;
    btn.addEventListener('click', function () {
      try { if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(val.textContent.trim()).catch(function () { sel(); }); else sel(); } catch (e) { sel(); }
      clearTimeout(t); root2.classList.remove('is-copied'); void root2.offsetWidth; root2.classList.add('is-copied'); tip.textContent = root2.dataset.done || 'Đã chép';
      t = setTimeout(function () { root2.classList.remove('is-copied'); tip.textContent = ''; }, 1800);
    });
    function sel() { var r = d.createRange(); r.selectNodeContents(val); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  }

  /* #025 notched floating labels + inline validation (demo: nothing is sent); #081 ring-and-check on submit lives in fx */
  var MSG = jsonOf('gc-form') || {};
  function form(f) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, fid = f.dataset.fid || (f.closest('.view') || f).id || 'f';
    $$('.u025-f', f).forEach(function (fl) {
      var input = $('.u025-in', fl), lab = $('.u025-lab', fl), msg = $('.u025-msg', fl), kind = fl.dataset.kind;
      input.id = fid + '-' + input.name; lab.htmlFor = input.id;
      if (msg) { msg.id = input.id + '-m'; input.setAttribute('aria-describedby', msg.id); }
      function lift() { var up = d.activeElement === input || input.value.length > 0 || input.tagName === 'SELECT'; fl.classList.toggle('is-up', up); $('.u025-line', fl).style.setProperty('--gap', up ? (lab.offsetWidth * 0.8 + 2) + 'px' : '0px'); }
      fl.check = function (strict) {
        var v = input.value.trim(), ok = true, m = '';
        if (kind === 'mail') { ok = !v || re.test(v); m = MSG.mail || 'Email chưa đúng dạng, ví dụ ban@email.com'; fl.classList.toggle('is-ok', !!v && ok); }
        if (kind === 'tel') { ok = /^[0-9 +().-]{9,}$/.test(v); m = MSG.tel || 'Nhập số điện thoại, ví dụ 0912 345 678'; fl.classList.toggle('is-ok', ok); }
        if (kind === 'name') { ok = v.length > 1; m = MSG.name || 'Nhập họ và tên để Green Chart biết cách xưng hô'; }
        if (kind === 'year') { ok = !v || /^(19|20)\d{2}$/.test(v); m = MSG.year || 'Năm sinh gồm 4 chữ số, ví dụ 1995'; }
        if (ok) { fl.classList.remove('is-bad'); input.removeAttribute('aria-invalid'); if (msg) msg.textContent = ''; }
        else if (strict) { fl.classList.add('is-bad'); input.setAttribute('aria-invalid', 'true'); if (msg) msg.textContent = m; fl.classList.remove('is-shake'); void fl.offsetWidth; fl.classList.add('is-shake'); }
        return ok;
      };
      input.addEventListener('focus', function () { fl.classList.add('is-focus'); lift(); });
      input.addEventListener('blur', function () { fl.classList.remove('is-focus'); lift(); if (input.value) fl.check(true); });
      input.addEventListener('input', function () { lift(); fl.check(fl.classList.contains('is-bad')); });
      layouts.push(function () { if (f.offsetParent) lift(); });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var first = null;
      $$('.u025-f[data-kind]', f).forEach(function (fl) { if (!fl.check(true) && !first) first = $('.u025-in', fl); });
      var ok = $('.ok', f);
      if (first) { first.focus(); ok.textContent = ''; return; }
      var msg = f.dataset.done || MSG.done || 'Bản demo: form hợp lệ, không gửi đi đâu.';
      function done() { ok.textContent = msg; var th = f.dataset.thanks && d.getElementById(f.dataset.thanks); if (th) { th.hidden = false; f.hidden = true; var h = th.querySelector('h2,h3'); if (h) { h.tabIndex = -1; h.focus(); } } }
      if (FX.submit && motionOn()) FX.submit(f, done); else done();
    });
  }

  /* search box (Kiến thức): client-side title search over the page's JSON index, accent-insensitive */
  function search(f) {
    var inp = $('input', f), res = d.createElement('ul'), idx = null, url = f.dataset.index, t = 0;
    res.className = 'search-res'; res.setAttribute('role', 'listbox'); res.hidden = true; f.appendChild(res);
    function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
    function load(cb) { if (idx) return cb(); fetch(url).then(function (r) { return r.json(); }).then(function (j) { idx = j; cb(); }).catch(function () { idx = []; cb(); }); }
    function show() {
      var q = norm(inp.value.trim()); res.innerHTML = '';
      if (q.length < 2) { res.hidden = true; return; }
      var hits = idx.filter(function (it) { return norm(it.t).indexOf(q) > -1; }).slice(0, 8);
      if (!hits.length) { res.innerHTML = '<li class="none">' + (f.dataset.none || 'Không tìm thấy bài viết') + '</li>'; res.hidden = false; return; }
      hits.forEach(function (it) { var li = d.createElement('li'); var a = d.createElement('a'); a.href = ROOT + it.u.replace(/^\//, ''); a.textContent = it.t; var s = d.createElement('small'); s.textContent = it.c; li.appendChild(a); a.appendChild(s); res.appendChild(li); });
      res.hidden = false;
    }
    inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { load(show); }, 120); });
    inp.addEventListener('focus', function () { load(function () {}); });
    f.addEventListener('submit', function (e) { e.preventDefault(); load(function () { show(); var a = $('a', res); if (a) a.click(); }); });
    d.addEventListener('pointerdown', function (e) { if (!f.contains(e.target)) res.hidden = true; });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Escape') res.hidden = true; });
  }

  /* rails: arrows + keyboard; fx adds #339 drag-and-snap */
  function rail(r) {
    var head = r.previousElementSibling; if (!head) return;
    $$('.arrow', head).forEach(function (b) { b.addEventListener('click', function () { var c = r.firstElementChild, step = c ? c.getBoundingClientRect().width + 18 : 300; r.scrollBy({ left: step * (+b.dataset.dir), behavior: motionOn() ? 'smooth' : 'auto' }); }); });
    r.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); r.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 300, behavior: motionOn() ? 'smooth' : 'auto' }); } });
  }

  window.GC = { $: $, $$: $$, motionOn: motionOn, store: store, scrollers: scrollers, layouts: layouts, root: ROOT, cur: function () { return cur; }, rmq: rmq, refresh: refreshView, layout: layoutAll, json: jsonOf };
  if (mt) mt.addEventListener('change', function () { store('gc-motion', mt.checked ? '1' : '0'); applyMotion(); refreshView(); });
  rmq.addEventListener && rmq.addEventListener('change', function () { if (rmq.matches && mt) mt.checked = false; applyMotion(); refreshView(); });
  applyMotion();
  if (FX.boot) { try { FX.boot(); } catch (e) { if (window.console) console.error(e); root.classList.remove('is-cover', 'is-lift'); } }
  initView(cur);
  refreshView();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(layoutAll);
  addEventListener('load', layoutAll);
  addEventListener('pageshow', function (e) { if (e.persisted) { root.classList.remove('is-cover', 'is-lift', 'pre'); layoutAll(); } });
})();
