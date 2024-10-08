

const MIN_COMPRESS_LENGTH = 1024;
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100;

function shouldCompress(request) {
  const { originType, originSize, webp } = request.params;

  // Convert originSize to a number if it's a string
  const size = typeof originSize === 'string' ? parseInt(originSize, 10) : originSize;

  if (!originType || !originSize) return false; // Ensure originType and originSize are defined

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
