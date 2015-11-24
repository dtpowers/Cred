
var socket = io();
var User = {};
var GuestNum = 0;

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
		id = GuestNum;
	}
    outMsg = "Guest " + id + ": " + $('#m').val(); 
    socket.emit('chat message', outMsg);
    $('#m').val('');
    event.preventDefault();
    return false;
});
      

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});