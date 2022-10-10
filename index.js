const http = require('http');

http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    console.error(err);
  });
  if (request.url==='/'){
  	fs.readFile('./public/index.html', 'UTF-8', (err, html)=>{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(html);
	});
}).listen(8080);
