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

  if (!Auth.isAuth()){
    $location.path('#/signin');
  }

});
