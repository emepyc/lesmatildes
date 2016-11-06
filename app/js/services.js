/* Services */

var services = angular.module('lesMatildesServices', []);

services
    .factory('courses', ['$log', '$http', function ($log, $http) {
        // Reads the courses from the appropriate url and returns a promise with the object.
        $log.log("reading courses file from fs");
        var coursesPromise = $http.get('/cursos.json');
        return {
            fetch: coursesPromise
        };
    }])
    .factory('items', ['$log', '$http', function ($log, $http) {
        $log.log("reading items file from fs");
        var itemsPromise = $http.get('/items.json');
        return {
            fetch: itemsPromise
        };
    }]);
