var app = angular.module('lesMatildesApp', [
  'ngRoute',
  'ngMap',
  'mm.foundation',
  'lesMatildesServices',
  'lesMatildesCtrls',
  'lesMatildesDirectives'
]);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: "partials/home.html",
                controller: 'HomeCtrl'
            })
            .when('/cursos', {
                templateUrl: "partials/cursos.html",
                controller: 'CursosCtrl'
            })
            .when('/articulos', {
                templateUrl: "partials/articulos.html",
                controller: 'ArticulosCtrl'
            })
            .when('/contacto', {
                templateUrl: "partials/contacto.html",
                controller: 'ContactoCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
}]);
