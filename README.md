
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

## Pages

Creating pages inside the folder `pages` will result in the generated page being build for preview at `localhost:3000/[pagename.html]`. 

It's best to only create or edit content, styles, images, JavaScript etc within the `src` folder as any changes in the `build` folder will be overwritten.

I've included a file called `pages/skeleton.html` that can be used as a starting point. It includes each of the needed JavaScript files and a starting structure for the page.

## Generating Zip files

Once the page works as expected you can generate a zip file for each of the pages in the `pages` folder using Gulp.

The command `gulp build` (if `gulp` isn't already running), then `gulp make` takes the built previews and makes them ready for the zip step. Finally run `gulp zip` to create the .zip files. You should then find a set of zip files in the `zips` folder.

Note: The build process puts all images into each folder, so it's currently necessary to go in and tidy away any images that aren't needed. 

## Page: cross-sell.html

The Cross Sell page is made up of two main sections, the "Main Stage" and "Get more apps". It uses the following templates (see also the source code under `pages/cross-sell.html` for notes:

### Header image

If a page needs a header image, you can use this template to place it:

    <div class="to-render"
      data-template="page-title-template"
      data-settings='{
        "image": "./images/example/storytoys.png",
        "height": 78,
        "width": 320
      }'></div>

The `data-template` attribute is used to specify which template is being rendered. It then needs a `data-settings` object (JSON) containing any attributes specific to this template.

For reference, these templates can be found in the file `templates/all.mst`. During the build process these templates are placed inline with the HTML.

### Sections

"Sections" are containers for content and they display their content using Flexbox by default. A section can have a background or be transparent, and have an optional "title" attribute displayed as a header. This title attribute is associated with a `title` key under `i18n` to identify the string in the locales file for translation.

The background classes `bg-non` or `bg-white` set the background.

    <div class="to-render" data-template="section-template" data-settings='{
      "bgClass": "bg-none",
      "title": "Main Stage",
      "i18n": {
        "title": "Main Stage"
      }
    }'>

    ... content as needed, or other templates ...

    </div>

Another type of section is one with a group of items being passed in. 

    <div 
      class="to-render"
      data-template="section-template"
      data-child-template="asset-group-template"
      data-settings='{
        "bgClass": "bg-white"
      }'
      data-dbgroups='[{
        "title": "Get more apps",
        "titlei18nKey": "Get more apps",
        "showOwnedApps": false,
        "showNonOwnedApps": true,
        "image": "icon",
        "class": "icon",
        "categories": ["category1"]
      }]'
    ></div>

This section includes a second template setting, the `data-child-template`. This is the template used for these child "icons". We then define these icons in `data-dbgroups`.

`data-dbgroups` is an array of 1 or more "groups" of items called in from the local "database". Each group contains a title, an internationalisation key, settings for whether to show apps that the user owns (boolean), whether to show apps that are not on the device (boolean), the `image` type (brick / book/ icon / bundle), the class (same) and `categories`.

The `categories` property is an array of categories that line up with the categories set for each of the apps in `data/apps.json`.

In this example above, it'll show only apps the user doesn't have from a set with "category1" in their category array.

### Banners

Large image-based boxes that can either be full width, half-width or third-width. The banners rely on a "banners" div container to make sure that they sit properly without wrapping.

    <div class="banners">
      <!-- Put in as many of the following banners as needed (e.g. 1, 2 or 3) -->
      <div class="to-render"
        data-template="banner-template"
        data-settings='{
          "target": "#",
          "title": "Banner title",
          "subtitle": "",
          "image": "./images/example/placeholder_",
          "height": 300,
          "i18n": {
            "title": "banner2Title",
            "subtitle": ""
          }
        }'></div>
    </div>

The settings for the banner include the `target` which is the URL the banner will link to.

It also includes an optional `title` and optional `subtitle` (which goes beneath the banner image).

It also specifies an `image` which follows the naming convention: `[imagename]_[lang]@4x.jpg` such as `placeholder_en@4x.jpg`.

It sets the image `height` and lastly includes keys for the `title` and `subtitle` strings to connect the titles to what's in the internationalisation file.

### Footer

The footer is a text link, based on a template also. It can be set as follows:

    <div
      class="to-render"
      data-template="footer-link-template"
      data-settings='{
        "target": "#",
        "linkText": "More from TouchPress",
        "i18n": { 
          "linkTextKey": "More from TouchPress"
        }
      }'></div>

## Page: up-sell.html

The page `pages/up-sell.html` is an example of a responsive modal overlay with dynamic content which scales to fit any size of screen. it uses percentage and relative sizing so that it can adapt to any screen size.

Currently the content on this page is static, it does not use any templates but it does use the internationalisation object found in `locales/all.json`, so any strings referred to using a key in the `data-i18n` data attribute will be automatically replaced with localised strings.

(Note: The locale setting within the JS isn't being set yet and defaults to "en", until we nail down the Localytics object contents).

This page contains:

* Background image on the modal (defined in the HTML)
* Background page colour (set in promo.scss)
* HTML text (defined in the HTML)
* One or more "tiers" 

Styling for these elements can be found under `sass/components/_promo.scss`.

To set the background image, you can add an image within the HTML:

    <div
      class="promo-container image-bg"
      style="background-image: url(./images/example/background.jpg);"
    >

Currently this is not internationalised.

Each tier has a target specified in the HTML:

    <a href="#"> <!-- Link for the tier -->
      <div class="tier blue">
        <div class="top">
          <h2 data-i18n="7 days free!">7 Days Free!</h2>
        </div>
        <div class="bottom">
          <h3 data-i18n="Monthly plan">Monthly Plan</h3>
          <div class="button">
            <span data-i18n="currencySymbol">$</span><span id="js-price">3.99</span>
          </div>
          <p class="small" data-i18n="Billed monthly">Billed monthly</p>
        </div>
      </div>
    </a>

The colour for the tier is set in the CSS and referred to here in the classes as a modifier. Internationalisation strings are included in the content and these keys can be added to the `locales/all.json` file as needed.

The price is currently hardcoded but shuld be updatable once we settle on the data from Localytics.

### Countdown

The main dynamic element on this page is the countdown. This is a JavaScript counter that counts down to a specific target date. The date is set in the JavaScript at line 112 of the page source:

    var targetDate  = new Date(Date.UTC(2017, 3, 01));

This UTC date is then compared to the devices local date to ensure the countdown is accurate. Currently this is hardcoded.

## Page: up-sell-video.html

Siilar to the `up-sell.html` page, this page contains some extra code to embed a video in the background. To customise the video, edit this part of the HTML:

    <div class="video-container">
      <video autoplay loop class="fillWidth">
        <source src="https://cssanimation.rocks/levelup/public/video/Big-Apple/MP4/Big-Apple.mp4" type="video/mp4" />
      </video>
      <div class="poster hidden">
        <img src="https://cssanimation.rocks/levelup/public/video/Big-Apple/Snapshots/Big-Apple.jpg" alt="Big Apple">
      </div>
    </div>

The video referenced in the `source` tag should be an mp4 video. You can also specify a poster file that will show when the video is loading. 

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

## i18n

In various examples you'll see i18n keys specified. These are used to call in the translated form of the string where available in a locale file. If no translated version is found, the fallback is to use the given string.

Translations are handled by [i18next](https://www.i18next.com/).

Translations are contained in the `locales` folder. Since the translations files had to be loaded in using an Ajax request, this wasn't working for local files so instead it now puts the translation keys inline in the HTML. All translations are in the file `locales/all.json`.

    {
      "en": {
        "translation": {
          "Main Stage": "Main Stage",
          "Get more apps": "Get more apps",
          "appTitles": {
            "LeonardosCat": "Leonardos Cat",
            "SleepingBeauty": "Sleeping Beauty",
            ... etc
          }
        }
      },
      "de": {
        "translation": {
          ... German versions here ...
        }
      }
    }

Other examples can be found in the templates, and include plurals as well as dynamic data being passed into the translations file.


