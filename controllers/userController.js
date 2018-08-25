const userModel = require('../models/userModel');
const memeModel = require('../models/memeModel')
const formidable = require('formidable');
const crypto = require("crypto");
const session = require('express-session');
const cookieparser = require('cookie-parser');
const path = require('path');
const fs = require('fs');//used for file upload


function userModule(server){
server.use(session({
    name: 'User Session', // session name
    secret: 'session secret',
    resave: true,
    saveUninitialized: true,
}));
server.get('/about', function(req,resp){
      resp.render('./pages/about',{username:req.session.username});
  });   
server.get('/logout', function(req,resp){
      req.session.destroy();
      resp.render('./pages/logout');
  });
server.get('/sign-up', function(req,resp){
      resp.render('./pages/sign-up');
  });
server.get('/index', function(req,resp){
      resp.redirect('/');
  });

  server.get('/', function(req,resp){
      memeModel.viewMeme(function(list){
      const data = { list:list};
      var findUser = userModel.findOne(req.session.username);
      //  findUser.then((foundUser)=>
      resp.render('./pages/index',{data:data, username:req.session.username});
    });
  });

  server.get('/log-in', function(req,resp){
      resp.render('./pages/log-in');
  });

server.get('/user-profile/:username', function(req,resp){
  memeModel.searchOwner(req.params.username, function(list){
    const data = { list:list};
      var findUser = userModel.findOne(req.params.username)
      findUser.then((foundUser)=>
        {
            if(foundUser)
            {
                        resp.render('./pages/user-profile',{username:req.session.username,
                         userProfile:foundUser.username,
                         image:foundUser.image,
                         shortBio:foundUser.shortBio,
                         data:data
                        });
                   
            }
        
      else
                    {
                        resp.redirect('./log-in');
                    }
      })
  });
});

  server.post('/log-in=successful', function(req,resp){
      var form = new formidable.IncomingForm()
//      var password = req.body.password;
      
    form.parse(req, function (err, fields, files) {
      var hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex")
      var findUser = userModel.findOne(fields.username)
      findUser.then((foundUser)=>
        {
            if(foundUser)
            {
               if(foundUser.password === hashedpassword)
                    if (fields.rememberMe) {
						req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)
						req.session.maxAge = 1000 * 60 * 60 * 24 * 7 * 3
					}
                        req.session.rememberMe = fields.rememberMe
                        req.session.username = fields.username;
                        resp.redirect('/');
            }
        
      else
                    {
                        resp.redirect('./log-in');
                    }
      })
    });
  });

  server.post('/signed-up', function(req,resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex")
      var oldpath = files.image.path;
      var newpath = path.join('./','public','new',path.basename(files.image.path) + files.image.name);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        userModel.addUser(fields.username, path.basename(files.image.path) + files.image.name, hashedpassword ,fields.emailAddress, fields.shortBio, function(){
          resp.redirect('/');
        });//addUser
      });//rename
    });//parse
      
  });//post
}
module.exports.Activate = userModule;
