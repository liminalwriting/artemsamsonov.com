(function (h, o, t, j, a, r) {
  h.hj = h.hj || function () {
    (h.hj.q = h.hj.q || []).push(arguments);
  };
  h._hjSettings = {hjid: 713452, hjsv: 6};
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script');
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

// Set viewport height for mobile browsers
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Update viewport height on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Glassmorphism effect on header scroll
function initPage() {
  const tenureEl = document.getElementById('experience-tenure-mango');
  if (tenureEl) {
    const start = new Date(2025, 11, 1); // 1 December 2025 (month 0-based)
    const now = new Date();
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const months =
      (endOfCurrentMonth.getFullYear() - start.getFullYear()) * 12 +
      (endOfCurrentMonth.getMonth() - start.getMonth());
    const n = Math.max(0, months);
    tenureEl.textContent = `${n} мес`;
  }

  const imagePairs = Array.prototype.slice.call(document.querySelectorAll('.article__pair'));

  imagePairs.forEach(function(pair) {
    const toggle = pair.querySelector('.article__pair-toggle');
    const frames = Array.prototype.slice.call(pair.querySelectorAll('.article__image-frame'));

    if (!toggle || !frames.length) {
      return;
    }

    function getFullHeight(frame) {
      const img = frame.querySelector('img');

      if (!img) {
        return 0;
      }

      // naturalWidth is 0 until the image is decoded, so fall back to the rendered height
      if (img.naturalWidth && img.naturalHeight) {
        return Math.round(frame.clientWidth * img.naturalHeight / img.naturalWidth);
      }

      return img.offsetHeight;
    }

    function applyFrameHeights() {
      const isExpanded = pair.classList.contains('article__pair_expanded');

      frames.forEach(function(frame) {
        frame.style.height = isExpanded ? `${getFullHeight(frame)}px` : '';
      });
    }

    toggle.addEventListener('click', function() {
      const isExpanded = pair.classList.toggle('article__pair_expanded');

      applyFrameHeights();
      toggle.textContent = isExpanded ? 'Свернуть' : 'Развернуть на\u00A0всю высоту';
      toggle.setAttribute('aria-expanded', String(isExpanded));
    });

    window.addEventListener('resize', applyFrameHeights);

    frames.forEach(function(frame) {
      const img = frame.querySelector('img');

      if (img && !img.complete) {
        img.addEventListener('load', applyFrameHeights);
      }
    });
  });

  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      const maxScroll = 400; // Maximum scroll distance for full opacity
      const opacity = Math.min(scrollY / maxScroll, 1); // Calculate opacity from 0 to 1
      
      header.style.setProperty('--bg-opacity', opacity);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
