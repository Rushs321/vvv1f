#!/usr/bin/env node
'use strict';

const Fastify = require('fastify');
const params = require('./src/params');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || `0.0.0.0`;
// Initialize Fastify instance
const app = Fastify({
  logger: true,
  trustProxy: true // Enable trustProxy option
});

// Register the params middleware as a global hook
app.addHook('preHandler', async (request, reply) => {
  await params(request, reply);
});

// Define routes
app.get('/', async (request, reply) => {
  await proxy(request, reply);
});

app.get('/favicon.ico', (request, reply) => {
  reply.status(204).send();
});

// Start the server
app.listen({host: HOST, port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
