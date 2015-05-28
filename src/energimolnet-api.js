/*
 * This service performs communication with Energimolnet API.
 * It formats requests to required format and parses the
 * responses in a suitable way.
 *
 * Unless needed, use the api models to communicate with the API
 * on a higher level.
 * I.e.:
 *
 * Do:
 *
 *   Owners.query({name: 'Halmstad'})
 *
 * Dont':
 *
 *   energimolnetAPI.request({url: '/owners', params:...})
 */
var makeUrl = require('./util/makeurl');

var PATH_API_VERSION =        'api/2.0';
var PATH_SIGN_IN =            'security/signin';
var PATH_SIGN_OUT =           'security/signout';

module.exports = function($http, $window, $q, BASE_URL) {
  function request(config) {
    return $q(function(resolve, reject) {
      config.url = makeUrl([BASE_URL + PATH_API_VERSION, config.url]);

      $http(_emAuthorize(config)).then(function(res) {
        if (res.data.count == null || res.data.limit == null || res.data.skip == null) {
          resolve(res.data.data);
        } else {
          resolve({
            data: res.data.data,
            pagination: {
              skip: res.data.skip,
              limit: res.data.limit,
              count: res.data.count,
              page: 1 + (res.data.skip / res.data.limit),
              from: (res.data.count === 0) ? 0 : res.data.skip + 1,
              to: (res.data.skip + res.data.limit > res.data.count) ? res.data.count : res.data.skip + res.data.limit
            }
          });
        }
      }, function(res) {
        if (res.status === 401) { // User is not logged in
          setToken(undefined);
        }

        reject(res.data != null ? res.data.errors : {});
      });
    });
  }

  // Impersonation
  // -------------
  // Setting the API token will override the session authentication (if any)
  var KEY_API_TOKEN = 'energimolnetApiToken';

  function getToken() {
    return $window.localStorage.getItem(KEY_API_TOKEN);
  }

  function setToken(token) {
    if (token != null && token.length > 0) {
      $window.localStorage.setItem(KEY_API_TOKEN, token);
    } else {
      $window.localStorage.removeItem(KEY_API_TOKEN);
    }
  }

  // Pre-processing of request
  function _emAuthorize(config) {
    var token = getToken();

    if (token != null) {
      config.headers = {Authorization: 'OAuth ' + token};
    }

    return config;
  }

  function loginUrl(redirect) { return BASE_URL + PATH_SIGN_IN + '?redirect=' + redirect; }
  function logoutUrl(redirect) { return BASE_URL + PATH_SIGN_OUT + '?redirect=' + redirect; }

  return {
    loginUrl: loginUrl,
    logoutUrl: logoutUrl,
    getToken: getToken,
    setToken: setToken,
    request: request
  };
};
