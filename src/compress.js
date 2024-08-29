const sharp = require('sharp');
const redirect = require('./redirect');

async function compress(request, reply, input) {
  const format = request.params.webp ? 'webp' : 'jpeg';

  const transform = sharp()
    .grayscale(request.params.grayscale)
    .toFormat(format, {
      quality: request.params.quality,
      progressive: true,
      optimizeScans: true
    });

  try {
    // Collect the data into a buffer
    const data = await new Promise((resolve, reject) => {
      const buffers = [];
      input.pipe(transform)
        .on('data', (chunk) => buffers.push(chunk))
        .on('end', () => resolve(Buffer.concat(buffers)))
        .on('error', reject);
    });

    reply.header('content-type', `image/${format}`);
    reply.header('x-original-size', request.params.originSize);
    reply.header('x-bytes-saved', request.params.originSize - data.length);
    reply.status(200);

    // Send the compressed image data
    reply.send(data);
  } catch (error) {
    console.error('Error during compression:', error);
    redirect(request, reply);
  }
}

module.exports = compress;
