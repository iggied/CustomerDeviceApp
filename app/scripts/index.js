'use strict';
angular.module('AppIndex', ['ionic', 'config', 'ngResource', 'AppIndex.controllers', 'AppIndex.services'])

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

//  .constant('managerUrl', 'http://10.0.1.2:8080/outlet/serve')
  .constant('managerUrl', 'http://192.168.56.101:8080/outlet/serve')

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



angular.module('AppIndex.controllers', [])

  .controller('LoginCtrl', ['$scope', '$state', '$rootScope', 'ManagerRes', function($scope, $state, $rootScope, ManagerRes) {
    $scope.staffInput = {
      Id: "",
      Pin: ""
    };

    $scope.staffLogin = function() {
      $rootScope.staffId = "";

      var staffId = $scope.staffInput.Id, staffPin = $scope.staffInput.Pin;

      ManagerRes.validateCreds({staffId: staffId, staffPin: staffPin},
        function(data) {
          if (data.success === "1") {
            $rootScope.staffId = staffId;
            $rootScope.staffName = data.value.name;
            $state.go('tables');
          } else {
            console.log(data.message);
          }
        });

    };
  }])

  .controller('TablesCtrl', ['$scope', '$rootScope', '$window', 'ManagerRes', function($scope, $rootScope, $window, ManagerRes) {
    ManagerRes.getTables().$promise.then(
      function (response) {
        if (response.success === "1") {
          $scope.tableAreas = response.value.data;
        } else {
          console.log(response.message);
        }
      }
    );

    $scope.TableSelected = function(tableArea, tableNumber) {
      $window.location.href = 'main.html#/coverpage/'+$rootScope.staffId+'/'+tableArea+'/'+tableNumber;
    };
  }]);


angular.module('AppIndex.services', [])

  .factory('ManagerRes', ['$resource', 'managerUrl',
    function($resource, managerUrl) {
      return $resource( managerUrl, {},
        {validateCreds: {method: 'GET', params: {action: "VALIDATECREDS", staffId: "@StaffId", staffPin: "@StaffPin"}},
         getTables: {method: 'GET', isArray:false, params: {action: "GETTABLES"}}
        }
      );
    }
  ])





  // I provide a request-transformation method that is used to prepare the outgoing
  // request as a FORM post instead of a JSON packet.
  .factory( "transformRequestAsFormPost",
    function() {

      // I prepare the request data for the form post.
      function transformRequest( data, getHeaders ) {
        var headers = getHeaders();
        headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
        return( serializeData( data ) );
      }

      // Return the factory value.
      return( transformRequest );


      // ---
      // PRVIATE METHODS.
      // ---


      // I serialize the given Object into a key-value pair string. This
      // method expects an object and will default to the toString() method.
      // --
      // NOTE: This is an atered version of the jQuery.param() method which
      // will serialize a data collection for Form posting.
      // --
      // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
      function serializeData( data ) {
        // If this is not an object, defer to native stringification.
        if ( ! angular.isObject( data ) ) {
          return( ( data == null ) ? "" : data.toString() );
        }

        var buffer = [];

        // Serialize each key in the object.
        for ( var name in data ) {
          if ( ! data.hasOwnProperty( name ) ) {
            continue;
          }

          var value = data[ name ];

          buffer.push(
            encodeURIComponent( name ) +
            "=" +
            encodeURIComponent( ( value == null ) ? "" : value )
          );

        }

        // Serialize the buffer and clean it up for transportation.
        var source = buffer
            .join( "&" )
            .replace( /%20/g, "+" )
          ;

        return( source );

      }

    }
  );
