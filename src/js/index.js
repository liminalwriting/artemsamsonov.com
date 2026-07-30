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

  const comparisons = Array.prototype.slice.call(document.querySelectorAll('.article__compare'));

  comparisons.forEach(function(compare) {
    const frame = compare.querySelector('.article__compare-frame');
    const handle = compare.querySelector('.article__compare-handle');
    const toggle = compare.querySelector('.article__compare-toggle');

    if (!frame || !handle) {
      return;
    }

    // Нижний слой задаёт размеры кадра, верхний обрезается шторкой
    const baseImage = frame.querySelector('img');

    let position = 50;

    function setPosition(value) {
      position = Math.min(100, Math.max(0, value));
      compare.style.setProperty('--compare-position', `${position}%`);
      handle.setAttribute('aria-valuenow', String(Math.round(position)));
    }

    function positionFromEvent(event) {
      const rect = frame.getBoundingClientRect();

      return ((event.clientX - rect.left) / rect.width) * 100;
    }

    function onPointerMove(event) {
      setPosition(positionFromEvent(event));
    }

    function stopDragging() {
      compare.classList.remove('article__compare_dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    }

    frame.addEventListener('pointerdown', function(event) {
      event.preventDefault();
      compare.classList.add('article__compare_dragging');
      setPosition(positionFromEvent(event));
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', stopDragging);
      window.addEventListener('pointercancel', stopDragging);
    });

    handle.addEventListener('keydown', function(event) {
      const step = event.shiftKey ? 10 : 2;

      if (event.key === 'ArrowLeft') {
        setPosition(position - step);
      } else if (event.key === 'ArrowRight') {
        setPosition(position + step);
      } else if (event.key === 'Home') {
        setPosition(0);
      } else if (event.key === 'End') {
        setPosition(100);
      } else {
        return;
      }

      event.preventDefault();
    });

    setPosition(position);

    if (!toggle || !baseImage) {
      return;
    }

    function getFullHeight() {
      // naturalWidth is 0 until the image is decoded, so keep the collapsed height until then
      if (baseImage.naturalWidth && baseImage.naturalHeight) {
        return Math.round(frame.clientWidth * baseImage.naturalHeight / baseImage.naturalWidth);
      }

      return frame.clientHeight;
    }

    function applyFrameHeight() {
      const isExpanded = compare.classList.contains('article__compare_expanded');

      frame.style.height = isExpanded ? `${getFullHeight()}px` : '';
    }

    toggle.addEventListener('click', function() {
      const isExpanded = compare.classList.toggle('article__compare_expanded');

      applyFrameHeight();
      toggle.textContent = isExpanded ? 'Свернуть' : 'Развернуть на\u00A0всю высоту';
      toggle.setAttribute('aria-expanded', String(isExpanded));
    });

    window.addEventListener('resize', applyFrameHeight);

    if (!baseImage.complete) {
      baseImage.addEventListener('load', applyFrameHeight);
    }
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
