const mongoose = require('./connectionModel').connection;
var userSchema = mongoose.Schema({
	username: String,
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
function addUser(username,image, password, emailAddress, shortBio, callback){
  var instance = new userModel({ username: username, image: image, password: password, emailAddress: emailAddress, shortBio: shortBio });
  
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}


function findOne(username){
   return userModel.findOne({username: username});
    
}

function pushMeme(meme, username){
    userModel.findOneAndUpdate({
                username:username},{
                $push: {meme: meme}
    }).then();
    console.log(meme);
    console.log(userModel.meme);
}

module.exports.findOne = findOne;   
module.exports.pushMeme = pushMeme;   
module.exports.addUser = addUser;