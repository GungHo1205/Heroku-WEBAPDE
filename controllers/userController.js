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
      let findUser = userModel.findOne(req.session.username);
      //  findUser.then((foundUser)=>
      resp.render('./pages/index',{data:data, username:req.session.username});
    });
  });

  server.post('/loadMore', function(req,resp){
    memeModel.viewNextMemes(function(list){
    const data = { list:list};
    let findUser = userModel.findOne(req.session.username);
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
      let findUser = userModel.findOne(req.params.username)
      findUser.then((foundUser)=>
        {
            if(foundUser)
            {
                        resp.render('./pages/user-profile',{username:req.session.username,
                         userProfile:foundUser.username,
                         email:foundUser.email,
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
      let form = new formidable.IncomingForm()
//      let password = req.body.password;
      
    form.parse(req, function (err, fields, files) {
      let hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex")
      let findUser = userModel.findOne(fields.username)
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
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
      let hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex")
    
      let is = fs.createReadStream(files.image.path);
      let os = fs.createWriteStream(path.join('./','public','new',path.basename(files.image.path) + files.image.name));
      is.pipe(os);
      is.on('end',function() {
          fs.unlinkSync(files.image.path);
      });

        userModel.addUser(fields.username, fields.emailAddress, path.basename(files.image.path) + files.image.name, hashedpassword, fields.shortBio, function(){

      if (err) throw err;
        resp.redirect('/');
    });
    });//post
});

}

module.exports.Activate = userModule;
