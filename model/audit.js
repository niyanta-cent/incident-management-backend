let mongoose = require('mongoose');

let auditModel = mongoose.Schema
(
    {
        userName: 
        {
            type: String,
            default: '',
            trim: true,
            //unique:true,
         //   required: 'username is required'
        },
       incidentId:
       {
           type: String,
           default:'',
           trim:true
       },
       logs:
       {    
           
            type:Array,
            default:'',
            trim: true
            
       },
       createdOn: 
       {
            type:String,
            default: null,
       },
       updatedOn: 
       {
            type: String,
            default: null,
       }
    },
    {
        collection: "audits"
    }
);

module.exports = mongoose.model('Audit', auditModel);