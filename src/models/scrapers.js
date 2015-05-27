module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/scrapers',
    get: true,
    query: true
  });
};
