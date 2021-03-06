'use strict';

var _ = require('underscore');

function Request(options) {
  this.method = options.method && options.method.toLowerCase();
  this.path = options.path;
  this.query = options.query || {};
  this.headers = options.headers || {};
  this.body = options.body || {};
}

Request.prototype.match = function (request) {
  if (request.constructor !== Request) {
    request = new Request(request);
  }

  var isMethodTheSame = request.method && request.method.toLowerCase();
  isMethodTheSame = _.isEqual(this.method, isMethodTheSame);

  return isMethodTheSame &&
        _.isEqual(this.path, request.path) &&
        _.isEqual(this.query, request.query) &&
        // https://github.com/realestate-com-au/pact/wiki/Matching-gotchas
        // #but-pact-breaks-postels-law-for-request-headers
        areAllExpectationHeadersPesentInRequest(this.headers, request.headers) &&
        _.isEqual(this.body, request.body);
};

function areAllExpectationHeadersPesentInRequest(expHeaders, reqHeaders) {
  for(var entry in expHeaders) {
    // https://nodejs.org/api/http.html#http_message_headers
    // ... Header names are lower-cased. ...
    var temp = entry.toLowerCase();
    if ( reqHeaders[temp] !== expHeaders[entry] ) {
      return false;
    }
  }
  return true;
} 

module.exports = Request;