/*!
 * clout-passport
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
module.exports = {
	passport: {
		directory: '/strategies',
		serializeUser: '<PATH_TO_FN>', // e.g. models.User.serializeUser
		deserializeUser: '<PATH_TO_FN>' // e.g. models.User.deserializeUser
	}
};
