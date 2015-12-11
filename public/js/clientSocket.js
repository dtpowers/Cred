var socket = io.connect("http://credtest-dtpowers.rhcloud.com:8000");
//var socket = io.connect();
var User = {};
var GuestNum = 0;
var SongQue = [];
var CurrentSong = {};
//update system information on page refresh to avoid errors

//page load requirments
$().ready(function(){
	relog(); 
	//get song playing info



});

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


//plaecholder for spend cred options
$("#spendCred").click(function(e){
	//html changes
	e.preventDefault;
	
	$("#credMenue").toggle();
	$("#navvv").css({"margin-bottom" : "0"});

	//change cred in db and locally
	//hard value for now, will be value of request later
	

});

$("#skipSong").click(function(e){
	e.preventDefault;

	if(User.cred >= 20){
		socket.emit("skip");
		changeCred(User.cred - 20);
	}
	else{
		alert("you dont have enough cred...");
	}
	
});

//update db with new cred amount after spending
function changeCred(amount){

	var newTotal = amount;
	if (newTotal < 0) {
		alert("You dont have enough cred, Loser.");
		return;
	};
	filter = 'find={"username":"' + User.username; 
	filter += '", "password" : "' + User.password; 
	filter += '"}&update={"$set":{"cred":"' +  newTotal + '"}}';
	

	 $.ajax({
		url: "/users/users/",
		data: filter,
		type: 'POST',
		success: function(result) {
			console.log(result);
			logIn(User.username, User.password);  
		}
	});


}

//delete account
$("#foot").click(function(e){
	e.preventDefault;
	removeUser();
});

function removeUser(){
	filter = 'find={"username":"' + User.username; 
	filter += '", "password" : "' + User.password; 
	filter += '"}';

	 $.ajax({
		url: "/users/users/",
		data: filter,
		type: 'DELETE',
		success: function(result) {
			console.log(result);
			logOut();  
		}
	});
}
//hide/show registration form
$("#regButton").click(function(e){
	e.preventDefault;

	$("#register").toggle();
	$("#navvv").css({"margin-bottom" : "0"});

});

//hide/show registration form
$("#uploadTrack").click(function(e){
	e.preventDefault;

	$("#uploadForm").toggle();
	$("#navvv").css({"margin-bottom" : "0"});

});

$("#credUp").click(function(e){
	e.preventDefault;

	$("#credUp").toggle();
	//get user
	username = songQue[0].user;
	usr = {};
	$.ajax({
    	url: "/users/users/?username=" + username,
    	type: 'GET',
    	success: function(result) {
    		if (result[0]) {
	    		usr.username = result[0].username;
	    		usr.cred = result[0].cred;

	    		console.log(usr.cred);
	    		console.log(usr.cred);
    newTotal = parseInt(usr.cred) + 5;
   	console.log(newTotal);
	//give cred to user
	filter = 'find={"username":"' + usr.username; 
	
	filter += '"}&update={"$set":{"cred":"' +  newTotal + '"}}';
	console.log(filter);
	

	 $.ajax({
		url: "/users/users/",
		data: filter,
		type: 'POST',
		success: function(result) {
			console.log(result);
			  
		}
	});
    		}
    		else{
    			alert("couldn't find user");
    		}
    		
    	}
    });
    
});

//hide/show sign in form
$("#signIn").click(function(e){
	e.preventDefault;
	
	$("#logForm").toggle();
	$("#navvv").css({"margin-bottom" : "0"});



});




function addGuestInfo(){
	return;
}
//on sign in update page with info for user
function addUserInfo(){
	$("#signedInAs").html("Signed in as " + User.username); 
	$("#credScore").html("Cred Score: " + User.cred);
	$("#spendCred").html("Spend Cred");
	$("#uploadTrack").html("Upload a Track");
	$("#foot").html("delete my account");
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
    	url: "/users/users/?username=" + username + "&password=" + password,
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
    	url: "users/users/?username=" + username,
    	type: 'GET',
    	success: function(result) {
    		if (result[0]) {
    			alert("that username is taken");
    			return;
	    		
    		}
    		else{
    			 $.ajax({
			    	url: "/users/users/",
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

//form handler for log in
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

//for current song information update
socket.on('getPlaylist', function(data){
		console.log('get playlist fired');
	   CurrentSong = data.currentSong;
	   SongQue = data.songQue;
	
	   
	if($.isEmptyObject(CurrentSong)){
		$("#title").html("Queue empty :( upload a song!");
		
	}
	else{
		$("#title").html(CurrentSong.title + " - " + CurrentSong.artist);
		$("#coverArt").attr("src", data.currentSong.image);
		   console.log(data.currentSong.image);
		
	}
	updatePageQue(data)


});

//fill que on left side of screen
function updatePageQue(data){
	$('#que').empty();
	var song = "";
	console.log(data);
	var sq = data.songQue;
	songQue = data.songQue;
	for(i = 0; i < data.songQue.length; i++){
		console.log(sq);
		song = sq[i].title + " - " + sq[i].artist;
		$('#que').append($('<li>').text(song));
	}
	//update the music player
	if(sq.length){
	$("#credUp").show();
	var aud = document.getElementById("playerSource");
	//parse the song path
	var sourcePath = sq[0].path.replace("public", "");
	aud.src = sourcePath;
	console.log(sourcePath);
	var player = document.getElementById("player");
	player.pause();
	player.load();
	//set play time
	var startTime = data.startTime;
	var currTime = new Date().getTime() / 1000;
	player.currentTime = currTime - startTime;
	player.play();
}


}

//submit a new chat message and emit to all other users
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
      
//recieve new chat message
socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
});

