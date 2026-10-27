(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir navegación');
    nav.classList.remove('is-open');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
    });
  }

  var catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    var cards = Array.from(catalog.querySelectorAll('[data-category]'));
    var filters = Array.from(catalog.querySelectorAll('[data-filter]'));
    var search = catalog.querySelector('input[type="search"]');
    var counter = catalog.querySelector('[data-result-count]');
    var empty = catalog.querySelector('[data-empty-state]');
    var category = 'all';
    var valid = ['all', 'extension', 'template', 'web', 'utility'];
    function normalize(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
    function update(syncURL) {
      var query = normalize(search.value);
      var words = query.split(/\s+/).filter(Boolean);
      var count = 0;
      cards.forEach(function (card) {
        var match = (category === 'all' || card.dataset.category === category) && words.every(function (word) { return normalize(card.dataset.search).includes(word); });
        card.hidden = !match;
        if (match) count++;
      });
      filters.forEach(function (button) { var on = button.dataset.filter === category; button.classList.toggle('is-active', on); button.setAttribute('aria-pressed', String(on)); });
      counter.textContent = count + (count === 1 ? ' recurso para explorar' : ' recursos para explorar');
      empty.hidden = count !== 0;
      if (syncURL) {
        var url = new URL(window.location.href);
        if (query) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
        if (category !== 'all') url.searchParams.set('tipo', category); else url.searchParams.delete('tipo');
        window.history.replaceState({}, '', url);
      }
    }
    function readURL() {
      var params = new URL(window.location.href).searchParams;
      category = valid.includes(params.get('tipo')) ? params.get('tipo') : 'all';
      search.value = params.get('q') || '';
      update(false);
    }
    filters.forEach(function (button) { button.addEventListener('click', function () { category = button.dataset.filter; update(true); }); });
    search.addEventListener('input', function () { update(true); });
    catalog.querySelector('[data-clear-filters]').addEventListener('click', function () { category = 'all'; search.value = ''; update(true); search.focus(); });
    document.addEventListener('keydown', function (event) {
      var editing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); search.focus(); }
      if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; update(true); }
    });
    window.addEventListener('popstate', readURL);
    readURL();
  }

  var demo = document.querySelector('[data-demo]');
  if (demo) {
    var events = {
      page_view: [['page_title', '"Nueva colección"'], ['page_location', '"ejemplo.test"'], ['debug_mode', 'true']],
      view_item: [['item_name', '"Camiseta Luratic"'], ['currency', '"EUR"'], ['value', '24.90']],
      purchase: [['transaction_id', '"DEMO-001"'], ['currency', '"EUR"'], ['value', '24.90']]
    };
    demo.querySelectorAll('[data-event]').forEach(function (button) {
      button.addEventListener('click', function () {
        var name = button.dataset.event;
        demo.querySelectorAll('[data-event]').forEach(function (item) { var on = item === button; item.classList.toggle('is-active', on); item.setAttribute('aria-pressed', String(on)); });
        demo.querySelector('[data-param="event_name"]').textContent = '"' + name + '"';
        events[name].forEach(function (row, index) {
          demo.querySelector('[data-key="' + (index + 1) + '"]').textContent = row[0];
          demo.querySelector('[data-value="' + (index + 1) + '"]').textContent = row[1];
        });
      });
    });
  }
})();
