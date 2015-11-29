exports.init = function(io) {

var GuestNum = 0; // keep track of the number of guest for temp chat id's
songQue = [];
	
console.log("IO initialized");

io.on('connection', function(socket){
	++GuestNum;  
    io.emit('guest', {number : GuestNum});
	socket.on('chat message', function(msg){
     io.emit('chat message', msg);
    });
    



});







}





exports.addSong = function(req, res) {
    var song = {}
    song.image = req.files['cover'][0].path;
    song.music = req.files['song'][0].path;
    song.title = req.body.title;
    song.artist = req.body.artist;
    songQue.push(song);
    res.send(songQue);
}







