exports.init = function(io) {

var GuestNum = 0; // keep track of the number of guest for temp chat id's
var playlist = [];
	
console.log("IO initialized");

io.on('connection', function(socket){
	++GuestNum;  
    io.emit('guest', {number : GuestNum});
	socket.on('chat message', function(msg){
     io.emit('chat message', msg);
    });
    



});


//This controls all the playlist logic




}

function addSong(socket){
	return;
}



