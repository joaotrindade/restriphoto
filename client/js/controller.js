var app = angular.module("AltranWebApp",["ngRoute","ngCookies"]);

app.config( function($routeProvider)
{
	$routeProvider
		.when("/", {templateUrl:'partials/login.html', controller:'loginController'})
		.when("/about", {templateUrl:'partials/about.html', controller:'aboutController'})
		.when("/user/:ID", {templateUrl: 'partials/user.html', controller: 'userController'})
		.when("/register", {templateUrl:'partials/register.html', controller:'registerController'})
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
	
	$scope.goToRegister = function(){
		$location.path("/register");
	}
});

app.controller('registerController', function($scope,$location,$timeout,$routeParams,$cookies)
{
	
	$scope.regist = function(){
	
		var name = document.getElementById("register_name").value;
		var email = document.getElementById("register_email").value;
		var password = document.getElementById("register_password").value;
		var url = document.getElementById("register_url").value;
		
		var apiurl = "http://joaotrindade.pt:80/api/Register/";
		
		$.post(apiurl, {Name : name, Url : url, Password : password, Email : email}).then( function(response)
		{
			console.log(response);
			
			$location.path("/");
			 
			$timeout(function () { 
				$scope.currentPath = $location.path();
			},0)
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
	var selectedTide = 3;
	
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
	
	$scope.nRestrictions = 0;
	$scope.rests = [];
	
	$scope.sWeather = selectedWeather;
	$scope.sDays = selectedDays;
	$scope.sSunPosition = selectedSunPosition;
	$scope.selectedTide = 3;
	
	initialize();
	
	function getRestris(){
		var apiRequisito = "http://joaotrindade.pt:80/api/Requisito/";
		var userid = $cookies.get("userid");
		$.post(apiRequisito , {idUtilizador : userid}).then( function(response)
		{
			console.log(response);
			if(response[0].StatusCode == 666)
				$scope.nRestrictions = 0;
			else
			{
				var temp = [];
				var ntemp = 0;
				for(var i=0; i<response.length; i++)
				{
					for(var j=0; j<response[i].list.length; j++)
					{
						for(var k=0; k<response[i].list[j].EstadoTempo.length; k++)
						{
							if(response[i].list[j].EstadoTempo[k].id==32)
								temp[ntemp] = "Sun.png";
							else if(response[i].list[j].EstadoTempo[k].id==44)
								temp[ntemp] = "Sun_Cloud.png";
							else if(response[i].list[j].EstadoTempo[k].id==9)
								temp[ntemp] = "DownPour.png";
							else if(response[i].list[j].EstadoTempo[k].id==26)
								temp[ntemp] = "Mostly_Cloudy.png";
							else if(response[i].list[j].EstadoTempo[k].id==11)
								temp[ntemp] = "Rain.png";
							else if(response[i].list[j].EstadoTempo[k].id==4)
								temp[ntemp] = "Thunder.png";
							else if(response[i].list[j].EstadoTempo[k].id==20)
								temp[ntemp] = "Fog.png";
							else if(response[i].list[j].EstadoTempo[k].id==16)
								temp[ntemp] = "Snow.png";
							else if(response[i].list[j].EstadoTempo[k].id==24)
								temp[ntemp] = "Wind.png";
							else if(response[i].list[j].EstadoTempo[k].id==17)
								temp[ntemp] = "Hail.png";
							
							ntemp++;
						}
						response[i].list[j].etIcons = temp;
						temp=[];
						ntemp = 0;
						
						var temp2=[];
						var ntemp2 = 0;
						if(response[i].list[j].segundaStatus)
						{
							temp2[ntemp2] = "Seg";
							ntemp2++;
						}
						if(response[i].list[j].tercaStatus)
						{
							temp2[ntemp2] = "Ter";
							ntemp2++;
						}
						if(response[i].list[j].quartaStatus)
						{
							temp2[ntemp2] = "Qua";
							ntemp2++;
						}
						if(response[i].list[j].quintaStatus)
						{
							temp2[ntemp2] = "Qui";
							ntemp2++;
						}
						if(response[i].list[j].sextaStatus)
						{
							temp2[ntemp2] = "Sex";
							ntemp2++;
						}
						if(response[i].list[j].sabadoStatus)
						{
							temp2[ntemp2] = "Sab";
							ntemp2++;
						}
						if(response[i].list[j].domingoStatus)
						{
							temp2[ntemp2] = "Dom";
							ntemp2++;
						}
						response[i].list[j].etDays = temp2;
						
						var temp3 = [];
						var myDays= ["Dom","Seg","Ter","Qua","Qui","Sex","Sab","Dom","Seg","Ter","Qua","Qui","Sex","Sab","Dom","Seg","Ter","Qua","Qui","Sex","Sab","Dom"]
						var today=new Date();
						var thisDay=today.getDay();
						thisDay=myDays[thisDay];
						
						for(var k=0; k<response[i].list[j].estados.length; k++)
						{
							if(response[i].list[j].estados[k] != null)
							{
								if(response[i].list[j].estados[k] > 0)
									temp3[k] = myDays[thisDay+response[i].list[j].estados[k]];
								else
									temp3[k] = "Hoje";
							}
							else
								temp3[k] = "";
						}
						response[i].list[j].goodDays = temp3;
					}
				}
				
				
				$scope.$apply(function () {
					$scope.nRestrictions = response.length;
					$scope.rests = response;
				});
			}
		});
	}
	getRestris();
	
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
				globalCoordenates = results[0].geometry.location.A + " ; " + results[0].geometry.location.F;
				
				globalLocality = "";
				globalDistrict = "";
				globalRoute = "";
				
				console.log(results);
				var level2 = false;
				//Funciona apenas com Portugal para já
				for(var i=0; i< results[0].address_components.length ; i++)
				{
					if(results[0].address_components[i].types[0] == "route")
					{
						globalRoute= results[0].address_components[i].short_name;
						//alert("Localidade = " + globalLocality );
					}
				
					if(results[0].address_components[i].types[0] == "locality")
					{
						if(!level2)
							globalLocality = results[0].address_components[i].long_name;
						//alert("Localidade = " + $scope.addLocalidade );
					}
					
					if(results[0].address_components[i].types[0] == "administrative_area_level_2")
					{
						globalLocality = results[0].address_components[i].long_name;
						level2 = true;
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
				
				if(globalRoute != "")
					document.getElementById('address').value = globalRoute + ", " + globalLocality + ", " + globalDistrict;
				else if(globalLocality != "")
					document.getElementById('address').value = globalLocality + ", " + globalDistrict;
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
	
	$scope.copyL = function(lct){
		document.getElementById('address').value = lct;
	}
	
	$scope.deleteL = function(id){
		var apiurl = "http://joaotrindade.pt:80/api/EliminaRequisito/";
		
		var idUser = $cookies.get("userid");
		var obj = {
			'id' : parseInt(id),
			'idUtilizador' : parseInt(idUser)
		}
		
		console.log(JSON.stringify(obj));
		
		$.ajax({
		  url:apiurl,
		  type:"POST",
		  data: JSON.stringify(obj),
		  contentType:"application/json",
		  success: function(response){
			console.log(response);
			getRestris();
		  }
		});	
		
	}
	
	$scope.active = function selectWeather(id){
		
		if(selectedWeather[id])
		{	
			selectedWeather[id] = false;
			$scope.sWeather[id] = false;
		}
		else
		{
			selectedWeather[id] = true;
			$scope.sWeather[id] = true;
		}
		
	}
	
	$scope.activeDays = function selectDays(id){
		
		if(selectedDays[id])
		{	
			selectedDays[id] = false;
			$scope.sDays[id] = false;
		}
		else
		{
			selectedDays[id] = true;
			$scope.sDays[id] = true;
		}
		
	}
	
	$scope.activeSunPosition = function selectSP(id){
		
		if(selectedSunPosition[id])
		{	
			selectedSunPosition[id] = false;
			$scope.sSunPosition[id] = false;
		}
		else
		{
			selectedSunPosition[id] = true;
			$scope.sSunPosition[id] = true;
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
			selectedTide = 3;
			$scope.selectedTide = 3;
		}
	}
	
	$scope.addRestriction = function(){
		var selectedDays2 = [];
		for(var i = 1; i<8; i++)
		{
			if(selectedDays[i])
				selectedDays2[i] = 1;
			else
				selectedDays2[i] = 0;
		}
		
		var selectedSunPosition2 = [];
		for(var i = 1; i<3; i++)
		{
			if(selectedSunPosition[i])
				selectedSunPosition2[i] = 1;
			else
				selectedSunPosition2[i] = 0;
		}
		
		var estadoTids = [32,44,26,9,11,20,4,16,17,24];
		var estadoTnames = ["Sunny","Partly Cloudy","Cloudy","Drizzle","Showers","Foggy","Thunderstorms","Snow","Hail","Windy"];
			
		var estadoT = [];
		for(var i = 1; i<11; i++)
		{
			if(selectedWeather[i])
			{
				var temp = {'id': estadoTids[i-1]};
				estadoT.push(temp);
			}
		}
		
		var estadoM = [];
		if(selectedTide == 3) estadoM = null;
		else
			estadoM.push({"id":selectedTide});
		
		var horaInit = parseInt(document.getElementById('initTime').value.substring(document.getElementById('initTime').value, 2));
		var horaFinit = parseInt(document.getElementById('endTime').value.substring(document.getElementById('endTime').value, 2));
		
		var exist = false;
		var existID = -1;
		var local = document.getElementById('address').value;
		for(var i=0; i<$scope.rests.length; i++)
		{
			if($scope.rests[i].local == local)
			{
				exist = true;
				existID = parseInt($scope.rests[i].id);
				i = $scope.rests.length;
			}
		}
		
		var obj = 
		{ 
			'segundaStatus' : selectedDays2[1],
			'tercaStatus' : selectedDays2[2],
			'quartaStatus' : selectedDays2[3],
			'quintaStatus' : selectedDays2[4],
			'sextaStatus' : selectedDays2[5],
			'sabadoStatus' : selectedDays2[6],
			'domingoStatus' : selectedDays2[7],
			'idRequisito' : existID,
			'horaInicio' : horaInit, 
			'horaFim' : horaFinit,
			'sunset' : selectedSunPosition2[2],
			'sunrise' : selectedSunPosition2[1],
			'EstadoTempo' : estadoT,
			'EstadoMares' : estadoM,
			'EstadoLua' : null
		}
	
		console.log(obj);
		console.log(JSON.stringify(obj));
		
		if(!exist)
		{
			var apiurl2 = "http://joaotrindade.pt/api/AdicionaRequisito/";
			
			var portoMar = document.getElementById("portoSelect").value;
			var idUser = $cookies.get("userid");
			var obj2 = 
			{ 
				'localizacao' : globalDistrict,
				'local' : local,
				'Porto' : parseInt(portoMar),
				'idUtilizador' : parseInt(idUser),
				'coordenadas' : globalCoordenates,
				'list' : null
			}
			
			console.log(JSON.stringify(obj2));
			$.ajax({
			  url:apiurl2,
			  type:"POST",
			  data: JSON.stringify(obj2),
			  contentType:"application/json",
			  success: function(response){
				console.log(response);
				
				var apiurl = "http://joaotrindade.pt/api/AdicionaCondicao/";
				
				var obj = 
				{ 
					'segundaStatus' : selectedDays2[1],
					'tercaStatus' : selectedDays2[2],
					'quartaStatus' : selectedDays2[3],
					'quintaStatus' : selectedDays2[4],
					'sextaStatus' : selectedDays2[5],
					'sabadoStatus' : selectedDays2[6],
					'domingoStatus' : selectedDays2[7],
					'idRequisito' : response.idRequisito,
					'horaInicio' : horaInit, 
					'horaFim' : horaFinit,
					'sunset' : selectedSunPosition2[1],
					'sunrise' : selectedSunPosition2[2],
					'EstadoTempo' : estadoT,
					'EstadoMares' : estadoM,
					'EstadoLua' : null
				}
		
				$.ajax({
				  url:apiurl,
				  type:"POST",
				  data: JSON.stringify(obj),
				  contentType:"application/json",
				  success: function(response){
					console.log(response);
					resetConditions();
					getRestris();
				  }
				});	
			  }
			});
			
			
		}
		else
		{
			var apiurl = "http://joaotrindade.pt/api/AdicionaCondicao/";
			
			$.ajax({
			  url:apiurl,
			  type:"POST",
			  data: JSON.stringify(obj),
			  contentType:"application/json",
			  success: function(response){
				console.log(response);
				resetConditions();
				getRestris();
			  }
			});	
		}
	}
	
	function resetConditions(){
		$scope.$apply(function () {
			selectedDays = resetSelectedD();
			selectedSunPosition = resetSelectedSP();
			selectedWeather = resetSelectedW();
			
			$scope.sWeather = selectedWeather;
			$scope.sDays = selectedDays;
			$scope.sSunPosition = selectedSunPosition;
			$scope.selectedTide = 3;
		});
		
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
var globalRoute = "";
var globalLocality = "";
var globalDistrict = "";
var globalCoordenates = "";

function initialize() {
	geocoder = new google.maps.Geocoder();
  	var latlng = new google.maps.LatLng(41.178522, -8.599528);
	globalCoordenates = "41.178522 ; -8.599528";
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
		globalCoordenates = position.A + " ; " + position.F;
		$.get(geoApi).then( function(response){
			var results = response.results;
			console.log(results);
			
			globalLocality = "";
			globalDistrict = "";
			globalRoute = "";
			
			//Funciona apenas com Portugal para já
			for(var i=0; i< results[0].address_components.length ; i++)
			{
				if(results[0].address_components[i].types[0] == "route")
				{
					globalRoute= results[0].address_components[i].short_name;
					//alert("Localidade = " + globalLocality );
				}
				
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
			
			if(globalRoute != "")
				document.getElementById('address').value = globalRoute + ", " + globalLocality + ", " + globalDistrict;
			else if(globalLocality != "")
				document.getElementById('address').value = globalLocality + ", " + globalDistrict;
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






