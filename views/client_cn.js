/**
 * Created by Jerome on 03-03-17.
 */
//alert("client werkt");

var Client = {};
Client.socket = io.connect();

var locaties = ["11","12","13","14","15","21","22","23","24","25","31","32",
"33","34","35","41","42","43","44","45","51","52","53","54","55"];

Client.klik = function(id){
    Client.socket.emit('klik', id);
};
Client.nieuwspel = function(){
    Client.socket.emit('nieuwspel');
};
Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.socket.on('bord',function(borddata){
	kleurenset(borddata);
	for (i = 0; i < 25; i++) 
		{ 
		var idstring = locaties[i];
		document.getElementById(idstring).innerHTML = borddata[1][i];
		if(borddata[2].indexOf(idstring) >= 0) {
			document.getElementById(idstring).style.background = borddata[0][i];
			document.getElementById(idstring).style.color = "white";
    		}
    	else {
			document.getElementById(idstring).style.background = "lightgrey";
			document.getElementById(idstring).style.color = "black";
			}
		} 
});
Client.socket.on('nieuwspel',function(borddata){
	location.reload();
	kleurenset(borddata);
	for (i = 0; i < 25; i++) 
		{ 
			var idstring = locaties[i];
			document.getElementById(idstring).innerHTML = borddata[1][i];
		} 
});
Client.socket.on('klik_server',function(id){
    myServerFunction(id);
});




