var Client = {};
Client.socket = io.connect();

Client.joinroom = function(room){
	roomname = room;
	Client.socket.emit('room', roomname);
};

Client.klik = function(id){
    Client.socket.emit('klik', [id, roomname]);
};
Client.nieuwspel = function(){
    Client.socket.emit('nieuwspel',roomname);
};
Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.socket.on('bord',function(room){
	kleurenset(room);
	makeboard(room);
});

Client.socket.on('nieuwspel',function(room){
	kleurenset(room);
	makeboard(room);
});
Client.socket.on('klik_server',function(id){
	myServerFunction(id);
});



