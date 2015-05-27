module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/clients',
    get: true,
    put: true,
    post: true,
    query: true,
    delete: true,
    forAccount: {
      default: 'clients',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};
