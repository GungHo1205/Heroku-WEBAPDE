const mongoose = require('./connectionModel').connection;
var tagSchema = mongoose.Schema({
	tag: [{
        tagName: String
    }]
}); // user schema

var tagModel = mongoose.model('tag', tagSchema); // model used for database of userinfo


function pushTag(tag){
    console.log(tag);
    tagModel.update({
                $push: {tagName: tag}
    }).then();
    console.log(tagModel.tag);
}

function viewTags(callback){
  tagModel.find({}, function (err, tags) {
    if(err) return console.error(err);
    callback(tags);
  });
}
module.exports.viewTags = viewTags;
module.exports.pushTag = pushTag;