module.exports={
    dateDiffInMillis : function(date1,date2){
        let sDate = new Date(date1);
        let eDate = new Date(date2);
        return Math.abs(sDate - eDate);
    },

    dateDiffInDays : function(date1,date2){
        return Math.ceil(this.dateDiffInMillis(date1,date2)/(1000*60*60*24))
    }
};