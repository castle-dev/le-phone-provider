var PhoneService = function (provider, storage, from) {
  if (!provider) { throw new Error('Phone provider required'); }
  if (!storage) { throw new Error('Instance of le-storage-service required'); }
  if (!from) { throw new Error('From phone number required'); }
  var _provider = provider;
  var _storage = storage;
  var _from = from;

  this.text = function (to, message) {
    return _provider.text(_from, to, message)
    .then(function () {
      var record = _storage.createRecord('Text');
      return record.update({
        from: _from,
        to: to,
        message: message
      }).then(function () { return record; });
    });
  }
}

module.exports = PhoneService;
