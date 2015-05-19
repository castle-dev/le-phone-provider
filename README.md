le-phone-service
=========

**Send texts**

## Installation

  `npm install le-phone-service`

## Usage

```
  var storage = /* initialize storage service */
  var provider = /* initialize phone provider (such as le-phone-provider-twilio) */
  var PhoneService = require('le-phone-service');
  var from = /* your phone number */
  var phone = new PhoneService(provider, storage, from);

  phone.text('3138675309', 'Hello!')
  .then(function (record) {
    ...
  });
```

## Tests

* `npm test` to run unit tests once
* `gulp tdd` to run unit and e2e tests when tests change
* `gulp coverage` to run unit tests and create a code coverage report

## Contributing

Please follow the project's [conventions](https://github.com/castle-dev/le-phone-service/blob/develop/CONTRIBUTING.md) or your changes will not be accepted

## Release History

* 0.1.0 Initial release
