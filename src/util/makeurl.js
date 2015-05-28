module.exports = function makeUrl(components) {
  components = components == null? [] : !angular.isArray(components) ? [components] : components;
  var fullPath = [];

  for (var i = 0, len = components.length; i < len; i++) {
    var component = components[i];

    if (component == null) {
      break;
    }

    fullPath.push(component.replace(/^\/|\/$/, ''));
  }

  return fullPath.join('/');
};
