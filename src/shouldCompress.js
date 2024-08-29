

const MIN_COMPRESS_LENGTH = 1024;
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100;

function shouldCompress(request) {
  const { originType, originSize, webp } = request.params;
  const size = parseInt(originSize, 10) || 0;

  console.log('Checking compression:');
  console.log('originType:', originType);
  console.log('originSize:', originSize);
  console.log('webp:', webp);
  console.log('size:', size);

  if (!originType || !originSize) return false;
  if (!originType.startsWith('image')) return false;
  if (size === 0) return false;
  if (request.headers.range) return false;
  if (webp && size < MIN_COMPRESS_LENGTH) return false;
  if (
    !webp &&
    (originType.endsWith('png') || originType.endsWith('gif')) &&
    size < MIN_TRANSPARENT_COMPRESS_LENGTH
  ) {
    return false;
  }

  return true;
}


module.exports = shouldCompress;
