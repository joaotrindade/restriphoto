var app = angular.module("AltranWebApp",["ngRoute"]);

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

app.controller('loginController', function($scope,$location,$routeParams)
{
	//$scope.Id = $routeParams.Id2;
	//$("body").css("background-color","blue");
	
	$scope.login = function(){
		var username = document.getElementById("login_username").value;
		var password = document.getElementById("login_password").value;
	
		$location.path("user/"+username); 
	}
});


app.controller('aboutController', function($scope,$routeParams,$window)
{
	//alert("LEL");
	$("body").css("background-color","yellow");
});

app.controller('userController', function($scope,$routeParams,$window)
{
	$scope.ID = $routeParams.ID;
	$scope.UpURL = "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xap1/v/t1.0-9/10169442_416816631805894_6827082371479926696_n.jpg?oh=654fd9d6c0acf4a0be65012bc86a5295&oe=55827CC7&__gda__=1434640923_05f4c6a8edb66579a7a8c96c9a48601e";
	
	$scope.IconURL = "Sun.png";
});

app.controller('parametersController2', function($scope,$routeParams)
{
	$scope.Id = $routeParams.Id2;
});




