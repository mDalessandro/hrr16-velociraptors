# Intro
This app provides a *service* for registering names associated to GPS coordinates, similar to how a DNS registrar provides a service for registering names that are associated to IP addresses. In the case of DNS, these names are called TLDs (top-level domains, or more commonly, just "domains").

In our app, these names are called **omgeo** tags.

All **omgeo** tags registered live in the same namespace, are publicly accessible, and must be unique. That is, no two people can register `home`, just like no two people can register `example.com`.

However, different names can be made to point to the same GPS coordinate. The analogy with the DNS service is the same: there can be any number of domain names pointing to the same server (IP address), that is, anyone can register `<my_personal_domain>.com` and make it point to Example's servers. Likewise, different names registered by different people can point to the same coordinate.

# User Experience and Service Mechanics
Users can sign up for a free account to register tags and assign them coordinates. Thats it.

The syntax for referring to a registered **omgeo** tag in the context of this service is via an underscore: `_home` would supposedly point to someone's home, and `_companyHQ` would supposedly point to that company's headquarters.

Developers wanting to integrate this service with their apps can query our RESTful interface. For example, developers working on a messaging app can look for occurances of the pattern `_<text>` in a user submitted string and query the API. If the API returns a succesful response, the developers can then turn that part of the string into a link to the corresponding coordinate on a map.

This service can also be integrated with ecommerce sites. Instead of having users enter their addresses into various fields (which is quite cumbersome), they may allow users to write a single omgeo which will greatly speed up the checkout process.
```
Insert shipping info |vs.| Insert omgeo: _myHouse
Addr Line1:            |
Addr Line2:            |
Zip Code:              |
etc...                 |
```

# Suggestion for Legacy
Implement an app (i.e. chat client, ecommerce site, other) that integrates this service.

# Technical Documentation
All the specs you need to succesfully complete Legacy are in this section

## Server Routes
| URL                    | HTTP Verb | Request Body               | Result                                                                                             | Response body                                                                       |
|------------------------|-----------|----------------------------|----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| /                      | GET       | -                          | Responds with home page.                                                                           | HTML of home page.                                                                  |
| /api/tags?username=bob | GET       | -                          | Responds with bob's tags if bob exists.                                                            | JSON. Array of zero or more tags. Array of length zero if bob does not exist.       |
| /api/tags?tag=myHouse  | GET       | -                          | Responds with single tag if found.                                                                 | JSON. Array of length 1 (one) if tag exists, length 0 (zero) if tag does not exist. |
| /api/tags              | GET       | -                          | Returns all tags from DB.                                                                          | JSON. Array of zero or mor tags.                                                    |
| /api/tags              | POST      | JSON. `tag`                | Inserts `tag` in DB. User must be authenticated. Returns 201 on success.                           | JSON. Inserted `tag` on success.                                                    |
| /api/tags              | DELETE    | JSON. `{tagname: tagname}` | Deletes tag with `tagname` from DB. Returns 200 on success.                                        | -                                                                                   |
| /logout                | GET       | -                          | Destroys user session                                                                              | -                                                                                   |
| /signin                | POST      | JSON. User credentials     | Signs in user.                                                                                     | -                                                                                   |
| /signup                | POST      | JSON. User credentials     | Creates user if username not taken. Will redirect (302) to profile, or 409 if user already exists. | -                                                                                   |

## Status codes in detail
* **200** Used to signal that a user is authenticated or when `/` is requested.

* The only **302** is in a "catch-all" route that redirects to `/`.

* **400** When the JSON data is not properly formatted, such as missing username during signup or missing latitude when creating tag. Client side checks should prevent sending invalid data, but if you use postman, you are able to send invalid data and the server will handle it properly.

* **403** For all unauthorized requests requiring authorization.

* **409** When a name (username or tagname) is already in use.

* 404 is not used. Since it is an SPA living off `/`, any attempt to navigate to other routes outside of the API will redirect to `/`.

## Client-side routes with angular

* `#/`: Home page with tag search functionality
* `#/signin`: Log in page
* `#/signup`: Sign up page
* `#/profile`: User profile page. Can see tags and register new ones.

## DB
Using mongoDB with mongoose. The database has two collections: one for tags and one for users. One user can have many tags. All tags belong to only one user. This is a user:tag => 1:many relationship.

The database was set up with two models: one for users and one for tags. All fields in either model are required.

### Users model
* `email`: User's email.
* `name`: User's real name. Used to greet user in profile page.
* `password`: Stores a bcrypt hash of user's real password.
* `username`: Alias or handle the user wants to use to log into their account.

### Tags model
* `tagname`: User designated name for the tag.
* `username`: Username the tag belongs to.
* `lat`: North/south degrees from equator. Range [-90, 90].
* `long`: East/west from prime meridian. Range [-180, 180].
