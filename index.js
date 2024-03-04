const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, world!\n');
});

// Define the port number
const port = 3000;

// Start the server listening on the specified port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
