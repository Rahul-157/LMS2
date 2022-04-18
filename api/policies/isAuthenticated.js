var passport = require('passport');
module.exports = function (req, res, next) {
    if(req.emp){
        console.log("Already logged in")
    }
	req.headers.authorization='Bearer '+req.signedCookies.jwt
		passport.authenticate('jwt', async function (error, user, info) {
		if (error) {
			return res.serverError(error);
		}
		if (!user) {
			return res.forbidden("Please Login.")
		}
        req.emp = user;
		next();
	})(req, res);
}; 