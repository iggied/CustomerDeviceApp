'use strict';
angular.module('CustomerDeviceApp', ['ionic', 'config', 'ngResource', 'CustomerDeviceApp.controllers', 'CustomerDeviceApp.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })


  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          '@': {
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('tables', {
        url: '/tables',
        views: {
          '@': {
            templateUrl: 'tables.html',
            controller: 'TablesCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });



angular.module('CustomerDeviceApp.controllers', [])

  .controller('LoginCtrl', function($scope, $state, $rootScope) {
    $scope.staffInput = {
      Id: "",
      Pin: ""
    };

    $scope.login = function() {
      $rootScope.staffId = "";

      var staffId = $scope.staffInput.Id, staffPin = $scope.staffInput.Pin;
      var regExId = new RegExp( staffId.substr(1,1), "g");

      if (staffId.length > 4 && staffPin.length > 4 && staffId.replace(regExId, "").length > 0) {
        if (staffPin === staffId.split("").reverse().toString().replace(/,/g, "")) {
          $rootScope.staffId = staffId;
          $state.go('tables');
        };
      };
    };
  })

  .controller('TablesCtrl', ['$scope', '$rootScope', '$window', 'Tables', function($scope, $rootScope, $window, Tables) {
    $scope.tables = Tables.query();

    $scope.TableSelected = function(tableIndex) {
      $window.location.href = 'main.html#/coverpage/'+$rootScope.staffId+'/'+tableIndex+'/'+$scope.tables[tableIndex].tableNumber;
    };
  }]);


angular.module('CustomerDeviceApp.services', [])

.factory('Tables', ['$resource',
  function($resource){
    return $resource('res/appdata/Tables.json', {}, {query: {method: 'GET', isArray: true}}
    );
  }
])
