const memeModel = require('../models/memeModel');

const formidable = require('formidable');
const fs = require('fs');//used for file upload

function memeModule(server){
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme');
  });

server.get('/upload-meme', function(req,resp){
      resp.render('./pages/upload-meme',{username:req.session.username});
  }) ;



server.post('/uploaded-meme', function(req,resp){
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
    console.log(fields.memeTag);
//    var array = memeTag.map(function(tag){
//        return tag.value;
//    });
      var oldpath = files.image.path;
      var newpath = __dirname + '\\public\\new\\' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        addMeme(fields.memeTitle, fields.memeTag, files.image.name, req.session.username, fields.memePrivacy, function(){
//            for(i=0; i <= hold.length; i++)
//            console.log(fields.memeTag);
        });//addMeme
      });//rename
    });//parse
      resp.render('./pages/uploaded-meme'   );
  });
}
module.exports.Activate = memeModule;
