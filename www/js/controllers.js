var myApp = angular.module('starter');

myApp.controller('AppCtrl', function($scope, $http,  $timeout) {

});


myApp.controller('loginCtrl', function($scope, $http, $ionicModal, $timeout, $state, $filter) {
  
// Form data for the login modal
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $http({
          method: 'POST',
          url: 'https://api.teambasementsystems.com/tbsauth/',
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: 'email=' + encodeURIComponent($scope.loginData.email) +
                '&password=' + encodeURIComponent($scope.loginData.password)
        })
      .success(function(data) {
           if (data.isLoggedIn === true) {
            swal("Good job!", "You now loggedin!", "success");
            $state.go("app.dashboard");
            console.log(data.message);
            localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
          }
          else {
              localStorage.clear();
              sweetAlert(data.message);
          }
        });

  };
  

});

 
myApp.controller('imgController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, ImageService, FileService) {
 
  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });
 

  $scope.urlForImage = function(imageName) {
    var trueOrigin =  imageName;
    return trueOrigin;
  };
 
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
  };
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  };
 
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





