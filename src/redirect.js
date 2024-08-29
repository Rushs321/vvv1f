function redirect(request, reply) {
  if (reply.sent) {
    return;
  }

  reply.header('content-length', '0');
  reply.header('cache-control', '');
  reply.header('expires', '');
  reply.header('date', '');
  reply.header('etag', '');
  reply.header('location', encodeURI(request.params.url));
  reply.code(302).send();
}

module.exports = redirect;
