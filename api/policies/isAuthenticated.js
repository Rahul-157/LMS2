var passport = require('passport');
module.exports = function (req, res, next) {
	req.headers.authorization='Bearer '+req.signedCookies.jwt
		passport.authenticate('jwt', async function (error, user, info) {
		if (error) {
			return res.serverError(error);
		}
		if (!user) {
			return res.redirect("/login")
		}
        req.emp = user;
		next();
	})(req, res);
}; 