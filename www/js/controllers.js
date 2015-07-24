angular.module('starter.controllers', ['ngCordova', 'firebase'])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
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
    //console.log('Doing login', $scope.loginData);
     $http({
           method: 'POST',
           url: 'https://api.teambasementsystems.com/tbsauth/',
           params: { 
                'email' :   $scope.loginData.email,
                'password': $scope.loginData.password
               }
        })

      .success(function(data) {
          // this callback will be called asynchronously
          // when the response is available
          alert(data.message);
          $state.go("app.photogallery");
        }). 

      error(function(data) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
           alert("fail");
        });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
     $timeout(function() {
       $scope.closeLogin();
     }, 1000);
  };
  

})

 
.controller('imgController', function($scope, $cordovaCamera, $cordovaDevice, 
 $cordovaFile, $ionicPlatform,  $ionicActionSheet, ImageService, FileService) {
 
 //controller for before/after 
 
  $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.$apply();
   });
 
 $scope.urlForImage = function(imageName) {
  var name = imageName.substr(imageName.lastIndexOf('/') + 1);
  var trueOrigin = cordova.file.dataDirectory + name;
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
 
 })


.controller("FirebaseController", function($scope, $state, $firebaseAuth) {

    var fbAuth = $firebaseAuth(fb);

    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("app.photogallery");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("app.photogallery");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

})

//upload to firebase
.controller("SecureController", function($scope, $state, $ionicHistory, 
  $firebaseAuth , $firebaseArray, $cordovaCamera) {

    $ionicHistory.clearHistory();

    $scope.images = [];

   var fbAuth = fb.getAuth();
      if(fbAuth) {
       var userReference = fb.child("users/" + fbAuth.uid);
         var syncArray = $firebaseArray(userReference.child("images"));
         $scope.images = syncArray;
    } 
    else {
       $state.go("app.firebase");
      }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData}).then(function() {
                alert("Image has been uploaded");
            });
        }, function(error) {
            console.error(error);
        });
    }

})


.controller("PostsCtrl", function($scope, $http) {
   //Get profile information
  $http.get('https://teamtreehouse.com/chalkers.json').
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.badges = data.badges;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
});





