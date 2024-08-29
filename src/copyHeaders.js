function copyHeaders(source, target) {
  if (!source || !source.headers) {
    console.error('Invalid source object or headers:', source);
    return;
  }

  for (const [key, value] of source.headers.entries()) {
    try {
      target.header(key, value); // Use Fastify's method to set headers
    } catch (e) {
      console.error('Error setting header:', key, e.message);
    }
  }
}

module.exports = copyHeaders;
