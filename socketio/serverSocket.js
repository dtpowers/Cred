


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



var mp3Duration = require('mp3-duration');
 





exports.addSong = function(req, res) {
    var song = {}
    song.image = "/uploads/" + req.files['cover'][0].filename;
    song.music = "/uploads/" + req.files['song'][0].filename;
    song.title = req.body.title;
    song.artist = req.body.artist;
    mp3Duration(req.files['song'][0].path, function (err, duration) {
    if (err){ 
      song.duration = "fail";
    }
    else if (duration === undefined) {
     song.duration = "fail";
    }else{
     song.duration = duration;
}
  console.log('Your file is '+ duration +' seconds long');
    songQue.push(song);
    res.render("index");
    if(songQue.length == 1){
        playSong();
    }
    
});

}



getSong =  function(){
  return songQue[0];
}

nextSong = function(){
  songQue.shift();
  populateSongList();
  playSong();
}

playSong = function(){
  console.log(songQue.length + "songs on the que");
  if (songQue.length != 0){
    songStartTime = new Date().getTime() / 1000;
    console.log("Song started at time " + songStartTime);
    console.log("current song is " + songQue[0].duration + "long");
    var songLength = songQue[0].duration * 1000;
    setTimeout(songOver, songLength);
  }else{
    console.log("song list empty");
  }
}

songOver = function(){
    console.log("song ended \n\n\n\n\n\n\n\n\n\n");
    nextSong();
}

function populateSongList() {
    //TODO
    //Emit to client that queue has changed
    //update que on all clients
    return 5;

}



}









