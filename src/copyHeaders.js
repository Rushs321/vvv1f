function copyHeaders(source, target) {
  const headers = source.raw.headers; // Use raw.headers to get the headers from the source
  
  for (const [key, value] of Object.entries(headers)) {
    try {
      target.header(key, value); // Set the headers on the target using Fastify's method
    } catch (e) {
      console.log(e.message); // Log any errors that occur
    }
  }
}

module.exports = copyHeaders;
