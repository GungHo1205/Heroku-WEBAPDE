const mongoose = require('./connectionModel').connection;
var userSchema = mongoose.Schema({
    username: String,
    email: String,
	image: String,
	password: String,
	shortBio: String,
	meme: [{
		memeTitle: String,
        memeTag: String,
        memeImage: String,
        memeOwner: String,
        memePrivacy: String
    }]
}); // user schema

var userModel = mongoose.model('user', userSchema); // model used for database of userinfo

function addUser(username, email, image, password, shortBio, callback){
  userModel.findOne({username: username}).then((foundUser)=>{
    if(foundUser){
    callback();
    console.log("username already exists");
    }else{
    console.log("successfully made user");
    var instance = new userModel({ username: username, email:email, image: image, password: password, shortBio: shortBio });
    instance.save(function (err) {
      if(err) return console.error(err);
      callback();
    });
    }
  });
}


function findOne(username){
   return userModel.findOne({username: username});
}

function findUsers(callback){
    userModel.find({}, {username:1},function(err, list){
        if(err) return console.error(err);
        callback(list);
    })
}

function pushMeme(username, meme){
    userModel.findOneAndUpdate({
                username:username},{
                $push: {meme: meme}
    }).then();
}

function deleteMeme(username,id){
    userModel.findOne(
        {username: username}
    ).then((foundUser)=>{
        if(foundUser){
            for(let i = 0; i < foundUser.meme.length; i++){
                console.log(foundUser.meme[i]._id + '  ' + id);
                if(foundUser.meme[i]._id == id){
                    foundUser.meme.splice(i, 1);
                }
            }
            foundUser.save().then();
        }
    })
}

function editMeme(username, id, memeTitle, memeTag, memeImage, memePrivacy){
    userModel.findOne({
        username:username
    }).then((foundUser) => {
        if(foundUser){
            for(let i = 0; i < foundUser.meme.length;i++){
                if(foundUser.meme[i]._id == id){
                    foundUser.meme[i].memeTitle = memeTitle;
                    foundUser.meme[i].memeTag = memeTag;
                    foundUser.meme[i].memeImage = memeImage;
                    foundUser.meme[i].memePrivacy = memePrivacy;
                }
                else{console.log("no meme")};
            }
                foundUser.save().then();
            }else{console.log("no user")};
        });
    }

module.exports.findOne = findOne;   
module.exports.pushMeme = pushMeme;   
module.exports.addUser = addUser;
module.exports.deleteMeme = deleteMeme;
module.exports.editMeme = editMeme;
module.exports.findUsers = findUsers;