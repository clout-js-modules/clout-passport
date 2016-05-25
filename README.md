clout-passport
==================
## Install
In the directory of your clout-js application, do the following;

1) Install this package
```bash
npm install clout-passport
```

2) Add this module to ```package.json``` or ```clout.json```
```JSON
{
    ...
    "modules": ["clout-passport"]
    ...
}
```

## Configure
Create a new file ```passport.default.js``` or ```passport.<YOUR_ENV>.js``` in ```/conf``` directory with the following JavaScript.
```JavaScript
module.exports = {
    passport: {
        directory: '/strategies',
        serializeUser: '<PATH_TO_FN>', // e.g. models.User.serializeUser
        deserializeUser: '<PATH_TO_FN>', // e.g. models.User.deserializeUser
        /** Configure strategies */
        facebook: { // this can be seen in passport documentation
            clientID: '<CLIENT_ID>',
            clientSecret: '<CLIENT_SECRET>',
            callbackURL: '<CALLBACK_URL>',
            profileFields: ['id', 'displayName']
        }
        /** load stratergies from this module (default: false) */
        useDefault: true, // load all strategies
        useDefault: ['local'], // selective loading
        /** configure provided stratergy */
        _facebook: {

        }
    }
};
```

## Usage
Create a new directory in your project called ```/strategies```. This directory will contain all your passport stratergies.

### Example strategy
local.js
```
/**
 * Local Stratergy Example
 */
const LocalStrategy = require('passport-local');
module.exports = function (conf) {
    var self = this; // clout context
    return new LocalStrategy(conf, function (username, password, cb) {
        self.models.User
            .authenticate(username, password)
            .then(function (user) {
                cb(null, user);
            }).catch(cb);
    });
};
```

### Default strategies
These strategies can be enabled in the configuration.

#### Local
##### Configure
```
{
    ...
    passport: {
        ...
        _local: {
            authenticateFn: 'models.User.authenticate' // Path to authenticate function
        }
        ...
    }
    ...
}
```

##### Usage
Authenticate function should be defined in the models. An example of an authentication function is the following;
```
var User = module.exports = {},
    clout = require('clout.js');
...
// User Sequalize Model
...
User.authenticate = function authenticate(username, password) {
    var deferred = clout.Q.defer(),
    User.query({
        username: username,
        password: password
    }).then(function (user) {
        if (!user) {
            return deferred.reject('Username or Password is incorrect');
        }
        deferred.resolve(user);
    }, deferred.reject);
    return deferred.promise;
}
```

#### Coming Soon
- Facebook
- Twitter
- Google

