var url   = require("url");
var fs    = require('fs');
var statusCode = 200;
var postCode  =  201;
var errorCode  =  404;
var index = fs.readFileSync('./client/index.html');

/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/html";

  var message = JSON.stringify({results: [{username: "Jono", message: "Do my bidding!"}]});  

  if(request.url === '/classes/messages' && request.method === 'GET'){
    response.writeHead(statusCode, headers);
    response.end(index);
  }
  if(request.url === '/classes/messages' && request.method === 'POST'){

    response.writeHead(postCode, headers);
    response.end(index);
  } else {
    response.writeHead(errorCode, headers);
    response.end(index);
  }

  response.end(index);

  /* .writeHead() tells our server what HTTP status code to send back */
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};
handleRequest.handler = function(request, response){

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/html";

  var message = JSON.stringify({results: [{username: "Jono", message: "Do my bidding!"}]});
  if(request.url === '/classes/room1' && request.method === 'GET'){
    response.writeHead(statusCode, headers);
    response.end(message);
  } else if(request.url === '/classes/room1' && request.method === 'POST'){
    response.writeHead(postCode, headers);
    response.end();
  } else {
    response.writeHead(errorCode, headers);
    response.end();
  }
}

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = handleRequest
