const memeModel = require('../models/memeModel');
const userModel = require('../models/userModel');
const tagModel = require('../models/tagModel');
const path = require('path');
const bodyparser = require('body-parser');
const timestamp = require('time-stamp');

const formidable = require('formidable');
const fs = require('fs');//used for file upload

function memeModule(server){
  server.use(bodyparser.json());
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme');
  });

    server.get('/search', function(req,resp){
      resp.render('./pages/search',{username:req.session.username});
    });
    
    server.post('/likedMeme', function(req,resp){
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        memeModel.addLike(fields.memeID, req.session.username);
        resp.redirect('/');
      });
    });
    
    server.get('/memeCall/:id', function(req,resp){
              var findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>{
           if(foundUser){
         var findMeme = memeModel.findMeme(req.params.id)
         memeModel.viewComment(req.params.id, function(list){
           const data = {list: list}
      findMeme.then((foundMeme)=>
        {
          if(foundMeme){
              resp.render('./pages/meme1',{
                  username:req.session.username,
                  memeDate:foundMeme.memeDate,
                  memeTime: foundMeme.memeTime,
                  memeID: req.params.id,
                  memeTitle: foundMeme.memeTitle,
                  memeTag: foundMeme.memeTag ,
                  memeImage: foundMeme.memeImage,
                  memeOwner: foundMeme.memeOwner,
                  memePrivacy: foundMeme.memePrivacy,
                  comment: foundMeme.comment,
                  data: data
                                          })
                      }
                else
                    {
                        resp.redirect('./inaccessible-meme');
                    }
                  })
                });
              }
                           else
                    {
                        resp.render('./pages/inaccessible-meme');
                    }
                              });
        });
      
server.get('/searched', function(req,resp){
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields){
        console.log(req.query.search);
      memeModel.searchMeme(req.query.search, function(list){
      const data = { list:list};
      var findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>
      resp.render('./pages/index',{data:data, username:req.session.username})
            )
        });
    });
  });
server.get('/upload-meme', function(req,resp){
    if(req.session.username)
      resp.render('./pages/upload-meme', {username:req.session.username});
    else
        {
        resp.redirect('./log-in')
        }
  }) ;
    
server.post('/delete', function(req,resp){
          var form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
            userModel.deleteMeme(req.session.username,fields.memeID);
                memeModel.deleteMeme(fields.memeID);
                            resp.redirect('/');
                    
          });
  }) ;

  
  server.post('/add-comment', function(req, resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields){
      let instance = {
        commentOwner: req.session.username,
        commentDesc: fields.comment 
      }
        memeModel.pushComment(fields.memeID, instance);

        resp.redirect('/memeCall/' + fields.memeID)
    });
    
  });

server.post('/uploaded-meme', function(req,resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.image.path;
      var newpath = path.join('./','public','new',path.basename(files.image.path)+ files.image.name)
      fs.rename(oldpath, newpath, function (err) {
        var instance = {
            memeTitle: fields.memeTitle,
            memeDate: Date(),
            memeTime: timestamp("<YYYY-MM-DD-HH"),
            memeTag: fields.memeTag,
            memeImage: path.basename(files.image.path) + files.image.name,
            memeOwner: req.session.username,
            memePrivacy: fields.memePrivacy,
            memeShare: fields.memeShare
        }
                memeModel.pushMeme(instance, function(newInstance){
                console.log(newInstance);
                  userModel.pushMeme(req.session.username, newInstance);
                resp.redirect('/');
                if (err) throw err;
                })
      });//rename
    });//parse
      
});
server.post('/edit', function(req,resp){
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields.tite);
    var oldpath = files.image.path;
    var newpath = path.join('./','public','new',path.basename(files.image.path) + files.image.name)
    fs.rename(oldpath, newpath, function (err) {
      console.log(req.session.username);
      userModel.editMeme(req.session.username, fields.memeID,fields.memeTitle, fields.memeTag, path.basename(files.image.path) + files.image.name, fields.memePrivacy );
        memeModel.editMeme(fields.memeID, fields.memeTitle, fields.memeTag, path.basename(files.image.path) + files.image.name, fields.memePrivacy);
                    resp.redirect('/memeCall/' + fields.memeID);
            });
  });
}) ;


}
module.exports.Activate = memeModule;
