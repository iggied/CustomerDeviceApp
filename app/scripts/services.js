'use strict';
angular.module('RestaurantApp.services', [])


.factory('Menus', ['$resource',
    function($resource){

        function calcDiscount(response) {
            var key1, key2, data = response.data;
            for (key1 in data) {
                for (key2 in data[key1].priceCat) {
                    data[key1].priceCat[key2].discountRate = Math.round(data[key1].priceCat[key2].basicRate * 0.85);
                }
            }

            return response.resource;
        }


        return $resource('res/appdata/Restaurantmenu.json', {},
            {query: {method: 'GET', isArray: true, interceptor: {response: calcDiscount }}}
        );
    }
])


.service('CustomerSvc', ['$window',
    function($window){

        this.getCustomer = function( mobile ) {
            return angular.fromJson(localStorage.getItem('cust.' + mobile));
        }

        this.setCustomer = function( customer ) {
            localStorage.setItem('cust.' + customer.mobile, JSON.stringify(customer));
        }

        this.checkLogin = function( mobile, surName ) {
            var cust = this.getCustomer( mobile );
            return ( cust.mobile == mobile && cust.surName == surName );
        }


    }
])

.service('LoginSvc', ['$state', '$rootScope', '$ionicModal', '$timeout', 'CustomerSvc', 'DialImage', 'VerificationStatus', '$firebase',
            function ($state, $rootScope, $ionicModal, $timeout, CustomerSvc, DialImage, VerificationStatus, $firebase) {

    this.setLoginModal = function(modal) {
        this.loginModal = modal;
    };

    this.getLoginModal = function(){
        return this.loginModal
    };

    this.initialize = function() {
        var parent = this;
        $ionicModal.fromTemplateUrl('login-modal.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            parent.setLoginModal(modal);

            modal.scope.close = function() {
                modal.hide();
            };

            modal.scope.custLoginInput = {
                mobile: '',
                pin: ''};

            modal.scope.login = function() {
                //if (CustomerSvc.checkLogin(modal.scope.custLoginInput.mobile, modal.scope.custLoginInput.pin )) {
                    $rootScope.customerName = CustomerSvc.getCustomer(modal.scope.custLoginInput.mobile).firstName;
                    modal.hide();
                    $state.go(parent.getNextState(), {customerName: $rootScope.customerName, clearHistory: true});
                //}
            };

            modal.scope.dialImageRes = {} ;
            modal.scope.verificationStatusRes = {} ;
            modal.scope.inAPIcall = 0;

            modal.scope.firebaseData = {};

            modal.scope.verify = function() {
                modal.scope.inAPIcall = 1;
                DialImage.post({mobile_no: modal.scope.custLoginInput.mobile},
                    function (data) {
                        parent.getLoginModal().scope.dialImageRes = data;

                        var ref = new Firebase("https://boiling-fire-4418.firebaseio.com/crn/"+data.SessionId.substr(3));

                        ref.once('child_added', function(dataSnapshot){ parent.getLoginModal().scope.login(); });

//                        var sync = $firebase(ref);
//                        modal.scope.firebaseData = sync.$asObject();


                        //data.ImageUrl,data.SessionId
                    })

/*
                     .$promise.then( function(data) {
                        return $timeout(function () {
                            parent.getLoginModal().scope.checkStatus(data.SessionId);
                        }, 25000)})
                    .then( function() {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function (data) {
                        if (parent.getLoginModal().scope.verificationStatusRes.VerificationStatus != "VERIFIED") {
                            return $timeout(function () {
                                parent.getLoginModal().scope.checkStatus(parent.getLoginModal().scope.dialImageRes.SessionId);
                            }, 5000)
                        }})
                    .then(function () {
                        modal.scope.inAPIcall = 0;
                    })
*/
            };

            modal.scope.checkStatus = function(sessionId)
            {
                VerificationStatus.post( { sessionId : sessionId },
                    function(data) {
                        parent.getLoginModal().scope.verificationStatusRes = data;
                        if (data.VerificationStatus === "VERIFIED") {
                            parent.getLoginModal().scope.login();
                        }
                    }
                )
            };

        });
    };




    this.setNextState = function(state) {
        this.nextState = state;
    };

    this.getNextState = function() {
        return this.nextState;
    }

    this.openLoginModal = function(nextState) {
        this.setNextState( nextState );
        this.loginModal.show();
    };



/*
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            this.loginModal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
*/


    }])

.factory('DialImage', ['$resource',
    function($resource){
        return $resource('http://project-one-ek.appspot.com/getimage', {phone_number: "@mobile_no" }, {post: {method: 'POST'}}
        );
    }
])

.factory('VerificationStatus', ['$resource',
    function($resource){
        return $resource('http://project-one-ek.appspot.com/verificationstatus', { SID : "@sessionId" }, {post: {method: 'POST'}}
        );
    }
])




.service('RegisterSvc', ['$state', '$rootScope', '$ionicModal', 'CustomerSvc',
                function ($state, $rootScope, $ionicModal, CustomerSvc) {

    this.setRegisterModal = function(modal) {
        this.registerModal = modal;
    };

    this.getRegisterModal = function(){
        return this.registerModal
    };

    this.initialize = function() {
        var parent = this;
        $ionicModal.fromTemplateUrl('register-modal.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            parent.setRegisterModal(modal);

            modal.scope.close = function() {
                modal.hide();
            };

            modal.scope.customerInput = {
                firstName: '',
                surName: '',
                email: '',
                mobile: '',
                pinCode: '',
                gender: '',
            };

            modal.scope.register = function() {
                CustomerSvc.setCustomer(modal.scope.customerInput);
//                $rootScope.customerName = modal.scope.customerInput.firstName;
                modal.hide();
                $state.go('firstpage.registercomplete', {customerName: modal.scope.customerInput.firstName});
            };

            modal.scope.skipToMenu = function() {
                modal.hide();
                $state.go('tab.menus', {customerName: modal.scope.customerInput.firstName});
            };
        });
    };


    this.setNextState = function(state) {
        this.nextState = state;
    };

    this.getNextState = function() {
        return this.nextState;
    }

    this.openRegisterModal = function(nextState) {
        this.setNextState( nextState );
        this.registerModal.show();
    };

}])



.service('OrderSvc', function () {

    this.setOrder = function (order) {
        this.$order = order;
    }

    this.getOrder = function(){
        return this.$order;
    }

    this.addItem = function (menuItem, priceCat) {
        if (!priceCat.quantity) priceCat.quantity = 1;
        priceCat.quantity = parseInt(priceCat.quantity);

        var inOrder = this.itemInOrder(menuItem.itemId, priceCat.catCode)

        if (inOrder !== false){
            this.quantity(inOrder, priceCat.quantity);
        } else {

            var i = {
                itemId: menuItem.itemId,
                itemName: menuItem.itemName,
                itemDescription: menuItem.itemDescription,
                priceCatCode: priceCat.catCode,
                basicRate: priceCat.basicRate,
                discount: priceCat.discount,
                discountRate: priceCat.discountRate,
                quantity: priceCat.quantity,
                instructions: "",
                data: ""
            };

            this.$order.push(i);
        };

        this.$saveOrder();
    };


    this.reduceItem = function (menuItem, priceCat) {
        if (!priceCat.quantity) priceCat.quantity = 1;
        priceCat.quantity = parseInt(priceCat.quantity);

        var inOrder = this.itemInOrder(menuItem.itemId, priceCat.catCode)

        if (inOrder !== false) {
            if (inOrder.quantity <= 1) {
                this.removeItem(this.getOrder().indexOf(inOrder));
            } else {
                this.quantity(inOrder, -priceCat.quantity);
            }
        }

        this.$saveOrder();
    };


    this.quantity = function (item, offset) {
        var quantity = (item.quantity || 0) + offset;
        if (quantity < 1) quantity = 1;
        item.quantity = quantity;
    }

    this.itemInOrder = function (itemId, priceCatCode) {
        var a =  _.findWhere(this.getOrder(), {itemId:itemId, priceCatCode: priceCatCode});
        if (a === undefined) return false
        else return a;
    }

    this.totalLineItems = function () {
        return this.getOrder().length;
    }

    this.getBasicTotal = function(){
        var total = 0;
        angular.forEach(this.getOrder(), function (item) {
            total += (item.basicRate * item.quantity);
        });
        return total;
    }

    this.getDiscountedTotal = function(){
        var total = 0;
        angular.forEach(this.getOrder(), function (item) {
            total += ((item.discountRate) /*-item.discount)*/ * item.quantity);
        });
        return Math.round(total);
    }



    this.totalCost= function () {
        var tax = (!this.getTax() ? 0 : this.getTax());
        return this.getSubTotal() + tax;
    }



    this.removeItem = function (index) {
        this.$order.splice(index, 1);
        this.$saveOrder(this.$order);
    }

    this.empty = function () {
        this.$order = [];
        localStorage.removeItem('RestaurantOrder');
    }

    this.$saveOrder = function () {
        localStorage.setItem('RestaurantOrder', JSON.stringify(this.getOrder()));

    }

});

