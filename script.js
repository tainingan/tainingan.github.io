(() => {
  'use strict';
  const links = Array.from(document.querySelectorAll('[data-photo]'));
  const dialog = document.querySelector('.photo-dialog');
  const viewerImage = dialog.querySelector('.viewer-image');
  const viewerMedia = dialog.querySelector('.viewer-media');
  const title = document.getElementById('viewer-title');
  const description = document.getElementById('viewer-description');
  const count = document.getElementById('viewer-count');
  let current = 0;
  let trigger = null;
  let previousOverflow = '';

  function showPhoto(index) {
    current = (index + links.length) % links.length;
    const link = links[current];
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector('img').alt;
    viewerMedia.classList.toggle('is-rotated', link.dataset.rotation === '-90');
    title.textContent = link.dataset.title;
    description.textContent = link.dataset.caption;
    count.textContent = `${current + 1} / ${links.length}`;
  }

  if (typeof dialog.showModal === 'function') {
    links.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        trigger = link;
        showPhoto(index);
        previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        dialog.querySelector('.viewer-close').focus();
      });
    });
    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(current - 1));
    dialog.querySelector('.viewer-next').addEventListener('click', () => showPhoto(current + 1));
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(current + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    });
  }

  const videos = Array.from(document.querySelectorAll('video'));
  videos.forEach((video) => {
    video.addEventListener('play', () => {
      videos.forEach((other) => { if (other !== video) other.pause(); });
    });
  });
  document.getElementById('more-videos').addEventListener('toggle', (event) => {
    if (!event.currentTarget.open) event.currentTarget.querySelectorAll('video').forEach(video => video.pause());
  });
})();
