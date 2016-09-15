var http = require('http'); 
var port = 8000; 
 
function handle_request(request, response) { 
    response.writeHead(200, { 
        'Content-Type' : 'text/plain' 
    }); 
 
    response.end('MediaMade Rest app\n'); 
    console.log('mediamade.js was requested'); 
} 
 
http.createServer(handle_request).listen(port, '0.0.0.0'); 
 
console.log('Started Node.js http server at http://127.0.0.1:' +  port);