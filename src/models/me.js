module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me',
    get: true,
    put: true
  });
};
