angular.module('greenfield.auth', [])

.controller('AuthController', function($scope, Auth, $location) {
  angular.extend($scope, Auth)
  
  $scope.user = {};
  $scope.newSignup = {};
  $scope.conflict = false;
  
  $scope.login = function() {
    Auth.signin($scope.user)
      .then(function(error){
        $scope.newSignup.username=''; 
        $scope.newSignup.password='';
        if (error === 'Not Found' || error === 'Forbidden') {
          $scope.conflict = true;
        } else {
          $location.path('/profile')
         }
      });
  }
  
  $scope.addUser = function() {
    Auth.signup($scope.newSignup)
      .then(function(error){
        $scope.newSignup.email=''; 
        $scope.newSignup.name=''; 
        $scope.newSignup.username=''; 
        $scope.newSignup.password='';
        if (error === 'Conflict') {
          $scope.conflict = true;
        } else {
          $location.path('/profile')
         }
      });
  }
  
});
