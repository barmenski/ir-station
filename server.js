const http = require('http');
const fs = require('fs');
var path = require('path');
const PORT = process.env.PORT || 8080;
http
  .createServer((request, response) => {
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', (err) => {
      console.error(err);
      response.end();
    });
    if (request.url === '/') {
      fs.readFile('./src/index.html', 'UTF-8', (err, html) => {
        response.statusCode = 200;
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
      });
    } else if (request.url.match('.css$')) {
      var cssPath = path.join(__dirname, 'src', request.url);
      var fileStream = fs.createReadStream(cssPath, 'UTF-8');
      response.writeHead(200, { 'Content-Type': 'text/css' });
      fileStream.pipe(response);
      // } else if (request.url.match('.(woff(2)?|eot|ttf|otf)$')) {
      //   var fontPath = path.join(__dirname, 'src', request.url);
      //   var fileStream = fs.createReadStream(fontPath);
      //   response.writeHead(200, { 'Content-Type': 'font' });
      //   fileStream.pipe(response);
    } else if (request.url.match('.woff2$')) {
      var fontPath = path.join(__dirname, 'src', request.url);
      var fileStream = fs.createReadStream(fontPath);
      response.writeHead(200, { 'Content-Type': 'font/woff2' });
      fileStream.pipe(response);
    } else if (request.url.match('.ttf$')) {
      var fontPath = path.join(__dirname, 'src', request.url);
      var fileStream = fs.createReadStream(fontPath);
      response.writeHead(200, { 'Content-Type': 'font/ttf' });
      fileStream.pipe(response);
    } else if (request.url.match('.ico$')) {
      var favPath = path.join(__dirname, 'src', request.url);
      var fileStream = fs.createReadStream(favPath);
      response.writeHead(200, { 'Content-Type': 'image/x-icon' });
      fileStream.pipe(response);
    } else if (request.url.match('.js$')) {
      var jsPath = path.join(__dirname, 'src', request.url);
      var fileStream = fs.createReadStream(jsPath, 'UTF-8');
      response.writeHead(200, { 'Content-Type': 'text/javascript' });
      fileStream.pipe(response);
    } else {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end('No Page Found');
    }
  })
  .listen(PORT, () => {
    console.log(`Webserver started on :${PORT}`);
  });

process.on('SIGINT', function () {
  console.log('\nWebserver closed');
  process.exit();
});
