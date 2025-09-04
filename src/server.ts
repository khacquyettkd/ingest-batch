const app = require('./app') ;
const http = require('http') ;
const logger = require('./utils/logger.util');

const port: number = parseInt(process.env.PORT || "6800",10);
const server = http.createServer(app);

server.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Ingest service listening on port ${port}`);
  }
})
process.on('unhandledRejection', (reason:unknown, promise: Promise<unknown>) => {
  console.error('[UNHANDLED REJECTION]', reason);
  logger.error(`[UNHANDLED REJECTION] ${reason}`);
});

process.on('uncaughtException', (err: Error) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  logger.error(`[UNCAUGHT EXCEPTION] ${err}`);
});