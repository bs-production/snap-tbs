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
              localStorage.setItem('company', JSON.stringify(data.company));
          }
          else {
              localStorage.clear();
              sweetAlert(data.message);
          }
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


 
myApp.controller('imgController', function($scope, $http, $filter, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $ionicPlatform,  $ionicActionSheet, ImageService, FileService, Upload, $base64) {
 
  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });
 

$scope.urlForImage = function(imageName) {

     var name = imageName.substr(imageName.lastIndexOf('/') + 1);
     var trueOrigin = cordova.file.dataDirectory + name;
     $scope.newImg = trueOrigin;
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
  };
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  };



   $scope.megaUpload = function(file) {

 
 
 

 document.addEventListener('deviceready', function () {  

    $scope.imageData = {};
    $scope.imageData.accessToken = '1147-17e482216956aacccd7450b71f3e07b6';
    $scope.imageData.company = '1015';
    $scope.imageData.group = 'billbyob';
    

    console.log( $scope.newImg );
    console.log( JSON.stringify($scope.images[0]) );

    var fileURL =   JSON.stringify($scope.images[0]);   
    var uploadUrl = 'http://ryan.dev.basementsite.com/api/image/index2.php/upload';

     
    function getBase64Image(img1) { 
        var canvas = document.createElement("canvas");
        canvas.width = img1.naturalHeight;
        canvas.height = img1.naturalWidth;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img1, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

       var img1 = document.getElementById("object-0");
       var imgData = 'data:image/jpg;base64,' + getBase64Image(img1);

      console.log(imgData);


      $http({
              method: 'POST',
              debug: 1,
              url: uploadUrl,
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded'
               },
             data: 'accessToken=' + encodeURIComponent($scope.imageData.accessToken) +
                '&company=' + encodeURIComponent($scope.imageData.company) +
                '&group=' + encodeURIComponent($scope.imageData.group) +
                '&image_0=' + encodeURIComponent(imgData)
 
          }).
        success(function (data, status, headers, config) {

            console.log("success!");
            console.log(data);
            

        }).
        error(function (data, status, headers, config) {

              console.log("failed!");
               console.log(data);
            
        });



  });

     
 };
 
 

}); //end controller


 

 
 