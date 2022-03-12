const express = require('express');
const routes = require('./router/routes');
const nunjucks = require('nunjucks');
const path = require('path');

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

nunjucks.configure('views', {
    express: app,
    autoescape: true
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

app.use('/', routes);

const server = app.listen(7777, function(){
    console.log("Server is running...");
})