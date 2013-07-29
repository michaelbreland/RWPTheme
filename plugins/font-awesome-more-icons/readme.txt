=== Font Awesome More Icons ===
Contributors: jr00ck
Plugin URI: http://blog.webguysaz.com/font-awesome-more-icons-wordpress-plugin/
Donate link: http://blog.webguysaz.com/donate/
Tags: icons, font-awesome, font-awesome-more, fontstrap, font icon, UI, icon font, bootstrap
Requires at least: 3.0
Tested up to: 3.6-beta4
Stable tag: 3.2.1
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html


Enables Font Awesome icon font set plus icons from Font Awesome More (aka Fontstrap) extension set from within WordPress using HTML PHP or shortcodes.

== Description ==

Font Awesome More (Fontstrap) is a pictographic font set of over 300 icons. It includes all icons from the [Font Awesome](http://fortawesome.github.io/Font-Awesome/) set, plus additional icons from the [Fontstrap](http://gregoryloucas.github.io/Font-Awesome-More/) extension set. The icons are infitinely scalable and screen reader compatible.

A full list of over 300 Font Awesome More (Fontstrap) icons is available: [http://gregoryloucas.github.io/Font-Awesome-More/#icons-gLp](http://gregoryloucas.github.io/Font-Awesome-More/#icons-gLp) (_Note:_ The list of icons is temporarily unavailable)

To use any of the Font Awesome More icons on your WordPress site you have three options:

__HTML Option__

All code examples on the Font Awesome site apply: [http://gregoryloucas.github.io/Font-Awesome-More/#examples](http://gregoryloucas.github.io/Font-Awesome-More/#examples)

**Examples**

WordPress icon

`<i class="icon-wordpress"></i>`

Google icon

`<i class="icon-google"></i>`

Google Chrome icon

`<i class="icon-chrome"></i>`

__Shortcode Option__

Don't want to worry about HTML tags?  You can use a shortcode in your posts, pages and even widgets to display a Font Awesome More icon.

The shortcode to use is `[icon name=name-of-icon]`, where name=X is the class of the icon you would like to use.


WordPress icon

`[icon name=icon-wordpress]`

Google icon

`[icon name=icon-google]`

Google Chrome icon

`[icon name=icon-chrome]`

__PHP Option__

Within PHP you can call the shortcode functions and pass the appropriate shortcode attributes.


WordPress icon

`<?php echo do_shortcode('[icon name="icon-wordpress"]'); ?>`

Google icon

`<?php echo do_shortcode('[icon name="icon-google"]'); ?>`

Google Chrome icon

`<?php echo do_shortcode('[icon name="icon-chrome"]'); ?>`


__Credits__

* The Font Awesome & Font Awesome More (Fontstrap) font is licensed under the [SIL Open Font License](http://scripts.sil.org/OFL).

* Font Awesome & Font Awesome More (Fontstrap) CSS, LESS, and SASS files are licensed under the [MIT License](http://opensource.org/licenses/mit-license.html).

* The Font Awesome & Font Awesome More (Fontstrap) pictograms are licensed under the [CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/).

* [Font Awesome](http://fortawesome.github.com/Font-Awesome) is a product by Dave Gandy

* [Font Awesome More](http://gregoryloucas.github.io/Font-Awesome-More/) (Fontstrap) is a product of Gregory Loucas.

* The rights to each pictogram in the social and corporate extensions are either trademarked or copyrighted by the respective company.

* This plugin is based off of [Font Awesome Icons](http://rachelbaker.me/font-awesome-icons-wordpress-plugins/) by Rachel Baker.

__Author__

*   [Web Guys](http://webguysaz.com)

= Icons =

[Font Awesome More](http://gregoryloucas.github.io/Font-Awesome-More/#icons-gLp)

== Installation ==

1. Upload Font Awesome More Icons to the `/wp-content/plugins/` directory.

1. Activate the plugin through the 'Plugins' menu in WordPress.

1. Add shortcode to your posts, pages and even widgets to display a Font Awesome icon.

The shortcode to use is `[icon name=X]`, where name=X is the class of the icon you would like to use.

**Example:**

`[icon name=icon-pencil]`


1. You can use HTML by adding the appropiate class to the `<i>` element.

All code examples on the Font Awesome site apply: [http://fortawesome.github.com/Font-Awesome/#code](http://fortawesome.github.com/Font-Awesome/#code)

1. You can use PHP by calling the appropiate shortcode functions and passing the shortcode attributes.

**Example:**

`<?php echo do_shortcode('[icon name="icon-wordpress"]'); ?>`

== Frequently Asked Questions ==

= How is the plugin different from Rachel Baker’s Font Awesome Icons? =

Rachel’s plugin contains all the icons from Font Awesome. This plugin contains all of those icons plus the additional icons provided by Font Awesome More (Fontstrap), which includes important icons like PayPal, YouTube, Skype, and WordPress, to name a few.

= Does this plugin require a separate Font Awesome installation/plugin and Font Awesome More installation/plugin? =

No, this plugin includes all icon sets from both [Font Awesome](http://fortawesome.github.com/Font-Awesome/) and [Font Awesome More](http://gregoryloucas.github.io/Font-Awesome-More/).

= Is this plugin compatible with Rachel Baker's Font Awesome Icons Plugin? =

No. You must deactivate and/or remove Font Awesome Icons plugin before activating this plugin, which is a superset of Font Awesome Icons.

= Does this plugin require Twitter Bootstrap? =

No. It is completely independent of Twitter Bootstrap.

= Are there any settings for this plugin? =

Nope. No settings page is created. Just activate and start using. No configuration required.

== Screenshots ==

1. HTML code examples
1. Shortcode examples
1. PHP code examples

== Changelog ==

= 3.2.1 =

* Updated Font Awesome to 3.2.1, which includes 58 new icons

= 3.1.1 =

* Updated Font Awesome to 3.1.1, which includes 54 new icons
* Load Font Awesome CSS and font files from Bootstrap CDN (significantly smaller plugin size)

= 3.0.2 =

* Initial release