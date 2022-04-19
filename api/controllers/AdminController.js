module.exports={
    dashboard : async function(req,res){
		res.locals.user=req.emp
		let totalEmp = await Employee.count({});
		let pendingLeaves = await Leaves.count({status:'PENDING'});
		let approvedLeaves = await Leaves.count({status:'APPROVEED'});
		let rejectedLeaves = await Leaves.count({status:'REJECTED'});

		res.view('partials/dashboard',
			{	
				layout:"template",
				data: {
					totalEmp:totalEmp,
					pendingLeaves:pendingLeaves,
					approvedLeaves:approvedLeaves,
					rejectedLeaves:rejectedLeaves,
					totalLeaves:rejectedLeaves+approvedLeaves+pendingLeaves
				}
			})
	},

	manage_leaves: async function(req,res){
		res.locals.user=req.emp
        let pendingLeaves = await Leaves.find({status:'PENDING'});
        let rejectedLeaves = await Leaves.find({status:'REJECTED'});
        let approvedLeaves = await Leaves.find({status:'APPROVED'});
        return  res.view('partials/manageLeaveApplication',
            {	
                layout:"template",
                data:pendingLeaves.concat(rejectedLeaves.concat(approvedLeaves))
            }
        );
    },

	approveLeave: async function(req,res){
		res.locals.user=req.emp
        let leaveId = req.params.leaveId;
        let leave;
        try{
            leave = await Leaves.update({id:leaveId}).set({status:"APPROVED"})
            return res.redirect("/manage_leaves")
        }catch(err){
            console.log(err)
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"error-persistent",
                    message: err.message + " Click <a href='/manage_leaves'>here</a>"
                }
            );
           
        }
    },
    rejectLeave: async function(req,res){
		res.locals.user=req.emp
        let leaveId = req.params.leaveId;
        let leave;
        try{
            leave = await Leaves.update({id:leaveId}).set({status:"REJECTED"})
            return res.redirect("/manage_leaves")

        }catch(err){
            console.log(err)
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"error-persistent",
                    message: err.message+ " Click <a href='/manage_leaves'>here</a>"
                }
            );
           
        }
    },
};