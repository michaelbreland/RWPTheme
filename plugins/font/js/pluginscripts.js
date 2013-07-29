// JavaScript Document
jQuery('document').ready(function () {
    /*
    show font plugin browser BUTTON
    */
    'use strict';
    jQuery('#FFW_chooseFontButton, #content_FFWButton, #wp-admin-bar-font_settings a').bind('click', function () {
        //if initialized already just toggle
        if (jQuery('#fontplugin')[0]) {
            jQuery('#fontplugin').data('fontPlugin').$presets.fadeToggle(500);
        } else {
            //open jquery plugin
            var fontPluginWrapper = jQuery('<div id="fontplugin" class="draggableModal"></div>'),
                settings;
            fontPluginWrapper.appendTo('body');
            settings = {
                "settingFields": [
                    {
                        "type": "text",
                        "label": "Selector",
                        "name": "selector",
                        "settingType": "general",
                        "settingName": "selector",
                        "extendWith": "selectorPicker"
                    },
                    {
                        "type": "text",
                        "label": "Font size",
                        "name": "font-size",
                        "settingType": "css",
                        "settingName": "fontSize",
                        "extendWith": "slider",
                        "unit": "px"
                    },
                    {
                        "type": "text",
                        "label": "Color",
                        "name": "color",
                        "settingType": "css",
                        "settingName": "color",
                        "extendWith": "colorPicker"
                    }],
                'settingFieldsExt': [
                    {
                        'type': 'text',
                        'label': 'Opacity',
                        'name': 'opacity',
                        'settingType': 'css',
                        'settingName': 'opacity',
                        "extendWith": "slider",
                        'slider': {
                            'min': 0,
                            'max': 1,
                            'step': 0.1
                        }
                    },
                    {
                        'type': 'text',
                        'label': 'Text shadow',
                        'name': 'text-shadow',
                        'settingType': 'css',
                        'settingName': 'text-shadow'
                    },
                    {
                        'type': 'text',
                        'label': 'Background',
                        'name': 'background-color',
                        'settingType': 'css',
                        'extendWith': 'colorPicker',
                        'settingName': 'background-color'
                    },
                    {
                        'type': 'text',
                        'label': 'Rounded',
                        'name': 'border-radius',
                        'settingType': 'css',
                        'settingName': 'border-radius',
                        'extendWith': 'slider',
                        'unit': 'px'
                    },
                    {
                        'type': 'text',
                        'label': 'Padding',
                        'name': 'padding',
                        'settingType': 'css',
                        'settingName': 'padding',
                        'extendWith': 'slider',
                        'unit': 'px'
                    },
                    {
                        'type': 'text',
                        'label': 'Margin',
                        'name': 'margin',
                        'settingType': 'css',
                        'settingName': 'margin',
                        'extendWith': 'slider',
                        'unit': 'px'
                    },
                    {
                        'type': 'text',
                        'label': 'Line height',
                        'name': 'line-height',
                        'settingType': 'css',
                        'settingName': 'line-height',
                        'extendWith': 'slider',
                        'unit': 'px'
                    },
                    {
                        'type': 'text',
                        'label': 'Position',
                        'name': 'position',
                        'settingType': 'css',
                        'settingName': 'position'
                    },
                    {
                        'type': 'text',
                        'label': 'Left',
                        'name': 'left',
                        'settingType': 'css',
                        'settingName': 'left',
                        'extendWith': 'slider',
                        'unit': 'px'
                    },
                    {
                        'type': 'text',
                        'label': 'Top',
                        'name': 'top',
                        'settingType': 'css',
                        'settingName': 'top',
                        'extendWith': 'slider',
                        'unit': 'px'
                    }
                ]
            };
            fontPluginWrapper.fontPlugin(settings);
        }
        return false;
    });
    //make image colorpickable
    /*function makeImagesColorpickable() {
        var image = jQuery("#header1preview").contents().find('img');
        jQuery("#header1preview").contents().find('a').click(function () {
            return false;
        });
        image.click(function (e) {
            var img = new Image(),
                canvas,
                context,
                posX,
                posY,
                x,
                y,
                data,
                color;
            img.src = jQuery(this).attr('src');
            canvas = jQuery('<canvas id="canvas" style="display:none"></canvas>');
            canvas[0].setAttribute('width', jQuery(this).width());
            canvas[0].setAttribute('height', jQuery(this).height());
            jQuery('body').append(canvas);
            context = document.getElementById('canvas').getContext('2d');
            context.drawImage(img, 0, 0);
            posX = jQuery(this).offset().left;
            posY = jQuery(this).offset().top;
            x = Math.round(e.pageX - posX);
            y = Math.round(e.pageY - posY);
            data = context.getImageData(x, y, 1, 1).data;
            color = dec2html(data[0]) + dec2html(data[1]) + dec2html(data[2]);
            ffwSetFontColor('#' + color);
            return false;
        });
        //calculating functions
        function dec2html(d) {
            // Converts from decimal color value (0-255) to HTML-style (00-FF)
            var hch = "0123456789ABCDEF",
                a = d % 16,
                b = (d - a) / 16;
            return hch.charAt(b) + hch.charAt(a);
        }
    }*/
    // Escape regex chars with \
    RegExp.escapeX = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    // The style function
    jQuery.fn.style = function (styleName, value, priority) {
		//console.log(styleName + ' - ' + value + ' - ' + priority);
        var node,
            style;
        // For those who need them (< IE 9), add support for CSS functions
        if (!CSSStyleDeclaration.prototype.getPropertyValue || !CSSStyleDeclaration.prototype.setProperty) {
            CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
                return this.getAttribute(a);
            };
            CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
                var rule;
                priority = typeof priority !== undefined ? priority : '';
                this.setAttribute(styleName, value);
                if (priority !== '') {
                    // Add priority manually
                    rule = new RegExp(RegExp.escapeX(styleName) + '\\s*:\\s*' + RegExp.escapeX(value) + '(\\s*;)?', 'gmi');
                    this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
                }
            };
            CSSStyleDeclaration.prototype.removeProperty = function (a) {
                return this.removeAttribute(a);
            };
            CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
                var rule = new RegExp(RegExp.escapeX(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
                return rule.test(this.cssText) ? 'important' : '';
            };
        }
        function camelToDash(str) {
            return str.replace(/\W+/g, '-')
                .replace(/([a-z\d])([A-Z])/g, '$1-$2');
        }
        styleName = camelToDash(styleName);
        // DOM node
        node = this.get(0);
        // Ensure we have a DOM node
        if (typeof node === 'undefined') {
            return;
        }
        // CSSStyleDeclaration
        style = this.get(0).style;
        // Getter/Setter
        if (styleName !== undefined) {
            if (value !== undefined) {
                // Set style property
                priority = priority !== undefined ? priority : '';
                //console.log(styleName + ', ' + value + ', ' + priority)
                style.setProperty(styleName, value, priority);
            } else {
                // Get style property
                return style.getPropertyValue(styleName);
            }
        } else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
	if(!jQuery.fn.on) {
		// The style function
		jQuery.fn.on = function (events, selorcallback, callback) {
			if(callback !== undefined) {
				return jQuery(selorcallback).live(events, callback);
				//return jQuery(document).delegate(events, selorcallback, callback);
			} else {
				return this.bind(events, selorcallback);
			}
		}
	}
	if(!jQuery.fn.off) {
		// The style function
		jQuery.fn.off = function (events) {
			this.die();
			return this.unbind();
		}
	}
});