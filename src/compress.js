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

  // Track if the response has been sent
  let responseSent = false;

  // Function to handle errors and ensure response is not sent more than once
  function handleError(err) {
    if (!responseSent) {
      responseSent = true;
      console.error('Error during compression:', err);
      redirect(request, reply);
    }
  }

  // Set up event listeners and pipe data
  input.pipe(transform)
    .on('info', (info) => {
      if (!responseSent) {
        responseSent = true;
        reply.header('content-type', `image/${format}`);
        reply.header('x-original-size', request.params.originSize);
        reply.header('x-bytes-saved', request.params.originSize - info.size);
        reply.status(200);
      }
    })
    .on('error', handleError)
    .pipe(reply.raw)
    .on('finish', () => {
      // Ensure the response has been properly finished
      if (!responseSent) {
        responseSent = true;
        reply.raw.end();
      }
    })
    .on('close', () => {
      // Ensure the response has been properly closed
      if (!responseSent) {
        responseSent = true;
        reply.raw.end();
      }
    });
}

module.exports = compress;
