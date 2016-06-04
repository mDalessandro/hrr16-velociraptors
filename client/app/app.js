//main angular module
angular.module('omgeo', [
  'omgeo.home',
  'omgeo.auth',
  'omgeo.profile',
  'omgeo.services',
  'ngRoute',
  'ngCookies',
])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/profile', {
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController'
    })
    .otherwise({
      redirectTo: '/'
    })
});
