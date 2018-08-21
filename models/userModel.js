const mongoose = require('./connectionModel').connection;
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
}); // user schema

const userModel = mongoose.model('user', userSchema); // model used for database of userinfo
function addUser(username,image, password, emailAddress, shortBio, callback){
  const instance = userModel({ username: username, image: image, password: password, emailAddress: emailAddress, shortBio: shortBio });
  
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}

function findOne(username){
   return userModel.findOne({username: username});
    
}

module.exports.findOne = findOne;   

module.exports.addUser = addUser;