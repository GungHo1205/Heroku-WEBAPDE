const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser');
const server = express();   

const urlencoder = bodyparser.urlencoded({
    extended: false
});

  server.use(express.static(path.join(__dirname, 'public')));
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'ejs');

const controllers = ['user','meme', 'comment'];
for(var i=0;i<controllers.length;i++){
  const mdl = require('./controllers/'+controllers[i]+'Controller');
  mdl.Activate(server);
}


  server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
