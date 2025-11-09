/* modal.js - simple modal that loads the target href in an iframe.
   Place in assets/js/modal.js and include in your layout just before </body>
   Usage: add data-modal attribute to an <a> tag with an href to the page to load.
   Example: <a href="/edu-resourse.html" data-modal>Edu resourse</a>
*/
(function () {
  'use strict';

  function createModal(href, title) {
    // overlay
    const overlay = document.createElement('div');
    overlay.className = 'edu-modal-overlay';
    overlay.tabIndex = -1;

    // modal
    const modal = document.createElement('div');
    modal.className = 'edu-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    // header
    const header = document.createElement('div');
    header.className = 'edu-modal-header';

    const t = document.createElement('div');
    t.className = 'edu-modal-title';
    t.textContent = title || 'Edu resourse';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'edu-modal-close';
    closeBtn.setAttribute('aria-label', 'Close dialog');
    closeBtn.innerHTML = '&#x2715;'; // ✕

    header.appendChild(t);
    header.appendChild(closeBtn);

    // spinner container (visible until iframe loads)
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'edu-modal-spinner';
    spinnerContainer.innerHTML = '<div class="edu-spinner" aria-hidden="true"></div>';

    // iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'edu-modal-iframe';
    iframe.src = href;
    iframe.title = title || 'Edu resourse content';
    iframe.onload = function () {
      // remove spinner when iframe has loaded
      if (spinnerContainer.parentNode) {
        spinnerContainer.parentNode.replaceChild(iframe, spinnerContainer);
      }
    };

    modal.appendChild(header);
    modal.appendChild(spinnerContainer);
    overlay.appendChild(modal);

    // close logic
    function closeModal() {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    function onKeyDown(e) {
      if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onKeyDown);

    return { overlay, iframe, closeModal };
  }

  function initModalLinks() {
    if (!document.querySelectorAll) return;
    const links = document.querySelectorAll('a[data-modal]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        // If user wants to open in new tab (middle click / ctrl/cmd), allow default
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;
        const title = link.getAttribute('data-modal-title') || link.textContent.trim() || 'Edu resourse';
        const modal = createModal(href, title);
        document.body.appendChild(modal.overlay);
        // Focus the close button for keyboard users
        const closeBtn = modal.overlay.querySelector('.edu-modal-close');
        if (closeBtn) closeBtn.focus();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalLinks);
  } else {
    initModalLinks();
  }

})();