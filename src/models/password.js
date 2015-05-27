module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me/password',
    put: true
  });
};
