var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var multer  = require('multer');
var probe = require('node-ffprobe');
 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
  	console.log(file.originalname);
    cb(null, file.originalname);
  }
})
var upload = multer({storage : storage});


var app = express();


// Set the views directory
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

// Define how to log events
app.use(morgan('tiny'));	
// parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({ extended: true }));

// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function (file){
  // There might be non-js files in the directory that should not be loaded
  if (path.extname(file) == '.js') {
    console.log("Adding routes in "+file);
  	require('./routes/'+ file).init(app);
  	}
});
// Boilerplate for setting up socket.io alongside Express.
var httpServer = require('http').createServer(app);
var sio = require('socket.io')(httpServer);

// The server socket.io code is in the socketio directory.
require('./socketio/serverSocket.js').init(sio);

ioMod = require('./socketio/serverSocket.js');

//file uploads

var cpUpload = upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'song', maxCount: 1 }]);
app.post('/uploadSong', cpUpload, function (req, res, next) {
	console.log("uploading song...");
	ioMod.addSong(req, res);
})


// Handle static files
app.use(express.static(__dirname + '/public'));


  
// Catch any routes not already handed with an error message
app.use(function(req, res) {
	var message = 'Error, did not understand path '+req.path;
	// Set the status to 404 not found, and render a message to the user.
  res.status(404).render('error', { 'message': message });
});





/*
 * OpenShift will provide environment variables indicating the IP 
 * address and PORT to use.  If those variables are not available
 * (e.g. when you are testing the application on your laptop) then
 * use default values of localhost (127.0.0.1) and 50000 (arbitrary).
 */
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 50000;

httpServer.listen(port, ipaddress, function() {console.log('Listening on '+ipaddress+':'+port);});
