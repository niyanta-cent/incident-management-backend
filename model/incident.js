let mongoose = require('mongoose');
let incidentModel = mongoose.Schema
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
       incidentType: 
       {
            type: String,
            default: '',
            trim: true,
         //   required: 'Incident type is required'
       },
       incidentDescription: 
       {
            type: String,
            default: '',
            trim: true,
        //    required: 'Incident description is required'
       },
       incidentPriority: 
       {
            type: String,
            default: '',
            trim: true,
          //  required: 'Incident priority is required'
       },
       incidentStatus: 
       {
            type: String,
            default: 'NEW',
            trim: true,
           // required: 'Incident Status is required'
       },
       contactNumber: 
       {
            type: String,
            default: '',
            trim: true,
           // required: 'Incident Status is required'
       },
       incidentResolution: 
       {
            type: String,
            default: '',
            trim: true,
           // required: 'Incident resolution is required'
       },
       incidentRecordNumber:
       {    
           
            type: String,
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
        collection: "incidents"
    }
);

module.exports = mongoose.model('Incident', incidentModel);