exports.init = function(io) {

var GuestNum = 0; // keep track of the number of guest for temp chat id's
songQue = []; //playlist
songStartTime = 0; //time the last song started streaming



	
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
    var track = req.files['song'][0].path;
    probe(track, function(err, probeData) {
    console.log(probeData);
    song.duration = probeData.duration;
});
    songQue.push(song);
    res.send(songQue);
    if(songQue.length = 1){
        playSong();
    }
}



exports.getSong =  function(){
	return songQue[0];
}

exports.nextSong = function(){
	songQue.shift();
    playSong();
}

exports.playSong = function(){
    songStartTime = new Date().getTime() / 1000;
    console.log("Song started at time " + songStartTime);

    setTimeout(songOver(),(songLength + songStartTime));
}

exports.songOver = function(){
    nextSong();
}





