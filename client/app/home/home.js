angular.module('omgeo.home', [])

.controller('HomeController', function ($scope, Tags, Auth) {

  $scope.allData={};
  $scope.tag={};
  $scope.found={};

  var map=L.map('map').setView([37.783697, -122.408966],1);
  var circle = L.circle([51.508, -0.11], 500, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0
        }).addTo(map);

  var baseMap= L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '',
    noWrap: true
  }).addTo(map);

  $scope.searchTag = function(){
    Tags.search($scope.tag)
    .then(function(result){
      console.log(JSON.stringify(result));
      if (result.length === 0){
        $scope.found={};
        $scope.tag.result="Tag is available!"
        document.getElementById('registerThisTag').style.display="block";
        map.removeLayer(circle)
        
      } else {
        $scope.found.lat=result.lat+", ";
        $scope.found.long=result.long;
        $scope.tag.result="Tag coordinates: "
        document.getElementById('registerThisTag').style.display="none";
        map.removeLayer(circle)
        circle = L.circle([$scope.found.lat, $scope.found.long], 5000, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(map);
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
