const LeaveService = require("../services/LeaveService");

module.exports={
    applyLeave : function(req,res){
		if(!req.body.leaveType    || !req.body.fromDate || !req.body.toDate){
            return res.view('partials/applyLeave',
                        {	
                            layout:"template", 
                            status:"error",
                            message:"Leave Type, Leave Start Date, Leave End Date is required"
                        }
                    );
        }
        let leaveData = {
            employee:req.emp.id,
            type:req.body.leaveType,
            status:"PENDING",
            fromDate:req.body.fromDate,
            toDate:req.body.toDate
        }

        return LeaveService.createLeave(leaveData,function(err,leave){
                if(err){
                    return res.view('partials/applyLeave',
                        {	
                            layout:"template", 
                            status:"error",
                            message: err.message
                        }
                    );
                } else
                return res.view('partials/applyLeave',
                {	
                    layout:"template", 
                    status:"success",
                    message: "Applied Successfully"
                }
            );
        });
	},

    manageLeaveApplication: async function(req,res){
        let pendingLeaves = await Leaves.find({status:'PENDING'});
        let rejectedLeaves = await Leaves.find({status:'REJECTED'});
        let approvedLeaves = await Leaves.find({status:'APPROVED'});
        return res.json(pendingLeaves.concat(rejectedLeaves.concat(approvedLeaves)));
    },

    approveLeave: async function(req,res){
        let leaveId = req.params.leaveId;
        let leave;
        try{
            leave = await Leaves.update({id:leaveId}).set({status:"APPROVED"})
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"success",
                    message: "Approved"
                }
            );
        }catch(err){
            console.log(err)
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"error",
                    message: err.message
                }
            );
           
        }
    },
    rejectLeave: async function(req,res){
        let leaveId = req.params.leaveId;
        let leave;
        try{
            leave = await Leaves.update({id:leaveId}).set({status:"REJECTED"})
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"success",
                    message: "Rejected"
                }
            );
        }catch(err){
            console.log(err)
            return res.view('partials/manageLeaveApplication',
                {	
                    layout:"template", 
                    status:"error",
                    message: err.message
                }
            );
           
        }
    }
};