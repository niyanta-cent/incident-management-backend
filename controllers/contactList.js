let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
// create a reference to the model
let contactListModel = require('../model/contactListModel');

module.exports.displayContactList = (req, res, next) => {

    contactListModel.find((err, contactList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {

            //console.log("contactList123: ",contactList);
            contactList.sort(function(a, b){
                if(a.contact_name.toUpperCase() < b.contact_name.toUpperCase()) { return -1; }
                if(a.contact_name.toUpperCase() > b.contact_name.toUpperCase()) { return 1; }
                return 0;
            })
            res.render('businessContactList/list', {title: 'Business Contact List', ContactList: contactList, displayName: req.user ? req.user.displayName : ''});      
        }
    });
}

module.exports.displayAddContact = (req, res, next) => {
           
}

module.exports.processAddContact = (req, res, next) => {
    let newContact = contactListModel({
        "contact_name": req.body.contact_name,
        "contact_number": req.body.contact_number,
        "email": req.body.email,
    });
    console.log("newContact_123",newContact);
    contactListModel.create(newContact, (err, contact) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the book list
            //res.redirect('/contact-list');
            res.status(200).send({});
        }
    });
    

}

module.exports.getEditData = (req, res, next) => {
    let id = req.params.id;

    contactListModel.findById(id, (err, contactToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            
            res.json(contactToEdit);
        }
    });
}

module.exports.processEditContact = (req, res, next) => {
    
    let id = req.params.id

    let modifiedContact = contactListModel({
        "_id": id,
        "contact_name": req.body.contact_name,
        "contact_number": req.body.contact_number,
        "email": req.body.email,
    });

    console.log("modifiedContact", modifiedContact);

    contactListModel.updateOne({_id: id}, modifiedContact, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the book list
            //res.redirect('/book-list');
            res.status(200).send({});
        }
    });
    

}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    contactListModel.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the book list
             //res.redirect('/book-list');
             res.status(200).send({});
        }
    });
}



