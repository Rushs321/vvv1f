#!/usr/bin/env node
'use strict';

const Fastify = require('fastify');
const params = require('./src/params');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 8080;

const app = Fastify({ 
  logger: true,
  trustProxy: true  // Enable trustProxy option
});

// Middleware equivalent
app.addHook('preHandler', async (request, reply) => {
  await params(request, reply);
});

// Route for main proxy handling
app.get('/', async (request, reply) => {
  await proxy(request, reply);
});

// Route for favicon
app.get('/favicon.ico', (request, reply) => {
  reply.status(204).send();
});

// Start server
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on http://localhost:${PORT}`);
});
