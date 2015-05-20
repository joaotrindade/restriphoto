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
				$cookies.put("useremail", response.Email, {expires: exp});
				$cookies.put("userurl", response.Url, {expires: exp});
			
				$location.path("user/"+ response.id);
			 
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
	$scope.ID = $cookies.get("userid"); //$routeParams.Id
	$scope.UpURL = $cookies.get("userurl");

	$scope.IconURL = "Sun.png";
	
	

});

app.controller('parametersController2', function($scope,$routeParams)
{
	$scope.Id = $routeParams.Id2;
});




