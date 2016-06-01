angular.module('greenfield.auth', [])

.controller('AuthController', function($scope, Auth) {
  angular.extend($scope, Auth)
  
  $scope.login = function() {
    console.log('login was triggered');
    //check if entered data matches an existing email & password (for a single user)
      // if matching -> 
        // pass data to signin()
        // redirect to profile
      // else -> 
        // send to .result, "Login failed. Please check that you are entering your email and password correctly."
  }
  
  $scope.addUser = function() {
    console.log('addUser was triggered');
    //check if user already exists
      // if exists -> 
        // send to .result, "User already exists."
      // else -> 
        // submit user data for authentication
        // redirect to login page
  }
  
});
