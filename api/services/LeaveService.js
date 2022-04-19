module.exports = {
    createLeave : async function(leaveData,cb){
        let leaveType = await Leavetype.findOne({type:leaveData.type});
        let balanceLeaves = await getAvailableLeaves(leaveData.employee,leaveType.id)
        if(!balanceLeaves)
            return cb({message:"Error fetching Balance leaves for "+leaveData.employee},null);
        let totalDays = DateService.dateDiffInDays(leaveData.toDate,leaveData.fromDate)+1
        if(totalDays<0){
            return cb({message:"Can not apply in past"},null);
        }
        else if(parseInt(balanceLeaves.balance)>=totalDays){
            let leave
            try{
                leave  = await Leaves.create(leaveData);
            } catch (err){
                return cb({message:"Error Creating Leave"}, {});
            }
            await setAvailableLeaves(leaveData.employee,leaveType.id,parseInt(balanceLeaves.balance)-totalDays)
            return cb(null, leave);

        }else {
            return cb({message:"No available leaves for type " +leaveData.type},null);
        }
    },
    populateBalanceLeaves: async function (empId){
        let sickLeave = await Leavetype.findOne({type:"SICK_LEAVE"});
        let casualLeave = await Leavetype.findOne({type:"CASUAL_LEAVE"});
        let studyLeave = await Leavetype.findOne({type:"STUDY_LEAVE"});
        try{
            let balanceSickLeaves = await Balanceleaves.create({type:sickLeave.id,employee:empId,balance:process.env.sickLeave});
            let balanceCasualLeaves = await Balanceleaves.create({type:casualLeave.id,employee:empId,balance:process.env.casualLeave});
            let balanceStudyLeaves = await Balanceleaves.create({type:studyLeave.id,employee:empId,balance:process.env.studyLeave});
            return [balanceSickLeaves,balanceCasualLeaves,balanceStudyLeaves];
        } catch (err){
            console.log(err)
            deleteEmployee(empId)
            return null; 
        }
    }
};

async function getAvailableLeaves(empId,type){
    let balanceLeaves = await Balanceleaves.findOne({type:type,employee:empId});
    if(!balanceLeaves)
        return null
    return balanceLeaves;
}


async function setAvailableLeaves(empId,type,balance){
    let balanceLeaves;
    try{
     balanceLeaves = await Balanceleaves.update({type:type,employee:empId},{balance:balance});
    } catch (err){
        console.log(err)
    }
    return balanceLeaves.balance;
}

