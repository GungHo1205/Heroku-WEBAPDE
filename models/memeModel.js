const mongoose = require('./connectionModel').connection;

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
}); // meme schema


const memeModel = mongoose.model('meme', memeSchema); // model used for database of memes


function addMeme(memeTitle,memeTag,image, memeOwner, memePrivacy, callback){
  const instance = memeModel({ memeTitle: memeTitle, memeTag: memeTag,image: image, memeOwner: memeOwner, memePrivacy: memePrivacy });
  
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}

module.exports.addMeme = addMeme;
