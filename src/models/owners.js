module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/owners',
    get: true,
    query: true
  });
};
