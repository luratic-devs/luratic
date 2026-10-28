(function () {
  'use strict';
  document.documentElement.classList.add('js');

  function normalizeTrackingText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 120);
  }

  function trackingText(element) {
    return normalizeTrackingText(
      element.getAttribute('aria-label') ||
      element.textContent ||
      element.getAttribute('title') ||
      element.getAttribute('href') ||
      ''
    );
  }

  function trackingURL(element) {
    var href = element.getAttribute && element.getAttribute('href');
    if (!href) return window.location.href;
    try { return new URL(href, window.location.href).href; }
    catch (error) { return href; }
  }

  function pushInteraction(eventName, element, option) {
    window.dataLayer = window.dataLayer || [];
    var payload = {
      event: 'custom_event',
      event_name: eventName,
      link_text: trackingText(element),
      link_url: trackingURL(element)
    };
    if (option) payload.option = option;
    window.dataLayer.push(payload);
  }

  document.addEventListener('click', function (event) {
    var element = event.target.closest('a,button');
    if (!element || element.closest('[data-cookie-consent]') || element.hasAttribute('data-cookie-manage')) return;

    var name = 'click_button';
    var option = '';

    if (element.classList.contains('menu-toggle')) {
      name = 'click_hamburger_menu';
      option = element.getAttribute('aria-expanded') === 'true' ? 'open' : 'close';
    } else if (element.closest('.site-nav')) {
      name = 'click_menu';
      option = element.closest('.language-switcher') ? 'language_switcher' : 'main_navigation';
    } else if (element.closest('footer')) {
      name = 'click_footer';
      option = 'footer';
    } else if (element.closest('.resource-card')) {
      name = 'click_card';
      option = 'resource_card';
    } else if (element.closest('.home-tool')) {
      name = 'click_card';
      option = 'home_tool';
    } else if (element.closest('.person-card')) {
      name = 'click_card';
      option = 'person_card';
    } else if (element.tagName === 'A') {
      name = 'click_link';
      option = 'content_link';
    }

    pushInteraction(name, element, option);
  });

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', toggle.dataset.openLabel || 'Open navigation');
    nav.classList.remove('is-open');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? (toggle.dataset.closeLabel || 'Close navigation') : (toggle.dataset.openLabel || 'Open navigation'));
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
      counter.textContent = (count === 1 ? catalog.dataset.countOne : catalog.dataset.countMany).replace('%s', count);
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
