const memeModel = require('../models/memeModel');
const userModel = require('../models/userModel');

const formidable = require('formidable');
const fs = require('fs');//used for file upload

function memeModule(server){
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme');
  });

server.get('/upload-meme', function(req,resp){
      resp.render('./pages/upload-meme');
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
