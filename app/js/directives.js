/* Directives */
angular.module('lesMatildesDirectives', [])

    .directive('mastheadNavigationMenu', ['$log', function ($log) {
        return {
            restrict: 'E',
            templateUrl: "../partials/masthead.html"
        };
    }])

    .directive('subNavigationMenu', ['$log', function ($log) {
        return {
            restrict: 'E',
            templateUrl: "../partials/navigation-menu.html",
        };
    }])

    .directive('carritoItem', ['$log', 'carrito', function ($log, carrito) {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: "../partials/carrito-item.html",
            scope: {
                item: '='
            },
            link: function (scope, el, attrs) {
            }

        };
    }])

    .directive("matildesArticulo", ['$log', 'carrito', function ($log, carrito) {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: "../partials/item.html",
            scope: {
                item: "="
            },
            link: function (scope) {

                scope.decItem = function () {
                    carrito.removeItem(scope.item);
                    //scope.current = carrito.getThis(sc.item.file);
                };

                scope.incItem = function () {
                    carrito.addItem(scope.item);
                    //scope.current = carrito.getThis(sc.item.file);
                };
                
                scope.like = function () {
                    scope.byme = true;
                    carrito.addLike(scope.item);
                };

                // $timeout(function () {
                //     var image = document.getElementById("matildes-" + scope.item.file + "-img");
                //     $log.log(image);
                //     var downloadingImage = new Image();
                //     downloadingImage.onload = function(){
                //         image.src = this.src;
                //         // image.data = this.data;
                //     };
                //     downloadingImage.src = "imgs/items/" + scope.item.file;
                // }, 0);
            }
        };
    }])

    .directive("matildesCalendar", ['$log', function ($log) {
        var marked = [];
        return {
            restrict: "E",
            templateUrl: "partials/calendar.html",
            scope: {
                selected: "=",
                events: "="
            },
            link: function (scope) {
                scope.$watch("events", function (newDates) {
                    if (newDates) {
                        marked = newDates;
                        scope.same();
                    }
                });

                // scope.selected = _removeTime(scope.selected || moment());
                scope.month = scope.selected.clone();

                var start = scope.selected.clone();
                start.date(1);
                _removeTime(start.day(0));

                _buildMonth(scope, start, scope.month);

                scope.select = function (day) {
                    scope.selected = day.date;
                    if (day.isEvent) {
                        // Look for the selected events
                        scope.eventsThatDay = [];
                        for (var i = 0; i < marked.length; i++) {
                            var markedEvent = marked[i];
                            if (day.date.isSame(new Date(markedEvent.date), "day")) {
                                scope.eventsThatDay.push(markedEvent);
                            }
                        }
                        // Open a modal with the event details
                        //     $uibModal.open({
                        //        animation: true,
                        //        scope: scope,
                        //        template: '<div class=modal-header><h3 class=modal-title>Event details</h3></div>' +
                        //        '<div class=modal-body>' +
                        //        '  <div ng-repeat="event in eventsThatDay">' +
                        //        '    <p>{{event.date | date:"fullDate"}}. {{event.event}} {{event.place}} (<a ng-if="event.external.link" href="event.external.link">{{event.external.text}}</a><span ng-if="!event.external.link">{{event.external.text}}</span>)</p>' +
                        //        '  </div>' +
                        //        '</div>' +
                        //        '<div class=modal-footer><button class="btn btn-primary" type=button onclick="angular.element(this).scope().$dismiss()">Close</button></div>',
                        //        size: 'm'
                        //      });
                    } else {
                        //     $uibModal.open({
                        //         animation: true,
                        //         scope: scope,
                        //         template: '<div class=modal-header><h3 class=modal-title>No events this day</h3></div>' +
                        //         '<div class=modal-body>' +
                        //         '  <div>There is no event planned for this day. If you want to organize a training session in your institution please <a href="mailto:support@targetvalidation.org">contact us</a></div>' +
                        //         '</div>' +
                        //         '<div class=modal-footer><button class="btn btn-primary" type=button onclick="angular.element(this).scope().$dismiss()">Close</button></div>'
                        //     });
                    }
                };

                scope.same = function () {
                    var same = scope.month.clone();
                    _removeTime(same.month(same.month()).date(1));
                    scope.month.month(scope.month.month());
                    _buildMonth(scope, same, scope.month);
                };

                scope.next = function () {
                    var next = scope.month.clone();
                    _removeTime(next.month(next.month() + 1).date(1));
                    scope.month.month(scope.month.month() + 1);
                    _buildMonth(scope, next, scope.month);
                };

                scope.previous = function () {
                    var previous = scope.month.clone();
                    _removeTime(previous.month(previous.month() - 1).date(1));
                    scope.month.month(scope.month.month() - 1);
                    _buildMonth(scope, previous, scope.month);
                };
            }
        };

        function _removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }

        function _buildMonth(scope, start, month) {
            scope.weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
            while (!done) {
                scope.weeks.push({days: _buildWeek(date.clone(), month)});
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }

        function eventThisDay(day) {
            for (var i = 0; i < marked.length; i++) {
                var m = marked[i];
                for (var j = 0; j < m.fechas.length; j++) {
                    if (day.isSame(new Date(m.fechas[j]), "day")) {
                        return true;
                    }
                }
            }
            return false;
        }

        function _buildWeek(date, month) {
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    isEvent: eventThisDay(date),
                    date: date
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }
    }])
    .directive('cardPayment', ['$log', 'carrito', '$http', '$modal', function ($log, carrito, $http, $modal) {
        'use strict';

        return {
            restrict: "E",
            templateUrl: 'partials/card-payment.html',
            scope: {},
            link: function (scope, el, attrs) {
                var currCarrito = carrito.getCarrito();
                var total = ~~currCarrito.totalPrice * 100
                var items = currCarrito.total;


                scope.passThis = 123;

                var handler = StripeCheckout.configure({
                    key: 'pk_test_ubYTr1H1AAlLOM96g5rGw1mb',
                    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                    locale: 'auto',
                    shippingAddress: true,
                    token: function (token) {
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        var orderDetails = [];
                        orderDetails.totalPrice = currCarrito.totalPrice.toFixed(2);
                        orderDetails.total = currCarrito.total;
                        for (var i = 0; i < currCarrito.items.length; i++) {
                            var item = currCarrito.items[i];
                            if (item.n) {
                                orderDetails.push(item);
                            }
                        }
                        scope.orderId = Math.floor((Math.random()*1000000)+1);
                        var url = 'https://wt-emepyc-gmail-com-0.run.webtask.io/lesMatildes-test';
                        // var url = 'http://127.0.0.1:8915';
                        var stripeData = {
                            currency: 'eur',
                            amount: total,
                            stripeToken: token.id,
                            order: orderDetails,
                            orderId: scope.orderId,
                            email: token.email
                        };
                        scope.email = token.email;
                        var waitModal = $modal.open({
                            template: '<div class="modal-wait"><i class="fa fa-spinner fa-2x faa-spin animated"></i></div>'
                        });
                        $http.post(url, stripeData)
                            .then(function (resp) {
                                scope.paymentOk = true;
                                // Send notification using gunmail
                                // var orderDetails = [];
                                // orderDetails.totalPrice = currCarrito.totalPrice.toFixed(2);
                                // orderDetails.total = currCarrito.total;
                                // for (var i=0; i<currCarrito.items.length; i++) {
                                //     var item = currCarrito.items[i];
                                //     if (item.n) {
                                //         orderDetails.push(item);
                                //     }
                                // }
                                // var order = {
                                //     "pedidoId": 555555,
                                //     "pedidoDetails": orderDetails
                                // };
                                // $log.log("order");
                                // $log.log(order);
                                //
                                // $http.post('http://localhost:6974', order)
                                //     .then (function (resp) {
                                //         $log.log("notification ok");
                                //         $log.log(resp);
                                //     }, function (err) {
                                //         $log.log("notification failed!!");
                                //         scope.notificationFailed = true;
                                //     });
                                //

                                // Open a modal to thank the purchase
                                waitModal.close();
                                var modalInstance = $modal.open({
                                    template: '<h3>¡Gracias!</h3>' +
                                    '<div>Tu compra ha sido realizada con éxito</div>' +
                                    '<div>Éste es tu número de pedido: {{orderId}}</div>' +
                                    '<div>Te hemos enviado un correo electrónico a {{email}} confirmando tu compra</div>' +
                                    '<div>No dudes en ponerte en contacto con nosotros si tienes cualquier duda</div>' +
                                    '<a class="close-reveal-modal" ng-click="cancel()">&#215;</a>',
                                    scope: scope
                                });
                                scope.cancel = function () {
                                    modalInstance.dismiss('cancel');
                                };

                                // Reset the cart
                                // scope.paymentSuccess = scope.orderId;
                                carrito.resetPayment();
                            }, function (err) {
                                scope.paymentFailed = true;
                            });
                    }
                });

                el[0].addEventListener('click', function (e) {
                    // Open Checkout with further options:
                    handler.open({
                        name: 'Les Matildes',
                        description: items + ' artículos',
                        zipCode: true,
                        currency: 'eur',
                        amount: total
                    });
                    e.preventDefault();
                });

                // Close Checkout on page navigation:
                window.addEventListener('popstate', function () {
                    handler.close();
                });
            }
        };
    }]);
