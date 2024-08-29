function redirect(request, reply) {
  if (reply.sent) {
    return;
  }

  reply.header('content-length', '0');
  reply.header('cache-control', '');
  reply.header('expires', '');
  reply.header('date', '');
  reply.header('etag', '');
  reply.redirect(302, encodeURI(request.params.url));
}

module.exports = redirect;
