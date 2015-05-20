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

app.controller('loginController', function($scope,$location,$routeParams,$cookies)
{
	//$scope.Id = $routeParams.Id2;
	//$("body").css("background-color","blue");
	
	$scope.login = function(){
		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;
		
		var apiurl = "http://joaotrindade.pt/api/Login/";
		var passwordhash = CryptoJS.MD5(password).toString();
		
		$.post("http://joaotrindade.pt:80/api/Login/", {Email : username, Password : password}).then( function(response)
		{
			console.log("1 "+ response);
			//$location.path("user/"+username); 
		});
		
		$.post("http://joaotrindade.pt:8921/api/Login/", {Email : username, Password : password}).then( function(response)
		{
			console.log("2 "+ response);
			//$location.path("user/"+username); 
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
	$scope.ID = $routeParams.ID;
	$scope.UpURL = "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xap1/v/t1.0-9/10169442_416816631805894_6827082371479926696_n.jpg?oh=654fd9d6c0acf4a0be65012bc86a5295&oe=55827CC7&__gda__=1434640923_05f4c6a8edb66579a7a8c96c9a48601e";
	
	$scope.IconURL = "Sun.png";
	
	console.log($cookies.get("loginCookie"));
});

app.controller('parametersController2', function($scope,$routeParams)
{
	$scope.Id = $routeParams.Id2;
});




