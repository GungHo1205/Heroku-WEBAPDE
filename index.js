const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.sendFile(path.join(__dirname,'index.html')))
  .get('/index.html', (req, res) => res.sendFile(path.join(__dirname,'index.html')))
  .get('/login.html', (req, res) => res.sendFile(path.join(__dirname,'login.html')))
  .get('/about.html', (req, res) => res.sendFile(path.join(__dirname,'about.html')))
  .get('/search.html', (req, res) => res.sendFile(path.join(__dirname,'search.html')))
  .get('/sign-up.html', (req, res) => res.sendFile(path.join(__dirname,'sign-up.html')))
 .get('/signed-in.html', (req, res) => res.sendFile(path.join(__dirname,'signed-in.html')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
