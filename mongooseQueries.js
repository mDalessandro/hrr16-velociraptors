
//will check if a username exists, and if so, will return all the tags associated with username
//will otherwise return various responses depending on whether or not user exists/has tags
var username = req.query.username;
User.findOne({'username': username}, function(err, result){
  if (err){
    res.statusCode = 200;
    res.send('[]');
  } else {
    Tag.find({'username': username}, function(err, result){
      if (err){
        res.statusCode = 200;
        res.send('User has not created any tags yet');
      } else {
        res.statusCode = 200;
        res.send(result);
      }
    })
  }
})
var tag = req.query.tag;
Tag.findOne({'tagname': tag}, function(err, result){
  if (err){
    res.statusCode = 200;
    res.send('[]');
  } else {
    res.statusCode = 200;
    res.send(result);
  }
});
Tag.find({}, function(err, result){
  if (err){
    res.statusCode = 400?????;
    res.end();
  } else {
    res.statusCode = 200;
    res.send(result);
  }
})

Line 46 on server
Tag.findOne({'tagname': tag}, function(err, result){
  var user = req.body.username;
  var tag  = req.body.tagname;
  var lat  = req.body.lat;
  var long = req.body.long;
  if (err){
    res.statusCode = 201;
    var newTag = new Tag({'username': user, 'tagname': tag, 'lat': lat, 'long': long});
    console.log(newTag);
    res.send(newTag);

  } else {
    res.statusCode = 409;
    console.log("Tag already exists")
    res.end();
  }
});

    