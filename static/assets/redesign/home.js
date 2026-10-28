(function () {
  'use strict';
  var root = document.querySelector('[data-home-catalog]');
  if (!root) return;

  var cards = Array.from(root.querySelectorAll('[data-home-tool]'));
  var filters = Array.from(root.querySelectorAll('[data-home-filter]'));
  var search = root.querySelector('input[data-home-search]');
  var searchWrap = root.querySelector('.home-search');
  var searchToggle = root.querySelector('[data-home-search-toggle]');
  var catalogLinks = Array.from(root.querySelectorAll('[data-home-catalog-link]'));
  var grid = root.querySelector('[data-home-grid]');
  var empty = root.querySelector('[data-home-empty]');
  var status = root.querySelector('[data-home-result-status]');
  var panel = root.querySelector('[data-home-visit]');
  var panelToggle = root.querySelector('[data-home-panel-toggle]');
  var log = root.querySelector('[data-home-log]');
  var lastEvent = root.querySelector('[data-home-last-event]');
  var codeToggle = root.querySelector('[data-home-code]');
  var consentButtons = Array.from(root.querySelectorAll('[data-home-consent]'));
  var filterNames = { all: 'Todo', web: 'Consultar GA4', extension: 'Probar mis etiquetas', template: 'Plantillas para GTM' };
  var category = 'all';
  var showCode = false;
  var demoConsent = 'denied';
  var entries = [];
  var searchTimer;
  var lastSearch = '';

  function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  // Everything below is an on-page illustration kept in memory. The example
  // snippets are text nodes: never call gtag, push to dataLayer, store consent,
  // write cookies, or send requests from this demo.
  function token(parent, value, type) {
    var span = document.createElement('span');
    span.className = 'home-code-' + type;
    span.textContent = value;
    parent.appendChild(span);
  }

  function codeFor(entry) {
    var code = document.createElement('code');
    if (entry.consent) {
      token(code, 'gtag', 'function');
      token(code, '(', 'punctuation');
      token(code, '"consent"', 'string');
      token(code, ', ', 'punctuation');
      token(code, JSON.stringify(entry.mode), 'string');
      token(code, ', { ', 'punctuation');
      token(code, 'analytics_storage', 'key');
      token(code, ': ', 'punctuation');
      token(code, JSON.stringify(entry.consent), 'string');
      token(code, ' })', 'punctuation');
    } else {
      token(code, 'dataLayer.push', 'function');
      token(code, '({ ', 'punctuation');
      Object.keys(entry.data).forEach(function (key, index) {
        if (index) token(code, ', ', 'punctuation');
        token(code, key, 'key');
        token(code, ': ', 'punctuation');
        token(code, JSON.stringify(entry.data[key]), typeof entry.data[key] === 'string' ? 'string' : 'value');
      });
      token(code, ' })', 'punctuation');
    }
    return code;
  }

  function rowFor(entry) {
    var row = document.createElement('div');
    row.className = 'home-visit-line';
    var time = document.createElement('time');
    time.dateTime = entry.time.toISOString();
    time.textContent = entry.time.toLocaleTimeString('es-ES', { hour12: false });
    row.appendChild(time);
    if (showCode) {
      row.appendChild(codeFor(entry));
    } else {
      var human = document.createElement('span');
      human.className = 'home-visit-human';
      human.textContent = entry.human;
      row.appendChild(human);
    }
    return row;
  }

  function renderLog() {
    log.replaceChildren();
    entries.forEach(function (entry) { log.appendChild(rowFor(entry)); });
    if (log.lastElementChild) log.lastElementChild.classList.add('is-latest');
    log.scrollTop = log.scrollHeight;
  }

  function addLine(entry) {
    entry.time = new Date();
    if (!entries.length) log.replaceChildren();
    entries.push(entry);
    if (entries.length > 6) entries.shift();
    if (log.lastElementChild) log.lastElementChild.classList.remove('is-latest');
    var row = rowFor(entry);
    row.classList.add('is-latest');
    log.appendChild(row);
    while (log.children.length > 6) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
    lastEvent.textContent = entry.human;
  }

  function updateCatalog() {
    var query = normalize(search.value);
    var words = query.split(/\s+/).filter(Boolean);
    var count = 0;
    cards.forEach(function (card) {
      var matches = (category === 'all' || card.dataset.homeCategory === category) && words.every(function (word) {
        return normalize(card.dataset.homeSearch).includes(word);
      });
      card.hidden = !matches;
      if (matches) count++;
    });
    filters.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.homeFilter === category)); });
    empty.hidden = count !== 0;
    grid.hidden = count === 0;
    status.textContent = count + (count === 1 ? ' herramienta destacada' : ' herramientas destacadas');
    var url = new URL(category === 'template' && !query ? root.dataset.templateUrl : root.dataset.catalogUrl, window.location.href);
    if (category !== 'all' && !(category === 'template' && !query)) url.searchParams.set('tipo', category);
    if (query) url.searchParams.set('q', search.value.trim());
    var labels = {
      all: 'Ver los ' + root.dataset.resourceCount + ' recursos',
      web: 'Ver todas las webs',
      extension: 'Ver todas las extensiones',
      template: 'Ver las ' + root.dataset.templateCount + ' plantillas para GTM'
    };
    catalogLinks.forEach(function (link) {
      link.href = url.pathname + url.search;
      link.textContent = query ? 'Buscar en todo el catálogo' : labels[category];
    });
    grid.scrollLeft = 0;
  }

  function selectFilter(value) {
    if (!Object.prototype.hasOwnProperty.call(filterNames, value)) return;
    var changed = category !== value;
    category = value;
    updateCatalog();
    if (changed) addLine({ human: 'Has elegido «' + filterNames[value] + '».', data: { event: 'catalog_filter', filter: value } });
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () { selectFilter(button.dataset.homeFilter); });
  });

  function recordSearch() {
    clearTimeout(searchTimer);
    var value = search.value.trim().slice(0, 120);
    if (!value) { lastSearch = ''; return; }
    if (value === lastSearch) return;
    lastSearch = value;
    addLine({ human: 'Has buscado «' + value + '».', data: { event: 'search', search_term: value } });
  }
  search.addEventListener('input', function () {
    updateCatalog();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(recordSearch, 450);
  });
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') recordSearch();
    if (event.key === 'Escape') {
      if (search.value) {
        search.value = '';
        clearTimeout(searchTimer);
        lastSearch = '';
        updateCatalog();
      } else {
        searchWrap.classList.remove('is-open');
        searchToggle.setAttribute('aria-expanded', 'false');
        if (window.matchMedia('(max-width: 759px)').matches) searchToggle.focus();
      }
    }
  });
  searchToggle.addEventListener('click', function () {
    var open = !searchWrap.classList.contains('is-open');
    searchWrap.classList.toggle('is-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) search.focus();
    else {
      search.value = '';
      clearTimeout(searchTimer);
      lastSearch = '';
      updateCatalog();
    }
  });
  root.querySelector('[data-home-reset]').addEventListener('click', function () {
    search.value = '';
    clearTimeout(searchTimer);
    lastSearch = '';
    selectFilter('all');
    filters[0].focus();
  });

  document.querySelectorAll('[data-home-nav-filter]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      search.value = '';
      clearTimeout(searchTimer);
      lastSearch = '';
      selectFilter(link.dataset.homeNavFilter);
      root.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });

  cards.forEach(function (card) {
    card.addEventListener('click', function (event) {
      var link = event.target.closest('a[data-home-action]');
      if (!link) return;
      cards.forEach(function (item) { item.classList.toggle('is-featured', item === card); });
      var opening = link.dataset.homeAction === 'open';
      addLine({
        human: (opening ? 'Has pulsado para abrir ' : 'Has abierto la ficha de ') + card.dataset.homeTitle + '.',
        data: { event: opening ? 'click' : 'select_content', content_type: 'tool', content_id: card.dataset.homeTool, outbound: link.target === '_blank' }
      });
      // Let the browser follow the real resource or installation URL.
    });
  });

  panelToggle.addEventListener('click', function () {
    var open = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', open);
    panelToggle.setAttribute('aria-expanded', String(open));
    panelToggle.textContent = open ? 'Ocultar' : 'Ver tu visita';
  });
  codeToggle.addEventListener('click', function () {
    showCode = !showCode;
    codeToggle.setAttribute('aria-pressed', String(showCode));
    codeToggle.textContent = showCode ? 'Ver en palabras' : 'Ver el código';
    renderLog();
  });
  consentButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.homeConsent;
      if (value === demoConsent) return;
      demoConsent = value;
      consentButtons.forEach(function (item) { item.setAttribute('aria-pressed', String(item.dataset.homeConsent === value)); });
      addLine({ human: value === 'granted' ? 'En la demo has aceptado la analítica.' : 'En la demo has rechazado la analítica.', consent: value, mode: 'update' });
    });
  });

  updateCatalog();
  addLine({ human: 'Consentimiento de ejemplo: denegado.', consent: 'denied', mode: 'default' });
  addLine({ human: 'Has entrado en la portada.', data: { event: 'page_view', page_path: '/' } });
})();
