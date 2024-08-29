function copyHeaders(source, target) {
  if (!source || !source.headers) {
    console.error('Invalid source object or headers:', source);
    return;
  }

  for (const [key, value] of source.headers.entries()) {
    try {
      // Use raw.setHeader for low-level header setting
      target.raw.setHeader(key, value);
    } catch (e) {
      console.error('Error setting header:', key, e.message);
    }
  }
}

module.exports = copyHeaders;
