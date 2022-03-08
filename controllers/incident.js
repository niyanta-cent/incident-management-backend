let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let userModel = require("../model/user");
let User = userModel.User;
// create a reference to the incident model
let incident = require('../model/incident');
let audit= require('../model/audit');

const { isEmptyObject } = require('jquery');


module.exports.getAllIncidents = (req,res) => {
    incident.find((err, incidentList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            console.log("incidentList: ",incidentList);
            res.status(200).send(incidentList);
        }
    });
}

module.exports.getIncidentsByUser = (req,res) => {
    let username = req.params.username;

    User.find({ username: username }, function (err, user) {

        if(err) 
        {
          return res.send(err);
        } 
        else if (typeof user === "undefined" || user === null) {
    
          return res.json({
            code: "304",
            message: "Invalid Username!",
          });
    
        } 
        else {
            console.log("user888", user);
            let userDetails = user[0];

            if(!userDetails){
                res.status(500).send({status:"error", message:"User Not Found"});
            }
            if(userDetails && userDetails.userType === 'Customer')
            {
                incident.find({"userName":userDetails.username}, (err, incidentList) => {
                    if(err)
                    {
                        console.log(err);
                        res.end(err);
                    }
                    else
                    {   
                        
                        incidentList.forEach(incident=>{
                            let incidentDate = new Date(incident.createdOn);
                            let day = incidentDate.getDate();
                            let month = incidentDate.getMonth()+1;
                            let year = incidentDate.getFullYear();
                            incident.createdOn = ""+day+"/"+month+"/"+year;
                        })
                        res.status(200).send(incidentList);
                    }
                });
            }
            else{
                incident.find({},(err, incidentList) => {
                    if(err)
                    {
                        console.log(err);
                        res.end(err);
                    }
                    else
                    {   
                        incidentList.forEach(incident=>{
                            let incidentDate = new Date(incident.createdOn);
                            let day = incidentDate.getDate();
                            let month = incidentDate.getMonth()+1;
                            let year = incidentDate.getFullYear();
                            incident.createdOn = ""+day+"/"+month+"/"+year;
                        })
                        res.status(200).send(incidentList);
                    }
                })

            }
        }
      });


    
}

module.exports.processAddIncident = (req, res, next) => {

    let t = new Date().toUTCString();
    console.log("t: ", t);
    let recordNumber=0;
    incident.findOne().sort('-createdOn').exec(function(err, Incident) { 
        console.log("Incident5677", Incident);
        if(Incident){

            let incidentDate = new Date(Incident.createdOn);
            let todaysDate = new Date();

            let newDate = ""+ todaysDate.getDate()+"/"+(todaysDate.getMonth()+1)+"/"+todaysDate.getFullYear();
            let latestDate = ""+ incidentDate.getDate()+"/"+(incidentDate.getMonth()+1)+"/"+incidentDate.getFullYear();
            console.log("newDate", newDate);
            console.log("latest_date", latestDate);

            if(latestDate === newDate){
                let recNum= Incident.incidentRecordNumber.split('-');
                recordNumber= recNum[0]+'-'+((parseInt(recNum[1])+1));
            }else{
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                recordNumber=dd+mm+yyyy.toString().slice(2)+'-'+1;
            }
            
        }
        else{
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            recordNumber=dd+mm+yyyy.toString().slice(2)+'-'+1;
        }
        let newIncident = incident({    
            "userName": req.body.userName,
            "incidentType": req.body.incidentType,
            "incidentDescription": req.body.incidentDescription,
            "incidentRecordNumber":recordNumber,
            "incidentPriority": req.body.incidentPriority,
            "contactNumber":req.body.contactNumber,
            "createdOn": new Date(),
            "updatedOn": new Date(),
         //   "incidentResolution":req.body.incidentResolution
        });
        incident.create(newIncident, (err, Incident) =>{
            if(err)
            {
                console.log(err);
                res.end(err);
            }
            else
            {
               console.log("Incident created.");
               req.body.incidentRecordNumber=recordNumber;
               createAuditLogs(req,res);
              // res.status(200).send('ok');
               res.send(Incident);
            }
        });
    });
    
    

    
    
}


module.exports.processUpdateIncident = (req, res, next) => {
    let id = req.params.id
    let statusChanged=false;


    const token = req.headers["x-access-token"];
    let decodedValue = decodingJWT(token);
    let loggedUser= decodedValue.username;

    //incident.findOne().exec(function(err, Incident) { 
    incident.find({"_id":id}, (err, Incident) => {
        console.log("Incident123_5",Incident);
        if(err){
            console.log(err);
            res.end(err);
        }else{
            if(Incident.incidentStatus!==req.body.incidentStatus){
                statusChanged=true;
            }
            let updatedIncident = incident({
                "_id": id,
                "userName": req.body.userName,
                "contactNumber": req.body.contactNumber,
                "incidentRecordNumber":req.body.incidentRecordNumber,
                "incidentType": req.body.incidentType,
                "incidentDescription": req.body.incidentDescription,
                "incidentPriority": req.body.incidentPriority,
                "incidentStatus":req.body.incidentStatus,
                "incidentResolution":req.body.incidentResolution,
                "createdOn": Incident[0].createdOn,
                "updatedOn":Date.now
                });
                
                incident.updateOne({_id: id}, updatedIncident, (err) => {
                    if(err) 
                    {
                        console.log(err);
                        res.end(err);
                    }
                    else
                    {
                       console.log("incident updated.");
                       if(statusChanged){
                        req.body.action= 'Ticket status updated by '+loggedUser;
                       }else{
                        req.body.action= 'Ticket updated by '+loggedUser;
                       }
                         req.body.ticketId=updatedIncident.incidentRecordNumber;
                       addAuditLogs(req,res);
                      // res.status(200).send('ok');
                      res.send(updatedIncident);
                       
                    }
                });
            
        }
    });
   }

module.exports.processCloseIncident = (req,res,next) => {
    let id = req.params.id;

    const token = req.headers["x-access-token"];
    let decodedValue = decodingJWT(token);
    let loggedUser= decodedValue.username;
    incident.find({"_id":id}, (err, incidentList) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {   
            let incidentDetails = incidentList[0];
            console.log("incidentDetails",incidentDetails);
            console.log("req.body", req.body);

            incidentDetails.incidentResolution = req.body.incidentResolution;
            incidentDetails.incidentStatus = "CLOSED";
            incidentDetails.updatedOn = Date.now;

            let updatedIncident = incident(incidentDetails);

            incident.updateOne({"_id": id}, updatedIncident, (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    console.log("incident updated.");
                    req.body.action= 'Ticket closed by '+loggedUser;
                    req.body.ticketId=updatedIncident.incidentRecordNumber;
                    addAuditLogs(req,res);
                    // res.status(200).send('ok');
                    res.status(200).send({status:"ok", message:"Incident Closed sucessfully"});
                    
                }
            });
            
            // res.status(200).send(incidentDetails);
        }
    });

}


module.exports.processDeleteIncident = (req, res, next) => {
    let id = req.params.id;

    incident.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             console.log("incident deleted.")
             res.status(200).send('ok');
        }
    });
}

module.exports.getIncidentByRecordNumber = (req,res,next) => {
    let incidentRecordNumber = req.params.incidentRecordNumber;

    incident.find({ incidentRecordNumber: incidentRecordNumber }, function (err, incident) {

        if(err) 
        {
          return res.send(err);
        } 
 
        else {
            
            let incidentDetails = incident[0];
            console.log("incidentDetails", incidentDetails);
            if(!incidentDetails){
                res.status(500).send({status:"error", message:"Ticket does not exist"});
            }


            res.status(200).send({status:'ok', incidentDetails: incidentDetails});
        }
      });
}
createAuditLogs=(req,res)=>{
        
    let logObject = {
       // "userName":req.body.userName,
        "action":`Ticket created by ${req.body.userName}`,
        "createdOn":new Date()
    }
    console.log(logObject);
let newAudit = audit({    
    "userName": req.body.userName,
    "incidentId":req.body.incidentRecordNumber,
    "logs": logObject,
    "createdOn": new Date(),
    "updatedOn": new Date()
 
});
audit.create(newAudit, (err, Audit) =>{
    if(err)
    {
        console.log(err);
        res.end(err);
    }
    else
    {
       console.log("audit log created.");
      
    }
});
}
module.exports.getAuditLogs=(req,res,next)=>{
    let id= req.params.id;
    audit.find({
        "incidentId":id},(err,Audit)=>{
            if(err){
                console.log(err);
                res.end(err);
            }else{
                res.send(Audit);
            }
        }
    );
    
}

addAuditLogs=(req,res)=>{
    let ticketId = req.body.ticketId;
    console.log(req.body.ticketId);
    audit.find({
        "incidentId":ticketId},(err,Audit)=>{
            if(err){

                console.log(err);
                res.end(err);
            }else{
                let logObject = {
                    "action":req.body.action,
                    "createdOn":new Date()
                }
                let auditLogs= Audit[0].logs ;
                Audit[0].logs.push(logObject);
               Audit.logs=auditLogs;
               audit.updateOne({incidentId: ticketId}, Audit[0], (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                   console.log("audit updated.")
                                     
                }
            });
        
            }
        }
    );
   
}
const decodingJWT = (token) => {
  
    if(token !== null || token !== undefined){
     const base64String = token.split(".")[1];
     const decodedValue = JSON.parse(Buffer.from(base64String,    
                          'base64').toString('ascii'));
     console.log(decodedValue);
     return decodedValue;
    }
    return null;
  }