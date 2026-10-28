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

  function updateConsent(granted, source) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    var state = {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };

    window.gtag('consent', 'update', state);

    window.__luraticConsentState = {
      mode: 'update',
      analytics_storage: state.analytics_storage,
      ad_storage: state.ad_storage,
      ad_user_data: state.ad_user_data,
      ad_personalization: state.ad_personalization
    };

    window.dispatchEvent(new CustomEvent('luratic:consent-change', {
      detail: {
        mode: 'update',
        source: source || 'unknown',
        analytics_storage: state.analytics_storage,
        ad_storage: state.ad_storage,
        ad_user_data: state.ad_user_data,
        ad_personalization: state.ad_personalization
      }
    }));
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

    updateConsent(granted, source);

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
    push('cookies_banner_impression', 'banner');
  }

  function openSettings(location) {
    var saved = getSaved();
    lastFocus = document.activeElement;
    root.hidden = false;
    banner.hidden = true;
    settings.hidden = false;
    analytics.checked = !!(saved && saved.analytics === 'granted');
    push('cookies_open_settings', location || 'banner');
    var focusable = settings.querySelector('input,button');
    if (focusable) focusable.focus();
  }

  function closeSettings() {
    settings.hidden = true;
    if (getSaved()) root.hidden = true;
    else banner.hidden = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function hideAll() {
    root.hidden = true;
    banner.hidden = false;
    settings.hidden = true;
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
    if (event.key === 'Escape' && !settings.hidden) closeSettings();
  });

  if (!getSaved()) showBanner();
})();
