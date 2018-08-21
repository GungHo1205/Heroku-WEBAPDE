const mongoose = require('mongoose');

mongoose.connect('mongodb://BlackRamen:umami24@ds215502.mlab.com:15502/heroku_0dnhlnfk',
{
    useNewUrlParser: true
});

module.exports.connection = mongoose;