$(document).ready(function() {

	//------- Google Maps ---------//
		  
	// Creating a LatLng object containing the coordinate for the center of the map
	var latlng = new google.maps.LatLng(28.519,-81.224);
	  
	// Creating an object literal containing the properties we want to pass to the map  
	var options = {  
		zoom: 15, // This number can be set to define the initial zoom level of the map
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
	};  
	// Calling the constructor, thereby initializing the map  
	var map = new google.maps.Map(document.getElementById('map_div'), options);  
	
	// Define Marker properties
	var image = new google.maps.MarkerImage('http://localhost/rwp/wp-content/themes/dimsemenov-Touchfolio-59aee85/img/marker.png',
		// This marker is 129 pixels wide by 42 pixels tall.
		new google.maps.Size(32, 37),
		// The origin for this image is 0,0.
		new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 18,42.
		new google.maps.Point(18, 42)
	);
	
	// Add Marker
	var marker1 = new google.maps.Marker({
		position: new google.maps.LatLng(28.519,-81.224), 
		map: map,		
		icon: image // This path is the custom pin to be shown. Remove this line and the proceeding comma to use default pin
	});	
	
	// Add listener for a click on the pin
	google.maps.event.addListener(marker1, 'click', function() {  
		infowindow1.open(map, marker1);  
	});
		
	// Add information window
	var infowindow1 = new google.maps.InfoWindow({  
		content:  createInfo('Michael Breland', '10724 Spring Brook Lane,<br />Orlando,<br />Florida,<br />32825<br /><a href="http://www.responsivewebsitepro.com" title="Click to view our website">Our Website</a>')
	}); 
	
	// Create information window
	function createInfo(title, content) {
		return '<div class="infowindow"><strong>'+ title +'</strong><br />'+content+'</div>';
	} 

});


