var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/scratch.html');
});

//var server.lastPlayderID = 0;

server.listen(process.env.PORT || 8080,function(){
    console.log('Listening on '+server.address().port);
});

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