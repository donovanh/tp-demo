
# tp demo

This can be used to build and generate standalone pages that will act as cross-promo pages within the Localytics platform. It has the following features:

* Build process handled by Gulp
* Sass / Scss for CSS
* Uglified and compressed CSS and JavaScript assets
* Templating support using Mustache
* Internationalisation using i18next

## Build process

To get started, download this repo and run `npm install`. This requires [NodeJS](https://nodejs.org/en/) be installed first.

You can then run `gulp` and it will build the local version of the website, and automatically open it in your browser using the url `localhost:3000`.

The Gulp process then watches for changes to any HTML, CSS, or JavaScript files and runs the build process, updating the content in the browser using Browser Sync.

If adding new images, you'll need to run the process `gulp images` as it's not currently watching for changes to the images.

## Templates

Templates are defined within the index.html file [TODO: migrate them into their own file and load them asynchronously]. They are [Mustache](https://mustache.github.io/mustache.5.html) templates and can be found within `script` tags near the top of the file.

They look something like this:

    <script id="asset-template" type="text/html">
      <div class="asset {{class}}">
        {{#i18n.locale}}
          <span class="image" style="background-image: url({{image}}{{i18n.locale}}@4x.jpg)"></span>
        {{/i18n.locale}}
        {{^i18n.locale}}
          <span class="image" style="background-image: url({{image}})"></span>
        {{/i18n.locale}}
        {{#i18n.title}}
          <h2 class="asset-title" data-i18n="{{i18n.title}}">{{title}}</h2>
        {{/i18n.title}}
        {{^i18n.title}}
          <h2 class="asset-title">{{title}}</h2>
        {{/i18n.title}}
      </div>
    </script>

This example is for the brick, book or icon assets. They're made up of an image and a title. The Mustache tags are used to show a localised image if the `i18n.locale` string is available, otherwise it'll default to the image url.

If there's a localised title key specified (`i18n.title`) then it uses that version, otherwise it will default to the fallback title passed into the template.

Translations are handled by [i18next](https://www.i18next.com/).

## i18n

Translations are contained in the `locales` folder. For the above example, where the `i18n.title` key is referenced, the following parts are used from `en.json`:

    {
      "asset1Title": "Example brick",
      "asset2Title": "Example book",
      "asset3Title": "Example icon",
      "asset4Title": "Example bundle",
      "asset5Title": "Example bundle with child icon"
    }

If we pass in `asset1Title` as the value of `i18n.title` then it will look up that text string in the `en.json` file (or `de.json`, etc depending on the locale we set on load).

Other examples can be found in the templates, and include plurals as well as dynamic data being passed into the translations file.

TODO: Tidy up the translations file based on real content - it's just some dummy content for now.


