const userModel = require('../models/userModel');
const formidable = require('formidable');
const crypto = require("crypto");
const session = require('express-session');
const cookieparser = require('cookie-parser');
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
server.get('/index', function(req,resp){
      resp.render('./pages/index',{username:req.session.username});
  });  
server.get('/meme1', function(req,resp){
      resp.render('./pages/meme1',{username:req.session.username});
  });
server.get('/search', function(req,resp){
      resp.render('./pages/search',{username:req.session.username});
  });
server.get('/logout', function(req,resp){
      req.session.destroy();
      resp.render('./pages/logout');
  });
server.get('/sign-up', function(req,resp){
      resp.render('./pages/sign-up');
  });
server.get('/signed-up', function(req,resp){
      resp.render('./pages/signed-up');
  });

  server.get('/', function(req,resp){
      resp.render('./pages/index',{username:req.session.username});
  });

  server.get('/log-in', function(req,resp){
      resp.render('./pages/log-in');
  });

server.get('/user-profile', function(req,resp){
      var findUser = userModel.findOne(req.session.username)
      findUser.then((foundUser)=>
        {
            if(foundUser)
            {
                        resp.render('./pages/user-profile',{username:req.session.username,
                         image:foundUser.image,
                         shortBio:foundUser.shortBio
                        });
                   
            }
        
      else
                    {
                        resp.redirect('./log-in');
                    }
      })
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
                   {
                       req.session.username = fields.username;
                        resp.render('./pages/index',{username:req.session.username});
                   }
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
      var newpath = "public\\new\\" + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        userModel.addUser(fields.username, files.image.name, hashedpassword ,fields.emailAddress, fields.shortBio, function(){
          resp.redirect('/');
        });//addUser
      });//rename
        console.log(newpath);
    });//parse
      
  });//post
}
module.exports.Activate = userModule;
