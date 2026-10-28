(function () {
  'use strict';

  var root = document.querySelector('[data-cookie-consent]');
  if (!root) return;

  var key = 'luratic_consent_v1';
  var banner = root.querySelector('.cookie-banner');
  var settings = root.querySelector('[data-cookie-settings]');
  var analytics = root.querySelector('[data-cookie-analytics]');
  var lastFocus = null;

  function getSaved() {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null'); }
    catch (error) { return null; }
  }

  function setPageBlocked(blocked) {
    document.documentElement.classList.toggle('cookie-consent-open', blocked);
    document.body.classList.toggle('cookie-consent-open', blocked);

    Array.from(document.body.children).forEach(function (element) {
      if (element === root || element.tagName === 'SCRIPT') return;
      if (blocked) {
        if (!element.hasAttribute('data-consent-was-inert')) {
          element.setAttribute('data-consent-was-inert', element.inert ? 'true' : 'false');
        }
        element.inert = true;
      } else if (element.hasAttribute('data-consent-was-inert')) {
        element.inert = element.getAttribute('data-consent-was-inert') === 'true';
        element.removeAttribute('data-consent-was-inert');
      }
    });
  }

  function activeDialog() {
    return settings.hidden ? banner : settings;
  }

  function focusFirst() {
    var element = activeDialog().querySelector('button, a[href], input, [tabindex]:not([tabindex="-1"])');
    if (element) element.focus();
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || root.hidden) return;
    var dialog = activeDialog();
    var focusable = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(function (element) { return element.offsetParent !== null; });
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function push(name, location, option) {
    window.dataLayer = window.dataLayer || [];
    var payload = {
      event: 'custom_event',
      event_name: name,
      location: location
    };
    if (option) payload.option = option;
    window.dataLayer.push(payload);
  }

  function updateConsent(granted) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied'
    });
  }

  function save(granted, source) {
    var value = granted ? 'granted' : 'denied';
    var location = source === 'cookies_save_preferences' ? 'modal' : 'banner';
    try {
      window.localStorage.setItem(key, JSON.stringify({
        analytics: value,
        version: 1,
        updated_at: new Date().toISOString()
      }));
    } catch (error) {}

    updateConsent(granted);

    // Let GTM process the consent update before the analytics event.
    // This matters when the custom_event tag requires analytics_storage=granted.
    window.setTimeout(function () {
      push(source, location, 'analytics_' + value);
      hideAll();
    }, 0);
  }

  function showBanner() {
    root.hidden = false;
    banner.hidden = false;
    settings.hidden = true;
    setPageBlocked(true);
    push('cookies_banner_impression', 'banner');
    window.setTimeout(focusFirst, 0);
  }

  function openSettings(location) {
    var saved = getSaved();
    lastFocus = document.activeElement;
    root.hidden = false;
    banner.hidden = true;
    settings.hidden = false;
    analytics.checked = !!(saved && saved.analytics === 'granted');
    setPageBlocked(true);
    push('cookies_open_settings', location || 'banner');
    window.setTimeout(focusFirst, 0);
  }

  function closeSettings() {
    settings.hidden = true;
    if (getSaved()) {
      root.hidden = true;
      setPageBlocked(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    } else {
      banner.hidden = false;
      window.setTimeout(focusFirst, 0);
    }
  }

  function hideAll() {
    root.hidden = true;
    banner.hidden = false;
    settings.hidden = true;
    setPageBlocked(false);
  }

  root.querySelector('[data-cookie-accept]').addEventListener('click', function () { save(true, 'cookies_accept_all'); });
  root.querySelector('[data-cookie-reject]').addEventListener('click', function () { save(false, 'cookies_reject_all'); });
  root.querySelector('[data-cookie-open]').addEventListener('click', function () { openSettings('banner'); });
  root.querySelector('[data-cookie-close]').addEventListener('click', closeSettings);
  root.querySelector('[data-cookie-save]').addEventListener('click', function () { save(analytics.checked, 'cookies_save_preferences'); });
  root.querySelector('[data-cookie-settings-reject]').addEventListener('click', function () { save(false, 'cookies_reject_all'); });

  document.querySelectorAll('[data-cookie-manage]').forEach(function (button) {
    button.addEventListener('click', function () { openSettings('footer'); });
  });

  settings.addEventListener('click', function (event) {
    if (event.target === settings) closeSettings();
  });
  document.addEventListener('keydown', function (event) {
    trapFocus(event);
    if (event.key === 'Escape' && !settings.hidden) closeSettings();
  });

  if (!getSaved()) showBanner();
})();
