
var themeRoller = angular.module("themeRoller", ['ui.router']);

themeRoller.config(function($stateProvider, $urlRouterProvider) {
  
  //drupal settings
  var settings = Drupal.settings;

  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    
    .state('root', 
    {
      url: '/',
      abstract:true,
      templateUrl: settings.ellie.template_path + '/root.tpl.html',
      controller: 'mainCtrl'
    })
    
    .state('root.home', 
    {
      url: '',
      templateUrl: settings.ellie.template_path + '/home.tpl.html',
      controller: function($scope, $state)
      {
      	$scope.setTemplate = function(theme) 
		{
			$scope.selectedParams.theme = theme;
		    $state.go('root.color');
		}
      }
    })

    .state('root.color', 
    {
      url: 'color',
      templateUrl: settings.ellie.template_path + '/color.tpl.html',
      controller: function($scope, $state)
      {
      	if($scope.selectedParams.theme === undefined)
      	{
      		$state.go('root.home');
      	}

      	$scope.setColor = function(color) 
		{
			$scope.selectedParams.color = color;
			
		    $state.go('root.summary');
		}

      },
    })

    .state('root.summary', 
    {
      url: 'summary',
      templateUrl: settings.ellie.template_path + '/summary.tpl.html',
      controller: function($scope, $state, $http)
      {
      	if($scope.selectedParams.theme === undefined || $scope.selectedParams.color === undefined )
      	{
      		$state.go('root.home');
      	}

      	$scope.saveThemeSettings = function()
      	{
      		$http.post('/themeroller/save', $scope.selectedParams).
			  then(function(response) 
			  {
			    $state.go('homepage');
			  }
			);
      	}

      },
    })

    .state('homepage', {
       externalUrl: settings.ellie.home_path
  	});


  

});

themeRoller.run(function($rootScope, $window) {
    $rootScope.$on(
        '$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState.externalUrl) {
                event.preventDefault();
                $window.open(toState.externalUrl, '_self');
            }
        }
    );
});

themeRoller.controller('mainCtrl', function($scope, $http) {

	$scope.selectedParams = {};

	$http.get('/themeroller/themes').
	  then(
	  	  function(response) 
		  {
		    $scope.themes = response.data;
		  }
	  );

	 $http.get('/themeroller/colors').
	  then(
	  	  function(response) 
		  {
		    $scope.colors = response.data;
		  }
	  );

});

angular.element(document).ready(function() 
{  
  var app = document.getElementById("themeroller");
  angular.bootstrap(app, ["themeRoller"]);
});