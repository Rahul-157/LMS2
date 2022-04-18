const logger  = sails.log
const passport = require('passport');
const CipherService = require('../services/CipherService');

module.exports={
    login_view : function(req,res){
		res.view('partials/login',{	layout:"template",	})
	},

    tmp:function(req,res){
        res.ok()
    },

    login: async function (req, res) {
		if (!req.body.email || !req.body.password) {
			return res.view('partials/login',{
				status: 'error',
				layout:"template",
				message:"Email and Password both are required"
			});
		}
		
		let emp = await Employee.findOne({
			email: req.body.email
		});
		if (!emp) {
			return res.view('partials/login',{
				status: 'error',
				layout:"template",
				message:"You are not registered. Click here to <a href='/signup'>Signup</a>"
			});
		}
		try {
			if (emp.password) {
				passport.authenticate('local', function (err, emp, info) {
					if ((err) || (!emp)) {
						return res.view('partials/login',{
							status: 'error',
							message: info,
							layout:"template",
						});
					} else {
						req.login(emp, function (err) {
							if (err) {
								return res.serverError(err);
							} else {
								res.cookie('jwt', CipherService.createToken(emp), {
									secure: req.connection.encrypted ? true : false,
									httpOnly: true,
									signed:true
								});
								return res.redirect('/tmp')
							}
						})
					}
				})(req, res);
			} 
		} catch (err) {
			logger.info('Login Error   :   ', err);
			return res.serverError("Try <a href='/login'>Signing in</a>  again! ")
		}
	},
};