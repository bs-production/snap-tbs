angular.module('starter', ['ionic','ngCordova', 'ngFileUpload', 'base64'])

  .run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.newsletter', {
    url: "/newsletter",
    views: {
      'menuContent': {
        templateUrl: "templates/newsletter.html",
         controller: 'PostsCtrl'
      }
    }
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
         controller: 'loginCtrl'
      }
    }
  })

  .state('app.ba', {
    url: "/ba",
    views: {
      'menuContent': {
        templateUrl: "templates/ba.html",
        controller: 'imgController'
      }
    }
  })

  .state('app.firebase', {
    url: "/firebase",
    views: {
      'menuContent': {
        templateUrl: "templates/firebase.html",
        controller: 'FirebaseController'
      }
    }
  })
    .state('app.dashboard', {
      url: "/dashboard",
      views: {
        'menuContent': {
          templateUrl: "templates/dashboard.html",
          //controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.photogallery', {
    url: "/photogallery",
    views: {
      'menuContent': {
        templateUrl: "templates/photogallery.html",
        controller: 'SecureController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});


 



