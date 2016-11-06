/* Directives */
angular.module('lesMatildesDirectives', [])

    .directive('mastheadNavigationMenu', ['$log', function ($log) {
        return {
            restrict: 'E',
            templateUrl : "../partials/masthead.html",
        };
    }])

    .directive('subNavigationMenu', ['$log', function ($log) {
        return {
            restrict: 'E',
            templateUrl: "../partials/navigation-menu.html",
        };
    }])

    .directive("matildesArticulo", ['$log', '$timeout', function ($log, $timeout) {
        return {
            restrict: 'E',
            templateUrl: "../partials/item.html",
            scope: {
                item: "="
            },
            link: function (scope) {
                // $log.log("item in directive:");
                // $log.log(scope.item);

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

    .directive("matildesCalendar", ['$log', function($log) {
        var marked = [];
        return {
            restrict: "E",
            templateUrl: "partials/calendar.html",
            scope: {
                selected: "=",
                events: "="
            },
            link: function(scope) {
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

                scope.select = function(day) {
                    scope.selected = day.date;
                    if (day.isEvent) {
                        // Look for the selected events
                        scope.eventsThatDay = [];
                        for (var i=0; i<marked.length; i++) {
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

                scope.same = function() {
                    var same = scope.month.clone();
                    _removeTime(same.month(same.month()).date(1));
                    scope.month.month(scope.month.month());
                    _buildMonth(scope, same, scope.month);
                };

                scope.next = function() {
                    var next = scope.month.clone();
                    _removeTime(next.month(next.month()+1).date(1));
                    scope.month.month(scope.month.month()+1);
                    _buildMonth(scope, next, scope.month);
                };

                scope.previous = function() {
                    var previous = scope.month.clone();
                    _removeTime(previous.month(previous.month()-1).date(1));
                    scope.month.month(scope.month.month()-1);
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
                scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }

        function eventThisDay (day) {
            for (var i=0; i<marked.length; i++) {
                var m = marked[i];
                for (var j=0; j<m.fechas.length; j++) {
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
    }]);
