/*!
 * clout-passport
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
const
	debug = require('debug')('clout-passport:hooks/passport'),
	passport = require('passport'),
	path = require('path'),
	fs = require('fs');

module.exports = {
	initialize: {
		event: 'start',
		priority: 19,
		fn: function (next) {
			var self = this,
				conf = self.config.passport || {},
				getValue = self.utils.getValue;
			// expose passport
			this.passport = passport;

			// ensure directory
			!conf.directory && (conf.directory = 'strategies');
			if (!fs.existsSync(conf.directory)) {
				conf.directory = path.join(self.rootDirectory, conf.directory);
			}
			if (!fs.existsSync(conf.directory)) {
				self.logger.warn('passport strategies directory not found');
			}

			// start
			debug('config', conf);
			debug('initialize passport');

			function loadStrategy(filePath) {
				var name = filePath.split(conf.directory + '/')[1].replace('.js', ''),
					strategy = require(filePath),
					strategyConf = conf[name] || {};
				debug('loading strategy %s', name);
				passport.use(strategy.apply(self, [strategyConf]));
			}

			// load default strategies
			var globPattern = undefined,
				strategyFiles = [];
			conf._directory = conf.directory;
			conf.directory = 'strategies';
			if (conf.useDefault === true) {
				globPattern = path.join(__dirname, 'strategies/**/*.js');
				strategyFiles = self.utils.getGlobbedFiles(globPattern);
				strategyFiles.forEach(loadStrategy);
			}

			if (typeof conf.useDefault === 'object') {
				var strategyBase = path.join(__dirname, 'strategies');
				strategyFiles = [];
				conf.useDefault.forEach(function (strategyName) {
					var strategyFile = path.join(strategyBase, strategyName + '.js');
					fs.existsSync(strategyFile) && strategyFiles.push(strategyFile);
				});
				strategyFiles.forEach(loadStrategy);
			}
			conf.directory = conf._directory;

			// load application strategies
			globPattern = path.join(conf.directory, '**/*.js');
			strategyFiles = this.utils.getGlobbedFiles(globPattern);
			strategyFiles.forEach(loadStrategy);

			// append to middleware
			debug('app.use: passport.initialize');
			this.app.use(passport.initialize());
			debug('app.use: passport.session');
			this.app.use(passport.session());

			// configure serialization and deserialization
			if (conf.serializeUser && conf.serializeUser !== '<PATH_TO_FN>') {
				debug('serializeUser');
				var serializeUser = getValue(conf.serializeUser, self);
				!serializeUser && this.logger.error('conf.serializeUser is invalid');
				serializeUser && passport.serializeUser(serializeUser);
			} else this.logger.warn('Please define passport.serializeUser');
			
			if (conf.deserializeUser && conf.deserializeUser !== '<PATH_TO_FN>') {
				debug('deserializeUser');
				var deserializeUser = getValue(conf.serializeUser, self);
				!deserializeUser && this.logger.error('conf.deserializeUser is invalid');
				deserializeUser && passport.deserializeUser(deserializeUser);
			} else this.logger.warn('Please define passport.deserializeUser');
			next();
		}
	}
};
