module.exports = function makeUrl(components, params) {
  components = components == null? [] : !angular.isArray(components) ? [components] : components;
  var fullPath = [];

  for (var i = 0, len = components.length; i < len; i++) {
    var component = components[i];

    if (component == null) {
      break;
    }

    fullPath.push(component.replace(/^\/|\/$/, ''));
  }

  var path = fullPath.join('/') + '?';

  if (typeof params === 'object') {
    for (var key in params) {
      var value = params[key];

      path += key + '=' + encodeURIComponent(value) + '&';
    }
  }

  return path.slice(0, -1);
};
