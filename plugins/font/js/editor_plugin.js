(function() {
	tinymce.create('tinymce.plugins.FFWButtonPlugin', {
		init : function(ed, url) {
			ed.addCommand('mceFFWButton', function() {
				jQuery('#FFW_chooseFontButton').trigger('click');
			});
			// Register example button
			ed.addButton('FFWButton', {
				title : 'FFWButton.desc',
				cmd : 'mceFFWButton',
				image : url + '/../images/tinymce_icon.png'
			});
		},
		createControl : function(n, cm) {
				return null;
		},
		getInfo : function() {
			return {
				longname : 'FFWButton plugin',
				author : 'Paweł Misiurski',
				authorurl : 'http://killerdeveloper.com',
				infourl : 'http://killerdeveloper.com',
				version : "1.0"
			};
		}
	});
	// Register plugin
	tinymce.PluginManager.add('ffwbutton', tinymce.plugins.FFWButtonPlugin);
})();