var myApp = angular.module('starter');

myApp.controller('AppCtrl', function($scope, $http,  $timeout) {

});

myApp.controller('PlayCtrl', function($scope, $ionicSideMenuDelegate, $state) {

     $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };

     $scope.goSnap = function() {
        $state.transitionTo("app.ba");
      };

     $scope.goRead = function() {
        $state.transitionTo("app.newsletter");
      };


});

myApp.controller('loginCtrl', function($scope, $http, $ionicModal, $rootScope, $timeout, $state, $filter, $ionicSideMenuDelegate) {


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

              localStorage.clear();
              alert('Success! You now loggedin');
              //console.log(data.message);
              localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
              localStorage.setItem('name', JSON.stringify(data.userName));


              //Get the Company ID number in the Array 
              var item_name = data.companies[0].company;
              console.log(item_name);
              localStorage.setItem('company', JSON.stringify(item_name.id) );

              //Get User Name so we can display it
              var userFName  = JSON.parse( localStorage.getItem('name') );
              $rootScope.userFName = userFName;
              $state.transitionTo("app.dashboard");
          }
          else {
              localStorage.clear();
              alert(data.message);
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

  $scope.go = function() {
    //Psuedo Back Button
   $scope.myNews = true;
  }

$scope.newNews= function(href){
       $scope.myNews = false;
            // Get the link of what is click and perform request
            $http.get(href).success(function(response) {
               
                //Store Responses so we can easily grab later
                $rootScope.newTitle = response.title;
                $rootScope.newBody = response.body_html;

           
          });
    };

});
 
myApp.controller('imgController', function($scope, $http, $rootScope, $filter,  $cordovaCamera, $cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, ImageService, FileService, $ionicSideMenuDelegate) {
 

//takes images from the libary and displays them
  $scope.images2 = [];
  
  
    $scope.selImages = function() {
      
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 800
      };

      $cordovaCamera.getPicture(options).then(function(imageUri) {
        console.log('img', imageUri);
        $scope.images2.push(imageUri);
            
      }, function(err) {
      // error
      });

    };


     $ionicPlatform.ready(function() {
      $scope.images = FileService.images();
      $scope.$apply();
    });

      //Make Left Nav work
      $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };


      //Get Values from local storage parse them to remove quotes
      var token = JSON.parse( localStorage.getItem('accessToken') );
      var company  = JSON.parse( localStorage.getItem('company') );

      //start the form data building
      $scope.imageData = {};
      $scope.imageData.accessToken = token;
      $scope.imageData.company = company;
      //delete this value to get the field to work
      $scope.imageData.group = '';



      $scope.urlForImage = function(imageName) {
           // var name = imageName.substr(imageName.lastIndexOf('/') + 1);
           // var trueOrigin = cordova.file.dataDirectory + name;
           // return trueOrigin;

           var trueOrigin = cordova.file.dataDirectory + imageName;
           return trueOrigin;
      };


     $scope.addMedia = function() {
        $scope.hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: 'Take photo' }
            //{ text: 'Photo from library' }
          ],
          titleText: 'Camera',
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

    //loop through all the images on the page and start the upload process  one image per updload

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
         

        //Send Data To Our Server         
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


 

 
 