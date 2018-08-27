const mongoose = require('./connectionModel').connection;

var memeSchema = mongoose.Schema({
        memeTitle: String,
        memeDate: Date,
        memeTime: String,
        memeTag: String ,
        memeImage: String,
        memeOwner: String,
        memePrivacy: String,
        memeShare: String,
        likers:[String],
        comment:[{
          _memeID: mongoose.Schema.Types.ObjectId,
          commentOwner: String,
          commentDesc: String,
          nestedComments:[mongoose.Schema.Types.ObjectId]
        }]
}); // meme schema


var memeModel = mongoose.model('meme', memeSchema); // model used for database of memes
var counter=5;

function pushMeme(meme, callback){
    var m = new memeModel(meme);
    m.save().then((newMeme) => {
      callback(newMeme);
    }, (err) => {
    })
}

function pushComment(search, comment){
  memeModel.findOneAndUpdate({
    _id: search
    },{
    $push: {comment: comment}
  }).then();
}

function viewMeme(callback){
  counter=0;
  memeModel.find().sort({memeDate : -1}).limit(5).then((list) => {
    callback(list);
  }, (err) => {
  })
}

function viewNextMemes(callback){
  counter=counter+5;
  memeModel.find().sort({memeDate : -1}).limit(counter).then((list) => {
    callback(list);
  }, (err) => {
  })
}

function viewComment(search, callback){
  memeModel.findOne({_id: search},{comment: 1}).then((list) => {
    callback(list);
  }, (err) => {

  })
}

function searchMeme(search, callback){
  memeModel.find({$or : [{memeTag: {$in: search}}, {memeTag: {$in: search.split(', ')}}, {memeTag: {$in: search.split(', ').reverse()}}]}, function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
  
}

function searchOwner(search, callback){

  memeModel.find({memeOwner: search}, function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
}

function editMeme(id, memeTitle, memeTag, memeImage, memePrivacy){
  memeModel.findOneAndUpdate({
                    _id: id
                    },{
                    memeTitle, memeTag, memeImage, memePrivacy
                  }).then();
}
function deleteMeme(search){
  memeModel.remove({
                    _id:search
                  }).then();
}
    
function findMeme(id){
    return memeModel.findOne({_id:id});
}

function addLike(search, username){
    memeModel.findOne({_id: search}).then((meme) => {
      var found = 0;
      for(i=0;i<meme.likers.length;i++){
        if(meme.likers[i]==username)
        found=1;
      }
      if(found==0){
      memeModel.findOneAndUpdate({
      _id: search
      },{
      $push: {likers: username}
    }).then();
    }
    })
}

// first input is search]
module.exports.editMeme = editMeme;
module.exports.searchOwner = searchOwner;
module.exports.searchMeme = searchMeme;
module.exports.pushMeme = pushMeme;
module.exports.viewMeme = viewMeme;
module.exports.viewNextMemes = viewNextMemes;
module.exports.findMeme = findMeme;
module.exports.viewComment = viewComment;
module.exports.pushComment = pushComment;
module.exports.deleteMeme = deleteMeme;
module.exports.addLike = addLike;