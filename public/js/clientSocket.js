
var socket = io();
var User = {};
var GuestNum = 0;

$().ready(relog);

$("#signOut").click(logOut);
//for keeping credentials during a session
//load user information on page load
function relog(){
	User.username = localStorage.username;
	User.password = localStorage.password;
	User.cred = localStorage.cred;
	if(User.username){
		addUserInfo();
	}
	else{
		addGuestInfo();
	}
	
}



$("#spendCred").click(function(e){
	//html changes

	//change cred in db and locally
	//hard value for now, will be value of request later
	spendCred(20);

});

function spendCred(amount){

	var newTotal = User.cred - amount;
	if (newTotal < 0) {
		alert("You dont have enough cred, Loser.");
		return;
	};
	filter = 'find={"username":"' + User.username; 
	filter += '", "password" : "' + User.password; 
	filter += '"}&update={"$set":{"cred":"' +  newTotal + '"}}';
	

	 $.ajax({
		url: "/users/",
		data: filter,
		type: 'POST',
		success: function(result) {
			console.log(result);
			logIn(User.username, User.password);  
		}
	});


}




function removeUser(){
	filter = 'find={"username":"' + User.username; 
	filter += '", "password" : "' + User.password; 
	filter += '"}';

	 $.ajax({
		url: "/users/",
		data: filter,
		type: 'DELETE',
		success: function(result) {
			console.log(result);
			logOut();  
		}
	});
}

$("#regButton").click(function(e){
	e.preventDefault;

	$("#register").toggle();
	$("#navvv").css({"margin-bottom" : "0"});

});


$("#signIn").click(function(e){
	e.preventDefault;
	
	$("#logForm").toggle();
	$("#navvv").css({"margin-bottom" : "0"});



});


function addGuestInfo(){
	return;
}

function addUserInfo(){
	$("#signedInAs").html("Signed in as " + User.username); 
	$("#credScore").html("Cred Score: " + User.cred);
	$("#signOut").show();
	$("#regButton").hide();
	$("#signIn").hide();

}


function logOut(){
	localStorage.clear();
	location.reload();
}


//this function pulls the matchins user/ pass pair from the db
//and stores them locally + in browser
function logIn(username, password){
  
	 $.ajax({
    	url: "/users/?username=" + username + "&password=" + password,
    	type: 'GET',
    	success: function(result) {
    		if (result[0]) {
	    		localStorage.username = result[0].username;
	    		localStorage.password = result[0].password;
	    		console.log(result[0]);
	    		localStorage.cred = result[0].cred;
	    		$(".form").hide();
	    		relog();
    		}
    		else{
    			alert("That username or password is incorrect");
    		}
    		
    	}
    });
	
}


//add new user to db
//before add, ensure its not a duplicate user
 $("#register").submit(function(e){
    	e.preventDefault();
    	username = $("#setUsername").val();
    	pw = $("#setUserPass").val();
    	var tempUser = {};
    	tempUser.username = username;
    	tempUser.password = pw;
    	tempUser.cred = 100;
    	//this validation should be server side
    	//but I cant get that to work, so for now we are doing it client side
    	//this has obvious security concerns and should be fixed for production
    	 $.ajax({
    	url: "/users/?username=" + username,
    	type: 'GET',
    	success: function(result) {
    		if (result[0]) {
    			alert("that username is taken");
    			return;
	    		
    		}
    		else{
    			 $.ajax({
			    	url: "/users/",
			    	data: tempUser,
			    	type: 'PUT',
			    	success: function(result) {
			        	logIn(username, pw);
			        	console.log("Logging in..."); 
			            
			    	}
				});
    		}
    		
    	}
    });
       
    }); 

  $("#logForm").submit(function(e){
    	e.preventDefault();
    	username = $("#getUsername").val();
    	pw = $("#getUserPass").val();
    	logIn(username, pw);
      
    }); 

//for chat, if there is no use get guest number
socket.on('guest', function(data){
	    if (GuestNum == 0) {
	    	GuestNum = data.number;
	    }

});

$('#sideChat').submit(function(event){
	if (User.username != null) {
        id = User.username;
	}
	else{
		id = "Guest " + GuestNum;
	}
    outMsg = id + ": " + $('#m').val(); 
    socket.emit('chat message', outMsg);
    $('#m').val('');
    event.preventDefault();
    return false;
});
      

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
});