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

function pushMeme(meme){
    userModel.findOneAndUpdate({
                username:meme.memeOwner},{
                $push: {meme: meme}
    }).then();
}

function deleteMeme(search, callback){
    userModel.remove(
        {meme: search}, {meme: 1}, function(err){
            if(err) return console.error(err)
            callback();
        }
    ).then();
}

function editMeme(username, id, memeTitle, memeTag, memeImage, memePrivacy){
    userModel.findOne({
        username:username
    }).then((foundUser) => {
        if(foundUser){
            for(let i = 0; i < foundUser.meme.length;i++){
                if(foundUser.meme[i]._id == id){
                    console.log('wow')
                    console.log(memeTitle);
                    console.log(memeTag);
                    console.log(memeImage);
                    console.log(memePrivacy);
                    foundUser.meme[i].memeTitle = memeTitle;
                    foundUser.meme[i].memeTag = memeTag;
                    foundUser.meme[i].memeImage = memeImage;
                    foundUser.meme[i].memePrivacy = memePrivacy;
                    console.log(foundUser.meme[i].memeTitle);
                    console.log(foundUser.meme[i].memeTag);
                    console.log(foundUser.meme[i].memeImage);
                    console.log(foundUser.meme[i].memePrivacy);
                }
            }
                foundUser.save().then();
            }else{console.log("no user")};
        });
    }

module.exports.findOne = findOne;   
module.exports.pushMeme = pushMeme;   
module.exports.addUser = addUser;
module.exports.deleteMeme = deleteMeme;
module.exports.editMeme = editMeme