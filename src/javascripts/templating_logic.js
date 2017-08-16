// Essential helper functions

  document.getHTML= function(who, deep){
      if(!who || !who.tagName) return '';
      var txt, ax, el= document.createElement("div");
      el.appendChild(who.cloneNode(false));
      txt= el.innerHTML;
      if(deep){
          ax= txt.indexOf('>')+1;
          txt= txt.substring(0, ax)+who.innerHTML+ txt.substring(ax);
      }
      el= null;
      return txt;
  }

  var escape = document.createElement('textarea');
  function escapeHTML(html) {
      escape.textContent = html;
      return escape.innerHTML;
  }
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
    var localytics = {}; // Set a global I can populate then use later
  }

  window.appData = false;
  window.translationsLoadRun = false;
  window.translationsLoaded = false;
  window.templatesRendered = false;

  if ($('#__bs_script__').length) {
    $.get('data/apps.json', function(data) {
      console.log('App Data loaded');
      window.appData = data;
    });

    $.get('data/user.json', function(data) {
      console.log('User Data loaded', data);
      localytics = data;
    });
  }

  // Use requestAnimationFrame to poll until page is ready to be localised
  var check = window.requestAnimationFrame;
  function poll() {
    if (window.appData && !window.translationsLoadRun) {
      loadTranslations(localytics.lang);
    } 
    if (window.translationsLoaded && window.templatesLoaded && window.templatesRendered) {
      $('body').localize();
    } else {
      check(poll);
    }
  }
  // Call the poll for the first time
  poll();


  function loadTranslations(lang) {
    window.translationsLoadRun = true;
    // Init and load the translations file
    i18next.use(i18nextXHRBackend);
    i18next.init({
      'debug': false,
      'lng': lang,
      'fallbackLng': 'en',
      backend: {
        loadPath: '/locales/{{lng}}.json'
      }
    }, function() {
      jqueryI18next.init(i18next, $, {
        optionsAttr: 'i18n-options',
        useOptionsAttr: true
      });
      console.log('Translations loaded');
      window.translationsLoaded = true;
    });
  }


  // Get and render the templates
  $.get('templates/all.mst', function(templateHTML) {
    // With templates loaded, display each of the sections
    var templatesArray = $.parseHTML(templateHTML);
    var templates = templatesArray.reduce(function(templates, item) {
      if ($(item).attr('id')) {
        templates[$(item).attr('id')] = item;
      }
      return templates;
    }, {});
    
    renderAll(templates);
    if ($('.to-render').length) {
      renderAll(templates);
    }

    window.templatesLoaded = true;

  });

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
            // Set up the object based on the database data
            //group.showOwnedApps;
            // for each app in window.appData
            // match against the group.items
            // match also againt the localytics.attributes
            // if in attributes, and showOwnedApps is true, add it
            // if not in attributes, and showNonOwnedApps is true, add it
            group.items = [];

            group.dbitems.forEach(function(appKey) {
              console.log(window.appData[appKey]);
              if (
                (isInUserAttributes(appKey) && group.showOwnedApps)
                || (!isInUserAttributes(appKey) && group.showNonOwnedApps)
              ) {
                var item = generateItemFromDbGroup(appKey, group)
                group.items.push(item);
              }
            });
            content += renderArrayToHTML(groupTemplate, group);
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
    console.log('Templates rendered');
    window.templatesRendered = true;
  }

});