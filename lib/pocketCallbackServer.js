import { createServer } from 'node:http';

/**
 * Simple HTTP server which listens on a local port for the callback from pocket
 */

// listen for a single request made to our port
// once that request has been made shut the server down.
const server = createServer((req, res) => {
  // inform user of success and direct them back to their console.
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Account connection successful, please return to command line.');
  res.end();
  process.exit();
}).listen(process.env.PORT || 3000);

server.on('error', (e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
