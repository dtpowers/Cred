var users = [];
var lastSearch = {};

exports.init = function(app) {
  app.get("/user/:username", getUser);
  app.get("/users", getAllUsers);
  app.put("/user/:username/:gender/:email", newUser);
  app.post("/user/:username/:gender/:email", updateUser);
  app.delete("/user/:username", deleteUser);
  app.get('/', home);
  }


//Index

function home(request, response){
    response.render('index');
}

//CREATE
function newUser(request, response){
    //console.log(request.params);
    var user = new Object;
    user.username = request.params.username;
    user.gender = request.params.gender;
    user.email = request.params.email;
    users.push(user);
    //console.log(users);
    response.send(user);
}

//READ
function getUser(request, response){
    var user;
    username = request.params.username
    for (var i = 0; i < users.length; i++){
        if (users[i].username == username){
            user = users[i];
        }
    }
    if(user){
        response.send(user);
        lastSearch = user;
    }
    else{
        response.send(user);
    }
}

function getAllUsers(request, response){
  console.log("get all users called");
  response.render("usersPartial", {"users" : users});
}

//UPDATE
function updateUser(request, response){
    user = lastSearch;
    user.gender = request.params.gender;
    user.email = request.params.email;
    response.send(user);
    
}

//DELETE
function deleteUser(request, response){
    user = lastSearch;
    var userToDelete = -1;
    for (var i = 0; i < users.length; i++){
        if (users[i].username == user.username){
            userToDelete = i;
        }
    }
    if (userToDelete != -1){
        response.send(user);
        users.splice(userToDelete, 1);
    }
    else{
        response.send(user);
    }
    
}

