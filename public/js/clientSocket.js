
var socket = io();
User = {};
GuestNum = 0;

socket.on('connect', function(vNum){
        GuestNum = vNum;
});


$('#sideChat').submit(function(event){
	if (User.username) {
        id = User.username;
	}
	else{
		id = GuestNum;
	}
    outMsg = id + ": " + $('#m').val(); 
    socket.emit('chat message', outMsg);
    $('#m').val('');
    event.preventDefault();
    return false;
});
      

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});