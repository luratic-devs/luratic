/* Official videos load only after activation; screenshots remain ordinary links without JS. */
(() => {
  'use strict';
  const isPlainClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

  document.querySelectorAll('[data-extension-media] [data-video-id]').forEach(link => {
    const videoId = link.dataset.videoId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;
    link.addEventListener('click', event => {
      if (!isPlainClick(event)) return;
      event.preventDefault();
      const player = document.createElement('iframe');
      player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
      player.title = link.dataset.videoTitle || 'Vídeo de Luratic';
      player.width = '1280';
      player.height = '720';
      player.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      link.replaceWith(player);
      player.focus();
    });
  });

  const imageLinks = [...document.querySelectorAll('[data-media-image]')];
  if (!imageLinks.length || typeof HTMLDialogElement === 'undefined' || !('showModal' in HTMLDialogElement.prototype)) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'media-lightbox';
  dialog.setAttribute('aria-labelledby', 'media-lightbox-caption');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'media-lightbox-close';
  close.textContent = 'Cerrar ×';
  close.setAttribute('aria-label', 'Cerrar captura ampliada');
  const image = document.createElement('img');
  image.className = 'media-lightbox-image';
  const caption = document.createElement('p');
  caption.id = 'media-lightbox-caption';
  caption.className = 'media-lightbox-caption';
  const original = document.createElement('a');
  original.className = 'media-lightbox-original';
  original.textContent = 'Abrir imagen original ↗';
  original.target = '_blank';
  original.rel = 'noopener';
  dialog.append(close, image, caption, original);
  document.body.append(dialog);
  let opener;

  imageLinks.forEach(link => link.addEventListener('click', event => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || link.dataset.mediaTitle || 'Captura de la extensión';
    caption.textContent = link.dataset.mediaTitle || image.alt;
    original.href = link.href;
    dialog.showModal();
    document.documentElement.classList.add('media-lightbox-open');
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('media-lightbox-open');
    opener?.focus();
  });
})();
