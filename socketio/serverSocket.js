exports.init = function(io) {

var GuestNum = 0; // keep track of the number of guest for temp chat id's
songQue = []; //playlist
songStart = 0; //time the last song started streaming


	
console.log("IO initialized");

io.on('connection', function(socket){

	++GuestNum;  
	io.emit('getPlaylist', {songQue : songQue, currentSong: songQue[0]});
    io.emit('guest', {number : GuestNum});
	socket.on('chat message', function(msg){
     io.emit('chat message', msg);
    });

    



});







}





exports.addSong = function(req, res) {
    var song = {}
    song.image = "/uploads/" + req.files['cover'][0].filename;
    song.music = "/uploads/" + req.files['song'][0].filename;
    song.title = req.body.title;
    song.artist = req.body.artist;
    songQue.push(song);
    res.send(songQue);
}

exports.getSong =  function(){
	return songQue[0];s
}

exports.nextSong = function(){
	songQue.shift();
}







