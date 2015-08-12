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

 
myApp.controller('imgController', function($scope, $http, $filter, $cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, ImageService, FileService) {
 
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



   $scope.pushImage = function(type) {

    $scope.imageData = {};
    
    $scope.imageData.accessToken = '1147-289ec0fc9c5df3e83efca5593d5eab13';
    $scope.imageData.company = '1015';
    $scope.imageData.group = 'billbyob';

    console.log( JSON.parse(localStorage.getItem('images')) );
    console.log(  $scope.images[0]);

     $http({
          method: 'POST',
          url: 'https://api.teambasementsystems.com/image/upload/',
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: 'accessToken=' + encodeURIComponent($scope.imageData.accessToken) +
                '&company=' + encodeURIComponent($scope.imageData.company) +
                '&group=' + encodeURIComponent($scope.imageData.group) +
                '&filename=' + encodeURIComponent($scope.images[0])
      }).
      then(function(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
      }, function(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
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





