'use strict';
angular.module('MainApp.controllers', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$state', 'LoginSvc', 'RegisterSvc',
                function($scope, $rootScope, $state, LoginSvc, RegisterSvc) {
    $scope.notifyGoHome = function() {
        $rootScope.$emit('want.to.go.home');
    }

    $scope.loggedIn = function(){
        return $rootScope.customerName || $rootScope.customerName != '';
    }

    $scope.notInMenu = function(){
        return $scope.loggedIn() || $state.$current.name.indexOf("tab") < 0;
    }

    $scope.openLoginModal = function() {
        LoginSvc.openLoginModal('tab.menus') ;   //$state.$current.name);
    }

    $scope.openRegisterModal = function() {
        RegisterSvc.openRegisterModal('tab.menus') ;   //$state.$current.name);
    }
}])




.controller('MenusCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', '$ionicViewService', '$window', 'OrderSvc',
                  function($scope, Menus, $state, $stateParams, $rootScope, $ionicViewService, $window, OrderSvc) {
    $scope.orderSvc = OrderSvc;
    $scope.menuCat = {};
    $rootScope.customerName = $stateParams.customerName;

    if ($stateParams.clearHistory) {
        $ionicViewService.clearHistory();
    }

    Menus.query( function(data) {
        $scope.menuCat = _.groupBy(data, function(item){ return item.itemCatCodes[0]; });
    });

    $scope.selectMenuCategory = function(catCodePara) {
        $state.go('tab.itemlist', {catCode: catCodePara, searchInput: ""});
    };

    $scope.viewOrder = function() {
      $state.go('tab.vieworder');
    };

    $scope.searchItems = function() {
        if ($scope.searchInput) {
            $state.go('tab.itemlist', {catCode: "", searchInput: $scope.searchInput});
        };
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
      cleanupFunction();
    });

 }])


.controller('ItemListCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', '$filter', 'OrderSvc',
                    function($scope, Menus, $state, $stateParams, $rootScope, $filter, OrderSvc) {

    $scope.selectedCatCode = $stateParams.catCode;
    $scope.searchInput = $stateParams.searchInput;
    $scope.orderSvc = OrderSvc;
    $scope.menuItems = [];

    if ($scope.selectedCatCode != "") {
        Menus.query(function (data) {
            $scope.menuItems = [ _.filter(data, function (menuItem) {
                return menuItem.itemCatCodes[0] === $scope.selectedCatCode
            }) ];
        })
    } else {
        if ($scope.searchInput != "") {
            Menus.query(function (data) {
                $scope.menuItems = _.groupBy( $filter('filter')(data, $scope.searchInput), function(item){ return item.itemCatCodes[0]; } ) ;
            })
        }
    };

    $scope.showItemDetails = function(itemId, priceCatCode) {
        $state.go('tab.viewitem', {itemId: itemId, priceCatCode: priceCatCode});
    };

    $scope.viewOrder = function() {
        $state.go('tab.vieworder');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])


.controller('ViewItemCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', 'OrderSvc',
                    function($scope, Menus, $state, $stateParams, $rootScope, OrderSvc) {
    $scope.orderSvc = OrderSvc;
    $scope.menuItem = {};
    $scope.priceCat = {};
    $scope.orderItem = $scope.orderSvc.itemInOrder($stateParams.itemId, $stateParams.priceCatCode);

    Menus.query(function(data) {
        $scope.menuItem = _.findWhere(data, { itemId: $stateParams.itemId });
        $scope.priceCat = _.findWhere($scope.menuItem.priceCat, {catCode: $stateParams.priceCatCode});
    })

    $scope.viewOrder = function() {
        $state.go('tab.vieworder');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])

.controller('ViewOrderCtrl', ['$scope', '$stateParams', '$rootScope', 'OrderSvc',
                    function($scope, $stateParams, $rootScope, OrderSvc) {
    $scope.orderSvc = OrderSvc;

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])


.controller('CoverPageCtrl', ['$scope', '$state', '$stateParams', '$rootScope',
    function($scope, $state, $stateParams, $rootScope) {
        $rootScope.staffId = $stateParams.staffId;
        $rootScope.selectedTableIndex = $stateParams.selectedTableIndex;
        $rootScope.tableNumber = $stateParams.tableNumber;

        $scope.ShowFirstPage = function(){
            $state.go('firstpage');

        }

        var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
            $rootScope.confirmAndGoHome()
        });

        $scope.$on('$destroy', function() {
            cleanupFunction();
        });

    }])


.controller('FirstPageCtrl', ['$scope', '$state', '$ionicModal', '$rootScope', 'LoginSvc', 'RegisterSvc',
        function($scope, $state, $ionicModal, $rootScope, LoginSvc, RegisterSvc) {


    $rootScope.customerName = '';

    $scope.showMenu = function() {
        $state.go('tab.menus');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });

    $scope.openLoginModal = function() {
        LoginSvc.openLoginModal('tab.menus');
    }

    $scope.openRegisterModal = function() {
        RegisterSvc.openRegisterModal($state.$current.name);
    }

}])

.controller('RegisterCompleteCtrl', ['$scope', '$state', '$stateParams', '$rootScope',
    function($scope, $state, $stateParams, $rootScope) {

        $rootScope.customerName = $stateParams.customerName;

        $scope.showMenu = function() {
            $state.go('tab.menus', {customerName: $stateParams.customerName});
        };

        var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
            $rootScope.confirmAndGoHome()
        });

        $scope.$on('$destroy', function() {
            cleanupFunction();
        });

}])

;


