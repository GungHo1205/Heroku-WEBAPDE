const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const session = require('express-session')
const server = express();   
const formidable = require('formidable');
const fs = require('fs');//used for file upload
const crypto = require("crypto");

mongoose.connect('mongodb://BlackRamen:umami24@ds215502.mlab.com:15502/heroku_0dnhlnfk',
{
    useNewUrlParser: true
});

const urlencoder = bodyparser.urlencoded({
    extended: false
})
const userSchema = mongoose.Schema({
    username : String,
    image: String,
    password : String,
    shortBio: String,
    meme: [{
 //       memeID: String,
        memeTitle: String,
        memeTag: String,
//        [{
//            tag:String
//        }],
        memeOwner: String,
 //       memeDate: String,
        commentNumber: Number
    }]
}) // user schema

const memeSchema = mongoose.Schema({
 //       memeID: String,
        memeTitle: String,
        memeTag: String,
//    [{ // array of tags
//                tag:String   
//        }],
        image: String,
        memeOwner: String,
 //       memeDate: String,
 //       commentNumber: Number,
        memePrivacy: String
}) // meme schema

const userModel = mongoose.model('user', userSchema); // model used for database of userinfo
const memeModel = mongoose.model('meme', memeSchema); // model used for database of memes

server.use(session({
    name: 'User Session', // session name
    secret: 'session secret',
    resave: true,
    saveUninitialized: true,
}))

function addUser(username,image, password, emailAddress, shortBio, callback){
  const instance = userModel({ username: username, image: image, password: password, emailAddress: emailAddress, shortBio: shortBio });
  
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}
function addMeme(memeTitle,memeTag,image, memeOwner, memePrivacy, callback){
  const instance = memeModel({ memeTitle: memeTitle, memeTag: memeTag,image: image, memeOwner: memeOwner, memePrivacy: memePrivacy });
  
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}

  server.use(express.static(path.join(__dirname, 'public')));
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'ejs');

  server.get('/', function(req,resp){
      resp.render('./pages/index',{username:req.session.username});
//    if(req.session.username !== undefined){
//         console.log(req.session.username);
//      resp.render('./pages/index',{username:req.session.username});
//    }else
//    {
//         console.log(req.session.username);
//      resp.render('./pages/index',{username:'joshy'})
//    }
  })

  server.get('/log-in', function(req,resp){
      resp.render('./pages/log-in');
  })

  server.post('/log-in=successful',urlencoder, function(req,resp){
      var password = req.body.password;
      var hashedpassword = crypto.createHash("md5").update(req.body.password).digest("hex")
      var findUser = userModel.findOne({username: req.body.username})
      findUser.then((foundUser)=>
        {
            if(foundUser)
            {
               if(foundUser.password === hashedpassword)
                   {
                       req.session.username = req.body.username;
                        resp.render('./pages/index',{username:req.session.username});
                   }
            }
        
      else
                    {
                        resp.redirect('./log-in');
                    }
      })
      
  })

  server.get('/about', function(req,resp){
      resp.render('./pages/about');
  })
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme');
  })
  server.get('/index', function(req,resp){
      resp.render('./pages/index');
  })
  server.get('/logout', function(req,resp){
      req.session.destroy();
      resp.render('./pages/logout');
  })
  server.get('/meme1', function(req,resp){
      resp.render('./pages/meme1');
  })
  server.get('/search', function(req,resp){
      resp.render('./pages/search');
  })
  server.get('/sign-up', function(req,resp){
      resp.render('./pages/sign-up');
  })

  server.post('/signed-up', function(req,resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex")
      var oldpath = files.image.path;
      var newpath = __dirname + '\\public\\new\\' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        addUser(fields.username, files.image.name, hashedpassword ,fields.emailAddress, fields.shortBio, function(){
          resp.redirect('/');
        });//addUser
      });//rename
    });//parse
  });//post

  server.get('/signed-up', function(req,resp){
      resp.render('./pages/signed-up');
  })
  server.get('/upload-meme', function(req,resp){
//    var form = new formidable.IncomingForm();
//    form.parse(req, function (err, fields, files) {
//      var oldpath = files.memePicture.path;
//      var newpath = __dirname + '\\public\\new\\' + files.memePicture.name;
//      fs.rename(oldpath, newpath, function (err) {
//        if (err) throw err;
//        addMeme(fields.memeTitle, fields.memeTag,files.memePicture.name, fields.memeOwner, fields.memePrivacy, function(){
//          resp.redirect('/');
//        });//addMeme
//      });//rename
//    });//parse
      resp.render('./pages/upload-meme');
  }) 


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
  })
  server.get('/user-profile', function(req,resp){
      var findUser = userModel.findOne({username: req.session.username})
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
  })




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))