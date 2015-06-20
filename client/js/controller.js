var app = angular.module("AltranWebApp",["ngRoute","ngCookies"]);

app.config( function($routeProvider)
{
	$routeProvider
		.when("/", {templateUrl:'partials/login.html', controller:'loginController'})
		.when("/about", {templateUrl:'partials/about.html', controller:'aboutController'})
		.when("/user/:ID", {templateUrl: 'partials/user.html', controller: 'userController'})
		.when("/parameters/:Id1/:Id2", {templateUrl: 'partials/parameters.html', controller: 'parametersController2'});
});

app.controller('rootController', function($scope)
{
	$scope.reloadPage = function(){alert("LEL");}
	$scope.variavelteste = "GOOGLE";
	
});

app.controller('loginController', function($scope,$location,$timeout,$routeParams,$cookies)
{
	
	$scope.login = function(){
		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;
		
		var apiurl = "http://joaotrindade.pt:80/api/Login/";
		
		$.post(apiurl, {Email : username, Password : password}).then( function(response)
		{
			console.log(response);
			
			if(response.StatusCode != 666)
			{
				var now = new Date();
				var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
				
				$cookies.put("userid", response.Id, {expires: exp});
				$cookies.put("username", response.Name, {expires: exp});
				$cookies.put("useremail", response.Email, {expires: exp});
				$cookies.put("userurl", response.Url, {expires: exp});
			
				$location.path("user/"+ response.Name);
			 
				$timeout(function () { 
					$scope.currentPath = $location.path();
				},0)
			}
			else
			{
				alert("User not in the database");
			}
		});
		
	}
});


app.controller('aboutController', function($scope,$routeParams,$window)
{
	//alert("LEL");
	$("body").css("background-color","yellow");
});

app.controller('userController', function($scope,$routeParams,$cookies,$window)
{
	var selectedWeather = []; 
	var selectedDays = []; 
	var selectedSunPosition = [];
	var selectedTide = -1;
	
	function resetSelectedW(){
		var array = [];
		for(var i = 1; i<11; i++)
		{
			array[i] = false;
		}
		return array;
	}
	selectedWeather = resetSelectedW();
	
	function resetSelectedD(){
		var array = [];
		for(var i = 1; i<8; i++)
		{
			array[i] = false;
		}
		return array;
	}
	selectedDays = resetSelectedD();
	
	function resetSelectedSP(){
		var array = [];
		for(var i = 1; i<3; i++)
		{
			array[i] = false;
		}
		return array;
	}
	selectedSunPosition = resetSelectedSP();
	
	$scope.ID = $cookies.get("userid"); //$routeParams.Id
	$scope.Name = $cookies.get("username"); //$routeParams.Id
	$scope.UpURL = $cookies.get("userurl");
	
	$scope.sWeather = selectedWeather;
	$scope.sDays = selectedDays;
	$scope.sSunPosition = selectedSunPosition;
	$scope.selectedTide = -1;
	
	initialize();
	
	var apiRequisito = "http://joaotrindade.pt:80/api/Requisito/";
	var userid = $cookies.get("userid");
	$.post(apiurl, {idUtilizador : userid}).then( function(response)
	{
		console.log(response);
	});
	
	$scope.IconURL = "Sun.png";
	
	$scope.getLocality = function codeAddress() {
	 	var address = document.getElementById('address').value;
	  	geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
				if(globalMarker != null)
					globalMarker.setMap(null);
					
		      	map.setCenter(results[0].geometry.location);
	
		      	var marker = new google.maps.Marker({
		          	map: map,
		          	position: results[0].geometry.location
		      	});
				globalMarker = marker;
				globalMarker.setMap(map);
				map.setCenter(results[0].geometry.location);
				
				globalLocality = "";
				globalDistrict = "";
				
				//Funciona apenas com Portugal para já
				for(var i=0; i< results[0].address_components.length ; i++)
				{
					if(results[0].address_components[i].types[0] == "locality")
					{
						globalLocality = results[0].address_components[i].long_name;
						//alert("Localidade = " + $scope.addLocalidade );
					}
					
					if(results[0].address_components[i].types[0] == "administrative_area_level_1")
					{
						 globalDistrict = results[0].address_components[i].long_name;
						//alert("Distrito = " + $scope.addDistrito );
					}
				}
				
				$scope.addLocalidade = globalLocality;
				$scope.addDistrito = globalDistrict;
				
				if(globalLocality != "")
					document.getElementById('address').value = globalLocality + " , " + globalDistrict;
				else
					document.getElementById('address').value = globalDistrict;
		    } 
			else 
			{
		      alert('Geocode was not successful for the following reason: ' + status);
		    }
	  	});
	}
	
	$scope.changeLocation = function changeL(){
		$scope.addLocalidade = globalLocality;
		$scope.addDistrito = globalDistrict;
	}
	
	$scope.active = function selectWeather(id){
		
		if(selectedWeather[id])
		{	
			selectedWeather[id] = false;
		}
		else
		{
			selectedWeather[id] = true;
		}
		
	}
	
	$scope.activeDays = function selectDays(id){
		
		if(selectedDays[id])
		{	
			selectedDays[id] = false;
		}
		else
		{
			selectedDays[id] = true;
		}
		
	}
	
	$scope.activeSunPosition = function selectSP(id){
		
		if(selectedSunPosition[id])
		{	
			selectedSunPosition[id] = false;
		}
		else
		{
			selectedSunPosition[id] = true;
		}
		
	}
	
	$scope.activeTide = function selectTide(id){
		
		if(id != selectedTide)
		{
			selectedTide = id;
			$scope.selectedTide = id;
		}
		else
		{
			selectedTide = -1;
			$scope.selectedTide = -1;
		}
	}
	
	$scope.addRestriction = function(){
		/*
		{
			"id": 1,
			"segundaStatus": 2,
			"tercaStatus": 3,
			"quartaStatus": 4,
			"quintaStatus": 5,
			"sextaStatus": 6,
			"sabadoStatus": 7,
			"domingoStatus": 8,
			"idRequisito": 9,
			"estado": 10,
			"horaInicio": 11,
			"horaFim": 12,
			"sunset": 13,
			"sunrise": 14,
			"EstadoTempo": null,
			"EstadoMares": null,
			"EstadoLua": null
		}
		*/
		alert("add");
		var estadoTids = [32,44,9,26,11,4,20,16,24,17];
		var estadoT = "[";
		var n = 0;
		for(var i = 1; i<11; i++)
		{
			if(selectedWeather[i])
			{
				estadoT += '"' + estadoTids[i-1] + '",';
				n++;
			}
		}
		if(n!=0)
		{
			estadoT = estadoT.substring(estadoT, estadoT.length - 1);
		}
		estadoT+="]";
		
		var estadoM ="";
		if(selectedTide == -1)
			estadoM="null";
		else
			estadoM='["' + selectedTide + '"]';
			
		var j = '{ "segundaStatus":"' + selectedDays[1] + '",' +
				'"tercaStatus":"' + selectedDays[2] + '",' +
				'"quartaStatus":"' + selectedDays[3] + '",' +
				'"quintaStatus":"' + selectedDays[4] + '",' +
				'"sextaStatus":"' + selectedDays[5] + '",' +
				'"sabadoStatus":"' + selectedDays[6] + '",' +
				'"domingoStatus":"' + selectedDays[7] + '",' +
				'"idRequisito": "-1",' +
				'"estado":"false",' +
				'"horaInicio":"' + document.getElementById('initTime').value + '",' +
				'"horaFim":"' + document.getElementById('endTime').value + '",' +
				'"sunset":"' + selectedSunPosition[1] + '",' +
				'"sunrise":"' + selectedSunPosition[2] + '",' +
				'"EstadoTempo":' + estadoT + ',' +
				'"EstadoMares":' + estadoM + ',' +
				'"EstadoLua": null' + 
				'}';
		
		var obj = JSON.parse(j);
		console.log(obj);
		
		var apiurl = "http://joaotrindade.pt:80/api/AdicionaCondicao/";
		
		/*$.post(apiurl, {Email : username, Password : password}).then( function(response)
		{
			console.log(response);
		}*/
	}
});

app.controller('parametersController2', function($scope,$routeParams)
{
	$scope.Id = $routeParams.Id2;
});

/* GOOGLE GEOCODING API */

var geocoder;
var map;
var globalMarker = null;
var globalLocality = "";
var globalDistrict = "";

function initialize() {
	geocoder = new google.maps.Geocoder();
  	var latlng = new google.maps.LatLng(41.178522, -8.599528);
  	var mapOptions = {
    	zoom: 10,
    	center: latlng
  	}
  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  
	google.maps.event.addListener(map, 'click', function(e) {
		if(globalMarker != null)
			globalMarker.setMap(null);
			
		var position = e.latLng;
		var marker = new google.maps.Marker({
		   position: position,
		   map: map
		});
		globalMarker = marker;
		globalMarker.setMap(map);
		map.setCenter(position);
		
		var geoApi = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.A + "," + position.F;
		console.log(position.A + " " + position.F);
		$.get(geoApi).then( function(response){
			var results = response.results;
			console.log(results);
			
			globalLocality = "";
			globalDistrict = "";
			
			//Funciona apenas com Portugal para já
			for(var i=0; i< results[0].address_components.length ; i++)
			{
				if(results[0].address_components[i].types[0] == "locality")
				{
					globalLocality = results[0].address_components[i].long_name;
					//alert("Localidade = " + globalLocality );
				}
				 
				if(results[0].address_components[i].types[0] == "administrative_area_level_1")
				{
					globalDistrict = results[0].address_components[i].long_name;
					//alert("Distrito = " + globalDistrict );
				}
			}
			
			if(globalLocality != "")
				document.getElementById('address').value = globalLocality + " , " + globalDistrict;
			else
				document.getElementById('address').value = globalDistrict;
			
			angular.element(document.getElementById('userPartial')).scope().changeLocation();
			angular.element(document.getElementById('userPartial')).scope().$apply();
			
		});
		/*map.panTo(position);*/
	});
}

function codeAddress() {
 	var address = document.getElementById('address').value;
  	geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      	map.setCenter(results[0].geometry.location);
	      	var marker = new google.maps.Marker({
	          	map: map,
	          	position: results[0].geometry.locations
	      	});
	    } 
		else 
		{
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
  	});
}

google.maps.event.addDomListener(window, 'load', initialize);

/*--------------------------------*/
	
/*CLOCK PICKER ---------------------*/






