const mongoose = require('./connectionModel').connection;

var commentSchema = mongoose.Schema({
          _memeID: mongoose.Schema.Types.ObjectId,
          commentOwner: String,
          commentDesc: String,
          nestedComments:[mongoose.Schema.Types.ObjectId]
        
}); // meme schema


var commentModel = mongoose.model('comments', commentSchema); // model used for database of comments

function searchComment(id){
    commentModel.findOne({
        _id:id
    }).then((foundComment) => {
        callback(foundComment);
    }, (err) =>{    
        })
}

function pushComment(comment, callback){
    var c = new commentModel(comment);
    c.save().then((newComment) =>{
        callback(newComment);
    }, (err) => {
    })
}

function pushNested(search, comment, callback){
    var c = new commentModel(comment);
        c.save().then((newComment) => {
            commentModel.findOneAndUpdate({
                _id: search
            }, {
                $push: {nestedComments: newComment._id}
            }).then((henlo) => {
                console.log(henlo);
            }, (err) =>{

            })
            callback(newComment);
        }, (err) =>{

        })
}
module.exports.pushNested = pushNested;
module.exports.pushComment = pushComment;
module.exports.searchComment = searchComment;