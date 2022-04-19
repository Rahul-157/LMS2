/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */




 module.exports.bootstrap = async function(cb) {
	let roles = await Role.count({})
	if(!roles || roles==0){
		await Role.destroy({});
		await Role.create({
			role: "ADMIN"
		});
		await Role.create({
			role: "EMPLOYEE"
		});
	}
	let leavetypes=await Leavetype.count({})
	if(!leavetypes || leavetypes==0){
		await Leavetype.destroy({});
		await Leavetype.create({
			type: 'SICK_LEAVE',
		});
	
		await Leavetype.create({
			type: 'CASUAL_LEAVE',
		});
	
		await Leavetype.create({
			type: 'STUDY_LEAVE',
		});
	}
	let adminEmp = Employee.findOne({email:"a@b.c"});
	if(!adminEmp)
		await EmployeeService.createEmployee({
			name: 'Admin',
			password: 'admin@rocks',
			email:'a@b.c',
			role: await Role.findOne({role:'ADMIN'})
		},function(err,emp){
			if(err)
				throw err;
		});
  cb()
};
