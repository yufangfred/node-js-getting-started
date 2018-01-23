const express = require('express')
var cool = require('cool-ascii-faces');
var app = express();
const path = require('path')
const PORT = process.env.PORT || 5000

// added for authentication
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================


 app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index111'))
  
//   .get('/cool', (request, response) => response.send(cool())) 
   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
// app.get('/s',(req, res)=>{

// 	res.render('pages/s');
// });

app.get('/r', (req, res)=>{
	var gosu = require('gosugamers-api');
	var urls;

	gosu.fetchMatchUrls('lol', (err, urlsl) => {
	
		
		urls = urlsl;

		res.render('pages/r.ejs' , {
			urls: urls
		});
	});
});
