const mongoose = require('./connectionModel').connection;

var memeSchema = mongoose.Schema({
    _postID: mongoose.SchemaTypes.ObjectId,
        memeTitle: String,
        memeTag: String,
        memeImage: String,
        memeOwner: String,
        memePrivacy: String,
}); // meme schema


var memeModel = mongoose.model('meme', memeSchema); // model used for database of memes


function addMeme(memeTitle,memeTag,memeImage, memeOwner, memePrivacy, callback){
  var instance = memeModel({ memeTitle: memeTitle, memeTag: memeTag,memeImage: image, memeOwner: memeOwner, memePrivacy: memePrivacy });
  instance.save(function (err) {
    if(err) return console.error(err);
    callback();
  });
}

function pushMeme(meme){
    var m = new memeModel(meme);
    m.save();
}

function viewMeme(callback){
  memeModel.find({}, function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
}


module.exports.pushMeme = pushMeme;
module.exports.addMeme = addMeme;
module.exports.viewMeme = viewMeme;