const memeModel = require('../models/memeModel');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel');
const path = require('path');
const bodyparser = require('body-parser');
const timestamp = require('time-stamp');

const formidable = require('formidable');
const fs = require('fs');//used for file upload

function commentModule(server){
    server.use(bodyparser.json());


    server.post('/add-comment', function(req, resp){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
          let instance = {
            _memeID: fields.memeID,
            commentOwner: req.session.username,
            commentDesc: fields.comment ,
            nestedComments:[]
          }
            commentModel.pushComment(instance, function(newInstance){
                memeModel.pushComment(fields.memeID, newInstance);
                resp.redirect('/memeCall/' + fields.memeID)
            });
        });

    server.post('/add-nested', function(req, resp){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
          let instance = {
            _memeID: fields.memeID,
            commentOwner: req.session.username,
            commentDesc: fields.comment ,
            nestedComments:[]
                }
            commentModel.pushNested(fields.memeID, instance, function(newInstance){
                memeModel.pushComment(fields.memeID, newInstance);
                resp.redirect('/memeCall/' + fields.memeID)
             })
            });

        })
        
    });
}
module.exports.Activate = commentModule;