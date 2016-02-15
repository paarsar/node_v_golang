var http = require('http');
var url = require('url');
var dispatcher = require('httpdispatcher');
var mysql      = require('mysql');


const PORT=8080; 

function getConnection() {

  var connection = mysql.createConnection({
    host     : 'db',
    user     : 'root',
    password : 'mypassword',
    database : 'mysql'
  });

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected.. ");    
    } else {
        console.log("Error connecting database... " +err);    
    }
  });

  return connection;
}

dispatcher.onGet("/sleep", function(req, res) {

	var url_parts = url.parse(req.url, true);
	var duration = url_parts.query.duration;
	console.log("params " +url_parts.duration);

	if(typeof duration === "undefined") {
		duration = 5;
	}

  console.log("about to sleep for " + duration);
  require("child_process").execSync("sleep "+duration);
  console.log("sleep over ");
  	
  res.writeHead(200);
  res.end('Slept for '+ duration);
});    

dispatcher.onGet("/longDbQuery", function(req, res) {

  var url_parts = url.parse(req.url, true);
	var duration = url_parts.query.duration;
	console.log("params " + duration);

	if(typeof duration === "undefined") {
		duration = 5;
	}
  var connection = getConnection();
	connection.query('SELECT SLEEP(' + duration + ') ', function(err, rows, fields) {
		
		console.log('DB Proccess took ' + duration + ' ' + rows );
    connection.end();
		res.writeHead(200);
  	res.end('DB Proccess took '+ duration + ' seconds');
	});

});


dispatcher.onGet("/", function(req, res) {
  	res.writeHead(200);
  	res.end('Hello Http');
});


var server = http.createServer(function(request, response) {

   try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
	
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
