/* Services */

var services = angular.module('lesMatildesServices', []);

services
    .factory('courses', ['$log', '$http', function ($log, $http) {
        // Reads the courses from the appropriate url and returns a promise with the object.
        var coursesPromise = $http.get('https://emepyc.github.io/lesmatildes/cursos.json');
        return {
            fetch: coursesPromise
        };
    }])
    .factory('items', ['$log', '$http', function ($log, $http) {
        var itemsPromise = $http.get('https://emepyc.github.io/lesmatildes/items.json');
        return {
            fetch: itemsPromise
        };
    }])

    .factory('news', ['$log', '$http', function ($log, $http) {
        var newsPromise = $http.get('https://emepyc.github.io/lesmatildes/news.json');
        return {
            fetch: newsPromise
        };
    }]);
