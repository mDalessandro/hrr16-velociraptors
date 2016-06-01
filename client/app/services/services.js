angular.module('greenfield.services', [])

.factory('Tags', function ($http) {
  var getAll = function(){
    return $http({
      method: 'GET',
      url: '/api/tags'
    }).then(function (resp){
      return resp.data;
    })
  };
  
  var getUserAll = function(user){
    return $http({
      method: 'GET',
      url: '/api/tags/?user='+user
    }).then(function (resp){
      return resp.data;
    })
  };

  var addOne = function(tag){
    return $http({
      method: 'POST',
      url: '/api/tags',
      data: tag
    })
  };
  
  return {
    getAll: getAll,
    addOne: addOne,
    getUserAll: getUserAll
  };
})

.factory('Auth', function ($http, $location, $window) {

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  //this function can be used when routing to check if a user has authorization to access
   var isAuth = function () {
  //   
   };


  //this function will remove authorization from user and route to signin OR home page
   var signout = function () {
  //   $window.localStorage.removeItem('com.shortly');
  //   $location.path('/signin');
   };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
