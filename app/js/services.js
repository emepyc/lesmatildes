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
    }])
    .factory('carrito', ['$log', '$http', 'items', function ($log, $http, items) {
        var carrito = {
            total: 0, // Items selected
            totalPrice: 0,
            items: [],
            tags: {}
        };
        items.fetch
            .then(function (resp) {
                return resp.data;
            })
            .then (function (items) {
                for (var i=0; i<items.length; i++) {
                    var item = items[i];
                    item.n = 0;
                    carrito.items.push(item);

                    // tags
                    for (var j=0; j<item.tags.length; j++) {
                        if (!carrito.tags[item.tags[j]]) {
                            carrito.tags[item.tags[j]] = false;
                        }
                        //carrito.tags[item.tags[j]]++;
                    }
                }
            });
        return {
            addItem: function (item) {
                for (var i=0; i<carrito.items.length; i++) {
                    var thisItem = carrito.items[i];
                    if (thisItem.file == item.file) {
                        thisItem.n++;
                        carrito.total++;
                        carrito.totalPrice += parseFloat(thisItem.price);
                        break;
                    }
                }
                //carrito.items[item.file].n++;
                //carrito.total++;
            },
            removeItem: function (item) {
                for (var i=0; i<carrito.items.length; i++) {
                    var thisItem = carrito.items[i];
                    if (thisItem.file == item.file) {
                        thisItem.n--;
                        carrito.total--;
                        carrito.totalPrice -= parseFloat(thisItem.price);
                        break;
                    }
                }
                //if (carrito.items[item.file]) {
                //    carrito.items[item.file].n--;
                //    carrito.total--;
                //}

                //if (carrito.items[item.file] == 0) {
                //    delete carrito[item.file];
                //}
            },
            getThis: function (filename) {
                for (var i=0; i<carrito.items.length; i++) {
                    var item = carrito.items[i];
                    if (item.file == filename) {
                        return item;
                    }
                }
                //return carrito.items[name];
            },
            getCarrito: function () {
                return carrito;
            },
            resetPayment: function () {
                carrito.totalPrice = 0;
                carrito.total = 0;
            }
        };
    }]);

