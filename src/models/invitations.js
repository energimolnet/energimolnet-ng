module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/invitations',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });
};
