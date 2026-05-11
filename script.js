/* ═══════════════════════════════════════════════════════════
   UEFA SEASON'S GREETINGS 2026 — CREATIVE PROPOSAL
   Jump Design & Direction — May 2026
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Cached DOM references ─────────────────────────────── */
  const progressBar   = document.getElementById('progressBar');
  const frameImages   = Array.from(document.querySelectorAll('.frame__image'));
  const animateEls    = Array.from(document.querySelectorAll('.animate-in'));

  /* ── Scroll progress bar ───────────────────────────────── */
  function updateProgress() {
    const scrollTop  = window.pageYOffset;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ── Parallax ──────────────────────────────────────────── */
  /*
   * Each storyboard image sits in a slightly over-tall container
   * (112% height, offset top -6%). As the frame scrolls through
   * the viewport we shift the image by ±24px — slow enough to
   * feel cinematic, fast enough to be perceptible.
   */
  function updateParallax() {
    const vh = window.innerHeight;

    frameImages.forEach(function (img) {
      const frame = img.closest('.frame');
      if (!frame) return;

      const rect        = frame.getBoundingClientRect();
      const frameHeight = rect.height;

      // Skip frames far outside the viewport
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return;

      // progress: 0 = frame bottom entering from below,  1 = frame top leaving above
      const raw      = (vh - rect.top) / (vh + frameHeight);
      const progress = Math.max(0, Math.min(1, raw));

      // Shift: centre at 0, range ±24px
      const offset = (progress - 0.5) * 48;
      img.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  /* ── Intersection observer (fade-in) ───────────────────── */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  animateEls.forEach(function (el) {
    observer.observe(el);
  });

  /* ── Unified scroll handler (rAF throttled) ─────────────── */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ── Initial run ────────────────────────────────────────── */
  updateProgress();
  updateParallax();

}());
