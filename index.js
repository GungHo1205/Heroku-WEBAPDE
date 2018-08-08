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
        memeID: String,
        memeTitle: String,
        memeTag: [{
            tag:String
        }],
        memeOwner: String,
        memeDate: String,
        commentNumber: Number
    }]
}) // user schema

const memeSchema = mongoose.Schema({
        memeID: String,
        memeTitle: String,
        memeTag: [{ // array of tags
                tag:String   
        }],
        memeOwner: String,
        memeDate: String,
        commentNumber: Number
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
      resp.render('./pages/about', {username:req.session.username});
  })
  server.get('/inaccessible-meme', function(req,resp){
      resp.render('./pages/inaccessible-meme', {username:req.session.username});
  })
  server.get('/index', function(req,resp){
      resp.render('./pages/index', {username:req.session.username});
  })
  server.get('/logout', function(req,resp){
      req.session.destroy();
      resp.render('./pages/logout', {username:req.session.username});
  })
  server.get('/meme1', function(req,resp){
      resp.render('./pages/meme1', {username:req.session.username});
  })
  server.get('/search', function(req,resp){
      resp.render('./pages/search', {username:req.session.username});
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
      resp.render('./pages/upload-meme');
  })
  server.get('/uploaded-meme', function(req,resp){
      resp.render('./pages/uploaded-meme');
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
//  .get('/index', (req, res) => res.sendFile(path.join(__dirname,'index.html')))
//  .get('/about.html', (req, res) => res.sendFile(path.join(__dirname,'about.html')))
//  .get('/search.html', (req, res) => res.sendFile(path.join(__dirname,'search.html')))
//  .get('/sign-up.html', (req, res) => res.sendFile(path.join(__dirname,'sign-up.html')))
//  .get('/signed-in.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in.html')))
//  .get('/logout.html', (req, res) => res.sendFile(path.join(__dirname,'logout.html')))
//  .get('/signed-up.html', (req, res) => res.sendFile(path.join(__dirname,'signed-up.html')))
//  .get('/signed-in-about.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-about.html')))
//  .get('/signed-in-search.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-search.html')))
//  .get('/user-profile.html', (req, res) => res.sendFile(path.join(__dirname,'user-profile.html')))
//  .get('/user-profile2.html', (req, res) => res.sendFile(path.join(__dirname,'user-profile2.html')))
//  .get('/upload-meme.html', (req, res) => res.sendFile(path.join(__dirname,'upload-meme.html')))
//  .get('/uploaded-meme.html', (req, res) => res.sendFile(path.join(__dirname,'uploaded-meme.html')))
//  .get('/meme1.html', (req, res) => res.sendFile(path.join(__dirname,'meme1.html')))
//  .get('/meme2.html', (req, res) => res.sendFile(path.join(__dirname,'meme2.html')))
//  .get('/meme3.html', (req, res) => res.sendFile(path.join(__dirname,'meme3.html')))
//  .get('/meme4.html', (req, res) => res.sendFile(path.join(__dirname,'meme4.html')))
//  .get('/meme5.html', (req, res) => res.sendFile(path.join(__dirname,'meme5.html')))
//  .get('/meme6.html', (req, res) => res.sendFile(path.join(__dirname,'meme6.html')))
//  .get('/meme7.html', (req, res) => res.sendFile(path.join(__dirname,'meme7.html')))
//  .get('/meme8.html', (req, res) => res.sendFile(path.join(__dirname,'meme8.html')))
//  .get('/meme9.html', (req, res) => res.sendFile(path.join(__dirname,'meme9.html')))
//  .get('/meme10.html', (req, res) => res.sendFile(path.join(__dirname,'meme10.html')))
//  .get('/meme11.html', (req, res) => res.sendFile(path.join(__dirname,'meme11.html')))
//  .get('/meme12.html', (req, res) => res.sendFile(path.join(__dirname,'meme12.html')))
//  .get('/meme13.html', (req, res) => res.sendFile(path.join(__dirname,'meme13.html')))
//  .get('/meme14.html', (req, res) => res.sendFile(path.join(__dirname,'meme14.html')))
//  .get('/meme15.html', (req, res) => res.sendFile(path.join(__dirname,'meme15.html')))
//  .get('/inaccessible-meme.html', (req, res) => res.sendFile(path.join(__dirname,'inaccessible-meme.html')))
//  .get('/funny.html', (req, res) => res.sendFile(path.join(__dirname,'funny.html')))
//  .get('/sad.html', (req, res) => res.sendFile(path.join(__dirname,'sad.html')))
//  .get('/relationships.html', (req, res) => res.sendFile(path.join(__dirname,'relationships.html')))
//  .get('/social.html', (req, res) => res.sendFile(path.join(__dirname,'social.html')))
//  .get('/disgusting.html', (req, res) => res.sendFile(path.join(__dirname,'disgusting.html')))
//  .get('/racists.html', (req, res) => res.sendFile(path.join(__dirname,'racists.html')))
//  .get('/signed-in-funny.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-funny.html')))
//  .get('/signed-in-sad.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-sad.html')))
//  .get('/signed-in-relationships.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-relationships.html')))
//  .get('/signed-in-social.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-social.html')))
//  .get('/signed-in-disgusting.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-disgusting.html')))
//  .get('/signed-in-racists.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in-racists.html')))

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))