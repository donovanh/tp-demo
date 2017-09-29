// Essential helper functions

  function rendertoHTML(template, settings) {
    return Mustache.render(template, settings);
  }
  function renderArrayToHTML(template, items) {
    var html = '';
    $(items).each(function(index, item) {
      html += rendertoHTML(template, item);
    });
    return html;
  }
  function render(template, settings, item) {
    var html = Mustache.render(template, settings);
    $(item).replaceWith(html);
  }

$(function() {

  if (!localytics) {
    var localytics = window.userData; // Set local data for development
  }

  window.translationsLoadRun = false;
  window.translationsLoaded = false;
  window.templatesRendered = false;

  // Use requestAnimationFrame to poll until page is ready to be localised
  var check = window.requestAnimationFrame;
  function poll() {
    if (window.appData && !window.translationsLoadRun) {
      loadTranslations(localytics.lang);
    } 
    if (window.translationsLoaded && window.templatesRendered) {
      $('body').localize();
      $('html').addClass('loaded');
    } else {
      check(poll);
    }
  }
  // Call the poll for the first time
  poll();


  function loadTranslations(lang) {
    window.translationsLoadRun = true;
    // Init and load the translations file
    i18next.init({
      lng: 'en',
      debug: true,
      resources: window.locales
    }, function() {
      jqueryI18next.init(i18next, $, {
        optionsAttr: 'i18n-options',
        useOptionsAttr: true
      });
      window.translationsLoaded = true;
    });
  }


  // Get and render the templates
  if ($('.js-template').length) {
    var templatesArray = $('.js-template');
    templates = {};
    templatesArray.each(function(index, item) {
      if ($(item).attr('id')) {
        templates[$(item).attr('id')] = item;
      }
    });

    if ($('.to-render').length) {
      renderAll(templates);
    }
  }

  function isInUserAttributes(appKey) {
    return localytics.attributes[appKey] !== undefined;
  }

  function generateItemFromDbGroup(appKey, group) {
    return {
      "target": window.appData[appKey].urls.ios,
      "class": group.class,
      "title": window.appData[appKey].title,
      "i18n": {
        "title": 'appTitles.' + appKey
      },
      "image": window.appData[appKey].icons[group.image]
    }
  }

  function getItemsFromDBItemsList(group) {
    var groupItems = [];
    group.dbitems.forEach(function(appKey) {
      if (
        (isInUserAttributes(appKey) && group.showOwnedApps)
        || (!isInUserAttributes(appKey) && group.showNonOwnedApps)
      ) {
        var item = generateItemFromDbGroup(appKey, group)
        groupItems.push(item);
      }
    });
    return groupItems;
  }

  function hasCategory(app, categories) {
    var found = false;
    categories.forEach(function(category) {
      if (app.categories.indexOf(category) > -1) {
        found = true;
      }
    });
    if (found) return app;
  }

  function getItemsByCategories(group) {
    var groupItems = [];
    for (var appKey in window.appData) {
      if (window.appData.hasOwnProperty(appKey)) {
        var thisApp = window.appData[appKey];
        if (hasCategory(thisApp, group.categories)) {
          if (
            (isInUserAttributes(appKey) && group.showOwnedApps)
            || (!isInUserAttributes(appKey) && group.showNonOwnedApps)
          ) {
            var item = generateItemFromDbGroup(appKey, group)
            groupItems.push(item);
          }
        }
      }
    }
    return groupItems;
  }

  function renderAll(templates) {
    $('.to-render').each(function(index, item) {
      // If it's a section containing groups, it will have a child-template
      if ($(item).attr('data-child-template') && ($(item).attr('data-groups') || $(item).attr('data-dbgroups'))) {
        var groupTemplate = templates[$(item).attr('data-child-template')].innerHTML;
        var content = '';
        if ($(item).attr('data-groups')) {
          var groups = JSON.parse($(item).attr('data-groups'));
          groups.forEach(function(group) {
            content += renderArrayToHTML(groupTemplate, group);
          });
        }
        if ($(item).attr('data-dbgroups')) {
          var dbgroups = JSON.parse($(item).attr('data-dbgroups'));
          dbgroups.forEach(function(group) {
            // If no items specified, build the items array by category
            if (group.dbitems) {
              group.items = getItemsFromDBItemsList(group);
            } else if (group.categories) {
              group.items = getItemsByCategories(group);
            } else {
              console.error('Please specify either a list of items, or a category');
            }
            if (group.items) {
              content += renderArrayToHTML(groupTemplate, group);
            }
          });
        }
      }
      var template = templates[$(item).attr('data-template')].innerHTML;
      var settings = JSON.parse($(item).attr('data-settings'));
      if (content) {
        settings.content = content;
      }

      settings.inlineContent = $(item).html();

      render(template, settings, item);
    });
    window.templatesRendered = true;
  }

});