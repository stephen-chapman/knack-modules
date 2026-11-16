(function (global) {
  'use strict';

  const KnackModules = global.KnackModules || {};

  function requireKnackAPI() {
    if (typeof global.KnackAPI === 'undefined') {
      throw new Error('[KnackModules] knack-api-helper not loaded. Load it into your Knack JS before knack-modules.js.');
    }
    return global.KnackAPI;
  }

  // ----------------------------------------------------------------------------------------------------------
  KnackModules.formatView = function (viewKey, options = {}) {
    const $view = $('#' + viewKey);
    if (!$view.length) return;

    if (options.hideTitle) $view.find('.view-header').hide();
    if (options.bgColor) $view.css('background-color', options.bgColor);
    // ...your logic
  };

  // ----------------------------------------------------------------------------------------------------------
  // Purpose: Retrieve and add record counts to filter menu link labels
  KnackModules.addCountsToFilterMenu = async function (viewKey) {

    const KnackAPI = requireKnackAPI();
    
    const $view = $(`#${viewKey}`);
    const view = Knack.views[viewKey];
    const $filterMenu = $view.find('.js-filter-menu ul');
    const menuFilters = view?.model?.view?.menu_filters || [];
    
    if (!sceneCache[viewKey]) {
      sceneCache[viewKey] = {};
    }
      
    for (const [index, filter] of menuFilters.entries()) {
      const $link = $filterMenu.find(`li:nth-child(${index+1}) > a > span`);
      let recordCount = 0;
      if ($link.closest('li').hasClass('is-active')) {
        recordCount = view?.model?.data?.total_records || 0;
        sceneCache[viewKey][index] = recordCount;
      } else if (sceneCache[viewKey][index]) {
        recordCount = sceneCache[viewKey][index]
      } else {
        const knackAPI = new KnackAPI({ auth: 'view-based', applicationId: Knack.application_id, userToken: Knack.getUserToken() });
        const records = await knackAPI.getMany({ scene: view.model.view.scene.key, view: viewKey, filters: [filter], rowsPerPage: 1, maxRecordsToGet: 1});
        recordCount = records?.pages?.[0]?.json?.total_records || 0;
      }
      sceneCache[viewKey][index] = recordCount;
      if (recordCount) $link.html(`${$link.text()} (${recordCount})`); // Add the record count to the menu link
    }
  }

  // ----------------------------------------------------------------------------------------------------------

  KnackModules.version = '1.0.0';

  global.KnackModules = KnackModules;
})(window);
