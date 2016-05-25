/*!
 * clout-passport
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
const 
    debug = require('debug')('clout-passport:strategies/local'),
    LocalStrategy = require('passport-local');

module.exports = function (conf) {
    var getValue = this.utils.getValue,
    	_conf = this.config.passport._local || {},
    	authenticate = getValue(_conf.authenticateFn, this);

    debug('loading local strategy');

	if (!authenticate) {
		debug('authenticate function not found');
	}
	
    return new LocalStrategy(conf, function (username, password, cb) {
    	if (!authenticate) {
    		return cb('authenticate function not found');
    	}
        authenticate(username, password)
            .then(function (user) {
                cb(null, user);
            }).catch(cb);
    });
};