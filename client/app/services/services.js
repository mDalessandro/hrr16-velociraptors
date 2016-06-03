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

  var search = function(tag){
    return $http({
      method: 'GET',
      url: '/api/tags?tag='+tag.tagname
    }).then(function (resp){
      return resp.data;
    })
  };
  
  var getUserAll = function(user){
    console.log("user: ",user)
    return $http({
      method: 'GET',
      url: '/api/tags/?username='+user
    }).then(function (resp){
      return resp.data;
    })
  };

  var addOne = function(tag, username){
    tag.username = username;
    console.log("sending server: ",tag)
    return $http({
      method: 'POST',
      url: '/api/tags',
      data: tag
    })
  };
  
  return {
    getAll: getAll,
    addOne: addOne,
    getUserAll: getUserAll,
    search: search
  };
})

.factory('Auth', function ($http, $window, $cookieStore) {

  var getUsername = function(){
    return $cookieStore.get('username');
  }

  var signin = function (user) {
    $cookieStore.put('username',user.username);
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function successCallback(resp) {
      console.log('successfully logged in');
      return resp.data;
    }, function errorCallback(resp) {
      console.log('failed to log in');
      console.log(resp.data);
      return resp.data;
    });
  };

  var signup = function (user) {
    $cookieStore.put('username',user.username);
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function successCallback(resp) {
      console.log('successfully signed up');
      return resp.data;
    }, function errorCallback(resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  //this function can be used when routing to check if a user has authorization to access
   var isAuth = function () {
  //   Possible GET request to users, used with the ng-change when typing in username/email fields
  //GET request to /signin, if signed in 200, if not 403
    return $http({
      method: 'GET',
      url: '/signin'
    }).then(function(resp) {
     return resp.status
    });
    return 403
   };


  //this function will remove authorization from user and route to signin OR home page
   var signout = function () {
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function(resp) {
     return resp.status
    });
  //   $window.localStorage.removeItem('com.shortly');
  //   $location.path('/signin');
   };


  return {
    getUsername: getUsername,
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
