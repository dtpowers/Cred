var express = require("express");
var morgan = require('morgan');
var path = require('path');
var app = express();
app.use(morgan('short'));
app.use(express.static(path.join(__dirname, 'public')));
require('./routes/facebook.js').init(app);
// Set the views directory
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('index');
});



app.listen(50000);
console.log("Server listening at http://localhost:50000/");
