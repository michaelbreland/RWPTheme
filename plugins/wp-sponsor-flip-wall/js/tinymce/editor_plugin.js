(function() {
	tinymce.create('tinymce.plugins.WP_SFW', {
		init : function(ed, url) {
			ed.addButton('wp_sfw', {
				title : 'wp_sfw.sponsor',
				image : url + '/../../images/flip.png',
				onclick : function() {
					ed.execCommand('mceInsertContent', false, '[wp_sfw_render]');
				}
			});
		},
		createControl : function(n, cm) {
			return null;
		},
		getInfo : function() {
			return {
				longname    : "WP Sponsor Flip Wall",
				author      : 'Samuel Ramon',
				authorurl   : 'http://samuel.phpcafe.com.br/',
				infourl     : 'http://phpcafe.com.br/',
				version     : "0.1"
			};
		}
	});
	tinymce.PluginManager.add('wp_sfw', tinymce.plugins.WP_SFW);
})();