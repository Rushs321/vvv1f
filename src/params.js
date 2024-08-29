
const DEFAULT_QUALITY = 40;

async function params(request, reply) {
  let url = request.query.url;
  if (!url) {
    return reply.send('bandwidth-hero-proxy');
  }

  request.params = {
    url: decodeURIComponent(url),
    webp: !request.query.jpeg,
    grayscale: request.query.bw != 0,
    quality: parseInt(request.query.l, 10) || DEFAULT_QUALITY
  };

  // Add logging to verify parameter settings
  console.log('Params set:', request.params);
}


module.exports = params;
