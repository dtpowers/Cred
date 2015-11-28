
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



 $("#register").submit(function(e){
    	e.preventDefault();
    	username = $("#setUsername").val();
    	pw = $("#setUserPass").val();
        $.ajax({
    	url: "/users/" + "username=" +username + "&password=" + pw + "&cred=0",
    	type: 'PUT',
    	success: function(result) {
        	logIn(username, pw);
        	console.log("Logging in..."); 
            location.reload();
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