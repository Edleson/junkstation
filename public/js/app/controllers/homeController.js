
app.controller('homeController', ['$scope', function ($scope) {
	//
	
	$scope.test = "TESTE";
	$scope.load = function(){
		alert('teste');
	}

	$scope.$on("$viewContentLoaded", function(){
		loadDependence();
	});
}]);

function loadDependence(){
	var maps = document.createElement('script');
	maps.src = "http://maps.google.com/maps/api/js?sensor=false";
	//document.body.appendChild(maps);

	var jquery = document.createElement('script');
	jquery.src = "bower_components/jquery/dist/jquery.min.js";
	document.body.appendChild(jquery);

	jquery.onload = function(){
		var superfish = document.createElement('script');
		superfish.src = "bower_components/superfish/dist/js/superfish.min.js";
		document.body.appendChild(superfish);

		var plugins = document.createElement('script');
		plugins.src = "js/lib/jquery.themepunch.plugins.min.js";
		document.body.appendChild(plugins);

		var revolution = document.createElement('script');
		revolution.src = "js/lib/jquery.themepunch.revolution.min.js";
		document.body.appendChild(revolution);

		var form_style = document.createElement('script');
		form_style.src = "bower_components/jquery.customSelect/jquery.customSelect.min.js"; 
		document.body.appendChild(form_style);

		var bootstrap = document.createElement('script');
		bootstrap.src = "js/lib/bootstrap.min.js";
		document.body.appendChild(bootstrap);

		var placeholder = document.createElement('script');
		placeholder.src = "bower_components/jquery.placeholder/jquery.placeholder.min.js";
		document.body.appendChild(placeholder);

		var fancybox = document.createElement('script');
		fancybox.src = "js/lib/jquery.fancybox-1.3.4.js"; 
		document.body.appendChild(fancybox);
		fancybox.onload = function(){
			var custom = document.createElement('script');
			custom.src = "js/lib/custom.js"; // URL do seu script aqui
			document.body.appendChild(custom);
		}

		var gmap = document.createElement('script');
		gmap.src = "js/lib/jquery.gmap.min.js";
		document.body.appendChild(gmap);
	}
}


