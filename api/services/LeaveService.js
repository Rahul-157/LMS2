module.exports = {

    updateLeave : async function(leaveId,status,cb){
		await Leaves.update({id:leaveId},{status:status})
        .exec(function (error, leave) {
            if (error) return cb(error, {});
            return cb(null, leave);
        });
	},

    createLeave : async function(leaveData,cb){
        let leaveType = await LeaveType.findOne({type:leaveData.type});
        let balanceLeaves = await getAvailableLeaves(leaveData.empId,leaveData.type)
        if(balanceLeaves>0){
            await Leaves.create(leaveData)
            .exec(function ({message:error}, leave) {
                if (error) return cb(error, {});


                return cb(null, leave);
            });
        }else {
            return cb({message:"No available leaves"},null);
        }
    }


   

};

async function getAvailableLeaves(empId,type){
    let balanceLeaves = await Balanceleaves.findOne({type:type,employee:empId});
    return balanceLeaves.balance;
}


async function setAvailableLeaves(empId,type,balance){
    let balanceLeaves = await Balanceleaves.update({type:type,employee:empId},{balance:balance-1});
    return balanceLeaves.balance;
}
