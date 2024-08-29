const sharp = require('sharp');
const redirect = require('./redirect');

function compress(request, reply, input) {
  const format = request.params.webp ? 'webp' : 'jpeg';

  const transform = sharp()
    .grayscale(request.params.grayscale)
    .toFormat(format, {
      quality: request.params.quality,
      progressive: true,
      optimizeScans: true
    });

  input.pipe(transform)
    .on('info', info => {
      reply.header('content-type', `image/${format}`);
      reply.header('x-original-size', request.params.originSize);
      reply.header('x-bytes-saved', request.params.originSize - info.size);
      reply.code(200);
    })
    .on('error', () => redirect(request, reply))
    .pipe(reply.raw);
}

module.exports = compress;
