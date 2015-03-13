/*
 * This factory generates urls for accessing the Energimolnet API
 * based on current configurations.
 * 
 * url
 * ----
 * Returns the url for accessing the Energimolnet API based on current
 * configurations (e.g. development/staging/production and api version).
 * 
 *
 * Params:
 *  * components: Array The path components to append to the base path.
 *  
 * Example:
 *   url(['accounts', 'me']) 
 *   -> http://app.energimolnet.se/api/v2/accounts/me
 *
 * 
 * loginUrl
 * --------
 * Returns a url to present to the user for logging in.
 *
 * Params:
 *  * redirect: String  The url of the page to redirect to when login
 *                      has finished.
 *
 * 
 * logoutUrl
 * ---------
 * Returns a url to present to the user to logout (when using session login)
 *
 * Params:
 *  * redirect: String  The url of the page to redirect to when logout
 *                      has finished.
 * 
 */

module.exports = function(ngModule) {
  ngModule.factory('emUrl', [
    'apiBaseUrl',
    function(BASE_URL) {
      var PATH_SIGN_IN =            'security/signin';
      var PATH_SIGN_OUT =           'security/signout';
      var PATH_API_VERSION =        'api/2.0';

      function url(components) {
        components = components == null? [] : !angular.isArray(components) ? [components] : components;
        var fullPath = [BASE_URL + PATH_API_VERSION];
        
        for (var i = 0, len = components.length; i < components.length; i++) {
          var component = components[i];

          if (components[i] == null) {
            break;
          }

          fullPath.push(component.replace(/^\/|\/$/, ''));
        }

        return fullPath.join('/');
      }

      function loginUrl(redirect) { return BASE_URL + PATH_SIGN_IN + '?redirect=' + redirect; }
      function logoutUrl(redirect) { return BASE_URL + PATH_SIGN_OUT + '?redirect=' + redirect; }

      return {
        url: url,
        loginUrl: loginUrl,
        logoutUrl: logoutUrl
      };
    }
  ]);
};
