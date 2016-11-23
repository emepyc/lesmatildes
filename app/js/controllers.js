/* Controllers */
var ctrls = angular.module('lesMatildesCtrls', []);

ctrls.controller('HomeCtrl', ['$scope', '$log', 'news', '$sce', function ($scope, $log, news, $sce) {
        'use strict';

        // slick initialisation
        $('.slider').slick({
            arrow: false,
            autoplay: true,
            fade: true,
            dots: true
        });

        // read news file
        news.fetch
            .then(function (resp) {
                moment.locale('es');
                var today = moment();
                var currentNews = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var news = resp.data[i];
                    if (today.isBefore(news.expiry)) {
                        news.formattedDate = moment(news.date).format("LL");
                        news.formattedMsg = $sce.trustAsHtml(news.message);
                        currentNews.push(news);
                    }
                }
                $scope.news = currentNews;
            });

        // read courses file
        // courses.fetch
        //     .then (function (resp) {
        //         $scope.cursos = resp.data;
        //     });
        // moment.locale('es');
        // $scope.day = moment();
    }])

    .controller('ContactoCtrl', ['$scope', '$log', 'NgMap', function ($scope, $log, NgMap) {
        'use strict';
        // Google maps
        NgMap.getMap().then(function (map) {
            // $scope.map = map;
        });
    }])

    .controller('MastheadCtrl', ['$scope', '$log', function ($scope, $log) {
        'use strict';
    }])

    .controller('CheckoutCtrl', ['$scope', '$log', 'carrito', '$http', function ($scope, $log, carrito, $http) {
        'use strict';

        var total = 0;

        // Stripe Response Handler
        $scope.stripeCallback = function (code, result) {
            if (result.error) {
                $log.log('it failed! error: ' + result.error.message);
            } else {
                $log.log('success! token: ' + result.id);
                $log.log(result);
                //var baseUrl = 'https://wt-emepyc-gmail-com-0.run.webtask.io/lesMatildes-test?webtask_no_cache=1&'
                var url = 'https://wt-emepyc-gmail-com-0.run.webtask.io/lesMatildes-test?webtask_no_cache=1&amount=' + (total*100) + '&currency=eur' + '&stripeToken=' + result.id;
                $log.log(url);
                $http.get(url)
                    .then (function (resp) {
                        $log.log(resp);
                        $scope.transactionOk = true;
                    }, function () {
                        $scope.transactionWrong = true;
                    });
            }
        };


        $scope.carrito = carrito.getCarrito();

    }])

    .controller('NavCtrl', ['$scope', '$log', '$location', 'carrito', function ($scope, $log, $location, carrito) {
        'use strict';
        $scope.page = $location.path().substring(1);
        $scope.$on("$locationChangeSuccess", function () {
            $scope.page = $location.path().substring(1);
        });
        // $scope.itemsInCart = carrito.getCarrito();

    }])

    .controller('CursosCtrl', ['$scope', '$log', 'courses', '$sce', function ($scope, $log, courses, $sce) {
        moment.locale('es');
        $scope.day = moment();
        courses.fetch
            .then(function (resp) {
                var today = moment();
                var cursos = resp.data;
                for (var i = 0; i < cursos.length; i++) {
                    var curso = cursos[i];
                    curso.formattedDesc = $sce.trustAsHtml(curso.descripcion);
                    if (today.isBefore(curso.fechas)) {
                        curso.caducado = false;
                    } else {
                        curso.caducado = true;
                    }
                }
                $scope.cursos = cursos;
            });
    }])


    .controller('ArticulosCtrl', ['$scope', '$log', 'carrito', function ($scope, $log, carrito) {

        $scope.addRemoveTag = function (tag) {
            $scope.showedTags[tag] = !$scope.showedTags[tag];

            // If we don't have any tag selected, show all
            var nTags = 0;
            for (var thisTag in $scope.showedTags) {
                if ($scope.showedTags[thisTag]) {
                    nTags++;
                }
            }

            if (!nTags) {
                $scope.showedItems = $scope.items;
                return;
            }

            // If we have tags, show the items that have them
            var showedItems = [];
            for (var i = 0; i < $scope.items.length; i++) {
                var item = $scope.items[i];
                var showIt = false;
                for (var key in $scope.showedTags) {
                    if ($scope.showedTags.hasOwnProperty(key)) {
                        if (hasTag(item, key) && $scope.showedTags[key]) {
                            showIt = true;
                            break;
                        }
                    }
                }
                // item.showMe = showIt;
                if (showIt) {
                    showedItems.push(item);
                }
            }
            $scope.showedItems = showedItems;
        };

        var carrito = carrito.getCarrito();
        $log.log("this is the cart to show...");
        $log.log(carrito);
        $scope.items = carrito.items;

        $scope.showedItems = $scope.items;
        $scope.showedTags = carrito.tags;

        function hasTag(item, tag) {
            for (var i = 0; i < item.tags.length; i++) {
                if (item.tags[i] === tag) {
                    return true;
                }
            }
            return false;
        }
    }]);
