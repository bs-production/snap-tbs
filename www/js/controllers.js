var myApp = angular.module('starter.controllers', ['ngCordova']);

myApp.controller('AppCtrl', function($scope, $http,  $timeout) {

});


myApp.controller('loginCtrl', function($scope, $http, $ionicModal, $timeout, $state, $filter) {
  
// Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
   // console.log('Doing login', $scope.loginData.email, $scope.loginData.password);

    $http({
          method: 'POST',
          url: 'https://api.teambasementsystems.com/tbsauth/',
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: 'email=' + encodeURIComponent($scope.loginData.email) +
                '&password=' + encodeURIComponent($scope.loginData.password)
               

        })
      .success(function(data) {
          // this callback will be called asynchronously
          // when the response is available
           if (data.isLoggedIn === true) {
            swal("Good job!", "You now loggedin!", "success");
            $state.go("app.dashboard");
            console.log(data.message);
          }
          else {
              sweetAlert(data.message);
          }
        });

      

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
     $timeout(function() {
       $scope.closeLogin();
     }, 1000);
  };
  

});

 
myApp.controller('imgController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, ImageService, FileService) {
 
  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });
 
  $scope.urlForImage = function(imageName) {
    var trueOrigin = cordova.file.dataDirectory + imageName;
    return trueOrigin;
  }
 
  $scope.addMedia = function() {
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Upload Images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  }
  
 
});

myApp.controller("PostsCtrl", function($scope, $http) {
   //Get profile information
  $http.get('https://api.teambasementsystems.com/newsletters/').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(data);
      $scope.titles = data;
    }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
});





