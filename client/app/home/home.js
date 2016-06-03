angular.module('greenfield.home', [])

.controller('HomeController', function ($scope, Tags, Auth) {

  $scope.allData={};
  $scope.tag={};

  var map=L.map('map').setView([37.75, -96.23],1);

  var baseMap= L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

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
      for (var i = 0; i < $scope.allData.tags.length; i++){
        var lat = $scope.allData.tags[i].lat;
        var long = $scope.allData.tags[i].long;
        var tagname = $scope.allData.tags[i].tagname
        var marker = L.marker([lat, long]).addTo(map);
        marker.bindPopup('<b>'+tagname+'</b><br>'+lat+', '+long).openPopup();
      }
    });
  }
  //runs get all user tags on app startup
  $scope.getTags();


  $scope.signout = function(){
    Auth.signout();
  }

  // if (!Auth.isAuth()){
  //   //$location.path('/signin');
  // }

});
