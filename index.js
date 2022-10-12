const http = require('http');
const fs = require('fs');

http
  .createServer((request, response) => {
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', (err) => {
      console.error(err);
    });
    if (request.url === '/') {
      fs.readFile('./index.html', 'UTF-8', (err, html) => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
      });
    }
    console.log('Server started on :8080');
  })
  .listen(8080);

process.on('SIGINT', function () {
  //on ctrl+c
  console.log('\nWebserver closed');
  process.exit(); //exit completely
});
