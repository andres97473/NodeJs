const http = require('http');
const fs = require('fs');

const home = fs.readFileSync('./index.html');
const about = fs.readFileSync('./about.html');

http.createServer((request, response) => {
    const { url } = request;
    if (url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(home);
    } else if (url === "/about") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(about);
    } else {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.write("Page not foud")
    }
    response.end();
}).listen(8080)