'use strict';
angular.module('AppMain', ['ionic', 'config', 'ngResource', 'AppMain.controllers', 'AppMain.services'])

  .run(function($rootScope, $ionicPlatform, $ionicPopup, $window, OrderSvc, LoginSvc, RegisterSvc) {
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

    OrderSvc.setOrder([]);
    LoginSvc.initialize();
    RegisterSvc.initialize();

    $rootScope.programName = 'i benefit';
    $rootScope.programFee = 650;
    $rootScope.customerName = '';

/*    $rootScope.confirmAndGoHome =  function() {

      var p = $ionicPopup.confirm({
        title: OrderSvc.totalLineItemsPending() ? 'The selected items will be cleared' : 'Close App' ,
        template: 'Sure you want to close app?'
      });

        p.then(function (res) {
          if (res) {
            OrderSvc.empty();
            $window.location.href = 'index.html';
          } else {
            console.log('do not want to close app');
            p.close();
          }
        })
    };*/

  })

//  .constant('managerUrl', 'http://10.0.1.2:8080/outlet/serve')
  .constant('managerUrl', 'http://192.168.56.101:8080/outlet/serve')

  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider
      .tabs.position('bottom');
    $ionicConfigProvider
      .navBar.alignTitle('center');

    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'tabs.html'
      })

      .state('coverpage', {
        url: '/coverpage/:staffId/:tableArea/:tableNumber',
        views: {
          '@': {
            templateUrl: 'coverpage.html',
            controller: 'CoverPageCtrl'
          }
        }
      })

      .state('firstpage', {
        url: '/firstpage',
        views: {
          '@': {
            templateUrl: 'firstpage.html',
            controller: 'FirstPageCtrl'
          }
        }
      })

      .state('firstpage.registercomplete', {
        url: '/registercomplete/:customerName',
        views: {
          '@': {
            templateUrl: 'register-complete.html',
            controller: 'RegisterCompleteCtrl'
          }
        }
      })

      .state('tab.menus', {
        url: '/menus/:customerName/:clearHistory',
        views: {
          'menu-tab': {
            templateUrl: 'menus.html',
            controller: 'MenusCtrl'
          }
        }
      })

      .state('tab.itemlist', {
        url: '/itemlist/:catCode/:searchInput',
        views: {
          'menu-tab': {
            templateUrl: 'menu-itemlist.html',
            controller: 'ItemListCtrl'
          }
        }
      })

      .state('tab.viewitem', {
        url: '/viewitem/:itemId/:priceCatCode',
        views: {
          'menu-tab': {
            templateUrl: 'view-item.html',
            controller: 'ViewItemCtrl'
          }
        }
      })


      .state('tab.vieworder', {
        url: '/vieworder',
        views: {
          'menu-tab': {
            templateUrl: 'view-order.html',
            controller: 'ViewOrderCtrl'
          }
        }
      })


      .state('tab.chefcorner', {
        url: '/chefcorner/:customerName/:clearHistory',
        views: {
          'chef-corner': {
            templateUrl: 'chefcorner.html'
          }
        }
      })

      .state('tab.softdrinks', {
        url: '/softdrinks/:customerName/:clearHistory',
        views: {
          'soft-drinks': {
            templateUrl: 'softdrinks.html'
          }
        }
      })

      .state('tab.barcounter', {
        url: '/barcounter/:customerName/:clearHistory',
        views: {
          'bar-counter': {
            templateUrl: 'barcounter.html'
          }
        }
      })

      .state('tab.specialoffer', {
        url: '/specialoffer/:customerName/:clearHistory',
        views: {
          'special-offer': {
            templateUrl: 'specialoffer.html'
          }
        }
      })

      .state('tab.myfavourites', {
        url: '/myfavourites/:customerName/:clearHistory',
        views: {
          'myfavourites': {
            templateUrl: 'myfavourites.html'
          }
        }
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })


  .directive('ibenefitSavings', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'ibenefit-savings.html',
        link: function(scope) {
          scope.totalSavings = function () {
            var restTotal = scope.avgSpendsAtRestaurants * scope.noOfVisits * 12;
            var homeTotal = scope.avgSpendsOnHomeOrder * scope.noOfHomeOrders * 12;
            var bothTotal = parseInt(((isNaN(restTotal)?0:restTotal) + (isNaN(homeTotal)?0:homeTotal)) * .15) ;

            if (bothTotal < 650) {
              return 0;
            } else {
              return bothTotal;
            }
            /*                        if (scope.lastTouched == "") {
             return "";   //"Touch the questions to input values" ;
             } else {
             return "";   //"Use this number pad to input values" ;
             }
             } else {
             return "You can save Rs." + bothTotal + "* /year and recover the cost of membership the " + noOfTimes + " time you book your order using i benefit"  ;
             }
             */

          };

          scope.approxNoOfTimes = function() {
            var noOfTimes = Math.ceil(650 / (Math.max(isNaN(scope.avgSpendsAtRestaurants)?0:scope.avgSpendsAtRestaurants, isNaN(scope.avgSpendsOnHomeOrder)?0:scope.avgSpendsOnHomeOrder) * .15));

            var s=["th","st","nd","rd"], v=noOfTimes%100;
            noOfTimes = noOfTimes + (s[(v-20)%10]||s[v]||s[0]);

            return noOfTimes ;
          }

          scope.lastTouched = "NVR";

          scope.touchedASR = function() {
            scope.lastTouched = scope.lastTouched == "ASR" ? "" : "ASR";
          };

          scope.touchedNVR = function() {
            scope.lastTouched = scope.lastTouched == "NVR" ? "" : "NVR";
          };

          scope.touchedASH = function() {
            scope.lastTouched = scope.lastTouched == "ASH" ? "" : "ASH";
          };

          scope.touchedNVH = function() {
            scope.lastTouched = scope.lastTouched == "NVH" ? "" : "NVH";
          };

          scope.calcTouched = function(key) {
            var fieldVal = '' ;

            switch (scope.lastTouched) {
              case 'ASR' : fieldVal = scope.avgSpendsAtRestaurants; break;
              case 'NVR' : fieldVal = scope.noOfVisits; break;
              case 'ASH' : fieldVal = scope.avgSpendsOnHomeOrder; break;
              case 'NVH' : fieldVal = scope.noOfHomeOrders; break;
            }

            switch (key) {
              case '.' :
                if (fieldVal.length > 1) {
                  fieldVal = fieldVal.substr(0, fieldVal.length - 1);
                } else {
                  fieldVal = "";
                }
                break;
              case 'X':
                switch (scope.lastTouched) {
                  case 'ASR' : scope.lastTouched = 'NVH'; break;
                  case 'NVR' : scope.lastTouched = 'ASR'; break;
                  case 'ASH' : scope.lastTouched = ''; break;
                  case 'NVH' : scope.lastTouched = 'ASH'; break;
                }
                break;
              default : fieldVal = (fieldVal || "") + key;
                break;
            }

            if (key != 'X') {
              switch (scope.lastTouched) {
                case 'ASR' :
                  scope.avgSpendsAtRestaurants = fieldVal;
                  break;
                case 'NVR' :
                  scope.noOfVisits = fieldVal;
                  break;
                case 'ASH' :
                  scope.avgSpendsOnHomeOrder = fieldVal;
                  break;
                case 'NVH' :
                  scope.noOfHomeOrders = fieldVal;
                  break;
              }
            }

          }

        }
      };
    }
  )

  .directive('orderDetails', function(OrderSvc) {
    return {
      restrict : 'E',
      controller : ['$scope', '$rootScope', '$state', '$ionicPopup', function($scope, $rootScope, $state, $ionicPopup){
        $scope.orderSvc = OrderSvc;
        $scope.programName = $rootScope.programName;

        $scope.addItem = function(index){
          OrderSvc.quantity(OrderSvc.getOrder()[index], 1) ;
          OrderSvc.$saveOrder();
        };

        $scope.reduceItem = function(index){
          if (OrderSvc.getOrder()[index].quantity <= 1) {
            OrderSvc.removeItem(index) ;
          } else {
            OrderSvc.quantity(OrderSvc.getOrder()[index], -1) ;
          }
          OrderSvc.$saveOrder();
        };

        $scope.showItemDetails = function(itemId, priceCatCode) {
          $state.go('tab.viewitem', {itemId: itemId, priceCatCode: priceCatCode});
        };

        $scope.confirmOrder = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Order submission',
            okText: 'CONFIRM',
            template: 'Please touch CONFIRM to submit your order to the server. To change your order, please touch cancel'
          });
          confirmPopup.then(function (res) {
            if (res) {
              OrderSvc.placeOrder();
            }
          })
        };

      }],
      scope: {},
      templateUrl: 'order-details.html',
      link:function(scope, element, attrs){

      }
    };
  })

  .filter('objectToArray', function () {

    return function (obj) {
      if (!(obj instanceof Object)) {
        return obj;
      }

      return Object.keys(obj).map(function (key) {
        return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
      });
    }
  });

