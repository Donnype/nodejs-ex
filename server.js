var express = require('express');
var app = express();
var server = require('http').Server(app);
var morgan = require('morgan');
app.use(morgan('combined'));
var io = require('socket.io').listen(server);
var path = require('path');

app.use(express.static(path.join(__dirname,'views')));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/:room',function(req,res){
    res.sendFile(__dirname+'/views/index.html');
});

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

var Rooms = {};

function Room(name, kleur, woord, druk) {
	this.naam = name;
	this.kleuren = kleur;
	this.woorden = woord;
	this.gedrukt = druk;
};

io.on('connection',function(socket){
	console.log("connection");
	socket.on('room', function(roomname) {
        socket.join(roomname);
        if(!(roomname in Rooms)){
        	Rooms[roomname] = new Room(roomname, 
        	shuffle(["CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue", "CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue", "red","red","red","red","red","red","red","red","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","grey"]), 
        	shuffle(["bek", "boot", "doorn", "mug", "engeland", "storm", "vrouwen", "ventiel","knap", "overgang", "bank", "angst", "serie","strip", "kangoeroe", "malibu", "neon", "kool","tandarts", "hart", "ham", "baard", "yoghurt", "wind", "trend"]), 
        	[]);
        }
		socket.emit('bord', Rooms[roomname]);
		socket.on('klik',function(idroom){
        	Rooms[idroom[1]].gedrukt.push(idroom[0]);
            socket.to(idroom[1]).emit('klik_server',idroom[0]);
    	});
        socket.on('nieuwspel',function(roomname){
        	Rooms[roomname].gedrukt = []
        	Rooms[roomname].kleuren = shuffle(["CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue", "CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue","CornflowerBlue", "red","red","red","red","red","red","red","red","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","RosyBrown","grey"]);
        	Rooms[roomname].woorden = shuffle(["boek", "boot", "doorn", "mug", "engeland", "storm", "vrouwen", "ventiel","knap", "overgang", "bank", "angst", "serie","strip", "kangoeroe", "malibu", "neon", "kool","tandarts", "hart", "ham", "baard", "yoghurt", "wind", "trend"]);
            io.in(roomname).emit('nieuwspel', Rooms[roomname]);
        });
    	socket.on('test',function(){
        	console.log('test received');
    	});
    });
	
});
