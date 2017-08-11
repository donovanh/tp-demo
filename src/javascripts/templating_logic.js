window.translationsLoaded = false;
window.templatesDone = false;

// Init and load the translations file
i18next.use(i18nextXHRBackend);
i18next.init({
  'debug': false,
  'lng': 'en',
  'fallbackLng': 'en',
  backend: {
    loadPath: '/locales/{{lng}}.json'
  }
}, function() {
  jqueryI18next.init(i18next, $, {
    optionsAttr: 'i18n-options',
    useOptionsAttr: true
  });
  window.translationsLoaded = true;
});

// Get and render the templates
$.get('templates/all.html', function(templateHTML) {
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

  window.templatesDone = true;

});

function renderAll(templates) {
  $('.to-render').each(function(index, item) {
    // If it's a section containing groups, it will have a child-template
    if ($(item).attr('data-child-template') && $(item).attr('data-groups')) {
      var groupTemplate = templates[$(item).attr('data-child-template')].innerHTML;
      var content = '';
      var groups = JSON.parse($(item).attr('data-groups'));
      groups.forEach(function(group) {
        content += renderArrayToHTML(groupTemplate, group);
      });
    }
    var template = templates[$(item).attr('data-template')].innerHTML;
    var settings = JSON.parse($(item).attr('data-settings'));
    if (content) {
      settings.content = content;
    }

    settings.inlineContent = $(item).html();

    render(template, settings, item);
  });
}

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
  console.log(item);
  $(item).replaceWith(html);
}