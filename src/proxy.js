const fetch = require('node-fetch');
const { pick } = require('lodash');
const shouldCompress = require('./shouldCompress');
const redirect = require('./redirect');
const compress = require('./compress');
const copyHeaders = require('./copyHeaders');

async function proxy(request, reply) {
  try {
    const response = await fetch(request.params.url, {
      headers: {
        ...pick(request.headers, ['cookie', 'dnt', 'referer']),
        'user-agent': 'Bandwidth-Hero Compressor',
        'x-forwarded-for': request.headers['x-forwarded-for'] || request.ip,
        via: '1.1 bandwidth-hero'
      },
      compress: true,
      redirect: 'follow',
    });

    if (!response.ok) {
      return redirect(request, reply);
    }

    

    copyHeaders(response, reply);
    request.params.originType = response.headers.get('content-type') || '';
    request.params.originSize = response.headers.get('content-length') || '0';

    console.log('Fetched image type:', request.params.originType);
    console.log('Fetched image size:', request.params.originSize);

    reply.header('content-encoding', 'identity');

    if (shouldCompress(request)) {
      return compress(request, reply, response.body);
    } else {
      reply.header('x-proxy-bypass', 1);
      reply.header('content-length', request.params.originSize);
      response.body.pipe(reply.raw);
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    redirect(request, reply);
  }
}


module.exports = proxy;
