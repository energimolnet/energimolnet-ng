module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/refreshtokens',
    query: true
  });
};
