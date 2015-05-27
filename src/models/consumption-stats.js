module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me/consumption_stats',
    get: true,
    forAccount: {
      default: 'consumption_stats',
      get: true
    }
  });
};
