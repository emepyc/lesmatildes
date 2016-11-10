var webappFiles = {
    // 3rd party libs
    'thirdParty': {
        'js': [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-foundation/mm-foundation-tpls.min.js',
            'bower_components/angulartics/dist/angulartics.min.js',
            'bower_components/angulartics/dist/angulartics-piwik.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/slick-carousel/slick/slick.min.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'bower_components/ngmap/build/scripts/ng-map.min.js'
        ],

        // 'css': [
        //     'bower_components/foundation/css/foundation.min.css'
        // ],
        'cssCopyDir': [
            'bower_components/components-font-awesome/**/*'
        ]
    },

    'cttv': {
        'js': [
            // Our angular stuff
            'app/js/app.js',
            'app/js/services.js',
            'app/js/controllers.js',
            'app/js/directives.js'
        ],

        'css': [
            'app/css/index.scss'
        ]
    },

};
module.exports = exports = webappFiles;
