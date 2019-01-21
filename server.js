//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

//var io = require('socket.io').listen(server);


//self.server = require('http').createServer(self.app);
//self.io = io.listen(self.server);
//self.io.configure(function(){
//   self.io.set("transports", ["websocket"]);
//})

// Check the configuration file for more details
// var config = require('./config');

// Express.js stuff
//var express = require('express');
//var app = require('express')();
//var server = require('http').Server(app);

// Websockets with socket.io
//var io = require('socket.io')(server);

var server = require('http').Server(app);
var io = require('socket.io').listen(server);


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var woorden = ["boek", "boot", "doorn", "JJ", "anaal","mug", "engeland", "storm", "vrouwen", "ventiel",
"knap", "overgang", "bank", "angst", "serie","strip", "kangoeroe", "malibu", "neon", "kool","tandarts", 
"hart", "ham", "baard", "yoghurt", "wind", "trend"];

var kleuren = ["CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue",
"CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue",
"red","red","red","red","red","red","red","red","RosyBrown","RosyBrown","RosyBrown",
"RosyBrown","RosyBrown","RosyBrown","RosyBrown","grey"]

var kleuren_random = shuffle(kleuren);

var woorden_random = shuffle(woorden);

var gedrukt = [];

io.on('connection',function(socket){
	var borddata = [kleuren_random, woorden_random, gedrukt];
	socket.emit('bord', borddata);
		socket.on('klik',function(id){
        	gedrukt.push(id);
            socket.broadcast.emit('klik_server',id);
    	});
        socket.on('nieuwspel',function(){
        	gedrukt = []
        	kleuren_random = shuffle(kleuren);
        	woorden_random = shuffle(woorden);
        	borddata = [kleuren_random, woorden_random, gedrukt];
            io.emit('nieuwspel', borddata);
        });
        
    socket.on('test',function(){
        console.log('test received');
    });
});





