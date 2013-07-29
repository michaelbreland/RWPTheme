//font control panel plugin
(function ($) {
    'use strict';
    /*global document */
    /*global setTimeout */
    /*global setInterval */
    /*global clearTimeout */
    /*global window */
    /*global alert */
    /*global prompt */
    /*global confirm */
    /*global navigator */
    /*global jQuery */
    /*global console */
    /*global $ */
    /*global ajaxproxy */
    /*global location */
    /*global tinyMCE */
    /*global fontBlogUrl */
    /*global fontBlogName */
    /*global clearInterval */
    $.fontPlugin = function (el, options) {
        var self = this;
        self.$el = $(el);
        self.el = el;
        self.baseSelector = '#' + self.$el.attr('id');
        self.$el.data('fontPlugin', self);
		//modal windows array
		self.modals = [];
        self.options = options;
        self.options = $.extend({}, $.fontPlugin.defaultOptions, self.options);
		self.version = fontPluginVersion;
		self.settingFields = [];
        /*
			Initialize
		*/
        self.init = function () {
			self.detectMode();
            self.createContainers();
			self.loadSettings();
			if(!$.fn.on) {
				alert('WARNING: You are using an old Wordpress version. It is not guaranteed that the plugin will work. The oldest tested Wordpress version is 3.1 but at least 3.3.1 is recommended.');
			}
        };
		//execute cross domain request, JSON response
		self.xhrPost = function (params, callback) {
			var data = params;
			if(params.format === undefined) {
				params.format = 'json';
			}
			data.action = 'cross_domain_request';
			$.post(ajaxproxy, data, function (response) {
				if(typeof callback === 'function') {
					callback(response);
				}
			}, params.format);
		};
        //ajax load settings
        self.loadSettings = function () {
            var data = {
                action: 'get_font_settings'
            };
            $.post(ajaxproxy, data, function (response) {
                //console.log(self.options);
                if (response) {
                    self.options = $.extend({}, $.parseJSON(response), self.options);
                }
                //console.log(self.options);
                self.hideLoading();
                
                self.createPresetsPanel();
				self.createAppearancePanel();
                self.loadPreset(0);
                self.bindShowCategoriesAction();
                self.bindShowFontsAction();
                self.bindLinkOverlay();
                self.setFontOnclick();
                self.initUploadForm();
                self.customizePanelToContent();
                //check if api key is available
                //if(self.options.apikey)
                self.checkForApikey();
            });
        };
        self.bindLinkOverlay = function () {
            $('body').on('click', 'a.font_url, a.overlay_url, button.overlay_url', function () {
                var modal,
                    frameSrc,
                    iframe,
                    overlay,
					href = $(this).attr('href');
                if ($(this).attr('data-upgrade') === 'true') {
                    self.setupApikeyCheckingInterval();
                }
                //create overlay
                overlay = $('<div id="memberOverlay"></div>');
                overlay.appendTo(document.body);
                overlay.css({
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    'background-color': '#333',
                    filter: 'alpha(opacity=50)',
                    '-moz-opacity': 0.5,
                    '-khtml-opacity': 0.5,
                    opacity: 0.5,
                    'z-index': 20000
                });
                modal = $('<div class="draggableModal ui-draggable"><h1 class="draggableModalBar">' + href + ' <a class="closeModal" href="#">X</a></h1></div>');
                modal.css({
                    position: 'fixed',
                    left: '-475px',
                    marginLeft: '50%',
                    width: '950px',
                    top: '40px',
                    zIndex: 20001
                });
                modal.find('.closeModal').bind('mousedown', function () {
                    modal.remove();
                    overlay.remove();
                    return;
                });
                frameSrc = href;
                iframe = $('<iframe style="width:98%; height:490px; border:none; margin: 10px 1%" frameBorder="0" src="' + frameSrc + '"></iframe>');
                iframe.appendTo(modal);
                modal.appendTo($('body')).hide().fadeIn('slow');
                overlay.click(function () {
                    modal.remove();
                    $(this).remove();
                });
                return false;
            });
        };
        /*
		* create containsers
		*/
        self.createContainers = function () {
			//find fb-root
			if(!$('#fb-root').length) {
				var fbRoot = $('<div id="fb-root"></div>');
				fbRoot.prependTo($('body'));
				(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  js.src = "//connect.facebook.net/en_PI/all.js#xfbml=1";
				  fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}
			
            //appearance settings panel
            self.$apr = $('<div id="appearancePanel" class="draggableModal"><h1 class="draggableModalBar"></h1></div>');
			self.$like = $('<div class="fb-like" data-href="http://wordpress.org/extend/plugins/font/" data-send="true" data-width="500" data-show-faces="true"></div>');
			self.$apr.append(self.$like);
			self.$like.css({
				'position': 'absolute',
				'bottom': -41,
				'left': 0,
				'background':'#FFFFFF',
				'border-radius':'5px 5px 5px 5px',
				'box-shadow':'0 0 10px #666666',
				'padding':'5px 5px 3px',
				'height': '26px',
				'overflow': 'hidden'
			});
			//add like not/like
			self.$yesno = $('<div class="yesno">Do you like the plugin?<br><a href="http://fontsforweb.com/purchase/howtosupport?url=' + fontBlogUrl + '&name=' + fontBlogName + '" class="overlay_url yesbutton" data-upgrade="true">Yes!</a> or <a href="http://www.fontsforweb.com/contact/support" class="overlay_url nobutton">No</a></div>');
			self.$apr.append(self.$yesno);
			self.$yesno.css({
				'position': 'absolute',
				'bottom': -41,
				'right': 0,
				'background':'#FFFFFF',
				'border-radius':'5px 5px 5px 5px',
				'box-shadow':'0 0 10px #666666',
				'padding':'2px 5px 2px',
				'height': '30px',
				'width': '120px',
				'font-size': '10px',
				'text-align': 'right',
				'line-height': '1.2em',
				'font-weight': 'bold'
			});
			self.$yesno.find('a').css({
				'font-size': '10px',
				'background': 'none'
			});
			if(self.mode === 'global') {
				self.$apr.find('h1').html('<span id="font_ver"></span>Presets - drag<a class="closeModal" href="#">X</a>');
			} else {
				self.$apr.find('h1').html('Post editing mode - select text in your post and then use controls below<a class="closeModal" href="#">X</a>');
			}
            self.modals['main'] = self.$apr;
			self.modals['fonts'] = self.$el;
			self.showLoading();
        };
		/*
		* Create new modal window
		*/
		self.createNewModal = function (options) {
			var modal = $('<div class="draggableModal"><h1 class="draggableModalBar">' + options.title + '<a class="closeModal" href="#">X</a></h1></div>');
			modal.css({
				left: options.left,
				top: options.top,
				width: options.width,
				position: 'fixed',
				zIndex: 10000
				});
			if(options.nobar) {
				modal.find('h1.draggableModalBar').hide();
			}
			if(!options.show) {
				modal.hide();
			}
			if(options.id) {
				modal.attr('id', options.id);
			}
			self.modals[options.name] = modal;
			//make draggable
			modal.draggable({
                handle: modal.find('.draggableModalBar'),
                start: function () {
					$(this).css('bottom', 'auto');
                }
            });
			modal.find('.closeModal').click(function () {
                modal.fadeOut('slow');
                return;
            });
			modal.appendTo($('body'));
			return modal;
		}
        /*
        * customize panel to content
        */
        self.customizePanelToContent = function () {
            if (self.mode === 'postPage') {
                self.settingFields.presets.hide();
                self.settingFields.selector.hide();
                self.$apr.find('#fontSaveSettings').hide();
            }
        };
        /*
        * show loading
        */
        self.showLoading = function () {
            if (self.$apr.find('.loading').length) {
                self.$apr.find('fieldset').hide();
                self.$el.find('> div').hide();
                self.$apr.find('.loading').show();
                self.$el.find('.loading').show();
            } else {
                self.$apr.append('<div class="loading"></div>');
                self.$el.append('<div class="loading"></div>');
            }
        };
        self.hideLoading = function () {
            self.$apr.find('.loading').hide();
            self.$el.find('.loading').hide();
        };
        /*
        * detect if we're on post editing page or on any other page
        */
        self.detectMode = function () {
            var iframe = $('#content_ifr');
            if (iframe.length) {
                self.mode = 'postPage';
                self.postIframe = iframe.contents();
            //self.tinyMCE = $(self.postIframe).find('#tinymce');
            } else {
                self.mode = 'global';
            }
        };
        //check if api key is present
        self.checkForApikey = function () {
			self.xhrPost({
				url: self.options.FFW_baseUrl + '/api/getkey',
				data: {
					blogurl: fontBlogUrl,
					apikey: self.options.apikey,
					version: self.version
				}
			}, function (data) {
				if (!data || data.success !== 'true') {
					if(console !== undefined) console.log(data.message);
					alert(data.message);
				} else {
					if(data.keytype === 'PAID') {
						//alert('API key verified by FontsForWeb.com. Enjoy extended options');
						self.loadExtendedFields();
					}
					self.options.apikey = data.apikey;
				}
			}).error ( function(xhr, textStatus, errorThrown) {
				alert("An error occurde when trying to get Api key: " + textStatus);
			});
        };
        //setup api key interval
        self.setupApikeyCheckingInterval = function () {
			if(!self.checkForApikeyInterval) {
				self.checkForApikeyInterval = setInterval(function () {
					self.checkForApikey();
				}, 5000);
			}
        };
        //save settings by ajax
        self.saveSettings = function () {
            var savingOptions = {},
                data;
				
			if(self.mode === 'postPage') {
				alert('Click on "Update" or "Publish" to save');
				return;
			}
            self.showLoading();
            savingOptions.settingFields = self.options.settingFields;
            savingOptions.presets = self.options.presets;
            savingOptions.apikey = self.options.apikey;
            data = {
                action: 'set_font_settings',
                fontPluginSettings: JSON.stringify(savingOptions)
            };
            $.post(ajaxproxy, data, function (response) {
				if(response.success !== 'true') {
					alert('Error: ' + response.message);
					return;
				} else {
					location.reload(true);
				}
            }, 'json').error ( function(xhr, textStatus, errorThrown) {
				alert("Unknown error: \n" + xhr.responseText);
			});
        };
        /*
			Create HTML markup
		*/
        self.createFontPanel = function () {
            var i;
            //create html withing font browser
			self.$el.show();
			self.$el.append($('<h1 class="draggableModalBar">Fonts browser<a class="closeModal" href="#">X</a></h1>'));
            self.$el.append('<div class="tablinks"><a class="tablink" href="fontslist">Fontsforweb.com</a><a class="tablink" href="uploaded">Upload</a></div>');
            self.$el.append('<div class="tab" id="fontslist"></div>');
            self.$el.append('<div class="tab" id="uploaded"><div class="loading"></div></div>');
            self.$el.find('.tab').hide();
            self.$el.find('.tab').eq(0).show();
            self.$el.find('.tablink').on('click', function (e) {
                var target,
                    tab;
                e.preventDefault();
                self.$el.find('.tab').hide();
                target = $(this).attr('href');
                tab = self.$el.find('#' + target).show();
                if (target === 'uploaded') {
					self.loadPrivateFonts();
                }
                return false;
            });
            self.$el.css('right', '0')
                .draggable({
					handle: self.$el.find('.draggableModalBar')
				});
			$('body').on('mousedown', '.draggableModal', function() {
				self.modalToTop(this);
			});
			self.$el.find('a.closeModal').on('click', function () {
                self.$el.fadeOut('slow');
                return false;
            });
        };
		self.createPresetsPanel = function () {
			var i,
                presetName,
                presetId,
                field,
                paramObj,
                saveButton,
                upgrade;
            /*
			PRESETS
			*/
			var modalOptions = {
				id: 'presetsPanel',
				name: 'stdSettings',
				title: 'Presets - selections',
				nobar: true,
				left: '0',
				top: '28px',
				width: '100%',
				show: true
			};
			var modal = self.createNewModal(modalOptions);
			self.$presets = modal;
			//add presets list
            self.settingFields.presets = $('<fieldset id="presetsDropdownFieldset"><label>Presets<select id="presetsDropdown" name="presetsDropdown"></select></label></fieldset>');
			self.$presetsDropdown = self.settingFields.presets.find('select');
            self.$presets.append(self.settingFields.presets);
            self.$presetsDropdown.bind('change', function () {
				self.loadPreset($(this).val());
            });
            //populate presets list
            for (i = 0; i < self.options.presets.length; i += 1) {
                presetName = self.options.presets[i].name;
                presetId = i;
                self.$presetsDropdown.append('<option value="' + presetId + '">' + presetName + '</option>');
            }
			// Delete current preset
            self.settingFields.deletePreset = $('<button id="deletePreset" title="Delete">Del</button>');
            self.settingFields.presets.append(self.settingFields.deletePreset);
            self.settingFields.deletePreset.on('click', function () {
                self.deleteCurrentPreset();
            });
			// Rename current preset
            self.settingFields.renamePreset = $('<button id="renamePreset">Rename</button>');
            self.settingFields.presets.append(self.settingFields.renamePreset);
            self.settingFields.renamePreset.on('click', function () {
                self.renamePreset();
            });
			//add buttons fieldset
			var actions = $('<fieldset id="actionsFieldset"></fieldset>');
			var closeMod = $('<a class="closeModal" href="#">X</a>');
			actions.append(closeMod);
			closeMod.click(function(){
				self.$presets.fadeToggle();
			});
			
			//add different fields buttons
			var fontfaceSettings = $('<button id="fontfaceSettings">Font</button>').appendTo(actions);
			//add actions
			fontfaceSettings.on('click', function () {
				if (self.mode === 'global') {				
					var selector = self.currentPreset.selector;
					if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
						alert('First pick an element from the page to customize it.');
						return;
					}
				} else if (self.mode === 'postPage') {
					//VERSION FOR POST PAGE
					//get selection
					var selection = tinyMCE.activeEditor.selection.getContent();
					//only apply if something is selected
					if (!selection) {
						alert('Make a selection in the editor window first.');
						return;
					}
				}
				self.showFontsBrowser();
            });
			var colorsizeSettings = $('<button id="colorsizeSettings" class="toggleModal" data-modal-name="stdSettings">Color and Size</button>').appendTo(actions);
			
			var add3dSettings = $('<button id="add3dSettings">Add 3D</button>').appendTo(actions);
			add3dSettings.click(function(){
				self.addExtrudeHandle();
			});
			var proSettings = $('<a href="http://fontsforweb.com/purchase/pluginupgrade?url=' + fontBlogUrl + '&name=' + fontBlogName + '" class="overlay_url" id="upgradeToProButton" data-upgrade="true">More</a>').appendTo(actions);
			
			var shadowSettings = $('<button id="shadowSettings" class="toggleModal" data-modal-name="text-shadow">Shadow</button>').appendTo(actions);
			var extrafieldsSettings = $('<button id="extrafieldsSettings" class="toggleModal" data-modal-name="extrafields">PRO</button>').appendTo(actions);
	
			shadowSettings.hide();
			extrafieldsSettings.hide();
			
			//add save button
            saveButton = $('<button id="fontSaveSettings">Save settings</button>').appendTo(actions);
            saveButton.click(function () {
                self.saveSettings();
            });
			actions.insertAfter($('#presetsDropdownFieldset'));
		};
        self.createAppearancePanel = function () {
            var i,
                presetName,
                presetId,
                field,
                paramObj,
                saveButton,
                upgrade;
			/*
			SELECTORS
			*/
            //get standard fields in a new window
			var modalOptions = {
				name: 'stdSettings',
				title: 'Size and color settings',
				left: '0',
				top: '30px',
				width: '500px'
			};
			var modal = self.createNewModal(modalOptions);
			//create a fieldset
			self.$standardFields = $('<div id="appearanceStandardFields"></div>').appendTo(modal);
			//get standard fields in a new window
			var modalOptions = {
				title: 'Extended settings',
				left: '0',
				top: '0'
			};
			modal = self.createNewModal(modalOptions);
            self.$extendedFields = $('<div id="appearanceExtendedFields"></div>').appendTo(modal);
            //get extended fields not ready
            /*var switcher = $('<a href="#" id="showExtendedFields">Load extended fields from FontsForWeb.com</a>').appendTo(self.$apr);
            self.$extendedFields.hide();
            switcher.on('click', function () { self.$extendedFields.slideToggle(); self.loadExtendedFields(); return false; });*/
            /*
            Add all setting fields
            */
            for (i = 0; i < self.options.settingFields.length; i += 1) {
                field = self.options.settingFields[i];
                paramObj = {};
                paramObj.field = field;
                paramObj.type = 'lite';
                self.addSettingsField(paramObj);
            }
			//add window opening buttons
			var settingWindows = $('<fieldset id="settingsButtons"></fieldset>');
            
			//bind toggle modal
			$('body').on('click', '.toggleModal', function() {
				if (self.mode === 'global') {				
					var selector = self.currentPreset.selector;
					if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
						alert('First pick an element from the page to customize it.');
						return;
					}
				} else if (self.mode === 'postPage') {
					//VERSION FOR POST PAGE
					//get selection
					var selection = tinyMCE.activeEditor.selection.getContent();
					//only apply if something is selected
					if (!selection) {
						alert('Make a selection in the editor window first.');
						return;
					}
				}
				var modalName = $(this).attr('data-modal-name');
				self.toggleModal(modalName);
			});
			
            $('body').on('mousedown click', '.getApiKey', function () {
                $(this).attr('href', 'http://fontsforweb.com/purchase?url=' + fontBlogUrl);
                $(this).attr('target', '_blank');
            });
            //add keyup to change field
			self.getField('selector').bind('keyup', function(){
				$(this).trigger('change');
				self.hoverSelector = self.currentPreset.selector;
				self.hoverHighlightCurrent();
			});
        };
		//show fonts browser
		self.showFontsBrowser = function () {
			if(!this.fontInitialized) {
				self.createFontPanel();
				self.loadFontCategories();
				this.fontInitialized = true;
			} else {
				self.$el.fadeToggle();
			}
		};
		
		self.toggleModal = function (modalName) {
			self.modals[modalName].fadeToggle();
			self.modalToTop(self.modals[modalName]);
		};
		self.modalToTop = function (selectedModal) {
			var highestZindex = 10000;
			for(var index in self.modals) {
				var modal = self.modals[index],
					modalZindex = modal.css('z-index');
				if(modalZindex > highestZindex) {
					highestZindex = modalZindex;
				}
			}
			$(selectedModal).css({zIndex: parseInt(highestZindex, 10) + 1});
		};
        self.loadExtendedFields = function () {
            var i,
                field,
                paramObj,
                data;
			
			self.xhrPost({
				url: self.options.FFW_baseUrl + '/api/getextrafields2',
				data: {
						apikey: self.options.apikey,
						blogurl: fontBlogUrl
					}
			},
			function (data) {
                self.$extendedFields.html('');
                for (i = 0; i < data.length; i += 1) {
                    field = data[i];
                    paramObj = {};
                    paramObj.field = field;
                    paramObj.type = 'premium';
                    self.addSettingsField(paramObj);
					//add premium buttons
					
                    $('#upgradeToProButton').remove();
					$('#shadowSettings').show();
					$('#extrafieldsSettings').show();
                    clearInterval(self.checkForApikeyInterval);
                }
				self.reloadPreset();
				//reposition
				//var offset = self.$apr.offset().top - self.$apr.height() / 2 + 30;
				//self.$apr.css('bottom', 'auto');
				//self.$apr.css('top', offset);
            });
			//get extra fields
			self.xhrPost({
				url: self.options.FFW_baseUrl + '/api/getextrafields',
				data: {
						apikey: self.options.apikey,
						blogurl: fontBlogUrl
					}
			},
			function (data) {
				//create a new modal for it
				var modalOptions = {
					name: 'extrafields',
					title: 'Pro options',
					left: '0',
					top: '200px',
					width: '270px'
					};
				var modal = self.createNewModal(modalOptions);
                for (i = 0; i < data.length; i += 1) {
                    field = data[i];
                    paramObj = {};
                    paramObj.field = field;
                    paramObj.type = 'extrafields';
                    self.addSettingsField(paramObj);
                }
				self.reloadPreset();
            });
        };
        //add setting field
        self.addSettingsField = function (paramObj) {
            var field = paramObj.field,
                thisField,
                thisInput,
                replacementField,
                selectorPicker,
                selectorPicker2,
				i,
				manipulator,
				fieldset,
				subfield;
			//add support for multi value field
			if(field.settingType == 'cssmultival') {
				//create a new modal for it
				var modalOptions = {
					name: field.name,
					title: field.label,
					left: '0',
					top: '50px',
					width: '270px'
					};
				var modal = self.createNewModal(modalOptions);
				
				//create a fieldset
				fieldset = self.settingFields[field.name] = $('<fieldset id="' + field.name + 'Fieldset"></fieldset>');
				//add fieldset to extended fields
				modal.append(fieldset);
				//add all controls
				for(i = 0; i < field.values.length; i += 1) {
					subfield = field.values[i];
					//create a field with label around
					manipulator = $('<label>' + subfield.label + '<a class="resetField">reset</a><input type="' + subfield.type + '" name="' + subfield.name + '" title="' + subfield.settingName + '" id="' + subfield.name + 'Field"></label>');
					manipulator.appendTo(fieldset);
					thisInput = manipulator.find('input');
					thisInput.data('fieldInfo', subfield);
					//append field to extended list
					fieldset.append(thisField);
					//extend field with whatever
					thisInput = self.extendField(thisInput, subfield.extendWith);
				}
				//bind action to the inputs
				var inputs = fieldset.find('input');
				//bind change to color picker
				inputs.bind('change click keyup', function () {
					//console.log($(this).data('fieldInfo').settingName + ', ' + $(this).val() + ', ' + ($(this).data('fieldInfo').unit || ''))
					//get values of all siblings and create one value for the element
					var completeValue = '';
					inputs.each(function () {
						var fieldInfo = $(this).data('fieldInfo'),
							unit = '';
						if(fieldInfo.unit) {
							unit = fieldInfo.unit;
						}
						//get field info
						completeValue += ' ' + $(this).val() + unit;
						if($(this).val() == '') {
							$(this).val(fieldInfo.default);
						}
					});
					//console.log(field.settingName + ': ' + completeValue);
					self.updateCssSettings(field.settingName, completeValue);
					self.updateSelectedElement(field.settingName, completeValue);
					return false;
				});
				//reset field button action
				fieldset.find('a.resetField').click(function(){
					thisInput.val('');
					thisInput.trigger('change');
					alert('When resetting settings or deleting preset you have to save to see the change');
				});
			} else if(field.settingType == 'group') {
				
			}else {
				self.settingFields[field.name] = $('<fieldset id="' + field.name + 'Fieldset"><label>' + field.label + '<a class="resetField">reset</a><input type="' + field.type + '" name="' + field.name + '" title="' + field.settingName + '" id="' + field.name + 'Field"></label></fieldset>');
				thisField = self.settingFields[field.name];
				
				thisInput = self.getField(field.name);
				thisInput.data('fieldInfo', field);
				if (paramObj.type === 'premium') {
					self.$extendedFields.append(thisField);
				} else if (paramObj.type === 'extrafields') {
					self.modals['extrafields'].append(thisField);
				} else {
					if(field.name == 'selector') {
						thisField.insertAfter('#presetsDropdownFieldset');
					} else {
						self.$standardFields.append(thisField);
					}
				}
				//reset field button action
				thisField.find('a.resetField').click(function(){
					thisInput.val(0);
					thisInput.trigger('change');
					thisInput.val('none');
					thisInput.trigger('change');
					thisInput.val('inherit');
					thisInput.trigger('change');
					thisInput.val('');
					thisInput.trigger('change');
				});
				thisInput = self.extendField(thisInput, field.extendWith);
				
				//general actions - apply settings
				if (field.settingType === 'css') {
					//bind change to color picker
					thisInput.bind('change click keyup', function () {
						//console.log($(this).data('fieldInfo').settingName + ', ' + $(this).val() + ', ' + ($(this).data('fieldInfo').unit || ''))
						self.updateCssSettings($(this).data('fieldInfo').settingName, $(this).val());
						self.updateSelectedElement($(this).data('fieldInfo').settingName, $(this).val() + ($(this).data('fieldInfo').unit || ''));
						return false;
					});
				} else if (field.settingType === 'csstransform') {
					//bind change to color picker
					thisInput.bind('change click keyup', function () {
						//console.log($(this).data('fieldInfo').settingName + ', ' + $(this).val() + ', ' + ($(this).data('fieldInfo').unit || ''))
						self.updateCssSettings($(this).data('fieldInfo').settingName, $(this).val());
						self.updateSelectedElement($(this).data('fieldInfo').settingName, $(this).val() + ($(this).data('fieldInfo').unit || ''));
						return false;
					});
				} else if (field.settingType === 'general') {
					//bind change to color picker
					thisInput.bind('change click', function () {
						self.updateSettings($(this).data('fieldInfo').settingName, $(this).val());
						self.updateSelectedElement($(this).data('fieldInfo').settingName, $(this).val());
						return false;
					});
				}
			}
        };
		self.extendField = function (field, extendWith) {
			if (extendWith === 'slider') {
				var input = (function () {
					var min = 1,
						max = 100,
						step = 1,
						value = 40,
						orientation = 'horizontal',
						reverse = false,
						$slider = $('<div>'),
						input = field,
						fieldset = input.parents('fieldset');
					fieldset.addClass('slider-extended');
					fieldset.append($slider);
					if (input.data('fieldInfo').slider) {
						min = parseFloat(input.data('fieldInfo').slider.min);
						max = parseFloat(input.data('fieldInfo').slider.max);
						step = parseFloat(input.data('fieldInfo').slider.step);
						if(input.data('fieldInfo').slider.orientation) {
							orientation = input.data('fieldInfo').slider.orientation;
						}
						if(input.data('fieldInfo').slider.value) {
							value = input.data('fieldInfo').slider.value;
						}
						if(input.data('fieldInfo').slider.reverse) {
							reverse = true;
						}
					}
					//init slider
					$slider.slider({
						range: "min",
						value: value,
						min: min,
						max: max,
						step: step,
						orientation: orientation,
						slide: function (event, ui) {
							if(!reverse) {
								input.val(ui.value);
							} else {
								//reversed values
								input.val(max + min - ui.value);
							}
							input.trigger('change');
						}
					});
					//bind value change to the size slider
					input.bind('change click', function () {
						var val = $(this).val();
						if(val) {
							$slider.slider('value', parseFloat(val));
						}
						return false;
					});
					return input;
				}());
			} else if (extendWith === 'colorPicker') {
				var input = (function () {
					var input = field;
					input.change(function () {
						$(this).css('backgroundColor', $(this).val());
					});
					//init color picker
					input.ColorPicker({
						color: '#0000ff',
						onShow: function (colpkr) {
							$(colpkr).fadeIn(500);
							return false;
						},
						onHide: function (colpkr) {
							$(colpkr).fadeOut(500);
							return false;
						},
						onChange: function (hsb, hex, rgb) {
							input.val('#' + hex);
							input.trigger('change');
							input.trigger('change').css('backgroundColor', '#' + hex);
						},
						onBeforeShow : function () {
							$(this).ColorPickerSetColor(this.value);
						}
					}).bind('keyup', function () {
						$(this).ColorPickerSetColor(this.value);
					});
					return input;
				}());
			} else if (extendWith === 'selectorPicker') {
				var input = (function (field) {
					var replacementField,
						thisInput,
						selectorPicker,
						selectorPicker2,
						input = field,
						field = field.data('fieldInfo'),
						fieldset = input.parents('fieldset');
						
					self.settingFields[field.name] = $('<fieldset id="selectorFieldset"><label><input type="' + field.type + '" name="' + field.name + '" title="' + field.settingName + '">CSS selecor editor (advanced)</label></fieldset>');
					replacementField = self.settingFields[field.name];
					thisInput = self.getField(field.name);
					selectorPicker = $('<button class="pickElement">Pick element</button>');
					selectorPicker2 = $('<button class="pickElement pickAddElement">Pick element(add)</button>');
					replacementField.prepend(selectorPicker2);
					replacementField.prepend(selectorPicker);
					
					selectorPicker.on('click', function () {
						self.bindGetSelector();
						return false;
					});
					selectorPicker2.on('click', function () {
						self.bindGetSelector(true);
						return false;
					});
					//replace default field
					fieldset.replaceWith(replacementField);
					replacementField.find('label').hide();
					thisInput.data('fieldInfo', field);
					//return replaced input
					return thisInput;
				}(field));
			}
			return input;
		};
        //update internal settings
        self.updateSettings = function (settingName, value) {
            if (self.mode !== 'global') {
                return;
            }
            self.options.presets[self.currentPresetNo][settingName] = value;
        };
        //update internal settings
        self.updateCssSettings = function (settingName, value) {
            if (self.mode !== 'global') {
                return;
            }
            self.options.presets[self.currentPresetNo].styles[settingName] = value;
        };
        /*
			update selected
			global - update element from selector
			postPage - update selected text
		*/
        self.updateSelectedElement = function (settingName, value) {
            var selection,
                selector,
				selectorValid,
                element,
                node,
                justInsertedClass,
                newSpan,
                newHTML,
                inserted;
			if(!value || value == 'px') return;
			
            if (self.mode === 'global') {
                //VERSION FOR GENERAL SETTINGS PAGE
                selector = self.currentPreset.selector;
				//exit when default selector
				if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
					return;
				}
                //get the element from iframe or current page
                if ($("#header1preview").length) {
                    element = $("#header1preview").contents().find(selector);
                } else {
                    element = $(selector);
                }
                element.each(function () {
                    //CSS exceptions and general action
                    switch (settingName) {
                    case 'rotate':
                        $(this).style('-webkit-transform', 'rotate(' + value + 'deg)', 'important');
                        $(this).style('-moz-transform', 'rotate(' + value + 'deg)', 'important');
                        $(this).style('-o-transform', 'rotate(' + value + 'deg)', 'important');
                        $(this).style('-ms-transform', 'rotate(' + value + 'deg)', 'important');
                        $(this).style('transform', 'rotate(' + value + 'deg)', 'important');
                        break;
                    //general action
                    default:
                        $(this).style(settingName, value, 'important');
                    }
                });
            } else if (self.mode === 'postPage') {
                //VERSION FOR POST PAGE
                //get selection
                selection = tinyMCE.activeEditor.selection.getContent();
                //only apply if something is selected
                if (!selection) {
                    return;
                }
				//selectorValid - validate selector created from selected text. 
				//required because for example "." with nothing following breaks function execution
				selectorValid = true;
				try {
					$(selection);
				} catch (e) {
					selectorValid = false;
				}
                //get node
                node = tinyMCE.activeEditor.selection.getNode();
                if (selectorValid && ($.trim($(node).html()) === $.trim(selection) || $.trim($(node).html()) === $.trim($(selection).html()))) {
                    //console.log('already isolated');
                    tinyMCE.activeEditor.dom.setStyle(node, settingName, value);
                } else {
                    //console.log('isolating: ' + $(node).html() + ' - ' + selection);
                    justInsertedClass = 'inserted' + Math.floor(Math.random() * 10000);
                    newSpan = $('<span id="' + justInsertedClass + '">' + selection + '</span>');
                    newSpan.css(settingName, value);
                    //get span html together with span itself
                    newHTML = $('<div>').append(newSpan.clone()).html();
                    inserted = tinyMCE.activeEditor.selection.setContent(newHTML);
                    tinyMCE.activeEditor.selection.select(tinyMCE.activeEditor.dom.select('span#' + justInsertedClass)[0]);
                }
            }
        };
		//reload current preset
		self.reloadPreset = function () {
			self.loadPreset(self.currentPresetNo);
		};
        //load preset(
        self.loadPreset = function (presetNo) {
			var preset = self.options.presets[parseInt(presetNo,10)],
                property,
                found;
            if (!preset) {
                return;
            }
            self.currentPresetNo = presetNo;
            self.currentPreset = preset;
            //select preset from dropdown
            self.$presetsDropdown.val(presetNo);
            /*
            populate general fields
            */
            for (property in preset) {
                found = $('body').find('input[title=' + property + ']');
                if (found.length) {
                    found.val(preset[property]);
                    found.trigger('change');
                }
            }
            /*
            populate css fields
            */
            for (property in preset.styles) {
                found = $('body').find('input[title=' + property + ']');
                if (found.length) {
                    found.val(preset.styles[property]);
                    found.trigger('change');
                }
            }
            self.scrollToSelection();
			self.highlightCurrent();
        };
		//highlight all elements(with edititng option)
		self.outlineAllPresets = function () {
			//go through all presets
			for(var i = 0; i < self.options.presets.length; i++) {
				if(parseInt(i, 10) === parseInt(self.currentPresetNo, 10)) continue;
				var preset = self.options.presets[i];
				var selector = preset.selector;
				//exit when default selector
				if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
					continue;
				}
				var litme = $(selector);
				//hide 3d light
				
				litme.find('.extrudeHandleHolder').hide();
				litme.css('outline', '2px dashed rgba(150,150,250,0.3)');
				litme.css("cursor", 'pointer', 'important');
				if(litme.data('wired')) continue;
				litme.data('wired', true);
				(function() {
					var ind = i;
					litme.data('presetNo', ind);
					litme.click(function(e){
						if(parseInt($(this).data('presetNo'), 10) !== parseInt(self.currentPresetNo, 10)) {
							e.preventDefault();
							self.loadPreset(ind);
						}
					});
					litme.hover(
						function () {
							if(parseInt($(this).data('presetNo'), 10) !== parseInt(self.currentPresetNo, 10)) {
								$(this).css('outline', '2px dashed rgba(150,150,250,0.9)');
							}
						},
						function () {
							if(parseInt($(this).data('presetNo'), 10) !== parseInt(self.currentPresetNo, 10)) {
								$(this).css('outline', '2px dashed rgba(150,150,250,0.3)');
							}
						}
					);
				}());
			}
        };
        //highlight elements
        self.highlightCurrent = function () {
			var selector = self.currentPreset.selector;
			self.outlineAllPresets();
			//exit when default selector
			if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
				return;
			}
            self.hightlighted = $(selector);
            self.hightlighted.css('outline', '3px dashed rgba(250,50,30,0.7)');
			self.hightlighted.style("cursor", 'move', 'important');
			self.makeCurrentDraggable();
        };
		//make current draggable
		self.makeCurrentDraggable = function () {
			self.hightlighted.draggable({
				drag: function(event, ui) {
					var top = ui.position.top,
						left = ui.position.left,
						$el = self.hightlighted;
					$el.each(function(){
						//set position to relative
						$(this).style("position", 'relative', 'important');
						//hide before styles are applied
						$(this).style("visibility", 'hidden', 'important');
						//set slider y to dragged value (parseInt(top,10) + parseInt($(window).scrollTop(),10))
						//for firefox only
						if($.browser.mozilla) {
							self.updateCssSettings('top', (parseInt(top,10) + parseInt($(window).scrollTop(),10)) + 'px');
						} else {
							self.updateCssSettings('top', top + 'px');
						}
						
						//set slider x to dragged value
						self.updateCssSettings('left', left + 'px');
						//set position to relative
						self.updateCssSettings('position', 'relative');
					});
					//waiting to set top and left to "!important" after jquery ui draggable
					setTimeout(function(){
						$el.each(function(){
							$(this).style("visibility", 'visible', 'important');
							//set slider y to dragged value
							//for firefox only
							if($.browser.mozilla) {
								$(this).style("top", (parseInt(top,10) + parseInt($(window).scrollTop(),10)) + 'px', 'important');
							} else {
								$(this).style("top", top + 'px', 'important');
							}
							//set slider x to dragged value
							$(this).style("left", left + 'px', 'important');
						});
					}, 50);
				}
			});
		};
		/*
		add 3d light sourde
		*/
		self.addExtrudeHandle = function () {
			var handleHolder = self.hightlighted.find('.extrudeHandleHolder'),
				handle = self.hightlighted.find('.extrudeHandle');
			if(!handleHolder[0]) {
				handleHolder = $('<div class="extrudeHandleHolder"></div>'),
				handle = $('<div class="extrudeHandle">3D&nbsp;light<br>DRAG&nbsp;ME</div>');
				handleHolder.append(handle);
				self.hightlighted.append(handleHolder);
				handleHolder = self.hightlighted.find('.extrudeHandleHolder');
				handle = self.hightlighted.find('.extrudeHandle');
			}
			//make handle draggable
			handle.each(function(){
				$(this).parent().show();
				$(this).draggable({
					drag: function(event, ui) {
						var top = ui.position.top,
							left = ui.position.left,
							$el = self.hightlighted,
							rad = 0,
							y = -top,
							x = left,
							rad = Math.atan2(x, y),
							deg = rad * (180 / Math.PI),
							distance = 0;
						//get angle
						if(deg < 0) {
							deg = 360 + deg;
						}
						deg = Math.round(deg);
						distance = Math.sqrt ( x * x + y * y );
						self.extrude3d(self.hightlighted, 180 - deg * -1, distance);
						self.addShadow(self.hightlighted, 180 - deg * -1, distance);
					}
				});
			})
		};
		//extrude 3d
		self.extrude3d = function (subject, angle, distance) {
			var depth = distance / 10,
			subjectColor = subject.css('color'),
			subjectColorRgb = self.parseRgb(subjectColor),
			//initially take 20% off
			rColor = subjectColorRgb.r / 100 * 80,
			gColor = subjectColorRgb.g / 100 * 80,
			bColor = subjectColorRgb.b / 100 * 80,
			i = 0,
			speed = i,
			xDist = 0,
			yDist = 0,
			color = '';
			//console.log(subjectColor);
			//console.dir(subjectColorRgb);
			if(angle === undefined) {
				angle = 290;
			}
			self.textExtrudeValue = '';
			//generate text shadow value
			//loop to depth
			for(i = 0; i < depth; i++) {
				//calculate x and y of next shadow
				speed = 1.2;
				xDist += speed * Math.sin(angle * Math.PI / 180);
				yDist += speed * -Math.cos(angle * Math.PI / 180);
				xDist = xDist;
				yDist = yDist;
				//percentage darkened
				var percentageDone = i / depth;
				//darkening strength - the bigger depth the lower sstrength
				var light = 10 - percentageDone * 10;
				//darken the next shadow a bit take 10%
				rColor = Math.floor(rColor / 100 * 90 + light);
				gColor = Math.floor(gColor / 100 * 90 + light);
				bColor = Math.floor(bColor / 100 * 90 + light);
				color = 'rgb(' + rColor + ', ' + gColor + ', ' + bColor + ')';
				//put together shadow setting
				self.textExtrudeValue += xDist.toFixed(2) + 'px ' + yDist.toFixed(2) + 'px ' + 0.3 + 'px ' + color + ', ';
			}
			self.textExtrudeValue = self.textExtrudeValue.replace(/, +$/,'');
			//apply text shadow
			self.updateTextShadowEffects(subject);
		};
		//extrude 3d
		self.addShadow = function (subject, angle, distance) {
			var depth = distance / 10,
			rColor = 0,
			gColor = 0,
			bColor = 0,
			i = 0,
			speed = i,
			xDist = 0,
			yDist = 0,
			color = '';
			if(angle === undefined) {
				angle = 290;
			}
			self.textShadowValue = '';
			//generate text shadow value
			//loop to depth
			for(i = 0; i < depth; i++) {
				if(i> 3 && i%3) continue;
				//calculate x and y of next shadow
				speed = 6;
				xDist += speed * Math.sin(angle * Math.PI / 180);
				yDist += speed * -Math.cos(angle * Math.PI / 180);
				xDist = xDist;
				yDist = yDist;
				//lighten the next shadow a bit take 10%
				rColor = Math.floor(rColor / 90 * 100);
				gColor = Math.floor(gColor / 90 * 100);
				bColor = Math.floor(bColor / 90 * 100);
				color = 'rgba(' + rColor + ', ' + gColor + ', ' + bColor + ', 0.3)';
				//put together shadow setting
				self.textShadowValue += xDist.toFixed(2) + 'px ' + yDist.toFixed(2) + 'px ' + ((i+1)*2) + 'px ' + color + ', ';
			}
			self.textShadowValue = self.textShadowValue.replace(/, +$/,'');
			//apply text shadow
			self.updateTextShadowEffects(subject);
		};
		//update effects
		self.updateTextShadowEffects = function (subject) {
			var allShadows = '';
			//console.log('xt: ' + self.textExtrudeValue);
			//console.log('sdw: ' + self.textShadowValue);
			
			if(self.textExtrudeValue) {
				allShadows += self.textExtrudeValue;
			}
			if(self.textShadowValue) {
				if(allShadows) allShadows += ', ';
				allShadows += self.textShadowValue;
			}
			//get all different text shadows
			//subject[0].style.textShadow = allShadows + ' !important';
			subject.each(function(){
				$(this).style('textShadow', allShadows, 'important');
			});
			self.updateCssSettings('text-shadow', allShadows);
		}
		//temp highlight
        self.hoverHighlightCurrent = function () {
			var selector = self.hoverSelector;
            if (self.tempHightlighted) {
                self.tempHightlighted.css('outline', 'none');
            }
			//exit when default selector
			if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
				return;
			}
            self.tempHightlighted = $(selector);
            self.tempHightlighted.css('outline', '3px dashed rgba(100,250,100,0.7)');
        };
        self.liteVersion = function () {
        };
        //add new preset
        self.addNewPreset = function () {
            var presetName = prompt('New preset name i.e. paragraph');
            if (!presetName) {
                return;
            }
            self.createPreset(presetName);
        };
		self.createPreset = function (presetName) {
			var property,
                newPreset,
                newPresetId;
			//get first preset as a template
            newPreset = JSON.parse(JSON.stringify(self.options.presets[0]));
            //set preset variables
            newPreset.name = presetName;
            newPreset.selector = 'PICK AN ELEMENT NOW - or type CSS selector(advanced)';
            newPreset.fontid = '';
            newPreset.fontName = '';
            //reset css styles
            for (property in newPreset.styles) {
                newPreset.styles[property] = '';
            }
            //push the preset at the end
            newPresetId = self.options.presets.push(newPreset) - 1;
            //add preset to the dropdown and select it
            self.$presetsDropdown.append('<option value="' + newPresetId + '">' + presetName + '</option>');
            //get preset id and load it
            self.loadPreset(newPresetId);
		};
        //add new preset
        self.renamePreset = function () {
            //current preset option
            var currPresetOption = self.$presetsDropdown.find('option[value=' + self.currentPresetNo + ']'),
                presetName = prompt('New preset name i.e. paragraph', currPresetOption.text()),
                property;
            if (!presetName) {
                return;
            }
            self.$presetsDropdown.find('option[value=' + self.currentPresetNo + ']').text(presetName);
            self.currentPreset.name = presetName;
        };
        //delete preset
        self.deletePreset = function (presetNo) {
            if (!confirm("Are you sure you want to delete this preset?")) {
                return false;
            }
            if (self.options.presets.length === 1) {
                alert('At least one preset has to be present');
                return;
            }
            self.options.presets.splice(presetNo, 1);
            self.$presetsDropdown.find('option[value=' + presetNo + ']').remove();
            self.loadPreset(0);
			alert('When resetting settings or deleting preset you have to save to see the change');
        };
        //delete current preset
        self.deleteCurrentPreset = function () {
            self.deletePreset(self.currentPresetNo);
        };
        //load categories
        self.loadFontCategories = function () {
            //make ajax request to get categories
            self.xhrPost({
				url: self.options.FFW_baseUrl + '/fontcategories/fontplugininit',
				data: {
						apikey: self.options.apikey,
						blogurl: fontBlogUrl
					},
				format: 'html'
			},
			function (data) {
				//if empty answer display error
				if (!data || data === '') {
					self.$el.html('<h1>An error has occurde</h1><p>Please try again later</p>');
				}
				//hide loader
				self.$el.find('#loading').remove();
				//show fonts list
				self.$el.find('#fontslist').html(data);
				//bind close to close button
				self.$el.find('a.close_link').on('click', function () {
					self.$el.toggle();
				});
				//init carousel
				self.initCarousel();
			});
		};
        //bind onclick to links to reveal subcategories
        self.bindShowCategoriesAction = function () {
            $('body').on('click', self.baseSelector + ' #categoriesList > ul li a.categoryChoose', function () {
                var categoryId = $(this).attr('name');
                //hide all subcategories of other parents
                self.$el.find('#subcategoriesList li').hide();
                self.$el.find('#subcategoriesList li.instructions').show();
                //show all subcategories of this parent
                self.$el.find('#subcategoriesList li#FFW_parentcategory_' + categoryId).show();
                self.$el.find('.jcarousel-next').click();
                return false;
            });
        };
        //bind onclick to reveal font of category
        self.bindShowFontsAction = function () {
            //bind onclick subcategories to load their fonts
            $('body').on('click', self.baseSelector + ' #subcategoriesList > ul li a.categoryChoose', function () {
                var categoryId = $(this).attr('name');
				self.xhrPost({
					url: self.options.FFW_baseUrl + '/fontcategories/wpfontsforwebcategoryfonts/catid/' + categoryId,
					data: {
							apikey: self.options.apikey,
							blogurl: fontBlogUrl
						},
					format: 'html'
				},
				function (data) {
                    //if empty answer display error
                    if (!data || data === '') {
                        self.$el.html('<h1>An error has occurde</h1><p>Please reload page and try again later</p>');
                    }
                    //apply content to div
                    self.$el.find('#fontList').html(data);
                    //move carousel right
                    self.$el.find('.jcarousel-next').click();
                });
				/*
                $.get(self.options.FFW_baseUrl + '/fontcategories/wpfontsforwebcategoryfonts/catid/' + categoryId, function (data) {
                    //if empty answer display error
                    if (!data || data === '') {
                        self.$el.html('<h1>An error has occurde</h1><p>Please reload page and try again later</p>');
                    }
                    //apply content to div
                    self.$el.find('#fontList').html(data);
                    //move carousel right
                    self.$el.find('.jcarousel-next').click();
                });*/
                return false;
            });
            //bind delete function
            $('body').on('click', self.baseSelector + ' #uploaded a.delete', function () {
                if (!confirm("Are you sure you want to delete this font?")) {
                    return false;
                }
                var fontId = $(this).attr('name');
				
				self.xhrPost({
						url: self.options.FFW_baseUrl + '/api',
						data: {
							action: 'deletefont',
							apikey: self.options.apikey,
							blogurl: fontBlogUrl,
							fontid: fontId
						}
					}, function (data) {
						if (data.success === 'true') {
							self.loadPrivateFonts();
						} else {
							alert('Font deleting error.');
							$('.fontUploadForm').show();
							$('.fontUploading').hide();
						}
					}
				);
                return false;
            });
        };
        self.getField = function (name) {
            var input = self.settingFields[name].find('input');
            return input;
        };
        self.setField = function (name, value) {
            var input = self.getField(name);
            input.val(value);
            input.trigger('change');
        };
        /*
                    * when clicked on font in fonts browser
                    */
        self.setFontOnclick = function () {
            var selector;
            //bind onclick font change action to font images
            $('body').on('click', self.baseSelector + ' #fontList a.font_pick, ' + self.baseSelector + ' .fontsList a.font_pick', function () {
                var element,
                    fontName = $(this).parent().attr('title'),
                    selector,
                    elements,
                    head,
                    linkElement;
                //PAGE POST version
                if (self.mode === 'postPage') { //it's single post editing page
                    //set font to id from name attribute of a
                    self.setTinyMCEFont($(this).attr('name'), fontName);
                    return false;
                } else { //GENERAL VERSION
                    //get selector
                    selector = self.currentPreset.selector;
					//exit when default selector
					if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
						return;
					}
                    //set form fields
                    self.currentPreset.fontid = $(this).attr('name');
                    self.currentPreset.fontName = fontName;
                    //get target element from iframe or current page
                    if ($("#header1preview").length) {
                        element = $("#header1preview").contents().find();
                    } else {
                        element = $(document);
                    }
                    //set font family to a selector
                    elements = element.find(selector);
                    elements.each(function () {
                        $(this).style("font-family", fontName, 'important');
                    });
                    head = element[0].getElementsByTagName('head')[0];
                    linkElement = $(document.createElement('link'));
                    //get and add stylesheet
                    linkElement.attr({
                        href: self.options.FFW_baseUrl + '/font/generatepreviewcss/?id=' + $(this).attr('name'),
                        rel: 'stylesheet',
                        type: 'text/css'
                    });
                    linkElement.appendTo(head);
                    return false;
                }
            });
        };
        /*
		*	set font for post or page in tinymce
		*/
        self.setTinyMCEFont = function (fontId, fontName) {
            //get selection
            var selection = tinyMCE.activeEditor.selection.getContent(),
				selectorValid,
                fontClass,
                node,
                newSpan,
                newHTML,
                inserted;
            //only apply if something is selected
            if (!selection) {
                return;
            }
            //get node
            fontClass = "fontplugin_fontid_" + fontId + "_" + fontName;
            node = tinyMCE.activeEditor.selection.getNode();
			//selectorValid - validate selector created from selected text. 
			//required because for example "." with nothing following breaks function execution
			selectorValid = true;
			try {
				$(selection);
			} catch (e) {
				selectorValid = false;
			}
            if (selectorValid && ($.trim($(node).html()) === $.trim(selection) || $.trim($(node).html()) === $.trim($(selection).html()))) {
                //console.log('already isolated');
                tinyMCE.activeEditor.dom.setAttrib(node, 'class', fontClass);
            } else {
                newSpan = $("<span class=\"" + fontClass + "\">"  + selection + '</span>');
                //get span html together with span itself
                newHTML = $('<div>').append(newSpan.clone()).html();
                //add font in use
                inserted = tinyMCE.activeEditor.selection.setContent(newHTML);
                tinyMCE.activeEditor.selection.select(tinyMCE.activeEditor.dom.select('span.' + fontClass)[0]);
            }
            //loads font face to iframe editor
            self.loadFontFace(fontId);
        };
        //load font face for tinymce iframe
        self.loadFontFace = function (fontId) {
            var head = self.postIframe[0].getElementsByTagName('head')[0],
                linkElement = $(document.createElement('link'));
            linkElement.attr({
                href: self.options.FFW_baseUrl + '/font/generatepreviewcss/?id=' + fontId,
                rel: 'stylesheet',
                type: 'text/css'
            });
            linkElement.appendTo(head);
        };
        /*
                            Load private fonts
                    */
        self.loadPrivateFonts = function () {
			var apikey = self.options.apikey || false;
            //load private fonts
            self.xhrPost(
				{
					url: self.options.FFW_baseUrl + '/font/getuserfonts',
					data: {
						apikey: apikey,
						blogurl: fontBlogUrl,
						blogname: fontBlogName
					},
					format: 'html'
				}, function (data) {
					self.$el.find('#uploaded').html(data);
				}
			);
        };
        self.initCarousel = function () {
            var carousel = self.$el.find('#FFW_browser_carousel').jcarousel({
                buttonNextHTML: '<a href="#" onclick="return false;"></a>',
                buttonPrevHTML: '<a href="#" onclick="return false;"></a>',
                animation: 1000,
                scroll: 2
            });
        };
        /*
				focus font setting frame preview
		*/
        self.scrollToSelection = function () {
            var selector = self.currentPreset.selector,
                container,
                found;
			container = $('body');
			//exit when default selector
			if(selector.indexOf('ELEMENT NOW') != -1 || selector.indexOf('PICK ELEMENT') != -1) {
				return;
			}
            //get by selector from the iframe
            found = container.find(selector);
            //scroll to the top when no el selected
            if (!found.length) {
                //container.find('html, body').animate({
                //    scrollTop: 0
                //}, 'slow');
                return;
            }
            //animate scroll
            container.find('html, body').animate({
                scrollTop: (parseInt(found.offset().top, 10) - 100)
            }, 'slow');
        };
        self.initUploadForm = function () {
            $('body').on('submit', self.baseSelector + ' #fontUpload', function () {
                self.ajaxFontUpload.start();
            });
        };
		self.getSelector = function (element) {
			var selector = $(element).parents()
				.map(function () {
					return this.tagName;
				})
				.get().reverse().join(" "),
				id,
				classNames,
				selectorsArr,
				sel,
				parents = [],
				selectors = [];
			//go through each mapped object and get id class etc
			for(var i = 0; (i < $(element).parents().length && i < 4); i++) {
				var $parent = $(element).parents().eq(i),
					parentSelector = $parent[0].nodeName;
				//classses only for first 3 parents(now it's reversed)
				if(i < 2) {
					//get id
					//if(id = $parent.attr('id')) {
					//	parentSelector += '#' + id;
					//}
					//class names
					classNames = $parent.attr("class");
					if (classNames) {
						parentSelector += "." + $.trim(classNames).replace(/\s/gi, ".");
					}
				}
				selectors.push(parentSelector);
			}
			selector = selectors.reverse().join(' ');
			//get element tagname
			if (selector) {
				selector += " " + $(element)[0].nodeName;
			}
			id = $(element).attr("id");
			if (id) {
				selector += "#" + id;
			}
			classNames = $(element).attr("class");
			if (classNames) {
				selector += "." + $.trim(classNames).replace(/\s/gi, ".");
			}
			return selector;
		};
        /*
		* Selector picker events
		*/
        self.bindGetSelector = function (add) {
            $(function () {
				//get selector
                var selector = self.currentPreset.selector;
				//add cancel button
				if(!self.$cancelSelecting) {
					self.$cancelSelecting = $('<a href="#" class="cancelSelecting">Exit selecting mode</a>');
					$('body').append(self.$cancelSelecting);
					self.$cancelSelecting.data('cancelSelecting', true);
					//hide other elements
					self.$presets.hide();
				} else {
					self.$cancelSelecting.show();
					
					//hide other elements
					self.$presets.hide();
				}
                $('body').on('click', '*', function (e) {
					e.preventDefault();
					//if this is cancel selecting button
					if($(this).hasClass('cancelSelecting')) {
						self.stopSelectionMode();
						self.reloadPreset();
						return;
					}
					//if the element's preset is already created just pick it up
					if($(this).data('wired')) {
						self.$cancelSelecting.css('outline', 'none');
						self.stopSelectionMode();
						self.loadPreset($(this).data('presetNo'));
						return false;
					}
					//if not add to current preset mode
					if(!add) {
						var val = prompt('Name the selection i.e. title, header or paragraph. It\'ll be now listed in the upper left corner.')
						//if not ask for new selection name
						if(!val) {
							return;
						}					
						//create a new preset
						self.createPreset(val);
					}
							
					self.outlineAllPresets();
                    var sel = self.getSelector(this),
						selectorInput,
						comma;
                    selectorInput = self.getField('selector');
                    if (add) {
                        comma = selectorInput.val() ? ', ' : '';
                        selectorInput.val(selectorInput.val() + comma + sel);
                    } else {
                        selectorInput.val(sel);
                    }
                    selectorInput.trigger('change');
                    self.stopSelectionMode();
                    self.highlightCurrent();
					
					//load preset again to apply changes to a new element
					if(add) {
						self.reloadPreset();
					}
                    return false;
                });
                $('body').on('mouseover', '*', function () {
					if($(this).data('cancelSelecting')) {
						return;
					}
					self.hoverSelector = self.getSelector(this);
					self.hoverHighlightCurrent();
					$(this).css('outline', '3px dashed rgba(50,50,250,0.7)');
                    (function () {
                        var element = $(this);
                        setTimeout(function () {
							element.css('outline', 'none');
                        }, 100);
                    }());
                    return false;
                });
                $('body').on('mouseout', '*', function () {
                    $(this).css('outline', 'none');
                    return false;
                });
            });
        };
		//stop selection mode
		self.stopSelectionMode = function () {
			$('body').off('mouseover', '*');
			$('body').off('click', '*');
			$(this).css('outline', 'none');
			$('body').off('mouseout', '*');
			self.$cancelSelecting.hide();
			//hide other elements
			self.$presets.show();
		};
		// Converts from HEX/HTML to rgb object
		self.html2rgb = function(htmlcol){
			var rgb=new Object();
			rgb.r = self.html2dec(htmlcol.substr(0,2));
			rgb.g = self.html2dec(htmlcol.substr(2,2));
			rgb.b = self.html2dec(htmlcol.substr(4,2));
			return rgb;
		};
		self.parseRgb = function (rgbString) {
			//alert('#' + self.rgbString2hex(rgbString));
			return self.html2rgb(self.rgbString2hex(rgbString));
		};
		self.rgbString2hex = function(rgbString){
			var parts = rgbString
					  .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
			;
			// parts now should be ["rgb(0, 70, 255", "0", "70", "255"]
			delete (parts[0]);
			for (var i = 1; i <= 3; ++i) {
				 parts[i] = parseInt(parts[i]).toString(16);
				 if (parts[i].length == 1) parts[i] = '0' + parts[i];
			}
			var hexString = parts.join('');
			return hexString;
		};
		self.html2dec = function (h){
			// Converts from HEX/HTML-style (00-FF) to decimal color value (0-255)
			return parseInt(h,16);
		};
        //font ajax upload
        self.ajaxFontUpload = (function () {
            return {
                start: function () {
                    $('.fontUploadForm').hide();
                    $('.fontUploading').show();
                    $('#fontUploadIframe').load(function () {
						self.loadPrivateFonts();
                        //get info about the upload
                        /*$.getJSON(self.options.FFW_baseUrl + '/font/wpaddsummary', function (data) {
                            if (data.success === 'true') {
                                self.loadPrivateFonts();
                            } else {
                                alert('Font upload error. Check if file is not blocked against embedding.');
                                $('.fontUploadForm').show();
                                $('.fontUploading').hide();
                            }
                        });*/
                    });
                }
            };
        }());
        //last INIT
        self.init();
    };
    /*
         * set default options
         */
    $.fontPlugin.defaultOptions = {
        FFW_baseUrl: 'http://fontsforweb.com'
    };
    /*
         * make jquery plugin
         */
    $.fn.fontPlugin = function (options) {
        return this.each(function () {
            var fontPlugin = new $.fontPlugin(this, options);
        });
    };
}(jQuery));