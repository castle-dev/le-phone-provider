var q = require('q');
/**
 * A tool for sending texts
 * @class PhoneService
 * @param {PhoneProvider} provider the phone provider which this service delegates to
 * @param {StorageService} storage an instance of le-storage-service that is used to create records
 * @param {string} from the phone number to send the texts from
 * @returns {service}
 */
var PhoneService = function (provider, storage, from) {
  if (!provider) { throw new Error('Phone provider required'); }
  if (!storage) { throw new Error('Instance of le-storage-service required'); }
  if (!from) { throw new Error('From phone number required'); }
  var _queue = [];
  var locked = false;
  var rateLimitDelay = 1000;
  var _storage;
  var _provider;
  var _from;
  _storage = storage;
  _provider = provider;
  _from = from;

  function processQueue () {
    if (!locked) {
      if (_queue.length) {
        locked = true;
        var text = _queue.shift();
        var to = text.to;
        var message = text.message;
        _provider.text(_from, to, message)
        .then(function () {
          var record = _storage.createRecord('Text');
          return record.update({
            from: _from,
            to: to,
            message: message
          });
        })
        .then(function (record) {
          text.deferred.resolve(record);
          locked = false;
          setTimeout(processQueue, rateLimitDelay);
        })
        .catch(function (err) {
          text.deferred.reject(err);
          locked = false;
          setTimeout(processQueue, rateLimitDelay);
        });
      }
    }
  }
  /**
   * Sends a text message
   * @function text
   * @memberof PhoneService
   * @instance
   * @param {string} to the phone number of the recipient
   * @param {string} message the content of the text message
   * @returns {promise} resolves with the newly created text record
   */
  this.text = function (to, message) {
    var deferred = q.defer();
    _queue.push({
      to: to,
      message: message,
      deferred: deferred
    });
    processQueue();
    return deferred.promise;
  };

}

module.exports = PhoneService;
