const sharp = require('sharp');
const redirect = require('./redirect');

function compress(request, reply, input) {
  const format = request.params.webp ? 'webp' : 'jpeg';

  console.log('Starting compression:');
  console.log('Format:', format);
  console.log('Grayscale:', request.params.grayscale);
  console.log('Quality:', request.params.quality);

  const transform = sharp()
    .grayscale(request.params.grayscale)
    .toFormat(format, {
      quality: request.params.quality,
      progressive: true,
      optimizeScans: true
    });

  input.pipe(transform)
    .on('info', info => {
      console.log('Compression info:');
      console.log('Format:', format);
      console.log('Original size:', request.params.originSize);
      console.log('Compressed size:', info.size);
      console.log('Bytes saved:', request.params.originSize - info.size);

      reply.header('content-type', `image/${format}`);
      reply.header('x-original-size', request.params.originSize);
      reply.header('x-bytes-saved', request.params.originSize - info.size);
      reply.code(200);
    })
    .on('error', (error) => {
      console.error('Compression error:', error);
      redirect(request, reply);
    })
    .pipe(reply.raw);
}

module.exports = compress;
