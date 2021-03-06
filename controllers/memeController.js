const memeModel = require('../models/memeModel');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel');
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
      let form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        memeModel.addLike(fields.memeID, req.session.username);
        resp.redirect('/memeCall/' + fields.memeID);
      });
    });
    
    server.get('/memeCall/:id', function(req,resp){
              let findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>{
           if(foundUser){
         let findMeme = memeModel.findMeme(req.params.id)
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
      let form = new formidable.IncomingForm();
      form.parse(req, function(err, fields){
        console.log(req.query.search);
      memeModel.searchMeme(req.query.search, function(list){
      const data = { list:list};
      let findUser = userModel.findOne(req.session.username);
       findUser.then((foundUser)=>
      resp.render('./pages/index',{data:data, username:req.session.username})
            )
        });
    });
  });
server.get('/upload-meme', function(req,resp){
    userModel.findUsers(function(list){
      const data = {list:list};
    if(req.session.username)
      resp.render('./pages/upload-meme', {data:data,username:req.session.username});
    else
        {
        resp.redirect('./log-in')
        }
      })
  }) ;
  
  server.get('/multi-upload', function(req,resp){
    userModel.findUsers(function(list){
      const data = {list:list};
    if(req.session.username)
      resp.render('./pages/multi-upload', {data:data,username:req.session.username});
    else
        {
        resp.redirect('./log-in')
        }
      })
  }) ;

server.post('/delete', function(req,resp){
          let form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
            userModel.deleteMeme(req.session.username,fields.memeID);
                memeModel.deleteMeme(fields.memeID);
                            resp.redirect('/');
                    
          });
  }) ;

server.post('/uploaded-meme', function(req,resp){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let is = fs.createReadStream (files.image.path);
      let os = fs.createWriteStream(path.join('./','public','new',path.basename(files.image.path)+ files.image.name))
      is.pipe(os);
      is.on('end',function() {
          fs.unlinkSync(files.image.path);
      });
        let instance = {
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

    server.post('/multi-uploaded-meme', function(req,resp){
      let form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        let is = fs.createReadStream (files.image.path);
        let os = fs.createWriteStream(path.join('./','public','new',path.basename(files.image.path)+ files.image.name))
        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync(files.image.path);
        });
        let is2 = fs.createReadStream (files.image2.path);
        let os2 = fs.createWriteStream(path.join('./','public','new',path.basename(files.image2.path)+ files.image2.name))
        is2.pipe(os2);
        is2.on('end',function() {
            fs.unlinkSync(files.image2.path);
        });
          let instance = {
              memeTitle: fields.memeTitle,
              memeDate: Date(),
              memeTime: timestamp("<YYYY-MM-DD-HH"),
              memeTag: fields.memeTag,
              memeImage: path.basename(files.image.path) + files.image.name,
              memeOwner: req.session.username,
              memePrivacy: fields.memePrivacy,
              memeShare: fields.memeShare
          }
          let instance2 = {
            memeTitle: fields.memeTitle2,
            memeDate: Date(),
            memeTime: timestamp("<YYYY-MM-DD-HH"),
            memeTag: fields.memeTag2,
            memeImage: path.basename(files.image2.path) + files.image2.name,
            memeOwner: req.session.username,
            memePrivacy: fields.memePrivacy2,
            memeShare: fields.memeShare2
        }
                  memeModel.pushMeme(instance, function(newInstance){
                  console.log(newInstance);
                    userModel.pushMeme(req.session.username, newInstance);
                  if (err) throw err;
                  })
                  memeModel.pushMeme(instance2, function(newInstance){
                    console.log(newInstance);
                    userModel.pushMeme(req.session.username, newInstance);
                    resp.redirect('/');
                    if (err) throw err;
                    })
        });//rename
      });//parse

server.post('/edit', function(req,resp){
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields.tite);
    let oldpath = files.image.path;
    let newpath = path.join('./','public','new',path.basename(files.image.path) + files.image.name)
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
