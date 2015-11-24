exports.init = function(io) {

var GuestNum = 0; // keep track of the number of guest for temp chat id's
	
console.log("IO initialized");

io.on('connection', function(socket){    
	socket.on('chat message', function(msg){
     io.emit('chat message', msg);
    });
});


}
