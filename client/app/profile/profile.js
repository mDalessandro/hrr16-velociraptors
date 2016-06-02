angular.module('greenfield.profile', [])

.controller('ProfileController', function ($scope, Tags, Auth, $location) {

  $scope.data = {};
  $scope.tag = {};

  //User adds tag to database
  $scope.addTag = function(){
    Tags.addOne($scope.tag)
    .then(function(){
      $scope.getUserTags();
    });
  }

  //gets all user tags
  $scope.getUserTags = function(){
    Tags.getUserAll()
    .then(function(tags){
      $scope.data.tags = tags;
    });
  }
  //runs get all user tags on app startup
  $scope.getUserTags();


  $scope.signout = function(){
    Auth.signout();
  }

  //console.log(Auth.isAuth())
  Auth.isAuth()
  .then(function(resp){
    if (resp === 200){
      console.log("authorized")
    }
  }).catch(function(resp){
     $location.path('/signin');
  })
    // $location.path('/signin');
  

});
