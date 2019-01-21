var t = 0;

kleurenset();
function_locaties();

function kleurenset(borddata) {
	kleuren_random = borddata[0];	
}

var locaties = ["11","12","13","14","15","21","22","23","24","25","31","32",
"33","34","35","41","42","43","44","45","51","52","53","54","55"];

function spymaster(){
	for (i = 0; i < 25; i++) 
		{ 
			var idstring = locaties[i];
			if (t == 0 && document.getElementById(idstring).style.background == "lightgrey")
    			{
    			document.getElementById(idstring).style.color = kleuren_random[i];
    			}
    		if (t == 1 && document.getElementById(idstring).style.background == "lightgrey")
    			{
    			document.getElementById(idstring).style.color = "black";
    			}
		}
	if (t == 0)
    	{t = 1;}
    else
    	{t = 0;}
}

function myFunction(element) {
	id = element.id;
    element.style.background = kleuren_random[locaties.indexOf(id)];
    element.style.color = "white";
    Client.klik(id);
}

function myServerFunction(id) {
    document.getElementById(id).style.background = kleuren_random[locaties.indexOf(id)];
    document.getElementById(id).style.color = "white";
}


