const express = require('express')
var cool = require('cool-ascii-faces');
var app = express();
const path = require('path')
const PORT = process.env.PORT || 5000


app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  
  .get('/cool', (request, response) => response.send(cool())) 
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
app.get('/s',(req, res)=>{

	res.render('pages/s');
});

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