var myApp = angular.module('starter');

myApp.controller('AppCtrl', function($scope, $http,  $timeout) {

});

myApp.controller('PlayCtrl', function($scope, $ionicSideMenuDelegate) {

 $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});

myApp.controller('loginCtrl', function($scope, $http, $ionicModal, $timeout, $state, $filter, $ionicSideMenuDelegate) {


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
              console.log(data.message);
              localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
              localStorage.setItem('company', JSON.stringify(data.company));
              localStorage.setItem('name', JSON.stringify(data.userName));
              $state.go("app.dashboard");
          }
          else {
              localStorage.clear();
              sweetAlert(data.message);
          }
        });
  };
});

myApp.controller("PostsCtrl", function($scope, $http, $ionicSideMenuDelegate, $state, $rootScope) {
   //Get profile information
 $scope.myNews = true;
   document.addEventListener('deviceready', function () {
         $http({
              method: 'GET',
                 url: 'https://api.teambasementsystems.com/newsletters/'
              }).success(function(data){
              // With the data succesfully returned, call our callback
                  $scope.titles = data;
                  console.log(data);    
            }).error(function(){
                alert("error");
            });
  });

$scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

$scope.newNews= function(href){
       $scope.myNews = false;
            // how to get the href
            $http.get(href).success(function(response) {
               
                console.log(response);
                $rootScope.newTitle = "Hi, i'm $RootScope";
                $rootScope.newTitle = response.title;
                $rootScope.newBody = response.body_html;

           
          });

            //$state.transitionTo('app.newsdetails');
    };

});
 
myApp.controller('imgController', function($scope, $http, $filter, $cordovaDevice, $cordovaFile, $cordovaFileTransfer, $ionicPlatform,  $ionicActionSheet, ImageService, FileService, $ionicSideMenuDelegate) {
 
      
      //Get Values from local storage
      var token = localStorage.getItem('accessToken');
      var company  = localStorage.getItem('company');

      console.log(token);
      console.log(company);

      //start the form data building
      $scope.imageData = {};
      $scope.imageData.accessToken = '1147-57840ed4bc7dfc1990f330878f4b2d0d';
      $scope.imageData.company = '1015';
      //delete this value to get the field to work
      $scope.imageData.group = '';


  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });

   $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
 

$scope.urlForImage = function(imageName) {
     var name = imageName.substr(imageName.lastIndexOf('/') + 1);
     var trueOrigin = cordova.file.dataDirectory + name;
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

 $scope.remove = function(array, index){
    array.splice(index, 1);
};


 $scope.megaUpload = function(file) {

    document.addEventListener('deviceready', function () {

     

      var uploadUrl = 'https://api.teambasementsystems.com/image/upload';


    //loop through all the images on the page and start the upload process  

    for (var i = 0; i < $scope.images.length; i++) {
      //convert to base64
          function getBase64Image(img1) { 
            var canvas = document.createElement("canvas");
            canvas.width = img1.naturalHeight;
            canvas.height = img1.naturalWidth;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img1, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }

        //get value of the images
         var img1 = document.getElementById("object-" + i);
         //build proper base64 link
         var imgData = 'data:image/jpg;base64,' + getBase64Image(img1);
         //log data
         //console.log(img1);
                
      $http({
              method: 'POST',
              url: uploadUrl,
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded'
               },
             data: 'accessToken=' + encodeURIComponent($scope.imageData.accessToken) +
                '&company=' + encodeURIComponent($scope.imageData.company) +
                '&group=' + encodeURIComponent($scope.imageData.group) +
                '&image_'+ i + '=' + encodeURIComponent(imgData)
 
          }).
        success(function (data, status, headers, config) {
            swal("YES!", "Your Photos Are Now In TBS!", "success");
            console.log("success!");
            console.log(data);
        }).
        error(function (data, status, headers, config) {
              console.log("failed!");
              console.log(data);     
        });

      }



  });

     
 };
 
 

}); //end controller


 

 
 