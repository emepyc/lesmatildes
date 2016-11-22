/* Services */

var services = angular.module('lesMatildesServices', []);

services
    .factory('courses', ['$log', '$http', function ($log, $http) {
        'use strict';

        // Reads the courses from the appropriate url and returns a promise with the object.
        var coursesPromise = $http.get('https://emepyc.github.io/lesmatildes/cursos.json');
        return {
            fetch: coursesPromise
        };
    }])
    .factory('items', ['$log', '$http', function ($log, $http) {
        'use strict';

        var itemsPromise = $http.get('https://emepyc.github.io/lesmatildes/items.json');
        return {
            fetch: itemsPromise
        };
    }])

    .factory('likes', ['$log', '$http', function ($log, $http) {
        'use strict';

        var likesPromise = $http.get('https://emepyc.github.io/lesmatildes/likes.json');
        return {
            fetch: likesPromise
        };
    }])

    .factory('news', ['$log', '$http', function ($log, $http) {
        'use strict';

        var newsPromise = $http.get('https://emepyc.github.io/lesmatildes/news.json');
        return {
            fetch: newsPromise
        };
    }])
    .factory('carrito', ['$log', '$http', 'items', 'likes', function ($log, $http, items, likes) {
        'use strict';

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
                    }
                }
                return likes.fetch;
            })
            .then (function (resp) {
                $log.log("likes here");
                $log.log(likes);
                var ls = resp.data;
                for (var name in ls) {
                    var n = ls[name];
                    for (var i=0; i<carrito.items.length; i++) {
                        var item = carrito.items[i];
                        if (name === item.name) {
                            item.likes = n;
                        }
                    }
                }
                $log.log(carrito);
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

            addLike: function (likedItem) {
                if (likedItem.likes) {
                    likedItem.likes++;
                } else {
                    likedItem.likes = 1;
                }
                $log.log("added like for " + likedItem.name);
                var itemsWithLikes = {};
                for (var i = 0; i < carrito.items.length; i++) {
                    var item = carrito.items[i];
                    if (item.likes) {
                        itemsWithLikes[item.name] = item.likes;
                    }
                }
                $http.post('https://wt-emepyc-gmail-com-0.run.webtask.io/lesMatildes-likes', itemsWithLikes)
                // $http.post('http://127.0.0.1:7729', itemsWithLikes)
                    .then (function (resp) {
                        // $log.log("resp from likes commit...");
                        // $log.log(resp);
                    }, function (err) {
                        if (err) {
                            $log.log('error from likes commit...');
                            $log.error(err);
                        }
                    });
            },

            resetPayment: function () {
                carrito.totalPrice = 0;
                carrito.total = 0;
            }
        };
    }]);

