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
        .then (function (resp) {
            moment.locale('es');
            var today = moment();
            var currentNews = [];
            for (var i=0; i<resp.data.length; i++) {
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
    NgMap.getMap().then(function(map) {
        // $scope.map = map;
    });
}])

.controller('MastheadCtrl', ['$scope', '$log', function ($scope, $log) {
    'use strict';
}])

.controller('NavCtrl', ['$scope', '$log', '$location', function ($scope, $log, $location) {
    $scope.page = $location.path().substring(1);
    $scope.$on("$locationChangeSuccess", function () {
        $scope.page = $location.path().substring(1);
    });
}])

.controller('CursosCtrl', ['$scope', '$log', 'courses', '$sce', function ($scope, $log, courses, $sce) {
    moment.locale('es');
    $scope.day = moment();
    courses.fetch
        .then (function (resp) {
            var today = moment();
            var cursos = resp.data;
            for (var i=0; i<cursos.length; i++) {
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

.controller('ArticulosCtrl', ['$scope', '$log', 'items', function ($scope, $log, items) {

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
        for (var i=0; i<$scope.items.length; i++) {
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

    $scope.items = [];
    items.fetch
        .then (function (resp) {
            return resp.data;
        })
        .then (function (items) {

            // Compile all the tags
            $scope.tags = {};

            for (var i=0; i<items.length; i++) {
                var item = items[i];
                item.showMe = true;

                for (var j=0; j<item.tags.length; j++) {
                    if (!$scope.tags[item.tags[j]]) {
                        $scope.tags[item.tags[j]] = 0;
                    }
                    $scope.tags[item.tags[j]]++;
                }
                $scope.items.push(item);
            }
            $scope.showedItems = $scope.items;

            // visibility of tags...
            $scope.showedTags = {};
            for (var thisTag in $scope.tags) {
                $scope.showedTags[thisTag] = false;
            }
        });

    function hasTag(item, tag) {
        for (var i=0; i<item.tags.length; i++) {
            if (item.tags[i] === tag) {
                return true;
            }
        }
        return false;
    }
}]);