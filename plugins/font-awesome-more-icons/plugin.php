<?php
/*
Plugin Name: Font Awesome More Icons
Plugin URI: http://blog.webguysaz.com/font-awesome-more-icons-wordpress-plugin/
Description: Use the Font Awesome More (Fontstrap) icon set within WordPress. Icons can be inserted using either HTML, PHP or a shortcode.
Version: 3.2.1
Author: Web Guys
Author URI: http://webguysaz.com
Author Email: jeremy@webguysaz.com
Credits:
    The Font Awesome icon set was created by Dave Gandy (dave@davegandy.com)
     http://fortawesome.github.com/Font-Awesome/
    The Font Awesome More (Fontstrap) icon extension sets created by Greg Loucas (me@gregoryloucas.com)
     http://gregoryloucas.github.io/Font-Awesome-More/
    Original Font Awesome plugin by Rachel Baker (rachel@rachelbaker.me)
     http://rachelbaker.me/font-awesome-icons-wordpress-plugins/
*/

class FontAwesomeMore {
    public function __construct() {
        add_action( 'init', array( &$this, 'init' ) );
    }

    public function init() {
        add_action( 'wp_enqueue_scripts', array( $this, 'register_plugin_styles' ) );
        add_shortcode( 'icon', array( $this, 'setup_shortcode' ) );
        add_filter( 'widget_text', 'do_shortcode' );
    }

    public function register_plugin_styles() {
        global $wp_styles;
        wp_enqueue_style( 'font-awesome-styles', 'http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css' );
        wp_enqueue_style( 'font-awesome-corp-styles', plugins_url( 'assets/css/font-awesome-corp.css', __FILE__  ) );
        wp_enqueue_style( 'font-awesome-ext-styles', plugins_url( 'assets/css/font-awesome-ext.css', __FILE__  ) );
        wp_enqueue_style( 'font-awesome-social-styles', plugins_url( 'assets/css/font-awesome-social.css', __FILE__  ) );
        wp_enqueue_style( 'font-awesome-more-ie7', plugins_url( 'assets/css/font-awesome-more-ie7.min.css', __FILE__ ), array(), '1.0', 'all'  );
        $wp_styles->add_data( 'font-awesome-more-ie7', 'conditional', 'lte IE 7' );
    }

    public function setup_shortcode( $params ) {
        extract( shortcode_atts( array(
                    'name'  => 'icon-wrench'
                ), $params ) );
        $icon = '<i class="'.$name.'">&nbsp;</i>';

        return $icon;
    }

}

new FontAwesomeMore();
