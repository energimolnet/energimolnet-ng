module.exports = function(emResourceFactory) {
  var Feeds = emResourceFactory({
    default: '/feeds',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });

  return Feeds;
};
