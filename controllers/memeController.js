const memeModel = require('../models/memeModel');
const userModel = require('../models/userModel');
const tagModel = require('../models/tagModel');
const path = require('path');
const bodyparser = require('body-parser');

const formidable = require('formidable');
const fs = require('fs');//used for file upload

function memeModule(server){
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme');
  });

    server.get('/search', function(req,resp){
      resp.render('./pages/search',{username:req.session.username});
  });
    
    server.get('/memeCall/:id', function(req,resp){
              var findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>{
           if(foundUser){
         var findMeme = memeModel.findMeme(req.params.id)
         console.log('this is find meme ' + req.params.id);
      findMeme.then((foundMeme)=>
        {
          if(foundMeme){
            console.log('tae');
              resp.render('./pages/meme1',{
                  username:req.session.username,
                  memeID: req.params.id,
                  memeTitle: foundMeme.memeTitle,
                  memeTag: foundMeme.memeTag ,
                  memeImage: foundMeme.memeImage,
                  memeOwner: foundMeme.memeOwner,
                  memePrivacy: foundMeme.memePrivacy
                                          })
                      }
                else
                    {
                        resp.redirect('./inaccessible-meme');
                    }
        })
                    }
                           else
                    {
                        resp.render('./pages/inaccessible-meme');
                    }
                              });
        });
                    
  server.post('/searched', function(req,resp){
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields){
      console.log('eat' + fields.search);
      memeModel.searchMeme(fields.search, function(list){
      const data = { list:list};
      var findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>
                     console.log(foundUser));
      resp.render('./pages/index',{data:data, username:req.session.username});
        });
    });
  });
server.get('/upload-meme', function(req,resp){
    if(req.session.username)
      resp.render('./pages/upload-meme');
    else
        {
        resp.redirect('./log-in')
        }
  }) ;
    
server.post('/edit', function(req,resp){
          var form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
//                            console.log(req.body.memeID);
              console.log(fields.memeID);
            var oldpath = files.image.path;
            var newpath = path.join('public','new',files.image.path)
            console.log(oldpath);
            console.log(files.image.path);
            console.log(newpath);
            fs.rename(oldpath, newpath, function (err) {
                memeModel.editMeme(fields.memeID, fields.memeTitle, fields.memeTag, files.image.name, fields.memePrivacy);
                            console.log(fields.memeID);
                            resp.redirect('/memeCall/' + fields.memeID);
                    });
          });
  }) ;

server.post('/uploaded-meme', function(req,resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.image.path;
      var newpath = 'public\\new\\' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        var instance = {
            memeTitle: fields.memeTitle,
            memeTag: fields.memeTag,
            memeImage: files.image.name,
            memeOwner: req.session.username,
            memePrivacy: fields.memePrivacy
        }
        console.log(instance);
                memeModel.pushMeme(instance);
                    userModel.pushMeme(instance, req.session.username);
                if (err) throw err;

      });//rename
    });//parse
      resp.redirect('/');
});

}
module.exports.Activate = memeModule;
