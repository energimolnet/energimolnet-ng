// Authentication
// --------------
// Setting the private token will override all other tokens

var makeUrl = require('./util/makeurl');

var PATH_TOKEN =          'oauth/token';
var PATH_AUTHORIZE =        'oauth/authorize';
var PATH_SIGN_IN =        'security/signin';
var PATH_SIGN_OUT =       'security/signout';

var KEY_PRIVATE_TOKEN =   'emPrivateToken';
var KEY_REFRESH_TOKEN =   'emRefreshToken';
var KEY_ACCESS_TOKEN =    'emAccessToken';

module.exports = function($window, $http, $q, authConfig, BASE_URL) {
  var requestQueue = [];
  var fetchingAccessToken = false;

  function getPrivateToken() { return getToken(KEY_PRIVATE_TOKEN); }
  function getRefreshToken() { return getToken(KEY_REFRESH_TOKEN); }
  function getAccessToken() { return getToken(KEY_ACCESS_TOKEN); }

  function setPrivateToken(token) { setToken(token, KEY_PRIVATE_TOKEN); }
  function setRefreshToken(token) { setToken(token, KEY_REFRESH_TOKEN); }

  function setAccessToken(token) {
    token.expires_at = Date.now() + token.expires_in * 1000;
    setToken(token, KEY_ACCESS_TOKEN);
  }

  function getToken(key) {
    var value = $window.localStorage.getItem(key);

    if (value && (value.charAt(0) == '{' || value.charAt(0) == '[')) {
      return JSON.parse(value);
    }

    return value;
  }

  function setToken(token, key) {
    if (token) {
      var type = typeof token;

      if (type !== 'string' && type !== 'number') {
        token = JSON.stringify(token);
      }

      $window.localStorage.setItem(key, token);
    } else {
      $window.localStorage.removeItem(key);
    }
  }

  function isAuthenticated() {
    return (getPrivateToken() !== null || getRefreshToken() !== null);
  }

  function authorize(config) {
    return $q(function(resolve, reject) {
      var token = getPrivateToken();

      // Check for private api token
      if (token) {
        config.headers = {Authorization: 'OAuth ' + token};
        resolve(config);
        return;
      }

      // Check if OAuth is disabled in config. In that case, browser needs to
      // manage the authentication using session cookies
      if (authConfig.disabled) {
        resolve(config);
        return;
      }

      // Check for OAuth refresh token
      var refreshToken = getRefreshToken();

      if (!refreshToken) {
        reject();
        return;
      }

      ensureAccessToken(refreshToken).then(function(accessToken) {
        config.headers = {Authorization: 'Bearer ' + accessToken.access_token};
        resolve(config);
      }, function() {
        reject();
      });
    });
  }

  function ensureAccessToken(refreshToken) {
    return $q(function(resolve, reject) {
      var accessToken = getAccessToken();

      if (isValidToken(accessToken) && accessToken.refresh_token === refreshToken) {
        // User has a valid access token already, resolve with it
        resolve(accessToken);
      } else {
        // User has no valid token
        requestQueue.push(function(newAccessToken) {
          if (newAccessToken) {
            resolve(newAccessToken);
          } else {
            reject();
          }
        });

        // Only fetch token if we're not already fetching it
        if (!fetchingAccessToken) {
          fetchingAccessToken = true;

          fetchAccessToken(refreshToken).then(function(res) {
            var newToken = res.data;

            setAccessToken(newToken);
            fetchingAccessToken = false;

            // Process any pending requests
            requestQueue.forEach(function(queueFunc) {
              queueFunc(getAccessToken());
            });

            // Clear queue
            requestQueue = [];
          }, function(err) {
            setAccessToken(null);
            fetchingAccessToken = false;

            // Process any pending requests
            requestQueue.forEach(function(queueFunc) {
              queueFunc(null);
            });

            // Clear queue
            requestQueue = [];
          });
        }
      }
    });
  }

  function isValidToken(token) {
    return (token && token.expires_at > Date.now());
  }

  function fetchAccessToken(refreshToken) {
    return $http.post(makeUrl([BASE_URL, PATH_TOKEN]), {
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    });
  }

  function authorizeUrl() {
    var params = {
      client_secret: authConfig.clientSecret,
      client_id: authConfig.clientId,
      redirect_uri: authConfig.redirectUri,
      grant_type: 'authorization_code',
      response_type: 'code',
      state: 'emAuth',
      scope: 'basic'
    };

    return makeUrl([BASE_URL, PATH_AUTHORIZE], params);
  }

  function handleAuthCode(code) {
    return $http.post(makeUrl([BASE_URL, PATH_TOKEN]), {
      grant_type: 'authorization_code',
      code: code,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      state: 'emAuth',
      scope: 'basic',
      redirect_uri: authConfig.redirectUri
    }).then(function(res) {
      var token = res.data;

      setRefreshToken(token.refresh_token);
      setAccessToken(token);
    });
  }

  function loginUrl(redirect) {
    return makeUrl([BASE_URL, PATH_SIGN_IN]) + '?redirect=' + encodeURIComponent(redirect);
  }

  function logoutUrl(redirect) {
    return makeUrl([BASE_URL,PATH_SIGN_OUT]) + '?redirect=' + encodeURIComponent(redirect);
  }

  return {
    getPrivateToken: getPrivateToken,
    setPrivateToken: setPrivateToken,
    getRefreshToken: getRefreshToken,
    setRefreshToken: setRefreshToken,
    isAuthenticated: isAuthenticated,
    loginUrl: loginUrl,
    logoutUrl: logoutUrl,
    authorizeUrl: authorizeUrl,
    handleAuthCode: handleAuthCode,
    authorize: authorize
  };
};
