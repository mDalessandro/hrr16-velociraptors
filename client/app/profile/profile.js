angular.module('omgeo.profile', [])

.controller('ProfileController', function ($scope, Tags, Auth, $location) {

  $scope.data = {};
  $scope.tag = {};
  $scope.username=Auth.getUsername();

  var map=L.map('map').setView([37.75, -96.23],1);

  var baseMap= L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '',
    worldCopyJump: true
  }).addTo(map);


  //User adds tag to database
  $scope.addTag = function(){
    Tags.addOne($scope.tag, Auth.getUsername())
    .then(function(){
      $scope.getUserTags();
    });
  }
  var markers={};
  //User deletes tag to database
  $scope.removeTag = function(tagname){
    var tagToDelete = {tagname: tagname};
    Tags.deleteOne(tagToDelete)
    .then(function(){
      $scope.getUserTags();
      for (var item in markers){
        if (item === tagname){
          map.removeLayer(markers[tagname])
        }
      }
    });
  }

  //gets all user tags
  $scope.getUserTags = function(){
    Tags.getUserAll(Auth.getUsername())
    .then(function(tags){
      $scope.data.tags = tags;
      for (var i = 0; i < $scope.data.tags.length; i++){
        var lat = $scope.data.tags[i].lat;
        var long = $scope.data.tags[i].long;
        var tagname = $scope.data.tags[i].tagname
        markers[tagname]=L.marker([lat, long]).addTo(map);
        markers[tagname].bindPopup('<b>'+tagname+'</b><br>'+lat+', '+long).openPopup();
      }
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
