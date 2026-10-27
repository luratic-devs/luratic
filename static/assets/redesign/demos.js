/* Local walkthroughs only: no analytics, external scripts or product connections. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-walkthrough]').forEach(demo => {
    const frames = [...demo.querySelectorAll('[data-demo-frame]')];
    const captions = [...demo.querySelectorAll('[data-demo-caption]')];
    const steps = [...demo.querySelectorAll('[data-demo-step]')];
    const controls = demo.querySelector('.demo-controls');
    const play = demo.querySelector('[data-demo-play]');
    if (!frames.length || !play) return;
    let current = 0;
    let playing = !reducedMotion.matches;
    let visible = false;
    let timer;
    const clearTimer = () => { window.clearTimeout(timer); timer = undefined; };
    const schedule = () => {
      clearTimer();
      if (playing && visible && !document.hidden) timer = window.setTimeout(() => {
        show((current + 1) % frames.length);
        schedule();
      }, 6500);
    };
    const show = index => {
      current = index;
      demo.dataset.step = String(current);
      frames.forEach((frame, i) => { frame.hidden = i !== current; frame.classList.toggle('is-current', i === current); });
      captions.forEach((caption, i) => { caption.hidden = i !== current; });
      steps.forEach((step, i) => { step.setAttribute('aria-pressed', String(i === current)); step.classList.toggle('is-current', i === current); });
      demo.querySelector('[data-demo-position]').textContent = String(current + 1).padStart(2, '0');
    };
    const updatePlay = () => {
      play.setAttribute('aria-pressed', String(playing));
      play.setAttribute('aria-label', playing ? 'Pausar demostración' : 'Reproducir demostración');
      demo.querySelector('[data-play-label]').textContent = playing ? 'Pausar' : 'Reproducir';
      demo.querySelector('[data-play-icon]').textContent = playing ? 'Ⅱ' : '▶';
      demo.classList.toggle('is-playing', playing);
      schedule();
    };
    const goManually = index => { playing = false; show(index); updatePlay(); };
    steps.forEach((step, i) => step.addEventListener('click', () => goManually(i)));
    demo.querySelector('[data-demo-next]').addEventListener('click', () => goManually((current + 1) % frames.length));
    play.addEventListener('click', () => { playing = !playing; updatePlay(); });
    demo.addEventListener('keydown', event => {
      if (!event.target.matches('[data-demo-step]')) return;
      let next;
      if (event.key === 'ArrowRight') next = (current + 1) % frames.length;
      else if (event.key === 'ArrowLeft') next = (current + frames.length - 1) % frames.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = frames.length - 1;
      else return;
      event.preventDefault(); goManually(next); steps[next].focus();
    });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { playing = false; updatePlay(); } });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        schedule();
      }, {threshold: .25});
      observer.observe(demo);
    } else visible = true;
    controls.hidden = false;
    updatePlay();
  });
})();
