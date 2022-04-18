const logger  = sails.log
const passport = require('passport');
const CipherService = require('../services/CipherService');

module.exports={
    dashboard : function(req,res){
		res.view('partials/dashboard',{	layout:"template"	})
	},
};