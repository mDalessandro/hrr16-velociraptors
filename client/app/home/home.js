angular.module('greenfield.home', [])

.controller('HomeController', function ($scope, Tags, Auth) {

  $scope.allData={};
  $scope.tag={};

  $scope.searchTag = function(){
    Tags.search($scope.tag)
    .then(function(result){
      console.log(JSON.stringify(result));
      if (result.length === 0){
        $scope.tag.result="Tag is available!"
        document.getElementById('registerThisTag').style.display="block";
      } else {
        $scope.tag.result="This Tag already exists"
        document.getElementById('registerThisTag').style.display="none";
      }
    });
  }
  //gets all tags
  $scope.getTags = function(){
    Tags.getAll()
    .then(function(tags){
      $scope.allData.tags = tags;
    });
  }
  //runs get all user tags on app startup
  $scope.getTags();


  $scope.signout = function(){
    Auth.signout();
  }

  if (!Auth.isAuth()){
    //$location.path('/signin');
  }

});
