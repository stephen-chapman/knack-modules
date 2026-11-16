(function (global) {
  'use strict';

  const KnackModules = global.KnackModules || {};

  KnackModules.formatView = function (viewKey, options = {}) {
    const $view = $('#' + viewKey);
    if (!$view.length) return;

    if (options.hideTitle) $view.find('.view-header').hide();
    if (options.bgColor) $view.css('background-color', options.bgColor);
    // ...your logic
  };

  KnackModules.version = '1.0.0';

  global.KnackModules = KnackModules;
})(window);
