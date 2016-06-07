angular.module('omgeo.profile', [])

.controller('ProfileController', function ($scope, Tags, Auth, $location) {

  $scope.data = {};
  $scope.tag = {};
  $scope.username = Auth.getUsername();

  var map = L.map('map').setView([37.75, -96.23],1);

  var baseMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '',
    worldCopyJump: true
  }).addTo(map);


  //User adds tag to database
  $scope.addTag = function(){
    Tags.addOne($scope.tag, Auth.getUsername())
    .then(function() {
      $scope.getUserTags();
      $scope.tag.tagname = "";
      $scope.tag.lat = "";
      $scope.tag.long = "";
    });
  };
  
  var markers = new L.FeatureGroup();
  
  //User deletes tag to database
  $scope.removeTag = function(tagname) {
    var tagToDelete = {tagname: tagname};
    Tags.deleteOne(tagToDelete)
    .then(function() {
      $scope.getUserTags();
      markMe(); 
    });
  };

  //gets all user tags
  $scope.getUserTags = function() {
    Tags.getUserAll(Auth.getUsername())
    .then(function(tags) {
      $scope.data.tags = tags;
      markMe();
    });
  };

  var markMe = function() {
    map.removeLayer(markers)
    markers = new L.FeatureGroup();
    for (var i = 0; i < $scope.data.tags.length; i++) {
      var lat = $scope.data.tags[i].lat;
      var long = $scope.data.tags[i].long;
      var tagname = $scope.data.tags[i].tagname;
      var marker = L.marker([lat, long]).addTo(markers);
      marker.bindPopup('<b>' + tagname + '</b><br>' + lat + ', ' + long).openPopup();
    }
    markers.addTo(map);
  };
  
  //runs get all user tags on app startup
  $scope.getUserTags();

  $scope.signout = function(){
    Auth.signout();
  };

  Auth.isAuth()
  .then(function(resp){
    if (resp === 200){
      console.log("authorized");
    }
  }).catch(function(resp){
     $location.path('/signin');
  })

});
